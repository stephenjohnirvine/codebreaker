import express from "express";
import path from "path";
import http from "http";
import socketIO from "socket.io";
import crypto from "crypto";
import fs from "fs";
import { getRandomInt } from "./random/getRandomInt";
import { Code, GameState, TeamID, Turn } from "../client/src/types/gameState";
import { Player } from "../client/src/types/player";
import { newTurn } from "./game/turns/newTurn";

const app = express();
const httpServer = http.createServer(app);
const io = socketIO(httpServer);

const PORT = process.env.PORT || 3001;
const DEVELOPMENT = process.env.NODE_ENV.toLowerCase() === "development";
console.log(`NODE_ENV=${process.env.NODE_ENV}`);
if (DEVELOPMENT) {
  console.log(`Starting in DEVELOPMENT environment`);
} else {
  console.log(`Starting in PRODUCTION environment`);
}
const devLogging = (...args: any[]) => {
  if (DEVELOPMENT) {
    logging(args);
  }
};

const logging = (...args: any[]) => {
  console.log(...args);
};

app.use(express.static("public"));

const text = fs.readFileSync("./wordlist.txt").toString("utf-8");
const globalWordList = text.split("\n");
Object.freeze(globalWordList);

const autoPlayerNames = [
  "Adam",
  "Anna",
  "Jojo",
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
  "Sphinx",
  "Alex",
  "Sarah",
];
Object.freeze(autoPlayerNames);

const getRandomWord = (myWordList: string[]): string => {
  const index = getRandomInt(myWordList.length - 1);
  const word = myWordList[index];
  myWordList.splice(index, 1);
  return word;
};

const makeNewGameState = (): GameState => {
  const myWordList = [...globalWordList];

  const gameState: GameState = {
    players: [],
    state: "LOBBY",
    red: {
      interceptions: 0,
      transmissionFailures: 0,
      lastTransmitter: undefined,
      cypher: [
        getRandomWord(myWordList),
        getRandomWord(myWordList),
        getRandomWord(myWordList),
        getRandomWord(myWordList),
      ],
      players: [],
    },
    blue: {
      interceptions: 0,
      transmissionFailures: 0,
      lastTransmitter: undefined,
      cypher: [
        getRandomWord(myWordList),
        getRandomWord(myWordList),
        getRandomWord(myWordList),
        getRandomWord(myWordList),
      ],
      players: [],
    },
    history: [],
    winner: undefined,
  };

  return gameState;
};

type GameID = string;
const games = new Map<GameID, { state: GameState; lastActivity: Date }>();

const inactiveGameKillTime = 4.32e7; // 12 Hours
const garbageCollectInterval = 3.6e6; // 1 Hour
setInterval(() => {
  const now = new Date();
  for (const gameId in games.keys()) {
    const timeSinceLastActivity =
      now.getTime() - games.get(gameId).lastActivity.getTime();
    if (timeSinceLastActivity > inactiveGameKillTime) {
      logging(
        `Game: ${gameId} has had no activity for ${
          timeSinceLastActivity / 1000 / 60 / 60
        } hours. Deleting.)}`
      );
      games.delete(gameId);
    }
  }
}, garbageCollectInterval);

app.get("/new", (req, res) => {
  logging("GET /new");

  const gameId = crypto.randomBytes(10).toString("hex");

  const newGameState = makeNewGameState();
  games.set(gameId, { state: newGameState, lastActivity: new Date() });
  res.end(JSON.stringify(gameId));
  logging("New game created with ID", gameId);
});

io.on("connection", (socket) => {
  const gameId = socket.handshake.query.gameId;
  logging("connecting to game ", gameId);

  if (games.get(gameId) === undefined) {
    logging("Connection to non-existent game. Ignored");
    return;
  }

  const gameState = games.get(gameId).state;

  // Update game activity date
  games.get(gameId).lastActivity = new Date();
  socket.use((_, next) => {
    // Update last activity on all other activity on this socket
    games.get(gameId).lastActivity = new Date();

    return next();
  });

  socket.join(gameId);

  let me: Player = undefined;
  let reconnect: boolean = false;

  if (gameState.state !== "LOBBY") {
    // Is this player one that had previously disconnected

    const userId = socket.handshake.query.userId;

    if (userId === undefined) {
      logging("New connection to game in progress");
      return;
    }

    me = gameState.players.find((player) => player.id === userId);

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

  socket.emit("welcome", me);

  if (!reconnect) {
    logging("New player: ", me.id);
    gameState.players.push(me);
  }

  io.to(gameId).emit("game state", gameState);

  logging("Current Players", gameState.players);

  socket.on("player name", (name) => {
    devLogging("Player name: ", name);
    me.name = name;

    io.to(gameId).emit("game state", gameState);
  });

  socket.on("disconnect", () => {
    logging("user disconnected");
    const playerIdx = gameState.players.findIndex(
      (player) => player.id === me.id
    );
    if (playerIdx === -1) {
      logging("unknown user disconnected, that's odd!");
    } else {
      if (gameState.state !== "LOBBY") {
        // If the game is started, we want to allow people to reconnect
        gameState.players[playerIdx].status = "disconnected";
      } else {
        // Just remove people in the lobby if they drop.
        gameState.players.splice(playerIdx, 1);
      }
    }
    io.to(gameId).emit("game state", gameState);

    logging("Current Players", gameState.players);
    if (!gameState.players.some((player) => player.status === "connected")) {
      // Game is empty, clean it up.
      logging(
        `Game ${gameId} has no active connections, logging last activity.`
      );

      games.get(gameId).lastActivity = new Date();
    }
  });

  socket.on("transmission", (transmission) => {
    devLogging(`player ${me.id} is transmitting [${transmission}]`);

    if (
      gameState.history[gameState.history.length - 1].transmission !== undefined
    ) {
      logging("ERROR: Attempting to transmit twice in a single turn");
      throw new Error("Can't transmit twice for a single turn");
    }

    gameState.history[gameState.history.length - 1].transmission = transmission;

    io.to(gameId).emit("game state", gameState);
  });

  socket.on("guess", ({ team, guess }: { team: TeamID; guess: Code }) => {
    logging(
      `player ${me.id} has submitted guess ${guess} on behalf of team ${team}`
    );

    const currentTurn = gameState.history[gameState.history.length - 1];

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
      gameState[team].interceptions = gameState[team].interceptions + 1;
    }

    if (!correct && !interceptor) {
      // We got it wrong, and we were the intended recipient, Get a transmission failure point
      gameState[team].transmissionFailures =
        gameState[team].transmissionFailures + 1;
    }
    // If  both teams have guessed then this is the end of the turn
    if (
      currentTurn.guesses.red !== undefined &&
      currentTurn.guesses.blue !== undefined
    ) {
      currentTurn.type = "COMPLETE";
    }

    devLogging("Game State: ", JSON.stringify(gameState, null, 4));
    io.to(gameId).emit("game state", gameState);
  });

  socket.on("end turn", () => {
    const currentTurn = gameState.history[gameState.history.length - 1];

    // The turn should be complete
    if (currentTurn.type !== "COMPLETE") {
      logging("attempting to end turn when not complete");
      return;
    }

    let blueWin = false;
    let redWin = false;
    // If the current number of turns is even, then it's a fair time to check the scores
    // and see if a team has won.
    if (gameState.history.length % 2 === 0) {
      if (
        gameState["blue"].interceptions >= 2 ||
        gameState["red"].transmissionFailures >= 2
      ) {
        blueWin = true;
      }
      if (
        gameState["red"].interceptions >= 2 ||
        gameState["blue"].transmissionFailures >= 2
      ) {
        redWin = true;
      }
    }

    if (redWin || blueWin) {
      // The game is over.
      gameState.state = "FINISHED";
      gameState.winner = redWin && blueWin ? "draw" : redWin ? "red" : "blue";
    } else {
      gameState.history.push(newTurn(gameState));
    }

    devLogging("Game State: ", JSON.stringify(gameState, null, 4));
    io.to(gameId).emit("game state", gameState);
  });

  socket.on("start game", () => {
    logging("New Game");

    gameState.state = "RUNNING";

    const getTeam = (gameState: GameState): TeamID => {
      const redSize = gameState.red.players.length;
      const blueSize = gameState.blue.players.length;

      return redSize > blueSize ? "blue" : "red";
    };
    gameState.players.forEach((player) => {
      const team = getTeam(gameState);

      gameState[team].players.push(player.id);
    });
    gameState.history.push(newTurn(gameState));

    devLogging("Game State: ", gameState);
    io.to(gameId).emit("game state", gameState);
  });
});

app.get("*", function (req, res) {
  res.sendFile("index.html", {
    root: path.join(__dirname, "../public"),
  });
});

httpServer.listen(PORT, () => {
  console.log(`listening on *: ${PORT}`);
});
