import React, { useState, useEffect, memo, useRef, useCallback }from 'react';
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
const getColor2 = (x, y) => (x % 2) ? ((y % 2) ? "rgba(166,170,101,255)" : "rgba(104,84,14,255)") : ((y % 2) ? "rgba(104,84,14,255)" : "rgba(166,170,101,255)")


// const getTileFromEvent = (e) => {
//     if(e.target.className == "chessTile") {
//         return e.target;
//     } else if (e.target.className == "piece") {
//         return e.target.parentNode.parentNode.parentNode.parentNode;
//     } else if (e.target.className == "tileCircle") {
//         return e.target.parentNode;
//     } else return null;
// }

// const isStartingTile = (tile, e) => {
//     return tile.id === e.dragData.row + "-" + e.dragData.col
// }

// const ChessTile2 = (props) => {

//     const [curBeingHovered, setCurBeingHovered] = useState([false, false]);
//     const [offset, setOffset] = useState([0,0]);
//     const isActive = curBeingHovered[0] || props.selected;

//     const onDragEnter = (e) => {
//         var tile = getTileFromEvent(e);
//         if(tile && !isStartingTile(tile, e)) {
//             tile.style.backgroundColor = getColor(props.row, props.col, 0.75);
//         }
//     }

//     const onDragLeave = (e) => {
//         var tile = getTileFromEvent(e);
//         if(tile && !isStartingTile(tile, e)) {
//             tile.style.backgroundColor = getColor(props.row, props.col, 1);
//         }
//     }

//     const onMouseUp = (e) => {
//         var rect = e.target.parentNode.parentNode.parentNode.parentNode.getBoundingClientRect();
//         var inOriginalBox = 
//                 e.clientX >= rect.x && 
//                 e.clientX <= rect.x + rect.width && 
//                 e.clientY >= rect.y && 
//                 e.clientY <= rect.y + rect.height;
//         if(inOriginalBox) {
//             if(!curBeingHovered[1] && !(offset[0] === 0 && offset[1] === 0)) props.setSelectedSquare(props.row + "-" + props.col);
//             else props.setSelectedSquare(null);
//             setCurBeingHovered([false, !curBeingHovered[1]]);
//         }
//         else {
//             setCurBeingHovered([false, false]);
//             props.setSelectedSquare(null);
//         }
//         setOffset([0,0]);
//         e.stopPropagation();
//     }

//     const onMouseDown = (e) => {
//         var rect = e.target.getBoundingClientRect();
//         var x = e.clientX - rect.x - rect.width / 2;
//         var y = e.clientY- rect.y - rect.height / 2;
//         setOffset([x,y]);
//         setCurBeingHovered([true, props.selected]);
//         props.setSelectedSquare(props.row + "-" + props.col);
//     }

//     var piece = null;
//     if(props.piece) piece = <img 
//                             id={"piece-" + props.row + "-" + props.col}
//                             style={{marginLeft: offset[0], marginTop: offset[1]}} 
//                             onPointerDown={onMouseDown} 
//                             onPointerUp={onMouseUp}
//                             className="piece"
//                             draggable="false" 
//                             src={props.piece}
//                             />

//     const dropped = (e) => {
//         var tile = getTileFromEvent(e);
//         if(tile && !isStartingTile(tile, e)) {
//             const droppedPiece = e.dragData.droppedPiece;
//             const droppedPieceSetSquareState = e.dragData.droppedPieceSetSquareState;
//             tile.style.backgroundColor = getColor(props.row, props.col, 1);
//             props.setSquareState(droppedPiece);
//             droppedPieceSetSquareState(null);
//             props.testFunction();
//         }
//     }

//     const dragData = {
//         row: props.row, 
//         col: props.col, 
//         droppedPiece: props.piece,
//         droppedPieceSetSquareState: props.setSquareState,
//     };

//     const tileStyle = {
//         backgroundColor: getColor(props.row, props.col, isActive ? 0.75 : 1)
//     };
    

//     return (
//         <DropTarget targetKey="foo" onHit={dropped} onDragEnter={onDragEnter} onDragLeave={onDragLeave}>
//             <div className="chessTile" id={props.row + "-" + props.col} style={tileStyle}>
//                 <div className="tileCircle" id={"circle-" + props.row + "-" + props.col}>
//                     <DragDropContainer targetKey="foo" dragData={dragData}>
//                         {piece}
//                     </DragDropContainer>
//                 </div>
//             </div>
//         </DropTarget>
//     );
// }


// const componentShouldUpdate = (previousProps, currentProps) =>  {
//     return previousProps.row === currentProps.row &&
//     previousProps.col === currentProps.col && 
//     previousProps.piece === currentProps.piece && 
//     previousProps.selected === currentProps.selected
// }


// const getAllPossibleMoves = (board, selectedSquare) => {
//     if(selectedSquare && selectedSquare[0] == "6") {
//         return [[4, selectedSquare[2]], [5, selectedSquare[2]]];
//     } else return [];
// }

// const getCoordsFromEvent = (e) => {
//     if (e.target.className === "chessTile") return [e.target.id[0], e.target.id[2]];
//     if (e.target.className === "tileCircle") return [e.target.parentNode.id[0], e.target.parentNode.id[2]];
// }


// const Board1 = (props) => {

//     const board = useBoard();
//     const [selectedSquare, setSelectedSquare] = useState(null);
//     const [sideToPlay, setSideToPlay] = useState(true); // white will be true, black will be false

//     const testFunction = useCallback(() => 
//     setSideToPlay(sideToPlay => !sideToPlay)
//     , []);


//     // set visibility of certain moves based on selectedSquare and board
//     useEffect(() => {
//         const allPossibleMoves = getAllPossibleMoves(board, selectedSquare);
//             const allPossibleCircles = allPossibleMoves.map(coord => [document.getElementById("circle-" + coord[0] + "-" + coord[1]), coord[0], coord[1]]);
//             allPossibleCircles.map(el => el[0].style.backgroundColor = getColor2(el[1], el[2]));
//             const allPossibleTiles = allPossibleMoves.map(coord => [document.getElementById(coord[0] + "-" + coord[1]), coord[0], coord[1]]);
//             allPossibleTiles.map(el => el[0].style.cursor = "pointer");
//             allPossibleTiles.map(el => el[0].onmouseover = () => el[0].style.backgroundColor = getColor2(el[1], el[2]));
//             allPossibleTiles.map(el => el[0].onmouseleave = () => el[0].style.backgroundColor = getColor(el[1], el[2]));
//             allPossibleTiles.map(el => el[0].onpointerdown = (e) => {
//                 const [clickedRow, clickedCol] = getCoordsFromEvent(e);
//                 const startRow = selectedSquare[0];
//                 const startCol = selectedSquare[2];
//                 const piece = board[[startRow,startCol]][0];
//                 board[[startRow,startCol]][1](null);
//                 board[[clickedRow,clickedCol]][1](piece);
//                 setSelectedSquare(null);
//                 if (e.target.className === "chessTile") e.target.style.backgroundColor = getColor(el[1], el[2]);
//                 if (e.target.className === "tileCircle") e.target.parentNode.style.backgroundColor = getColor(el[1], el[2]);
//             });
//         return () => {
//             const allPossibleMoves = getAllPossibleMoves(board, selectedSquare);
//             const allPossibleCircles = allPossibleMoves.map(coord => [document.getElementById("circle-" + coord[0] + "-" + coord[1]), coord[0], coord[1]]);
//             allPossibleCircles.map(el => el[0].style.backgroundColor = null);
//             const allPossibleTiles = allPossibleMoves.map(coord => [document.getElementById(coord[0] + "-" + coord[1]), coord[0], coord[1]]);
//             allPossibleTiles.map(el => el[0].style.cursor = null);
//             allPossibleTiles.map(el => el[0].onmouseover = null);
//             allPossibleTiles.map(el => el[0].onmouseleave = null);
//             allPossibleTiles.map(el => el[0].onpointerdown = null);
//             allPossibleTiles.map(el => el[0].onpointerup = null);
//         }
//     }, [selectedSquare])

//     return (
//             eight.map(row => 
//                 eight.map(col => 
//                     <MemoizedChessTile
//                     key={row + col}
//                     row={row} 
//                     col={col}
//                     piece={board[[row,col]][0]}
//                     setSquareState={board[[row,col]][1]}
//                     selected={selectedSquare === row + "-" + col}
//                     setSelectedSquare={setSelectedSquare}
//                     testFunction={testFunction}
//                     />
//                 )
//             )
//     );
// }


const ChessTile = (props) => {

    var piece = null;
    const pieceOffset = props.selected ? {marginLeft: props.selected[1], marginTop: props.selected[2]} : null;
    if(props.piece) piece = <img 
                            id={"piece-" + props.row + "-" + props.col}
                            className={props.selected ? "selectedPiece" : "piece"}
                            draggable="false" 
                            src={props.piece}
                            style={pieceOffset} 
                            onPointerDown={props.handleTileClick}
                            onPointerUp={props.handleTileUnClick}
                            />

    const isActive = props.selected || props.hovered;
    // console.log('rerendering tile')

    const tileStyle = {
        backgroundColor: isActive ? "green" : getColor(props.row, props.col)
    };

    return (
        <DropTarget targetKey="chessTarget" onDragEnter={props.handleTileHoverEnter} onDragLeave={props.handleTileHoverLeave}>
            <div className="chessTile" id={props.row + "-" + props.col} style={tileStyle}>
                <div className="tileCircle" id={"circle-" + props.row + "-" + props.col}>
                    <DragDropContainer targetKey="chessTarget" dragData={props.row + "-" + props.col}>
                        {piece}
                    </DragDropContainer>
                </div>
            </div>
        </DropTarget>
    );
}


const MemoizedChessTile = memo(ChessTile);


const getTileFromEvent = (e) => {
    if(e.target.className == "chessTile") {
        return e.target;
    } else if (e.target.className == "piece"|| e.target.className == "selectedPiece") {
        return e.target.parentNode.parentNode.parentNode.parentNode;
    } else if (e.target.className == "tileCircle") {
        return e.target.parentNode;
    } else return null;
}

const getStartingTile = () => {
    var selectedPieces = document.getElementsByClassName("selectedPiece");
    return selectedPieces[0].parentNode.parentNode.parentNode.parentNode;
}

const Board = (props) => {

    const board = useBoard();
    const [selectedSquare, setSelectedSquare] = useState([null,0,0]);
    const [hoveredSquare, setHoveredSquare] = useState(null);

    const handleTileClick = useCallback((e) => {
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.x - rect.width / 2;
        var y = e.clientY- rect.y - rect.height / 2;
        setSelectedSquare([e.target.id, x, y]);
    }, [])

    const handleTileUnClick = useCallback((e) => {
        setSelectedSquare([null, 0, 0]);
        setHoveredSquare(null);
    }, [])

    const handleTileHoverEnter = useCallback((e) => {
        setHoveredSquare(e.target.id);
        // var tile = getTileFromEvent(e);
        // var startingTile = getStartingTile();
        // if(tile && tile != startingTile) {
        //     tile.style.backgroundColor = "green";
        // }
    }, [])

    const handleTileHoverLeave = useCallback((e) => {
        setHoveredSquare(null);
        // var tile = getTileFromEvent(e);
        // var startingTile = getStartingTile();
        // if(tile && tile != startingTile) {
        //     tile.style.backgroundColor = getColor(tile.id[0], tile.id[2]);
        // }
    }, [])
    

    return (
            eight.map(row => 
                eight.map(col => 
                    <MemoizedChessTile
                    key={row + col}
                    row={row} 
                    col={col}
                    piece={board[[row,col]][0]}
                    selected={selectedSquare[0] === "piece-" + row + "-" + col ? selectedSquare : null}
                    hovered={hoveredSquare === row + "-" + col}
                    handleTileClick={handleTileClick}
                    handleTileUnClick={handleTileUnClick}
                    handleTileHoverEnter={handleTileHoverEnter}
                    handleTileHoverLeave={handleTileHoverLeave}
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