import React, { useState, useEffect, memo, useRef, useCallback } from 'react';
import './playPage.css';

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
import useWebSocket from '../utils/websockets.js';


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

const whitePieces = {
    pawnp: pawnwhite,
    kingp: kingwhite,
    bishopp: bishopwhite,
    rookp: rookwhite,
    knightp: knightwhite,
    queenp: queenwhite,

    pawno: pawnblack,
    kingo: kingblack,
    bishopo: bishopblack,
    rooko: rookblack,
    knighto: knightblack,
    queeno: queenblack
}

const blackPieces = {
    pawnp: pawnblack,
    kingp: kingblack,
    bishopp: bishopblack,
    rookp: rookblack,
    knightp: knightblack,
    queenp: queenblack,

    pawno: pawnwhite,
    kingo: kingwhite,
    bishopo: bishopwhite,
    rooko: rookwhite,
    knighto: knightwhite,
    queeno: queenwhite
}


let root = document.documentElement;

const ChessTile = (props) => {

    var piece = null;
    const pieceOffset = props.selected ? {marginLeft: props.selected[1], marginTop: props.selected[2]} : null;
    if(props.piece) piece = <img 
                            id={"piece-" + props.row + "-" + props.col}
                            className={props.selected ? "selectedPiece" : props.isOnSideToPlay ? "selectablePiece" : "selectablePiece"}
                            draggable="false" 
                            src={props.playerSide == "white" ? whitePieces[props.piece] : blackPieces[props.piece]}
                            style={pieceOffset} 
                            onPointerDown={props.isOnSideToPlay && !props.cantMoveOpponent ? props.handleTileClick : null}
                            onPointerUp={props.isOnSideToPlay && !props.cantMoveOpponent ? props.handleTileUnClick : null}
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
                            <DragDropContainer targetKey="chessTarget" dragData={dragData} noDragging={!props.isOnSideToPlay || props.cantMoveOpponent}>
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

const isOccupied = (board, x, y) => withinBoard(x, y) && board[[x,y]][0] !== null;

const isOccupiedByBlack = (board, x, y) => withinBoard(x, y) && isOccupied(board, x, y) && !getSide(board[[x,y]][0]);

const isOccupiedByWhite = (board, x, y) => withinBoard(x, y) && isOccupied(board, x, y) && getSide(board[[x,y]][0]);

const squareIsAttacked = (board, side, x, y) => {
    // call isValidMove with the defaults set so it knows to not move anything and just use the x, y given
    return !isLegalMove(board, side, null, null, [x,y]);
}


const getAllPossibleMovesFromSquare = (board, selectedSquare, checkLegality=true) => {
    var x = parseInt(selectedSquare[0]);
    var y = parseInt(selectedSquare[2]);
    var selectedPiece = board[[x,y]][0];
    const side = getSide(selectedPiece);
    let ans = []
    
    if(selectedPiece == "pawnp") {
        if(!isOccupied(board, x-1, y) && withinBoard(x-1, y)) {
            ans.push([x-1,y]);
            if(x == "6" && !isOccupied(board, x-2, y)) ans.push([x-2,y]);
        }
        if(isOccupiedByBlack(board, x-1, y-1)) ans.push([x-1,y-1]);
        if(isOccupiedByBlack(board, x-1, y+1)) ans.push([x-1,y+1]);
    }

    if(selectedPiece == "pawno") {
        if(!isOccupied(board, x+1, y) && withinBoard(x+1, y)) {
            ans.push([x+1,y]);
            if(x == "1" && !isOccupied(board, x+2, y)) ans.push([x+2,y]);
        }
        if(isOccupiedByWhite(board, x+1, y-1)) ans.push([x+1,y-1]);
        if(isOccupiedByWhite(board, x+1, y+1)) ans.push([x+1,y+1]);
    }

    if(selectedPiece == "knightp" || selectedPiece == "knighto") {
        const checkOccupied = side ? (b, x, y) => withinBoard(x, y) && !isOccupiedByWhite(b, x, y)  : (b, x, y) => withinBoard(x, y) && !isOccupiedByBlack(b, x, y);
        const possibleMoves = [[1,2], [1,-2], [-1,2], [-1,-2], [2,1], [-2,1], [2,-1], [-2,-1]];
        for(let i = 0; i < possibleMoves.length; ++i) {
            const [diffx, diffy] = possibleMoves[i];
            if(checkOccupied(board, diffx + x, diffy + y)) ans.push([diffx+x,diffy+y]) 
        }
    }

    if(selectedPiece == "bishopp" || selectedPiece == "bishopo" || selectedPiece == "queenp" || selectedPiece == "queeno") {        
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

    if(selectedPiece == "rookp" || selectedPiece == "rooko" || selectedPiece == "queenp" || selectedPiece == "queeno") {        
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

    if(selectedPiece == "kingp" || selectedPiece == "kingo") {        
        const checkOccupied = side ? (b, x, y) => withinBoard(x, y) && !isOccupiedByWhite(b, x, y)  : (b, x, y) => withinBoard(x, y) && !isOccupiedByBlack(b, x, y);
        const possibleMoves = [[0,1], [0,-1], [1,0], [-1,0], [-1,-1], [1,-1], [-1,1], [1,1]];
        for(let i = 0; i < possibleMoves.length; ++i) {
            const [diffx, diffy] = possibleMoves[i];
            if(checkOccupied(board, diffx + x, diffy + y)) {
                ans.push([diffx+x,diffy+y]);
            }
        }
    }

    // find castle moves
    if(selectedPiece == "kingp") {
        if(board["pCastleQueen"][0] && !isOccupied(board, 7, 1) && !isOccupied(board, 7, 2) && !isOccupied(board, 7, 3)) {
                // additionally check that no piece is attacking the [7,2], [7,3], [7,4] (checking 7,4 is equivalent to the king being in check)
                let validCastle = true;
                for(let i = 2; i <= 4; ++i) {
                    if(squareIsAttacked(board, side, 7, i)) validCastle = false;
                }
                if(validCastle) ans.push([7,0,"specialMove"]);
        }

        if(board["pCastleKing"][0] && !isOccupied(board, 7, 5) && !isOccupied(board, 7, 6)) {
            // additionally check that no piece is attacking the [7,4], [7,5], [7,6] (checking 7,4 is equivalent to the king being in check)
            let validCastle = true;
            for(let i = 4; i <= 6; ++i) {
                if(squareIsAttacked(board, side, 7, i)) validCastle = false;
            }
            if(validCastle) ans.push([7,7,"specialMove"]);
        }
    }

    if(selectedPiece == "kingo") {
        if(board["oCastleQueen"][0] && !isOccupied(board, 0, 1) && !isOccupied(board, 0, 2) && !isOccupied(board, 0, 3)) {
                // additionally check that no piece is attacking the [0,2], [0,3], [0,4] (checking 0,4 is equivalent to the king being in check)
                let validCastle = true;
                for(let i = 2; i <= 4; ++i) {
                    if(squareIsAttacked(board, side, 0, i)) validCastle = false;
                }
                if(validCastle) ans.push([0,0,"specialMove"]);
        }

        if(board["oCastleKing"][0] && !isOccupied(board, 0, 5) && !isOccupied(board, 0, 6)) {
            // additionally check that no piece is attacking the [0,4], [0,5], [0,6] (checking 0,4 is equivalent to the king being in check)
            let validCastle = true;
            for(let i = 4; i <= 6; ++i) {
                if(squareIsAttacked(board, side, 0, i)) validCastle = false;
            }
            if(validCastle) ans.push([0,7,"specialMove"]);
        }   
    }

            




    if(checkLegality) {
        let legalAns = []
        for(let i = 0; i < ans.length; ++i) {
            if(ans[i].length === 3) {
                legalAns.push(ans[i]); // make moves that are already known to be legal have length 3
            }
            else if(isLegalMove(board, side, [selectedSquare[0], selectedSquare[2]], ans[i])) legalAns.push(ans[i]);
        }
        return legalAns;
    } else {
        return ans;
    }
}

const isLegalMove = (board, side, startSquare, endSquare, override=null) => {

    // make the move, then do a scan for possible rooks, bishops or knights that could attack the square
    let newBoard = {}
    for(let i = 0; i <= 7; ++i) {
        for(let j = 0; j <= 7; ++j) {
            newBoard[[i,j]] = board[[i,j]][0];
        }
    }

    if(override === null) {
        alterBoard(newBoard, startSquare, endSquare);

        var kingSquare = null;

        // find king square
        for(let i = 0; i <= 7; ++i) {
            for(let j = 0; j <= 7; ++j) {
                if((newBoard[[i,j]] == "kingp" || newBoard[[i,j]] == "kingo") && getSide(newBoard[[i,j]]) == side) {
                    kingSquare = [i,j];
                }
            }
        }

        var x = kingSquare[0];
        var y = kingSquare[1];

    } else {
        var x = override[0];
        var y = override[1];
    }


    const isOutOfBounds = (i, j) => i < 0 || i > 7 || j < 0 || j > 7; 
    const notOccupied = (i, j) => !isOutOfBounds(i,j) && newBoard[[i,j]] === null;

    // check for knight captures

    const isOppositeKnight = side ? 
    (i, j) => !isOutOfBounds(i, j) && newBoard[[i,j]] == "knighto" 
    : 
    (i, j) => !isOutOfBounds(i, j) && newBoard[[i,j]] == "knightp";
    const possibleKnightMoves = [[1,2], [1,-2], [-1,2], [-1,-2], [2,1], [-2,1], [2,-1], [-2,-1]]
    for(let i = 0; i < possibleKnightMoves.length; ++i) {
        const [diffx, diffy] = possibleKnightMoves[i];
        if(isOppositeKnight(diffx + x,diffy + y)) return false;
    }

    // check for rook captures

    const isOppositeRookorQueen = side ? 
    (i, j) => !isOutOfBounds(i, j) && (newBoard[[i,j]] == "rooko" || newBoard[[i,j]] == "queeno")
     : 
    (i, j) => !isOutOfBounds(i, j) && (newBoard[[i,j]] == "rookp" || newBoard[[i,j]] == "queenp");
    const possibleRookMoves = [[0,1], [0,-1], [1,0], [-1,0]];
    for(let i = 0; i < possibleRookMoves.length; ++i) {
        const [diffx, diffy] = possibleRookMoves[i];
        let m = 1;
        while(notOccupied(m * diffx + x, m * diffy + y)) m += 1;
        if(isOppositeRookorQueen(m * diffx + x, m * diffy + y)) return false;
    }


    // check for bishop captures

    const isOppositeBishoporQueen = side ? 
    (i, j) => !isOutOfBounds(i, j) && (newBoard[[i,j]] == "bishopo" || newBoard[[i,j]] == "queeno")
    :
    (i, j) => !isOutOfBounds(i, j) && (newBoard[[i,j]] == "bishopp" || newBoard[[i,j]] == "queenp");
    const possibleBishopMoves = [[-1,1], [-1,-1], [1,1], [1,-1]];
    for(let i = 0; i < possibleBishopMoves.length; ++i) {
        const [diffx, diffy] = possibleBishopMoves[i];
        let m = 1;
        while(notOccupied(m * diffx + x, m * diffy + y)) m += 1;
        if(isOppositeBishoporQueen(m * diffx + x, m * diffy + y)) return false;
    }

    // check for pawn captures

    const isOppositePawn = side ? 
    (i, j) => !isOutOfBounds(i, j) && newBoard[[i,j]] == "pawno"
    :
    (i, j) => !isOutOfBounds(i, j) && newBoard[[i,j]] == "pawnp"
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
    board[startSquare] = null;
    board[endSquare] = piece;
}

const getSide = (piece) => {
    return piece == "kingp" ||
        piece == "queenp" ||
        piece == "bishopp" ||
        piece == "knightp" ||
        piece == "rookp" ||
        piece == "pawnp";
}

const isPossibleMove = (selectedSquare, currentSquare, possibleMoves) => {
    if(possibleMoves && selectedSquare) return possibleMoves[selectedSquare].some(move => move[0] == currentSquare[0] && move[1] == currentSquare[1]);
    else return false;
}

const pieceIsInCheck = (piece, sideToPlay, isInCheck) => (piece == "kingp" || piece == "kingo") && isInCheck && getSide(piece) == sideToPlay;

const moveEquals = (arr, x, y) => arr[0] == x && arr[1] == y;

const makeMove = (board, startSquare, piece, droppedSquare, setSelectedSquare, setSideToPlay) => {
    
    if(piece == "kingp" && moveEquals(startSquare, 7, 4) && moveEquals(droppedSquare, 7, 0)) {
        board[[7,4]][1](null);
        board[[7,0]][1](null);
        board[[7,2]][1]("kingp");
        board[[7,3]][1]("rookp");
        moveSoundVar.play();
    } else if (piece == "kingp" && moveEquals(startSquare, 7, 4) && moveEquals(droppedSquare, 7, 7)) {
        board[[7,4]][1](null);
        board[[7,7]][1](null);
        board[[7,6]][1]("kingp");
        board[[7,5]][1]("rookp");
        moveSoundVar.play();
    }  else if (piece == "kingo" && moveEquals(startSquare, 0, 4) && moveEquals(droppedSquare, 0, 0)) {
        board[[0,4]][1](null);
        board[[0,0]][1](null);
        board[[0,2]][1]("kingo");
        board[[0,3]][1]("rooko");
        moveSoundVar.play();
    } else if (piece == "kingo" && moveEquals(startSquare, 0, 4) && moveEquals(droppedSquare, 0, 7)) {
        board[[0,4]][1](null);
        board[[0,7]][1](null);
        board[[0,6]][1]("kingo");
        board[[0,5]][1]("rooko");
        moveSoundVar.play();
    } else {
        board[startSquare][1](null);
        board[droppedSquare][1](piece);
        if(board[droppedSquare][0]) takeSoundVar.play();
        else moveSoundVar.play();
    }
    setSelectedSquare([null, 0, 0, false]);
    setSideToPlay(sideToPlay => !sideToPlay);

    if(piece == "kingp") {
        board["pCastleQueen"][1](false);
        board["pCastleKing"][1](false);
    } else if (piece == "kingo") {
        board["oCastleQueen"][1](false);
        board["oCastleKing"][1](false);
    } else if (piece == "rookp" && moveEquals(startSquare, 7, 0)) {
        board["pCastleQueen"][1](false);
    } else if (piece == "rookp" && moveEquals(startSquare, 7, 7)) {
        board["pCastleKing"][1](false);
    } else if (piece == "rooko" && moveEquals(startSquare, 0, 0)) {
        board["oCastleQueen"][1](false);
    } else if (piece == "rooko" && moveEquals(startSquare, 0, 7)) {
        board["oCastleKing"][1](false);
    }

}

const addClickable = (el, board, setSelectedSquare, setSideToPlay, setLastMove, websocket) => {
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
        if(websocket) setLastMove([startSquare, droppedSquare]);
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
      if(board[[i,j]][0] == "pawnp") s += 'P'
      else if(board[[i,j]][0] == "knightp") s += 'H'
      else if(board[[i,j]][0] == "bishopp") s += 'B'
      else if(board[[i,j]][0] == "rookp") s += 'R'
      else if(board[[i,j]][0] == "queenp") s += 'Q'
      else if(board[[i,j]][0] == "kingp") s += 'K'
  
      else if(board[[i,j]][0] == "pawno") s += 'O'
      else if(board[[i,j]][0] == "knighto") s += 'L'
      else if(board[[i,j]][0] == "bishopo") s += 'D'
      else if(board[[i,j]][0] == "rooko") s += 'C'
      else if(board[[i,j]][0] == "queeno") s += 'W'
      else if(board[[i,j]][0] == "kingo") s += 'I'
      else s += '_';
    }
    return s;
  }


const mapper = (pos) => {
    if(pos == 0) return 7;
    if(pos == 1) return 6;
    if(pos == 2) return 5;
    if(pos == 3) return 4;
    if(pos == 4) return 3;
    if(pos == 5) return 2;
    if(pos == 6) return 1;
    if(pos == 7) return 0;
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
        const playerPieces = props.playedSide == "white" ? whitePieces : blackPieces;
        if(num == 0) return !props.isOpen ? playerPieces["queeno"] : playerPieces["queenp"];
        if(num == 1) return !props.isOpen ? playerPieces["rooko"] : playerPieces["rookp"];
        if(num == 2) return !props.isOpen ? playerPieces["bishopo"] : playerPieces["bishopp"];
        if(num == 3) return !props.isOpen ? playerPieces["knighto"] : playerPieces["knightp"];
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
    const [sideToPlay, setSideToPlay] = useState(props.playerSide == "white"); // player's time to play iff true
    const [possibleMoves, setPossibleMoves] = useState(null);
    const [isInCheck, setIsInCheck] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(null);
    const [lastMove, setLastMove] = useState(null);
    const [boardHistory, setBoardHistory] = useState([]);
    const { websocket, setWebsocket } = useWebSocket();


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
            if(websocket) setLastMove([e.dragData.startSquare, droppedTile]);
        }
    }, [board])

    const handleModalClick = useCallback((num) => {
        // simply find the pawn of interest and change it to the selected piece
        for(let i = 0; i <= 7; ++i) {
            if(board[[0,i]][0] == "pawnp") {
                const piece = ["queenp", "rookp", "bishopp", "knightp"][num];
                board[[0,i]][1](piece);
            } else if(board[[7,i]][0] == "pawno") {
                const piece = ["queeno", "rooko", "bishopo", "knighto"][num];
                board[[7,i]][1](piece);
            }
        }
        setModalIsOpen(null);
    }, [board]);


    useEffect(() => {
        if(websocket) {
            websocket.onmessage = (message) => {
                const {type, data} = JSON.parse(message.data);
                if(type === 'move') {
                    const start = [mapper(data.move[0][0]), data.move[0][1]]
                    const end = [mapper(data.move[1][0]), data.move[1][1]]
                    makeMove(board, start, board[start][0], end, setSelectedSquare, setSideToPlay);
                    setLastMove(null);
                }
            }
        }

    }, [board]);

    useEffect(() => {
        for(let i = 0; i <= 7; ++i) {
            if(board[[0,i]][0] == "pawnp") {
                setModalIsOpen(true);
            } else if(board[[7,i]][0] == "pawno") {
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
                    if((board[[x,y]][0] == "kingp" || board[[x,y]][0] == "kingo") && getSide(board[[x,y]][0]) == sideToPlay) {
                        isInCheck = true;
                    }
                }
            }
        }
        setPossibleMoves(newPossibleMoves);
        setIsInCheck(isInCheck);
    }, [sideToPlay, modalIsOpen]);


    useEffect(() => {
        if(!sideToPlay && !props.noBot) {
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
        } else if(!sideToPlay && websocket && lastMove) { // if we are in two player mode and we made a move
            websocket.send(JSON.stringify({
                type: 'move',
                data: {
                    move: lastMove
                }
            }))
        }
    }, [sideToPlay, lastMove]);

    useEffect(() => {
        if(possibleMoves) {
            const clickableSquares = possibleMoves[selectedSquare[0]];
            if(clickableSquares) {
                var els = [];
                for(let i = 0; i < clickableSquares.length; ++i) {
                    const [row, col] = clickableSquares[i];
                    let el = document.getElementById(row + "-" + col);
                    addClickable(el, board, setSelectedSquare, setSideToPlay, setLastMove, websocket);
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
                <MemoizedModal isOpen={modalIsOpen} handleModalClick={handleModalClick} playedSide={props.playerSide}/>
                {eight.map(row => 
                    eight.map(col => 
                        <MemoizedChessTile
                        key={row + col}
                        row={row} 
                        col={col}
                        piece={board[[row,col]][0]}
                        playerSide={props.playerSide}
                        isInCheck={pieceIsInCheck(board[[row,col]][0], sideToPlay, isInCheck)}
                        isOnSideToPlay={getSide(board[[row,col]][0]) === sideToPlay}
                        cantMoveOpponent={websocket !== null && !sideToPlay} // false iff it is 2 player mode and it is the opponents time to move
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
        </div>
    );
}

export default Board;