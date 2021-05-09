import React from 'react';
import './PlayPage.css'
import Board from './board.js'

const PlayPage = () => {
    return (
    <div className="mainContainer">
        <div className="board">
            <Board/>
        </div>
    </div>
    );
  };

  export default PlayPage;