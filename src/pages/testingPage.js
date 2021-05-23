import React, { useState, useEffect, memo, useRef, useCallback } from 'react';
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
import {ReactComponent as Arrow} from '../images/arrow.svg';

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


let root = document.documentElement;


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
                            className={props.selected ? "selectedPiece" : props.isOnSideToPlay ? "selectablePiece" : "selectablePiece"}
                            draggable="false" 
                            src={props.piece}
                            style={pieceOffset} 
                            onPointerDown={props.isOnSideToPlay ? props.handleTileClick : null}
                            onPointerUp={props.isOnSideToPlay ? props.handleTileUnClick : null}
                            />

    const isActive = props.selected || props.hovered;
    const isPossibleMove = props.isPossibleMove;

    const tileStyle = {
        backgroundColor: props.isInCheck ? "red" : isActive ? getColor2(props.row, props.col) : getColor(props.row, props.col)
    };

    const style = {}
    const color = getColor2(props.row, props.col);
    if(isPossibleMove) {
        if(piece) style["background"] = `linear-gradient(to bottom left,  ${color} 12.5%, transparent 12.5%),\
        linear-gradient(to bottom right,  ${color} 12.5%, transparent 12.5%),\
        linear-gradient(to top left,  ${color} 12.5%, transparent 12.5%),\
        linear-gradient(to top right, ${color} 12.5%, transparent 12.5%)`;
        else style["backgroundColor"] = color;
    }

    const dragData = {
        piece: props.piece,
        startSquare: [props.row, props.col]
    }

    const inner = <div className="chessTile" id={props.row + "-" + props.col} style={tileStyle}>
                        <div className={props.isPossibleMove && piece ? "tileCorners": "tileCircle"} id={"circle-" + props.row + "-" + props.col} style={style}>
                            <DragDropContainer targetKey="chessTarget" dragData={dragData} noDragging={!props.isOnSideToPlay}>
                                {piece}
                            </DragDropContainer>
                        </div>
                    </div>;

    return (
        <DropTarget targetKey={"chessTarget"} onHit={e => props.handleDrop(e, [props.row, props.col], props.isPossibleMove)} onDragEnter={props.isPossibleMove ? props.handleTileHoverEnter : () => {}} onDragLeave={props.isPossibleMove ? props.handleTileHoverLeave : () => {}}>
            {inner}
        </DropTarget>
    );
}


const MemoizedChessTile = memo(ChessTile);


const getTileFromEvent = (e) => {
    if(e.target.className == "chessTile") {
        return e.target;
    } else if (e.target.className == "selectablePiece" || e.target.className == "selectedPiece" || e.target.className == "nonSelectablePiece") {
        return e.target.parentNode.parentNode;
    } else if (e.target.className == "tileCircle") {
        return e.target.parentNode;
    } else if (e.target.className == "ddcontainer") {
        return e.target.parentNode.parentNode;
    } else return null;
}

const getTileFromCoordinates = (x, y) => {
    const list = document.elementsFromPoint(x, y);
    for(let i = 0; i < list.length; ++i) if(list[i].className === "chessTile") return list[i];
    return null;
}

const getStartingTile = () => {
    var selectedPieces = document.getElementsByClassName("selectedPiece");
    return selectedPieces[0].parentNode.parentNode.parentNode.parentNode;
}

const withinBoard = (x, y) => 0 <= x && x <= 7 && 0 <= y && y <= 7;

const isOccupied = (board, x, y) => withinBoard(x, y) && board[[x,y]][0];

const isOccupiedByBlack = (board, x, y) => withinBoard(x, y) && isOccupied(board, x, y) && !getSide(board[[x,y]][0]);

const isOccupiedByWhite = (board, x, y) => withinBoard(x, y) && isOccupied(board, x, y) && getSide(board[[x,y]][0]);


const getAllPossibleMoves = (board, selectedSquare) => {
    var x = parseInt(selectedSquare[0]);
    var y = parseInt(selectedSquare[2]);
    var selectedPiece = board[[x,y]][0];
    const side = getSide(selectedPiece);
    let ans = []
    
    if(selectedPiece == pawnwhite) {
        if(!isOccupied(board, x-1, y)) {
            ans.push([x-1,y]);
            if(x == "6" && !isOccupied(board, x-2, y)) ans.push([x-2,y]);
        }
        if(isOccupiedByBlack(board, x-1, y-1)) ans.push([x-1,y-1]);
        if(isOccupiedByBlack(board, x-1, y+1)) ans.push([x-1,y+1]);
    }

    if(selectedPiece == pawnblack) {
        if(!isOccupied(board, x+1, y)) {
            ans.push([x+1,y]);
            if(x == "1" && !isOccupied(board, x+2, y)) ans.push([x+2,y]);
        }
        if(isOccupiedByWhite(board, x+1, y-1)) ans.push([x+1,y-1]);
        if(isOccupiedByWhite(board, x+1, y+1)) ans.push([x+1,y+1]);
    }

    if(selectedPiece == knightwhite || selectedPiece == knightblack) {
        const checkOccupied = side ? (b, x, y) => withinBoard(x, y) && !isOccupiedByWhite(b, x, y)  : (b, x, y) => withinBoard(x, y) && !isOccupiedByBlack(b, x, y);
        const possibleMoves = [[1,2], [1,-2], [-1,2], [-1,-2], [2,1], [-2,1], [2,-1], [-2,-1]]
        for(let i = 0; i < possibleMoves.length; ++i) {
            const [diffx, diffy] = possibleMoves[i];
            if(checkOccupied(board, diffx + x, diffy + y)) ans.push([diffx+x,diffy+y]) 
        }
    }

    if(selectedPiece == bishopwhite || selectedPiece == bishopblack || selectedPiece == queenwhite || selectedPiece == queenblack) {        
        const checkOccupied = side ? (b, x, y) => withinBoard(x, y) && !isOccupiedByWhite(b, x, y)  : (b, x, y) => withinBoard(x, y) && !isOccupiedByBlack(b, x, y);
        const otherSideOccupied = side ? isOccupiedByBlack : isOccupiedByWhite;
        const possibleMoves = [[1,1], [-1, 1], [1,-1], [-1,-1]];
        for(let i = 0; i < possibleMoves.length; ++i) {
            const [diffx, diffy] = possibleMoves[i];
            let m = 1;
            while(checkOccupied(board, m * diffx + x, m * diffy + y)) {
                ans.push([m*diffx+x,m*diffy+y]);
                if(otherSideOccupied(board, m * diffx + x, m * diffy + y)) break;
                m += 1;
            }
        }
    }

    if(selectedPiece == rookwhite || selectedPiece == rookblack || selectedPiece == queenwhite || selectedPiece == queenblack) {        
        const checkOccupied = side ? (b, x, y) => withinBoard(x, y) && !isOccupiedByWhite(b, x, y)  : (b, x, y) => withinBoard(x, y) && !isOccupiedByBlack(b, x, y);
        const otherSideOccupied = side ? isOccupiedByBlack : isOccupiedByWhite;
        const possibleMoves = [[0,1], [0,-1], [1,0], [-1,0]];
        for(let i = 0; i < possibleMoves.length; ++i) {
            const [diffx, diffy] = possibleMoves[i];
            let m = 1;
            while(checkOccupied(board, m * diffx + x, m * diffy + y)) {
                ans.push([m*diffx+x,m*diffy+y]);
                if(otherSideOccupied(board, m * diffx + x, m * diffy + y)) break;
                m += 1;
            }
        }
    }



    return ans;
}

const getCoordsFromEvent = (e) => {
    if (e.target.className === "chessTile") return [e.target.id[0], e.target.id[2]];
    if (e.target.className === "tileCircle") return [e.target.parentNode.id[0], e.target.parentNode.id[2]];
}

const getSide = (piece) => {
    return piece == kingwhite ||
        piece == queenwhite ||
        piece == bishopwhite ||
        piece == knightwhite ||
        piece == rookwhite ||
        piece == pawnwhite;
}

const isPossibleMove = (selectedSquare, currentSquare, possibleMoves) => {
    if(possibleMoves && selectedSquare) return possibleMoves[selectedSquare].some(move => move[0] == currentSquare[0] && move[1] == currentSquare[1]);
    else return false;
}

const pieceIsInCheck = (piece, sideToPlay, isInCheck) => (piece == kingwhite || piece == kingblack) && isInCheck && getSide(piece) == sideToPlay


const Board = (props) => {

    const board = useBoard();
    const [selectedSquare, setSelectedSquare] = useState([null, 0, 0, false]); //piece, offsetX, offsetY, wasSelectedPreviously
    const [hoveredSquare, setHoveredSquare] = useState(null);
    const [sideToPlay, setSideToPlay] = useState(true); // white is true, black is false
    const [possibleMoves, setPossibleMoves] = useState(null);
    const [isInCheck, setIsInCheck] = useState(null);

    const handleTileClick = useCallback((e) => {
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.x - rect.width / 2;
        var y = e.clientY - rect.y - rect.height / 2;
        setSelectedSquare([e.target.id, x, y, selectedSquare[0] === e.target.id]);
    }, [selectedSquare])

    const handleTileUnClick = useCallback((e) => {
        var tile = getTileFromCoordinates(e.clientX, e.clientY);
        if(tile) {
            if("piece-" + tile.id == selectedSquare[0]) {
                if(selectedSquare[3]) setSelectedSquare([null, 0, 0, false]);
                else setSelectedSquare([selectedSquare[0], 0, 0, true]);
            } else if(isPossibleMove(selectedSquare[0], [tile.id[0], tile.id[2]], possibleMoves)) {
                // let handleDrop take care of this case
            } else {
                setSelectedSquare([null, 0, 0, false])
            }
        } else {
            setSelectedSquare([null, 0, 0, false]);
        }
        setHoveredSquare(null);
    }, [selectedSquare, possibleMoves])

    const handleTileHoverEnter = useCallback((e) => {
        const tile = getTileFromEvent(e);
        setHoveredSquare(tile.id);
    }, [])

    const handleTileHoverLeave = useCallback((e) => {
        setHoveredSquare(null);
    }, [])

    const handleDrop = useCallback((e, droppedTile, isPossibleMove) => {
        if(isPossibleMove) {
            const piece = e.dragData.piece;
            board[e.dragData.startSquare][1](null);
            board[droppedTile][1](piece);
            setSelectedSquare([null, 0, 0, false]);
            setSideToPlay(sideToPlay => !sideToPlay);
        }
    }, [])

    useEffect(() => {
        var newPossibleMoves = {};
        var isInCheck = false;
        for(let i = 0; i <= 7; ++i) {
            for(let j = 0; j <=7; ++j) {
                newPossibleMoves["piece-" + i + "-" + j] = getAllPossibleMoves(board, i + "-" + j);
                for(let k = 0; k < newPossibleMoves["piece-" + i + "-" + j].length; k++) {
                    const [x, y] = newPossibleMoves["piece-" + i + "-" + j][k];
                    if((board[[x,y]][0] == kingwhite || board[[x,y]][0] == kingblack) && getSide(board[[x,y]][0]) == sideToPlay) {
                        isInCheck = true;
                    }
                }
            }
        }
        setPossibleMoves(newPossibleMoves);
        setIsInCheck(isInCheck);
        sideToPlay ? root.style.setProperty('--arrowColor', "black") : root.style.setProperty('--arrowColor', "white");
    }, [sideToPlay]);

    return (
        <div className="boardContainer">
            <div className="board">
                {eight.map(row => 
                    eight.map(col => 
                        <MemoizedChessTile
                        key={row + col}
                        row={row} 
                        col={col}
                        piece={board[[row,col]][0]}
                        isInCheck={pieceIsInCheck(board[[row,col]][0], sideToPlay, isInCheck)}
                        isOnSideToPlay={getSide(board[[row,col]][0]) === sideToPlay}
                        selected={selectedSquare[0] === "piece-" + row + "-" + col ? selectedSquare : null}
                        hovered={hoveredSquare === row + "-" + col}
                        handleTileClick={handleTileClick}
                        handleTileUnClick={handleTileUnClick}
                        handleDrop={handleDrop}
                        handleTileHoverEnter={handleTileHoverEnter}
                        handleTileHoverLeave={handleTileHoverLeave}
                        isPossibleMove={isPossibleMove(selectedSquare[0], [row, col], possibleMoves)}
                        />
                    )
                )}
            </div>
            <div className="boardButtonContainer">
                <div className="boardButton" 
                style={{backgroundColor: sideToPlay ? "white" : "black"}}
                onMouseEnter={e => e.target.style.backgroundColor = "gray"}
                onMouseLeave={e => e.target.style.backgroundColor = sideToPlay ? "white" : "black"}
                >
                    <i className="arrow left"></i>
                </div>
                <div className="boardButton" 
                style={{backgroundColor: sideToPlay ? "white" : "black"}}
                onMouseEnter={e => e.target.style.backgroundColor = "gray"}
                onMouseLeave={e => e.target.style.backgroundColor = sideToPlay ? "white" : "black"}
                >
                    <i className="arrow right"></i>
                </div>
            </div>
        </div>
    );
}




function TestPage(props) {

    return (
        <div className="mainContainer" id="container">
            <Board/>
        </div>
    );
}

export default TestPage;