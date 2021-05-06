import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

var getColor = (x,y) => (x % 2) ? ((y % 2) ? 'gray' : 'lightgray') : ((y % 2) ? 'lightgray' : 'gray')

var getIcon = function(type, color) {
  return type + color + '.png';
}

var eightByEight = []
for(var i = 0; i < 8; i++) {
  for(var j = 0; j < 8; j++) {
    eightByEight.push([i,j]);
  }
}

var reachableContains = function(arr, val) {
  for(var i = 0; i < arr.length; ++i) {
    if(arraysEqual(arr[i], val)) return true
  }
  return false
}


var isInPossibleMoves = function(move, allPossible) {
  for(var i = 0; i < allPossible.length; ++i) {
    if(arraysEqual(move[0], allPossible[i][0]) && arraysEqual(move[1], allPossible[i][1])) return true
  }
  return false
}


class ChessTile extends React.Component {

  render() {

    var color = getColor(this.props.x, this.props.y);
    var selected = arraysEqual([this.props.x, this.props.y], this.props.selected)
    var reachable = this.props.reachable

    return <div
            style={{
              float: "left",
              height: "12.5%",
              width: "12.5% ",
              backgroundColor: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: selected || reachable ? 0.75 : 1,
              boxShadow: "black",
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = 0.75}
              onMouseDown={(e) => this.props.makeMove(this.props.x, this.props.y)}
              onMouseOut={(e) => selected || reachable ? null : e.currentTarget.style.opacity = 1}
            >
              {this.props.piece[0] ? <img
                src={process.env.PUBLIC_URL + getIcon(this.props.piece[0], this.props.piece[1])} style={{
                width: "75%",
                height: "75%",
                cursor: "pointer"
                }}></img> : null}
            </div>;
  }
}


var initialPositionMap = {
  0: "rook",
  1: "knight",
  2: "bishop",
  3: "queen",
  4: "king",
  5: "bishop",
  6: "knight",
  7: "rook",
}

var arraysEqual = function(arr1, arr2) {
  if(arr1.length != arr2.length) return false;
  for(var i = 0; i < arr1.length; ++i) if(arr1[i] != arr2[i]) return false;
  return true;
}

var getBoardRepresentation = function(board) {
  var s = '';
  for(var num = 63; num >= 0; num--) {
    var i = Math.floor(num/8);
    var j = (7 - (num % 8)) % 8;
    if(arraysEqual(board[[i,j]],["pawn", "white"])) s += 'P'
    else if(arraysEqual(board[[i,j]],["knight", "white"])) s += 'H'
    else if(arraysEqual(board[[i,j]],["bishop", "white"])) s += 'B'
    else if(arraysEqual(board[[i,j]],["rook", "white"])) s += 'R'
    else if(arraysEqual(board[[i,j]],["queen", "white"])) s += 'Q'
    else if(arraysEqual(board[[i,j]],["king", "white"])) s += 'K'

    else if(arraysEqual(board[[i,j]],["pawn", "black"])) s += 'O'
    else if(arraysEqual(board[[i,j]],["knight", "black"])) s += 'L'
    else if(arraysEqual(board[[i,j]],["bishop", "black"])) s += 'D'
    else if(arraysEqual(board[[i,j]],["rook", "black"])) s += 'C'
    else if(arraysEqual(board[[i,j]],["queen", "black"])) s += 'W'
    else if(arraysEqual(board[[i,j]],["king", "black"])) s += 'I'
    else s += '_';
  }
  return s;
}



class App extends React.Component {

  constructor(props) {
    super(props);
    var board = {}
    for(var i = 0; i < 8; i++) {
      board[[0,i]] = [initialPositionMap[i], "black"];
      board[[1,i]] = ["pawn", "black"];
      board[[2,i]] = [null, null];
      board[[3,i]] = [null, null];
      board[[4,i]] = [null, null];
      board[[5,i]] = [null, null];
      board[[6,i]] = ["pawn", "white"];
      board[[7,i]] = [initialPositionMap[i], "white"];
    }
    this.state = {
      selected: [null, null],
      board: board,
      sideToPlay: "white",
      selectedPiece: null,
      blackCanCastleQueenSide: true,
      blackCanCastleKingSide: true,
      whiteCanCastleQueenSide: true,
      whiteCanCastleKingSide: true
    }
    var allPossibleMoves = this.getAllPossibleMoves(this.state, true)
    this.state.allPossibleMoves = allPossibleMoves


  }


  whiteCanCastleQueenSideCheck = (state) => {
    var emptySquare = (i,j) => !state.board[[i,j]][0]
    var condition = state.whiteCanCastleQueenSide
    condition = condition && emptySquare(7, 1)
    condition = condition && emptySquare(7, 2)
    condition = condition && emptySquare(7, 3)
    return condition
  }

  whiteCanCastleKingSideCheck = (state) => {
    var emptySquare = (i,j) => !state.board[[i,j]][0]
    var condition = state.whiteCanCastleKingSide
    condition = condition && emptySquare(7, 6)
    condition = condition && emptySquare(7, 5)
    return condition
  }

  blackCanCastleQueenSideCheck = (state) => {
    var emptySquare = (i,j) => !state.board[[i,j]][0]
    var condition = state.blackCanCastleQueenSide
    condition = condition && emptySquare(0, 1)
    condition = condition && emptySquare(0, 2)
    condition = condition && emptySquare(0, 3)
    return condition
  }

  blackCanCastleKingSideCheck = (state) => {
    var emptySquare = (i,j) => !state.board[[i,j]][0]
    var condition = state.blackCanCastleKingSide
    condition = condition && emptySquare(0, 6)
    condition = condition && emptySquare(0, 5)
    return condition
  }

  getReachablePieces = (state, checkLegality) => {
    var validLocation = (i,j) => (((0 <= i) && (i <= 7) && (0 <= j) && (j <= 7)) && state.board[[i,j]][1] != state.sideToPlay)
    var inBounds = (i,j) => ((0 <= i) && (i <= 7) && (0 <= j) && (j <= 7))

    var ans = []
    var x = state.selected[0]
    var y = state.selected[1]

    if(state.selectedPiece == "knight") {

      if(validLocation(x+2,y-1)) ans.push([x+2,y-1])
      if(validLocation(x+2,y+1)) ans.push([x+2,y+1])
      if(validLocation(x-2,y+1)) ans.push([x-2,y+1])
      if(validLocation(x-2,y-1)) ans.push([x-2,y-1])

      if(validLocation(x+1,y+2)) ans.push([x+1,y+2])
      if(validLocation(x+1,y-2)) ans.push([x+1,y-2])
      if(validLocation(x-1,y+2)) ans.push([x-1,y+2])
      if(validLocation(x-1,y-2)) ans.push([x-1,y-2])


    } if(state.selectedPiece == "bishop" || state.selectedPiece == "queen") {

      var k = 1
      while(validLocation(x+k, y+k)) {
        ans.push([x+k,y+k])
        if(state.board[[x+k,y+k]][1] && state.board[[x+k,y+k]][1] != state.sideToPlay) break
        k += 1
      }
      k = 1
      while(validLocation(x-k, y+k)) {
        ans.push([x-k,y+k])
        if(state.board[[x-k,y+k]][1] && state.board[[x-k,y+k]][1] != state.sideToPlay) break
        k += 1
      }
      k = 1
      while(validLocation(x+k, y-k)) {
        ans.push([x+k,y-k])
        if(state.board[[x+k,y-k]][1] && state.board[[x+k,y-k]][1] != state.sideToPlay) break
        k += 1
      }
      k = 1
      while(validLocation(x-k, y-k)) {
        ans.push([x-k,y-k])
        if(state.board[[x-k,y-k]][1] && state.board[[x-k,y-k]][1] != state.sideToPlay) break
        k += 1
      }

    } if(state.selectedPiece == "rook" || state.selectedPiece == "queen") {
      var k = 1
      while(validLocation(x+k, y)) {
        ans.push([x+k,y])
        if(state.board[[x+k,y]][1] && state.board[[x+k,y]][1] != state.sideToPlay) break
        k += 1
      }
      k = 1
      while(validLocation(x-k, y)) {
        ans.push([x-k,y])
        if(state.board[[x-k,y]][1] && state.board[[x-k,y]][1] != state.sideToPlay) break
        k += 1
      }
      k = 1
      while(validLocation(x, y-k)) {
        ans.push([x,y-k])
        if(state.board[[x,y-k]][1] && state.board[[x,y-k]][1] != state.sideToPlay) break
        k += 1
      }
      k = 1
      while(validLocation(x, y+k)) {
        ans.push([x,y+k])
        if(state.board[[x,y+k]][1] && state.board[[x,y+k]][1] != state.sideToPlay) break
        k += 1
      }

    } if(state.selectedPiece == "pawn") {
      if(state.sideToPlay == "white") {
        if(validLocation(x-1,y) && !(state.board[[x-1,y]][1] && state.board[[x-1,y]][1] != state.sideToPlay)) ans.push([x-1,y])
        if(inBounds(x-2, y) && state.selected[0] == 6 && !(state.board[[x-2,y]][1] && state.board[[x-2,y]][1] != state.sideToPlay)) if(validLocation(x-2,y)) ans.push([x-2,y])
        if(inBounds(x-1, y+1) && state.board[[x-1,y+1]][1] && state.board[[x-1,y+1]][1] != state.sideToPlay) ans.push([x-1,y+1])
        if(inBounds(x-1, y-1) && state.board[[x-1,y-1]][1] && state.board[[x-1,y-1]][1] != state.sideToPlay) ans.push([x-1,y-1])
      } else {
        if(validLocation(x+1,y) && !(state.board[[x+1,y]][1] && state.board[[x+1,y]][1] != state.sideToPlay)) ans.push([x+1,y])
        if(inBounds(x+2, y) &&  x == 1 && !(state.board[[x+2,y]][1] && state.board[[x+2,y]][1] != state.sideToPlay)) if(validLocation(x+2,y)) ans.push([x+2,y])
        if(inBounds(x+1, y+1) && state.board[[x+1,y+1]][1] && state.board[[x+1,y+1]][1] != state.sideToPlay) ans.push([x+1,y+1])
        if(inBounds(x+1, y-1) && state.board[[x+1,y-1]][1] && state.board[[x+1,y-1]][1] != state.sideToPlay) ans.push([x+1,y-1])
      }
    } if(state.selectedPiece == "king") {
      if(validLocation(x+1,y)) ans.push([x+1,y])
      if(validLocation(x-1,y)) ans.push([x-1,y])
      if(validLocation(x,y+1)) ans.push([x,y+1])
      if(validLocation(x,y-1)) ans.push([x,y-1])

      if(validLocation(x+1,y+1)) ans.push([x+1,y+1])
      if(validLocation(x-1,y+1)) ans.push([x-1,y+1])
      if(validLocation(x+1,y-1)) ans.push([x+1,y-1])
      if(validLocation(x-1,y-1)) ans.push([x-1,y-1])

      // Check for castles

      if(state.sideToPlay == "white") {
        if(this.whiteCanCastleQueenSideCheck(state)) ans.push([7,0])
        if(this.whiteCanCastleKingSideCheck(state)) ans.push([7,7])
      } else {
        if(this.blackCanCastleQueenSideCheck(state)) ans.push([0,0])
        if(this.blackCanCastleKingSideCheck(state)) ans.push([0,7])
      }




    }

    if(checkLegality) { // We don't have to check legality for moves that lead to checkmate, that is why we don't have to recurse
      var legalAnswer = []
      for(var i = 0; i < ans.length; ++i) { // filter out moves that are illegal
        if(isInPossibleMoves([state.selected, ans[i]], state.allPossibleMoves)) legalAnswer.push(ans[i])
      }
      return legalAnswer
    }

    return ans

  }

  alterBoard = (board, initialLoc, endingLoc) => {
    var newBoard = board
    var currentPiece = newBoard[initialLoc][0]
    var currentSide = newBoard[initialLoc][1]
    var castle = board[initialLoc][0] == "king" && board[endingLoc][0] == "rook" && board[endingLoc][1] == board[initialLoc][1]
    if(castle && arraysEqual(endingLoc,[7,0])) {
      newBoard[[7,4]] = [null, null]
      newBoard[[7,0]] = [null, null]
      newBoard[[7,3]] = ["rook", "white"]
      newBoard[[7,2]] = ["king", "white"]
    } else if(castle && arraysEqual(endingLoc,[7,7])) {
      newBoard[[7,4]] = [null, null]
      newBoard[[7,7]] = [null, null]
      newBoard[[7,5]] = ["rook", "white"]
      newBoard[[7,6]] = ["king", "white"]
    } else {
      newBoard[initialLoc] = [null, null]
      newBoard[endingLoc] = [currentPiece, currentSide]
    }
    return newBoard
  }

  isLegalMove = (state, initialLoc, endingLoc) => {
    var newState = JSON.parse(JSON.stringify(state));
    newState.board = this.alterBoard(newState.board, initialLoc, endingLoc)
    newState.sideToPlay = newState.sideToPlay == "white" ? "black" : "white"
    var possibleResponseMoves = this.getAllPossibleMoves(newState, false)
    for(var i = 0; i < possibleResponseMoves.length; ++i) {
      var newPositionSquare = newState.board[possibleResponseMoves[i][1]]
      if(newPositionSquare[0] == "king" && newPositionSquare[1] == state.sideToPlay) return false
    }
    return true
  }


  getAllPossibleMoves = (state, checkLegality) => {
    var answer = []
    for(var i = 0; i <= 7; ++i) {
      for(var j = 0; j <= 7; ++j) {
        if(state.board[[i,j]][1] == state.sideToPlay) {
          var newState = JSON.parse(JSON.stringify(state))
          newState.selected = [i,j]
          newState.selectedPiece = state.board[[i,j]][0]
          var res = this.getReachablePieces(newState, false)
          for(var k = 0; k < res.length; ++k) {
            if(checkLegality) {
              if(this.isLegalMove(state, [i,j], res[k])) answer.push([[i,j], res[k]])
            } else {
              answer.push([[i,j], res[k]])
            }
          }
        }
      }
    }
    return answer
  }



  makeMove = (x,y) => {
    var whiteQueenSideCastleMove = this.state.selectedPiece == "king" && arraysEqual([x,y], [7,0]) && this.whiteCanCastleQueenSideCheck(this.state)
    var whiteKingSideCastleMove = this.state.selectedPiece == "king" && arraysEqual([x,y], [7,7]) && this.whiteCanCastleKingSideCheck(this.state)
    var castlingMove = whiteQueenSideCastleMove || whiteKingSideCastleMove
    if(!castlingMove && this.state.board[[x,y]][1] === this.state.sideToPlay) {
      if(arraysEqual(this.state.selected, [x,y])) this.setState({selected: [null,null], selectedPiece: null}); // unclick selected
      else this.setState({selected: [x,y], selectedPiece: this.state.board[[x,y]][0]});
    }
    else if (this.state.selected[0] != null) { // we are making a move
      // check if valid move
      var currentX = this.state.selected[0];
      var currentY = this.state.selected[1];
      if(reachableContains(this.getReachablePieces(this.state, true), [x, y])) {
        var newBoard = this.alterBoard(this.state.board, this.state.selected, [x,y]);

        // figure out new rules for castling
        var whiteQueenCastle = this.state.whiteCanCastleQueenSide
        var whiteKingCastle = this.state.whiteCanCastleKingSide
        var blackQueenCastle = this.state.blackCanCastleQueenSide
        var blackKingCastle = this.state.whiteCanCastleKingSide

        if(this.state.sideToPlay == "white" && this.state.selectedPiece == "king") {
          whiteQueenCastle = false
          whiteKingCastle = false
        }

        if(this.state.sideToPlay == "black" && this.state.selectedPiece == "king") {
          blackQueenCastle = false
          blackKingCastle = false
        }

        if(this.state.selectedPiece == "rook" && arraysEqual([currentX,currentY],[7,0])) {
          whiteQueenCastle = false
        }

        if(this.state.selectedPiece == "rook" && arraysEqual([currentX,currentY],[7,7])) {
          whiteKingCastle = false
        }

        if(this.state.selectedPiece == "rook" && arraysEqual([currentX,currentY],[0,0])) {
          blackQueenCastle = false
        }

        if(this.state.selectedPiece == "rook" && arraysEqual([currentX,currentY],[0,7])) {
          blackKingCastle = false
        }

        if(this.state.sideToPlay == "white") {
          this.setState({
            board: newBoard,
            sideToPlay: this.state.sideToPlay == "white" ? "black" : "white",
            selected: [null, null],
            selectedPiece: null,
            whiteCanCastleQueenSide: whiteQueenCastle,
            whiteCanCastleKingSide: whiteKingCastle,
            blackCanCastleQueenSide: blackQueenCastle,
            blackCanCastleKingSide: blackKingCastle,
          }, () => {
            this.setState({
              allPossibleMoves: this.getAllPossibleMoves(this.state, true) 
            }, () => axios.post(`https://polar-badlands-38570.herokuapp.com/getMove`, { 'board': getBoardRepresentation(this.state.board)})
            //}, () => axios.post(`http://localhost:8000/getMove`, { 'board': getBoardRepresentation(this.state.board)})
            .then(res => {
              var fromX = parseInt(res.data['nextMove'][0]);
              var fromY = parseInt(res.data['nextMove'][2]);
              var piece = this.state.board[[7-fromX, fromY]][0];
              var toX = parseInt(res.data['nextMove'][4]);
              var toY = parseInt(res.data['nextMove'][6]);
              this.setState({selected: [7-fromX,fromY], selectedPiece: piece}, () => {
                this.makeMove(7-toX,toY);
              })}))})
        } else {
          this.setState({
            board: newBoard,
            sideToPlay: this.state.sideToPlay == "white" ? "black" : "white",
            selected: [null, null],
            selectedPiece: null,
            whiteCanCastleQueenSide: whiteQueenCastle,
            whiteCanCastleKingSide: whiteKingCastle,
            blackCanCastleQueenSide: blackQueenCastle,
            blackCanCastleKingSide: blackKingCastle,
          }, () => {
            this.setState({
            allPossibleMoves: this.getAllPossibleMoves(this.state, true)
          }, () => {if(arraysEqual([], this.state.allPossibleMoves)) alert("CHECKMATE")})});
        }
      }
    }
    else this.setState({selected: [null, null], selectedPiece: null}); // else just reset
  }

  render() {

    var reachablePieces = this.getReachablePieces(this.state, true)
    
    return (
      <div className="App">
        <div className="Container">
          {eightByEight.map(pair => <ChessTile
                                      x={pair[0]}
                                      y={pair[1]}
                                      piece={this.state.board[pair]}
                                      sideToPlay={this.state.sideToPlay}
                                      makeMove={this.makeMove}
                                      selected={this.state.selected}
                                      selectedPiece={this.state.selectedPiece}
                                      reachable={reachableContains(reachablePieces, [pair[0], pair[1]])}
                                      />)}
        </div>
      </div>
    );
  }

}

export default App;
