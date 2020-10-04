const express = require("express");
const app = express();
const path = require("path");
var http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/public/index.html");
// });

const players = [];
var next_id = 0;

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
var game_state = undefined;

app.get("/new", (req, res) => {
  console.log("GET /new");
  if (game_state !== undefined) {
    res.status(404);

    console.log("GET /new FAILED game already existed");
    res.end("Game already exists");
    return;
  }

  game_state = makeNewGameState();
  res.end(JSON.stringify(1));
  console.log("GET /new SUCCESS");
});

console.log("Game state: ", game_state);

// const games = io.of(/game\/[0-9]+/);

// // this middleware will be assigned to each namespace
// games.use((socket, next) => {
//   next();
// });

io.on("connection", (socket) => {
  if (game_state === undefined) {
    console.log("Connection to non-existent game. Ignored");
    return;
  }

  if (game_state.state !== "LOBBY") {
    console.log("New connection to game in progress. Ignored");
    return;
  }

  console.log("New connection");
  next_id = next_id + 1;
  const me = {
    name: autoPlayerNames[getRandomInt(autoPlayerNames.length - 1)],
    id: next_id,
  };

  console.log("New player: ", me.id);

  socket.emit("welcome", me);
  socket.emit("game state", game_state);
  //socket.emit('cypher', game_state[me.team].cypher);

  players.forEach((player) => {
    socket.emit("new player", player);
  });

  players.push(me);
  console.log("Current Players", players);

  io.emit("new player", me);

  // if (game_state.current_transmitter === undefined) {
  //   game_state.current_transmitter = me.id;
  //   game_state[me.team].last_transmitter = me.id;

  //   const code = getCode()
  //   game_state[me.team].codes.push({ code });

  //   console.log(`Player ${me.id} to encrypt code [${code}]`);
  //   socket.emit('code', game_state.code);
  // }

  socket.on("player name", (name) => {
    console.log("Player name: ", name);
    me.name = name;

    io.emit("update player", me);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    io.emit("player left", me);
    const index = players.indexOf(me);
    if (index > -1) {
      players.splice(index, 1);
    }
    console.log("Current Players", players);
  });

  socket.on("transmission", (transmission) => {
    console.log(`player ${me.id} is transmitting [${transmission}]`);

    if (
      game_state.history[game_state.history.length - 1].transmission !==
      undefined
    ) {
      console.log("Attempting to transmit again.");
      throw new Error("Can't transmit twice for a single turn");
    }

    game_state.history[
      game_state.history.length - 1
    ].transmission = transmission;

    io.emit("game state", game_state);
  });

  socket.on("guess", ({ team, guess }) => {
    console.log(
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

    console.log("Game State: ", JSON.stringify(game_state, null, 4));
    io.emit("game state", game_state);
  });

  socket.on("start game", () => {
    console.log("New Game");

    game_state.state = "RUNNING";

    const getTeam = (game_state) => {
      const redSize = game_state.red.players.length;
      const blueSize = game_state.blue.players.length;

      return redSize > blueSize ? "blue" : "red";
    };
    players.forEach((player) => {
      const team = getTeam(game_state);

      game_state[team].players.push(player.id);
    });
    game_state.history.push(newTurn(game_state));

    console.log("Game State: ", game_state);
    io.emit("game state", game_state);
  });
});

app.get("*", function (req, res) {
  res.sendFile("index.html", { root: path.join(__dirname, "/public/") });
});

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
