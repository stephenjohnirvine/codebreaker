import React from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

axios.defaults.proxy = {
  host: 'localhost',
  port: 3001,
};

export const Landing = () => {
  const history = useHistory();

  const newGame = () => {
    axios
      .get('/new')
      .then((gameId) => {
        history.push(`/game/${gameId.data}`);
      })
      .catch((err) => console.error(err));
  };

  return <button onClick={newGame}>Start New Game</button>;
};
