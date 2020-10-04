import React from 'react';
import './App.css';
// import io from 'socket.io-client'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Landing } from './components/Landing/Landing';
import Game from './components/Game/Game';

interface AppProps {}
interface AppState {}

class App extends React.Component<AppProps, AppState> {
  public constructor(props: AppProps) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>
          <Route path="/game/:id">
            <Game />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
