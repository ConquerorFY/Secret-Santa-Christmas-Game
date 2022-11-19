import React from 'react';
import Starting from './components/Starting';
import GameContainer from './components/GameContainer';

export default function App() {
  const [start, setStart] = React.useState(false);
  const [game, setGame] = React.useState(0);

  function selectGame(option) {
    setGame(option);
  }
  function startGame() {
    setStart(true);
    setGame(1);
  }

  const element = start ? <GameContainer game={game} selectGame={selectGame} /> : <Starting start={startGame} />;
  return (
    <div className="main-container">
      {element}
    </div>
  )
}