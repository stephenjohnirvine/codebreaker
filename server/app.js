const express = require("express");
const app = express();
const path = require("path");
var http = require("http").createServer(app);
const io = require("socket.io")(http);
const crypto = require("crypto");

const PORT = process.env.PORT || 3001;
const DEVELOPMENT = process.env.NODE_ENV.toLowerCase() === "development";

const logging = (...args) => {
  if (DEVELOPMENT) {
    console.log(...args);
  }
};

app.use(express.static("public"));

const word_list = [
  "water",
  "fish",
  "red",
  "yellow",
  "green",
  "blue",
  "car",
  "house",
  "tree",
  "sky",
  "bottle",
  "computer",
  "phone",
  "plane",
  "boat",
  "submarine",
  "chair",
  "hat",
  "plate",
  "fork",
  "knife",
  "hat",
];

const autoPlayerNames = [
  "Adam",
  "Anna",
  "Alice",
  "Steve",
  "Pernille",
  "Tom",
  "David",
  "Ruth",
  "John",
  "Linda",
  "Lucy",
  "Billy",
  "Alex",
  "Sarah",
];

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};
const getCode = () => {
  const possible = [1, 2, 3, 4];
  const code = [];

  while (code.length < 3) {
    const index = getRandomInt(possible.length);
    const num = possible[index];
    code.push(num);
    possible.splice(index, 1);
  }

  return code;
};
const getRandomWord = () => {
  const index = getRandomInt(word_list.length - 1);
  const word = word_list[index];
  word_list.splice(index, 1);
  return word;
};

const makeNewGameState = () => ({
  players: [],
  current_transmitter: undefined,
  state: "LOBBY",
  red: {
    interceptions: 0,
    transmission_fails: 0,
    last_transmitter: undefined,
    cypher: [
      getRandomWord(),
      getRandomWord(),
      getRandomWord(),
      getRandomWord(),
    ],
    players: [],
  },
  blue: {
    interceptions: 0,
    transmission_fails: 0,
    last_transmitter: undefined,
    cypher: [
      getRandomWord(),
      getRandomWord(),
      getRandomWord(),
      getRandomWord(),
    ],
    players: [],
  },
  history: [],
});
const newTurn = (game_state) => {
  const firstTurn = game_state.history.length === 0;
  if (firstTurn) {
    return {
      type: "INCOMPLETE",
      encryptor: game_state.red.players[0],
      encryptorTeam: "red",
      code: getCode(),
    };
  }

  const previousTurn = game_state.history[game_state.history.length - 1];
  const lastTeam = previousTurn.encryptorTeam;
  const nextTeam = lastTeam === "red" ? "blue" : "red";

  let previousEncryptor = game_state.history.reverse().find((turn) => {
    turn.encryptorTeam === nextTeam;
  })?.encryptor;
  previousEncryptor =
    previousEncryptor === undefined
      ? game_state[nextTeam].players[0]
      : previousEncryptor;

  const teamMemberIds = game_state[nextTeam].players;
  const lastEncryptorIndex = teamMemberIds.findIndex(
    (playerId) => playerId === previousEncryptor
  );
  const nextEncryptorId =
    teamMemberIds[lastEncryptorIndex + (1 % teamMemberIds.length)];

  return {
    encryptor: nextEncryptorId,
    encryptorTeam: nextTeam,
    code: getCode(),
    type: "INCOMPLETE",
  };
};
const games = {};

app.get("/new", (req, res) => {
  logging("GET /new");

  const gameId = crypto.randomBytes(10).toString("hex");

  game_state = makeNewGameState();
  games[gameId] = game_state;
  res.end(JSON.stringify(gameId));
  logging("New game created with ID", gameId);
});

io.on("connection", (socket) => {
  const gameId = socket.handshake.query.gameId;
  logging("connecting to game ", gameId);

  if (games[gameId] === undefined) {
    logging("Connection to non-existent game. Ignored");
    return;
  }

  const game_state = games[gameId];

  socket.join(gameId);

  let me = undefined;
  let reconnect = false;

  if (game_state.state !== "LOBBY") {
    // Is this player one that had previously disconnected

    const userId = socket.handshake.query.userId;

    if (userId === undefined) {
      logging("New connection to game in progress");
      return;
    }

    me = game_state.players.find((player) => player.id === userId);

    if (me === undefined) {
      const reason =
        "cannot match incoming player with existing disconnected player";
      logging(reason);

      socket.emit("denied", reason);
      return;
    }

    if (me.status === "connected") {
      logging("player re-connected when already connected: ", me);
    }

    reconnect = true;
    me.status = "connected";
  } else {
    me = {
      name: autoPlayerNames[getRandomInt(autoPlayerNames.length - 1)],
      id: crypto.randomBytes(10).toString("hex"),
      status: "connected",
    };
  }

  logging("New connection");

  logging("New player: ", me.id);

  socket.emit("welcome", me);
  socket.emit("game state", game_state);
  //socket.emit('cypher', game_state[me.team].cypher);

  game_state.players.forEach((player) => {
    socket.emit("new player", player);
  });

  if (reconnect) {
    io.to(gameId).emit("update player", me);
  } else {
    game_state.players.push(me);
    io.to(gameId).emit("new player", me);
  }

  logging("Current Players", game_state.players);

  socket.on("player name", (name) => {
    logging("Player name: ", name);
    me.name = name;

    io.to(gameId).emit("update player", me);
  });

  socket.on("disconnect", () => {
    logging("user disconnected");
    const player = game_state.players.find((player) => player.id === me.id);
    if (player === undefined) {
      logging("unknown user disconnected, that's odd!");
    } else {
      player.status = "disconnected";
    }
    io.to(gameId).emit("update player", player);

    logging("Current Players", game_state.players);
    if (!game_state.players.some((player) => player.status === "connected")) {
      // Game is empty, clean it up.
      logging(`Game ${gameId} has no active connections, destroying.`);
      delete games[gameId];
    }
  });

  socket.on("transmission", (transmission) => {
    logging(`player ${me.id} is transmitting [${transmission}]`);

    if (
      game_state.history[game_state.history.length - 1].transmission !==
      undefined
    ) {
      logging("Attempting to transmit again.");
      throw new Error("Can't transmit twice for a single turn");
    }

    game_state.history[
      game_state.history.length - 1
    ].transmission = transmission;

    io.to(gameId).emit("game state", game_state);
  });

  socket.on("guess", ({ team, guess }) => {
    logging(
      `player ${me.id} has submitted guess ${guess} on behalf of team ${team}`
    );

    const currentTurn = game_state.history[game_state.history.length - 1];

    // Record the guess
    currentTurn.guesses = {
      ...currentTurn.guesses,
      [team]: guess,
    };

    // Are we intercepting, or are we the intended recipients?
    const interceptor = team !== currentTurn.encryptorTeam;

    // Did we get it right?
    const correct = currentTurn.code.join("") === guess.join("");

    if (correct && interceptor) {
      // We got it correct, and we are intercepting. Get an interception point
      game_state[team].interceptions = game_state[team].interceptions + 1;
    }

    if (!correct && !interceptor) {
      // We got it wrong, and we were the intended recepient, Get a transmission failure point
      game_state[team].transmission_fails =
        game_state[team].transmission_fails + 1;
    }

    // If  both teams have guessed then this is the end of the turn
    if (
      currentTurn.guesses.red !== undefined &&
      currentTurn.guesses.blue !== undefined
    ) {
      currentTurn.type = "COMPLETE";

      let blueWin = false;
      let redWin = false;
      // If the current number of turns is even, then it's a fair time to check the scores
      // and see if a team has won.
      if (game_state.history.length % 2 === 0) {
        if (
          game_state["blue"].interceptions >= 2 ||
          game_state["red"].transmission_fails >= 2
        ) {
          blueWin = true;
        }
        if (
          game_state["red"].interceptions >= 2 ||
          game_state["blue"].transmission_fails >= 2
        ) {
          redWin = true;
        }
      }

      if (redWin || blueWin) {
        // The game is over.
        game_state.state = "FINISHED";
        game_state.winner =
          redWin && blueWin ? "draw" : redWin ? "red" : "blue";
      } else {
        game_state.history.push(newTurn(game_state));
      }
    }

    logging("Game State: ", JSON.stringify(game_state, null, 4));
    io.to(gameId).emit("game state", game_state);
  });

  socket.on("start game", () => {
    logging("New Game");

    game_state.state = "RUNNING";

    const getTeam = (game_state) => {
      const redSize = game_state.red.players.length;
      const blueSize = game_state.blue.players.length;

      return redSize > blueSize ? "blue" : "red";
    };
    game_state.players.forEach((player) => {
      const team = getTeam(game_state);

      game_state[team].players.push(player.id);
    });
    game_state.history.push(newTurn(game_state));

    logging("Game State: ", game_state);
    io.to(gameId).emit("game state", game_state);
  });
});

app.get("*", function (req, res) {
  res.sendFile("index.html", { root: path.join(__dirname, "/public/") });
});

http.listen(PORT, () => {
  logging(`listening on *:${PORT}`);
});
