import { useState }from 'react';
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


// It is hard to believe, but after thinking about it for a long time, this is the best way to handle state with a chess
// board. This avoids having to do an expensive deepcopy every time a piece moves (which isn't necessary because only two 
// squares will change on each move, so no need to deepcopy everything). Moreover, when we pass the curState and the setState
// of each element of this board to each individual chess tile, the chess tiles that did not change will not have to rerender because
// none of their props will have changed. So this is the most optimized way of manging state in react with a chess board.
// Also, note that useState should not be used within a loop (because of the way that react keeps track of which useState call 
// corresponds to previous useState calls). That is why this custom hook has this annoying definition.
function useBoard() {

    var board = {}

    board[[0,0]] = useState(rookblack);
    board[[0,1]] = useState(knightblack);
    board[[0,2]] = useState(bishopblack);
    board[[0,3]] = useState(queenblack);
    board[[0,4]] = useState(kingblack);
    board[[0,5]] = useState(bishopblack);
    board[[0,6]] = useState(knightblack);
    board[[0,7]] = useState(rookblack);

    board[[1,0]] = useState(pawnblack);
    board[[1,1]] = useState(pawnblack);
    board[[1,2]] = useState(pawnblack);
    board[[1,3]] = useState(pawnblack);
    board[[1,4]] = useState(pawnblack);
    board[[1,5]] = useState(pawnblack);
    board[[1,6]] = useState(pawnblack);
    board[[1,7]] = useState(pawnblack);

    board[[2,0]] = useState(null);
    board[[2,1]] = useState(null);
    board[[2,2]] = useState(null);
    board[[2,3]] = useState(null);
    board[[2,4]] = useState(null);
    board[[2,5]] = useState(null);
    board[[2,6]] = useState(null);
    board[[2,7]] = useState(null);

    board[[3,0]] = useState(null);
    board[[3,1]] = useState(null);
    board[[3,2]] = useState(null);
    board[[3,3]] = useState(null);
    board[[3,4]] = useState(null);
    board[[3,5]] = useState(null);
    board[[3,6]] = useState(null);
    board[[3,7]] = useState(null);

    board[[4,0]] = useState(null);
    board[[4,1]] = useState(null);
    board[[4,2]] = useState(null);
    board[[4,3]] = useState(null);
    board[[4,4]] = useState(null);
    board[[4,5]] = useState(null);
    board[[4,6]] = useState(null);
    board[[4,7]] = useState(null);

    board[[5,0]] = useState(null);
    board[[5,1]] = useState(null);
    board[[5,2]] = useState(null);
    board[[5,3]] = useState(null);
    board[[5,4]] = useState(null);
    board[[5,5]] = useState(null);
    board[[5,6]] = useState(null);
    board[[5,7]] = useState(null);

    board[[6,0]] = useState(pawnwhite);
    board[[6,1]] = useState(pawnwhite);
    board[[6,2]] = useState(pawnwhite);
    board[[6,3]] = useState(pawnwhite);
    board[[6,4]] = useState(pawnwhite);
    board[[6,5]] = useState(pawnwhite);
    board[[6,6]] = useState(pawnwhite);
    board[[6,7]] = useState(pawnwhite);

    board[[7,0]] = useState(rookwhite);
    board[[7,1]] = useState(knightwhite);
    board[[7,2]] = useState(bishopwhite);
    board[[7,3]] = useState(queenwhite);
    board[[7,4]] = useState(kingwhite);
    board[[7,5]] = useState(bishopwhite);
    board[[7,6]] = useState(knightwhite);
    board[[7,7]] = useState(rookwhite);

    return board;
  
}

export default useBoard;