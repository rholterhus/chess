import React, { useState, useEffect, memo, useRef }from 'react';
import './testingPage.css';

import bishopblack from '../images/bishopblack.png';
import bishopwhite from '../images/bishopwhite.png';
import rookblack from '../images/rookblack.png';
import rookwhite from '../images/rookwhite.png';
import queenblack from '../images/queenblack.png';
import queenwhite from '../images/queenwhite.png';
import kingblack from '../images/kingblack.png';
import kingwhite from '../images/kingwhite.png';
import pawnblack from '../images/pawnblack.png';
import pawnwhite from '../images/pawnwhite.png';
import knightblack from '../images/knightblack.png';
import knightwhite from '../images/knightwhite.png';

import moveSound from '../sounds/pieceMove.mp3';
import takeSound from '../sounds/pieceTake.mp3';

import { DragDropContainer, DropTarget } from 'react-drag-drop-container';


var getColor = (x,y) => (x % 2) ? ((y % 2) ? 'burlywood' : 'saddlebrown') : ((y % 2) ? 'saddlebrown' : 'burlywood')

const makeMoveSound = new Audio(moveSound);


const initialBoard = () => {
    var board = []
    for(var row = 0; row <= 7; row++) {
        for(var col = 0; col <= 7; col++) {
            board[[row,col]] = null;
        }
    }
    
    board[[0,0]] = rookblack;
    board[[0,7]] = rookblack;
    board[[0,1]] = knightblack;
    board[[0,6]] = knightblack;
    board[[0,2]] = bishopblack;
    board[[0,5]] = bishopblack;
    board[[0,3]] = queenblack;
    board[[0,4]] = kingblack;

    board[[7,0]] = rookwhite;
    board[[7,7]] = rookwhite;
    board[[7,1]] = knightwhite;
    board[[7,6]] = knightwhite;
    board[[7,2]] = bishopwhite;
    board[[7,5]] = bishopwhite;
    board[[7,3]] = queenwhite;
    board[[7,4]] = kingwhite;

    for(var col = 0; col <= 7; col++) {
        board[[1,col]] = pawnblack;
        board[[6,col]] = pawnwhite;
    }

    return board;
}

const getTileFromEvent = (e) => {
    if(e.target.className == "chessTile") {
        return e.target;
    } else if (e.target.className == "piece") {
        return e.target.parentNode.parentNode.parentNode;
    } else return null;
}

const isStartingTile = (tile, e) => {
    return tile.id === e.dragData.row + "-" + e.dragData.col
}


const ChessTile = memo((props) => {

    const dropped = (e) => {
        var tile = getTileFromEvent(e);
        if(tile && !isStartingTile(tile, e)) {
            tile.style.opacity = 1;
            makeMoveSound.play();
            console.log('dropped this data: ', e.dragData);
        }
    }

    const onDragEnter = (e) => {
        var tile = getTileFromEvent(e);
        if(tile && !isStartingTile(tile, e)) {
            tile.style.opacity = 0.75;
        }
        
    }

    const onDragLeave = (e) => {
        var tile = getTileFromEvent(e);
        if(tile && !isStartingTile(tile, e)) {
            tile.style.opacity = 1;
        }
    }

    const onDragStart = ({row, col}) => {
        var tile = document.getElementById(row + "-" + col);
        tile.style.backgroundColor = "gray";
    }

    const onDragEnd = ({row, col}) => {
        var tile = document.getElementById(row + "-" + col);
        tile.style.backgroundColor = getColor(row, col);
    }

    

    var piece = null;
    if(props.piece) piece = <img className="piece" draggable="false" src={props.piece}/>

    return (
        <DropTarget
        targetKey="foo" 
        dropData={"endData"}
        onHit={dropped}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        >
            <div className="chessTile" id={props.row + "-" + props.col} style={{backgroundColor: getColor(props.row, props.col)}}> 
                <DragDropContainer 
                targetKey="foo" 
                dragData={{row: props.row, col: props.col}}
                onDragStart={onDragStart} 
                onDragEnd={onDragEnd} 
                >
                    {piece}
                </DragDropContainer>
            </div>
        </DropTarget>
    );
})

const eight = [0,1,2,3,4,5,6,7]


const Board = (props) => {

    const [board, setBoard] = useState(() => initialBoard());


    return (
            eight.map(row => 
                eight.map(col => 
                    <ChessTile
                    row={row} 
                    col={col}
                    piece={board[[row,col]]}
                    />
                )
            )
    );

}

function TestPage(props) {

    return (
        <div className="mainContainer" id="container">
            <div className="board">
                <Board/>
            </div>
        </div>
    );
}

export default TestPage;