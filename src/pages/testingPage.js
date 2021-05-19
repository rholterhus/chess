import React, { useState, useEffect, memo, useRef }from 'react';
import './testingPage.css';

import moveSound from '../sounds/pieceMove.mp3';
import takeSound from '../sounds/pieceTake.mp3';

import useBoard from '../utils/useBoard.js'

import { DragDropContainer, DropTarget } from 'react-drag-drop-container';


const lightBrown = (opacity) => 'rgb(222,184,135,' + opacity + ")"
const darkBrown = (opacity) => 'rgb(139,69,19,' + opacity + ")"
const green = (opacity) => "rgb(0, 128, 0," + opacity + ")"
const white = (opacity) => "rgb(0, 0, 0," + opacity + ")"
const eight = [0,1,2,3,4,5,6,7]

const getColor = (x,y,opacity=1) => (x % 2) ? ((y % 2) ? lightBrown(opacity) : darkBrown(opacity)) : ((y % 2) ? darkBrown(opacity) : lightBrown(opacity))

const getTileFromEvent = (e) => {
    if(e.target.className == "chessTile") {
        return e.target;
    } else if (e.target.className == "piece") {
        return e.target.parentNode.parentNode.parentNode.parentNode;
    } else if (e.target.className == "tileCircle") {
        return e.target.parentNode;
    } else return null;
}

const isStartingTile = (tile, e) => {
    return tile.id === e.dragData.row + "-" + e.dragData.col
}

const ChessTile = (props) => {

    // const [curHoveredOver, setCurHoveredOver] = useState(false);
    const [curBeingHovered, setCurBeingHovered] = useState([false, false]); // is being hovered, was selected before hover
    const [offset, setOffset] = useState([0,0]);
    const isActive = curBeingHovered[0] || props.selected;
    // const isSelected = props.selected;

    // console.log(props.selected);

    const onDragEnter = (e) => {
        var tile = getTileFromEvent(e);
        if(tile && !isStartingTile(tile, e)) {
            tile.style.backgroundColor = getColor(props.row, props.col, 0.75);
        }
    }

    const onDragLeave = (e) => {
        var tile = getTileFromEvent(e);
        if(tile && !isStartingTile(tile, e)) {
            tile.style.backgroundColor = getColor(props.row, props.col, 1);
        }
    }

    const onMouseUp = (e) => {
        var rect = e.target.parentNode.parentNode.parentNode.parentNode.getBoundingClientRect();
        var inOriginalBox = 
                e.clientX >= rect.x && 
                e.clientX <= rect.x + rect.width && 
                e.clientY >= rect.y && 
                e.clientY <= rect.y + rect.height;
        if(inOriginalBox) {
            if(!curBeingHovered[1]) props.setSelectedSquare(props.row + "-" + props.col);
            else props.setSelectedSquare(null);
            setCurBeingHovered([false, !curBeingHovered[1]]);
        }
        else {
            setCurBeingHovered([false, false]);
            props.setSelectedSquare(null);
        }
        setOffset([0,0]);
    }

    const onMouseDown = (e) => {
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.x - rect.width / 2;
        var y = e.clientY- rect.y - rect.height / 2;
        setOffset([x,y]);
        setCurBeingHovered([true, props.selected]);
        props.setSelectedSquare(props.row + "-" + props.col);
    }

    var piece = null;
    if(props.piece) piece = <img 
                            style={{marginLeft: offset[0], marginTop: offset[1]}} 
                            onPointerDown={onMouseDown} 
                            onPointerUp={onMouseUp}
                            className="piece"
                            draggable="false" 
                            src={props.piece}
                            />

    const dropped = (e) => {
        var tile = getTileFromEvent(e);
        if(tile && !isStartingTile(tile, e)) {
            const droppedPiece = e.dragData.droppedPiece;
            const droppedPieceSetSquareState = e.dragData.droppedPieceSetSquareState;
            tile.style.backgroundColor = getColor(props.row, props.col, 1);
            props.setSquareState(droppedPiece);
            droppedPieceSetSquareState(null);
        }
    }

    const dragData = {
        row: props.row, 
        col: props.col, 
        droppedPiece: props.piece,
        droppedPieceSetSquareState: props.setSquareState,
    };

    const tileStyle = {
        backgroundColor: getColor(props.row, props.col, isActive ? 0.75 : 1)
    };
    

    return (
        <DropTarget targetKey="foo" onHit={dropped} onDragEnter={onDragEnter} onDragLeave={onDragLeave}>
            <div className="chessTile" id={props.row + "-" + props.col} style={tileStyle}>
                <div className="tileCircle" id={"circle-" + props.row + "-" + props.col}>
                    <DragDropContainer targetKey="foo" dragData={dragData}>
                        {piece}
                    </DragDropContainer>
                </div>
            </div>
        </DropTarget>
    );
}


const MemoizedChessTile = memo(ChessTile);

const getAllPossibleMoves = (board, selectedSquare) => {
    if(selectedSquare && selectedSquare[0] == "6") {
        return [[4, selectedSquare[2]], [5, selectedSquare[2]]];
    } else return [];
}

const getColor2 = (x, y) => (x % 2) ? ((y % 2) ? "rgba(166,170,101,255)" : "rgba(104,84,14,255)") : ((y % 2) ? "rgba(104,84,14,255)" : "rgba(166,170,101,255)")

const Board = (props) => {

    const board = useBoard();
    const [selectedSquare, setSelectedSquare] = useState(null);

    // set visibility of certain moves based on selectedSquare and board
    useEffect(() => {
        const allPossibleMoves = getAllPossibleMoves(board, selectedSquare);
            const allPossibleCircles = allPossibleMoves.map(coord => 
                [document.getElementById("circle-" + coord[0] + "-" + coord[1]), coord[0], coord[1]]);
            allPossibleCircles.map(el => el[0].style.backgroundColor = getColor2(el[1], el[2]));
        return () => {
            const allPossibleMoves = getAllPossibleMoves(board, selectedSquare);
            const allPossibleCircles = allPossibleMoves.map(coord => 
                [document.getElementById("circle-" + coord[0] + "-" + coord[1]), coord[0], coord[1]]);
            allPossibleCircles.map(el => el[0].style.backgroundColor = null);
        }
    }, [selectedSquare])

    return (
            eight.map(row => 
                eight.map(col => 
                    <MemoizedChessTile
                    key={row + col}
                    row={row} 
                    col={col}
                    piece={board[[row,col]][0]}
                    setSquareState={board[[row,col]][1]}
                    selected={selectedSquare === row + "-" + col}
                    setSelectedSquare={setSelectedSquare}
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