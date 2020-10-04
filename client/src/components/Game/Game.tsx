import React from 'react';

import { Player } from '../../types/player';
import {
  GameState,
  Code,
  TeamID,
  Transmission,
  PlayerID,
} from '../../types/gameState';
import { GameLobby } from '../GameLobby/GameLobby';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import io from 'socket.io-client';
import { GameRunning } from '../GameRunning/GameRunning';
import { GameOver } from '../GameOver/GameOver';

import { withCookies, Cookies } from 'react-cookie';

type PathParamsType = {
  id: string;
};

type GameProps = RouteComponentProps<PathParamsType> & {
  cookies: Cookies;
};
interface GameReactState {
  players: Player[];
  myId: PlayerID | 'pending';
  game: GameState | 'pending';
  gameId: string;
}

const PLAYER_COOKIE_ID = 'codebreaker-player-id';

class Game extends React.Component<GameProps, GameReactState> {
  private socket: SocketIOClient.Socket | undefined;

  public constructor(props: GameProps) {
    super(props);

    const { cookies } = this.props;
    const existingId = cookies.get(PLAYER_COOKIE_ID);

    this.state = {
      players: [],
      myId: existingId === undefined ? 'pending' : existingId,
      gameId: this.props.match.params.id,
      game: 'pending',
    };
  }

  componentDidMount() {
    this.socket = io({
      query: {
        gameId: this.state.gameId,
        userId: this.state.myId,
      },
    });
    //   this.socket = io(`/game/${this.props.match.params.id}`);
    window.addEventListener('beforeunload', this.componentCleanup);

    this.socket.on('new player', (player: Player) => {
      this.setState((state) => ({
        players: [...state.players, player],
      }));
    });
    this.socket.on('welcome', (player: Player) => {
      this.props.cookies.set(PLAYER_COOKIE_ID, player.id);
      this.setState({
        myId: player.id,
      });
    });
    this.socket.on('update player', (player: Player) => {
      const others = this.state.players.filter((p) => p.id !== player.id);
      this.setState({
        players: [...others, player],
      });
    });
    this.socket.on('player left', (player: Player) => {
      const others = this.state.players.filter((p) => p.id !== player.id);
      this.setState({
        players: others,
      });
    });
    this.socket.on('game state', (game: GameState) => {
      this.setState({
        game,
      });
    });
  }

  componentWillUnmount() {
    this.componentCleanup();
    window.removeEventListener('beforeunload', this.componentCleanup); // remove the event handler for normal unmounting
  }

  componentCleanup() {
    if (this.socket === undefined) {
      throw new Error('No socket connection when unmounting');
    }
    this.socket.emit('disconnect');
    this.socket.disconnect();
    this.socket.close();
  }

  private onNameChange(name: string) {
    if (this.socket === undefined) {
      throw new Error('Callback called before socket connection established');
    }
    this.socket.emit('player name', name);
  }

  private onGameStart() {
    if (this.socket === undefined) {
      throw new Error('Callback called before socket connection established');
    }
    this.socket.emit('start game');
  }

  private onTeamGuess(team: TeamID, guess: Code) {
    if (this.socket === undefined) {
      throw new Error('Callback called before socket connection established');
    }

    this.socket.emit('guess', { team, guess });
  }

  private onTransmit(transmission: Transmission) {
    if (this.socket === undefined) {
      throw new Error('Callback called before socket connection established');
    }

    this.socket.emit('transmission', transmission);
  }

  public render() {
    const notFullyConnected =
      this.socket === undefined ||
      this.state.myId === 'pending' ||
      this.state.players.findIndex(
        (player) => player.id === this.state.myId
      ) === -1 ||
      this.state.game === 'pending';

    let child;
    if (notFullyConnected) {
      child = <div>Connecting ...</div>;
    } else if ((this.state.game as GameState).state === 'LOBBY') {
      child = (
        <GameLobby
          players={this.state.players}
          myId={this.state.myId}
          onNameChange={this.onNameChange.bind(this)}
          onGameStart={this.onGameStart.bind(this)}
        />
      );
    } else if ((this.state.game as GameState).state === 'RUNNING') {
      child = (
        <GameRunning
          game={this.state.game as GameState}
          players={this.state.players}
          myId={this.state.myId}
          onTeamGuess={this.onTeamGuess.bind(this)}
          onTransmit={this.onTransmit.bind(this)}
        />
      );
    } else if ((this.state.game as GameState).state === 'FINISHED') {
      child = (
        <GameOver
          winner={(this.state.game as GameState).winner as 'draw' | TeamID}
        />
      );
    }

    return <div>{child}</div>;
    // <Teams players={this.state.players} />
  }
}

export default withCookies(withRouter(Game));
