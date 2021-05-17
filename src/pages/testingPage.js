import React, { useState, useEffect, memo, useRef }from 'react';
import './testingPage.css';

import moveSound from '../sounds/pieceMove.mp3';
import takeSound from '../sounds/pieceTake.mp3';

import useBoard from '../utils/useBoard.js'

import { DragDropContainer, DropTarget } from 'react-drag-drop-container';


const lightBrown = (opacity) => 'rgb(222,184,135,' + opacity + ")"
const darkBrown = (opacity) => 'rgb(139,69,19,' + opacity + ")"


var getColor = (x,y,opacity=1) => (x % 2) ? ((y % 2) ? lightBrown(opacity) : darkBrown(opacity)) : ((y % 2) ? darkBrown(opacity) : lightBrown(opacity))


// const initialBoard = () => {
//     var board = {}
//     for(var row = 0; row <= 7; row++) {
//         for(var col = 0; col <= 7; col++) {
//             board[[row,col]] = null;
//         }
//     }
    
//     board[[0,0]] = rookblack;
//     board[[0,7]] = rookblack;
//     board[[0,1]] = knightblack;
//     board[[0,6]] = knightblack;
//     board[[0,2]] = bishopblack;
//     board[[0,5]] = bishopblack;
//     board[[0,3]] = queenblack;
//     board[[0,4]] = kingblack;

//     board[[7,0]] = rookwhite;
//     board[[7,7]] = rookwhite;
//     board[[7,1]] = knightwhite;
//     board[[7,6]] = knightwhite;
//     board[[7,2]] = bishopwhite;
//     board[[7,5]] = bishopwhite;
//     board[[7,3]] = queenwhite;
//     board[[7,4]] = kingwhite;

//     for(var col = 0; col <= 7; col++) {
//         board[[1,col]] = pawnblack;
//         board[[6,col]] = pawnwhite;
//     }

//     return board;
// }

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


const ChessTile = (props) => {

    const [curHovering, setCurHovering] = useState(false);
    const [selected, setSelected] = useState(false);
    const [offset, setOffset] = useState([0,0]);
    const isActive = selected || curHovering;

    console.log("rendering");

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

    const onMouseUp = (e) => {
        var rect = e.target.parentNode.parentNode.parentNode.getBoundingClientRect();
        var inOriginalBox = 
                e.clientX >= rect.x && 
                e.clientX <= rect.x + rect.width && 
                e.clientY >= rect.y && 
                e.clientY <= rect.y + rect.height;
        if(inOriginalBox) setSelected(!selected);
        else setSelected(false);
        setCurHovering(false);
        setOffset([0,0]);
    }

    const onMouseDown = (e) => {
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.x - rect.width / 2;
        var y = e.clientY- rect.y - rect.height / 2;
        setOffset([x,y]);
        setCurHovering(true);
    }

    var piece = null;
    if(props.piece) piece = <img 
                            style={{marginLeft: offset[0], marginTop: offset[1]}} 
                            onMouseDown={onMouseDown} 
                            onMouseUp={onMouseUp}
                            className="piece"
                            draggable="false" 
                            src={props.piece}
                            />

    const dropped = (e) => {
        var tile = getTileFromEvent(e);
        if(tile && !isStartingTile(tile, e)) {
            tile.style.opacity = 1;
            const droppedRow = tile.id[0];
            const droppedCol = tile.id[2];
            const startRow = e.dragData.row;
            const startCol = e.dragData.col;
            const droppedPiece = e.dragData.droppedPiece;
            const droppedPieceSetSquareState = e.dragData.droppedPieceSetSquareState;
            props.setSquareState(droppedPiece);
            droppedPieceSetSquareState(null);
            
        }
    }
    

    return (
        <DropTarget
        targetKey="foo" 
        onHit={dropped}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        >
            <div 
            className="chessTile" 
            id={props.row + "-" + props.col} 
            style={{
                backgroundColor: getColor(props.row, props.col, isActive ? 0.75 : 1)
            }}
            >
                <DragDropContainer 
                targetKey="foo" 
                dragData={{
                    row: props.row, 
                    col: props.col, 
                    droppedPiece: props.piece,
                    droppedPieceSetSquareState: props.setSquareState,
                
                }}
                >
                    {piece}
                </DragDropContainer>
            </div>
        </DropTarget>
    );
}


const checkForUpdate = (prevProps, nextProps) => {
    return prevProps.piece === nextProps.piece &&
        prevProps.row === nextProps.row &&
        prevProps.col === nextProps.col;
}

const MemoizedChessTile = memo(ChessTile);

const eight = [0,1,2,3,4,5,6,7]

const Board = (props) => {

    const board = useBoard();

    // const makeMove = (startRow, startCol, endRow, endCol) => {
    //     var newBoard = JSON.parse(JSON.stringify(board));
    //     var oldPiece = board[[startRow,startCol]];
    //     newBoard[[startRow,startCol]] = null;
    //     newBoard[[endRow,endCol]] = oldPiece;
    //     setBoard(newBoard);
    // }

    return (
            eight.map(row => 
                eight.map(col => 
                    <MemoizedChessTile
                    key={row + col}
                    row={row} 
                    col={col}
                    piece={board[[row,col]][0]}
                    setSquareState={board[[row,col]][1]}
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