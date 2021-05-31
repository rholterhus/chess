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

import {Howl, Howler} from 'howler';

import useBoard from '../utils/useBoard.js'

import { DragDropContainer, DropTarget } from 'react-drag-drop-container';

import axios from 'axios';

const moveSoundVar = new Howl({
    src: [moveSound]
});
const takeSoundVar = new Howl({
    src: [takeSound]
});

const lightBrown = (opacity) => 'rgb(222,184,135,' + opacity + ")"
const darkBrown = (opacity) => 'rgb(139,69,19,' + opacity + ")"
const eight = [0,1,2,3,4,5,6,7]

const getColor = (x,y,opacity=1) => (x % 2) ? ((y % 2) ? lightBrown(opacity) : darkBrown(opacity)) : ((y % 2) ? darkBrown(opacity) : lightBrown(opacity))
const getColor2 = (x, y) => (x % 2) ? ((y % 2) ? "rgba(166,170,101,255)" : "rgba(104,84,14,255)") : ((y % 2) ? "rgba(104,84,14,255)" : "rgba(166,170,101,255)")
const getRed = (x, y) => (x % 2) ? ((y % 2) ? "#f24a36" : "#a81416") : ((y % 2) ? "#a81416" : "#f24a36")



let root = document.documentElement;

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
        backgroundColor: props.isInCheck ? getRed(props.row, props.col) : isActive ? getColor2(props.row, props.col) : getColor(props.row, props.col)
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
        return e.target.parentNode.parentNode.parentNode.parentNode;
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

const withinBoard = (x, y) => 0 <= x && x <= 7 && 0 <= y && y <= 7;

const isOccupied = (board, x, y) => withinBoard(x, y) && board[[x,y]][0];

const isOccupiedByBlack = (board, x, y) => withinBoard(x, y) && isOccupied(board, x, y) && !getSide(board[[x,y]][0]);

const isOccupiedByWhite = (board, x, y) => withinBoard(x, y) && isOccupied(board, x, y) && getSide(board[[x,y]][0]);


const getAllPossibleMovesFromSquare = (board, selectedSquare, checkLegality=true) => {
    var x = parseInt(selectedSquare[0]);
    var y = parseInt(selectedSquare[2]);
    var selectedPiece = board[[x,y]][0];
    const side = getSide(selectedPiece);
    let ans = []
    
    if(selectedPiece == pawnwhite) {
        if(!isOccupied(board, x-1, y) && withinBoard(x-1, y)) {
            ans.push([x-1,y]);
            if(x == "6" && !isOccupied(board, x-2, y)) ans.push([x-2,y]);
        }
        if(isOccupiedByBlack(board, x-1, y-1)) ans.push([x-1,y-1]);
        if(isOccupiedByBlack(board, x-1, y+1)) ans.push([x-1,y+1]);
    }

    if(selectedPiece == pawnblack) {
        if(!isOccupied(board, x+1, y) && withinBoard(x+1, y)) {
            ans.push([x+1,y]);
            if(x == "1" && !isOccupied(board, x+2, y)) ans.push([x+2,y]);
        }
        if(isOccupiedByWhite(board, x+1, y-1)) ans.push([x+1,y-1]);
        if(isOccupiedByWhite(board, x+1, y+1)) ans.push([x+1,y+1]);
    }

    if(selectedPiece == knightwhite || selectedPiece == knightblack) {
        const checkOccupied = side ? (b, x, y) => withinBoard(x, y) && !isOccupiedByWhite(b, x, y)  : (b, x, y) => withinBoard(x, y) && !isOccupiedByBlack(b, x, y);
        const possibleMoves = [[1,2], [1,-2], [-1,2], [-1,-2], [2,1], [-2,1], [2,-1], [-2,-1]];
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

    if(selectedPiece == kingwhite || selectedPiece == kingblack) {        
        const checkOccupied = side ? (b, x, y) => withinBoard(x, y) && !isOccupiedByWhite(b, x, y)  : (b, x, y) => withinBoard(x, y) && !isOccupiedByBlack(b, x, y);
        const possibleMoves = [[0,1], [0,-1], [1,0], [-1,0], [-1,-1], [1,-1], [-1,1], [1,1]];
        for(let i = 0; i < possibleMoves.length; ++i) {
            const [diffx, diffy] = possibleMoves[i];
            if(checkOccupied(board, diffx + x, diffy + y)) {
                ans.push([diffx+x,diffy+y]);
            }
        }
    }



    if(checkLegality) {
        let legalAns = []
        for(let i = 0; i < ans.length; ++i) {
            if(isLegalMove(board, side, [selectedSquare[0], selectedSquare[2]], ans[i])) legalAns.push(ans[i]);
        }
        return legalAns;
    } else {
        return ans;
    }
}

const isLegalMove = (board, side, startSquare, endSquare) => {

    // make the move, then do a scan for possible rooks, bishops or knights that could attack the square
    let newBoard = {}
    for(let i = 0; i <= 7; ++i) {
        for(let j = 0; j <= 7; ++j) {
            newBoard[[i,j]] = board[[i,j]][0];
        }
    }

    alterBoard(newBoard, startSquare, endSquare);

    var kingSquare = null;

    // find king square
    for(let i = 0; i <= 7; ++i) {
        for(let j = 0; j <= 7; ++j) {
            if((newBoard[[i,j]] == kingwhite || newBoard[[i,j]] == kingblack) && getSide(newBoard[[i,j]]) == side) {
                kingSquare = [i,j];
            }
        }
    }

    const x = kingSquare[0];
    const y = kingSquare[1];

    const isOutOfBounds = (i, j) => i < 0 || i > 7 || j < 0 || j > 7; 
    const notOccupied = (i, j) => !isOutOfBounds(i,j) && newBoard[[i,j]] === null;

    // check for knight captures

    const isOppositeKnight = side ? 
    (i, j) => !isOutOfBounds(i, j) && newBoard[[i,j]] == knightblack 
    : 
    (i, j) => !isOutOfBounds(i, j) && newBoard[[i,j]] == knightwhite;
    const possibleKnightMoves = [[1,2], [1,-2], [-1,2], [-1,-2], [2,1], [-2,1], [2,-1], [-2,-1]]
    for(let i = 0; i < possibleKnightMoves.length; ++i) {
        const [diffx, diffy] = possibleKnightMoves[i];
        if(isOppositeKnight(diffx + x,diffy + y)) return false;
    }

    // check for rook captures

    const isOppositeRookorQueen = side ? 
    (i, j) => !isOutOfBounds(i, j) && (newBoard[[i,j]] == rookblack || newBoard[[i,j]] == queenblack)
     : 
    (i, j) => !isOutOfBounds(i, j) && (newBoard[[i,j]] == rookwhite || newBoard[[i,j]] == queenwhite);
    const possibleRookMoves = [[0,1], [0,-1], [1,0], [-1,0]];
    for(let i = 0; i < possibleRookMoves.length; ++i) {
        const [diffx, diffy] = possibleRookMoves[i];
        let m = 1;
        while(notOccupied(m * diffx + x, m * diffy + y)) m += 1;
        if(isOppositeRookorQueen(m * diffx + x, m * diffy + y)) return false;
    }


    // check for bishop captures

    const isOppositeBishoporQueen = side ? 
    (i, j) => !isOutOfBounds(i, j) && (newBoard[[i,j]] == bishopblack || newBoard[[i,j]] == queenblack)
    :
    (i, j) => !isOutOfBounds(i, j) && (newBoard[[i,j]] == bishopwhite || newBoard[[i,j]] == queenwhite);
    const possibleBishopMoves = [[-1,1], [-1,-1], [1,1], [1,-1]];
    for(let i = 0; i < possibleBishopMoves.length; ++i) {
        const [diffx, diffy] = possibleBishopMoves[i];
        let m = 1;
        while(notOccupied(m * diffx + x, m * diffy + y)) m += 1;
        if(isOppositeBishoporQueen(m * diffx + x, m * diffy + y)) return false;
    }

    // check for pawn captures

    const isOppositePawn = side ? 
    (i, j) => !isOutOfBounds(i, j) && newBoard[[i,j]] == pawnblack
    :
    (i, j) => !isOutOfBounds(i, j) && newBoard[[i,j]] == pawnwhite
    const possiblePawnMoves =  side ? 
    [[-1,1], [-1,-1]]
    :
    [[1,1], [1,-1]]
    for(let i = 0; i < possiblePawnMoves.length; ++i) {
        const [diffx, diffy] = possiblePawnMoves[i];
        if(isOppositePawn(diffx + x,diffy + y)) return false;
    }

    

    return true;
}


// board must be a copy and not the actual board state from useBoard, this will be enforced anyways because it is 
// indexed differently
const alterBoard = (board, startSquare, endSquare) => {
    // for now, just move startSquare to endSquare, this will need to be more sophisticated later
    const piece = board[startSquare];
    board[endSquare] = piece;
    board[startSquare] = null;
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

const pieceIsInCheck = (piece, sideToPlay, isInCheck) => (piece == kingwhite || piece == kingblack) && isInCheck && getSide(piece) == sideToPlay;

const makeMove = (board, startSquare, piece, droppedSquare, setSelectedSquare, setSideToPlay) => {
    if(board[droppedSquare][0]) takeSoundVar.play();
    else moveSoundVar.play();
    board[startSquare][1](null);
    board[droppedSquare][1](piece);
    setSelectedSquare([null, 0, 0, false]);
    setSideToPlay(sideToPlay => !sideToPlay);
}

const addClickable = (el, board, setSelectedSquare, setSideToPlay, setHoveredSquare) => {
    el.style.cursor = "pointer";
    el.onmouseenter = () => el.style.backgroundColor = getColor2(el.id[0], el.id[2]);
    el.onmouseleave = () => el.style.backgroundColor = getColor(el.id[0], el.id[2]);
    el.onpointerdown  = (e) => {
        el.style.backgroundColor = getColor(el.id[0], el.id[2]);
        let tile = getTileFromEvent(e);
        let startPiece = document.getElementsByClassName("selectedPiece")[0];
        const startSquare = [startPiece.id[6], startPiece.id[8]];
        const droppedSquare = [tile.id[0], tile.id[2]]
        makeMove(board, startSquare, board[startSquare][0], droppedSquare, setSelectedSquare, setSideToPlay);
    };
}
    

const removeClickable = (el) => {
    el.style.cursor = "default";
    el.onmouseenter = null;
    el.onmouseleave = null;
    el.onpointerdown = null;
}


var getBoardRepresentation = function(board) {
    var s = '';
    for(var num = 63; num >= 0; num--) {
      var i = Math.floor(num/8);
      var j = (7 - (num % 8)) % 8;
      if(board[[i,j]][0] == pawnwhite) s += 'P'
      else if(board[[i,j]][0] == knightwhite) s += 'H'
      else if(board[[i,j]][0] == bishopwhite) s += 'B'
      else if(board[[i,j]][0] == rookwhite) s += 'R'
      else if(board[[i,j]][0] == queenwhite) s += 'Q'
      else if(board[[i,j]][0] == kingwhite) s += 'K'
  
      else if(board[[i,j]][0] == pawnblack) s += 'O'
      else if(board[[i,j]][0] == knightblack) s += 'L'
      else if(board[[i,j]][0] == bishopblack) s += 'D'
      else if(board[[i,j]][0] == rookblack) s += 'C'
      else if(board[[i,j]][0] == queenblack) s += 'W'
      else if(board[[i,j]][0] == kingblack) s += 'I'
      else s += '_';
    }
    return s;
  }


const noPossibleMoves = (board, possibleMoves, sideToPlay) => {
    for(let i = 0; i <= 7; ++i) {
        for(let j = 0; j <= 7; ++j) {
            if(getSide(board[[i,j]][0]) === sideToPlay && possibleMoves["piece-" + i + "-" + j].length > 0) {
                return false;
            }
        }
    }
    return true;
}


const Modal = (props) => {

    const style = {
        zIndex: props.isOpen !== null ? 1 : -1,
        backgroundColor: props.isOpen !== null ? "rgb(0,0,0,0.5)" : "rgb(0,0,0,0)"
    }

    let butttonStyles = [];
    for(let i = 0; i < 4; ++i) {
        let newStyle = {};
        if(i == 0) {
            newStyle["top"] = 0;
            newStyle["left"] = 0;
        } else if (i == 1) {
            newStyle["top"] = 0;
            newStyle["right"] = 0;
        } else if (i == 2) {
            newStyle["bottom"] = 0;
            newStyle["left"] = 0;
        } else if (i == 3) {
            newStyle["bottom"] = 0;
            newStyle["right"] = 0;
        }
        butttonStyles.push(newStyle);
    }

    const getPiece = (num) => {
        if(num == 0) return !props.isOpen ? queenblack : queenwhite;
        if(num == 1) return !props.isOpen ? rookblack : rookwhite;
        if(num == 2) return !props.isOpen ? bishopblack : bishopwhite;
        if(num == 3) return !props.isOpen ? knightblack : knightwhite;
    }

    var modal = null;
    if(props.isOpen !== null) {
        modal = 
            <div className="modal">
                {[0,1,2,3].map(num => 
                    <img 
                        className="modalButton" 
                        key={num}
                        style={butttonStyles[num]} 
                        src={getPiece(num)} 
                        onPointerDown={() => props.handleModalClick(num)}>
                    </img>
                )
                }
            </div>
    }

    return (
        <div className="modalBackground" style={style}>
           {modal}
        </div>
    )

}

const MemoizedModal = memo(Modal);


const Board = (props) => {

    const board = useBoard();
    const [selectedSquare, setSelectedSquare] = useState([null, 0, 0, false]); //piece, offsetX, offsetY, wasSelectedPreviously
    const [hoveredSquare, setHoveredSquare] = useState(null);
    const [sideToPlay, setSideToPlay] = useState(true); // white is true, black is false
    const [possibleMoves, setPossibleMoves] = useState(null);
    const [isInCheck, setIsInCheck] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(null);

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
            makeMove(board, e.dragData.startSquare, e.dragData.piece, droppedTile, setSelectedSquare, setSideToPlay);
        }
    }, [board])

    const handleModalClick = useCallback((num) => {
        // simply find the pawn of interest and change it to the selected piece
        for(let i = 0; i <= 7; ++i) {
            if(board[[0,i]][0] == pawnwhite) {
                const piece = [queenwhite, rookwhite, bishopwhite, knightwhite][num];
                board[[0,i]][1](piece);
            } else if(board[[7,i]][0] == pawnblack) {
                const piece = [queenblack, rookblack, bishopblack, knightblack][num];
                board[[7,i]][1](piece);
            }
        }
        setModalIsOpen(null);
    }, [board])

    useEffect(() => {
        for(let i = 0; i <= 7; ++i) {
            if(board[[0,i]][0] == pawnwhite) {
                setModalIsOpen(true);
            } else if(board[[7,i]][0] == pawnblack) {
                setModalIsOpen(false);
            }
        }
    }, [sideToPlay]);

    useEffect(() => {
        var newPossibleMoves = {};
        var isInCheck = false;
        for(let i = 0; i <= 7; ++i) {
            for(let j = 0; j <=7; ++j) {
                newPossibleMoves["piece-" + i + "-" + j] = getAllPossibleMovesFromSquare(board, i + "-" + j);
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
    }, [sideToPlay, modalIsOpen]);


    useEffect(() => {
        return;
        if(!sideToPlay) {
            const isDev = process.env.NODE_ENV == "development";
            const url = isDev ? "http://localhost:5000/getMove" : "https://polar-badlands-38570.herokuapp.com/getMove";
            axios.post(url, {'board': getBoardRepresentation(board)})
            .then(res => {
                const fromX = 7 - parseInt(res.data['nextMove'][0]);
                const fromY = parseInt(res.data['nextMove'][2]);
                const piece = board[[fromX, fromY]][0];
                const toX = 7 - parseInt(res.data['nextMove'][4]);
                const toY = parseInt(res.data['nextMove'][6]);
                const startSquare = [fromX, fromY];
                const droppedSquare = [toX, toY]
                makeMove(board, startSquare, piece, droppedSquare, setSelectedSquare, setSideToPlay);
            });
        }
    }, [sideToPlay]);


    useEffect(() => {
        if(possibleMoves) {
            const clickableSquares = possibleMoves[selectedSquare[0]];
            if(clickableSquares) {
                var els = [];
                for(let i = 0; i < clickableSquares.length; ++i) {
                    const [row, col] = clickableSquares[i];
                    let el = document.getElementById(row + "-" + col);
                    addClickable(el, board, setSelectedSquare, setSideToPlay);
                    els.push(el);
                }
                return () => {
                    for(let i = 0; i < els.length; ++i) {
                        removeClickable(els[i]);
                    }
                }
            }        
        }
    }, [selectedSquare])

    
    return (
        <div className="boardContainer">
            <div className="board" id="boardid">
                <MemoizedModal isOpen={modalIsOpen} handleModalClick={handleModalClick}/>
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
            {/* <div className="boardButtonContainer">
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
            </div> */}
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