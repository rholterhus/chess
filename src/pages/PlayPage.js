import querySearch from "stringquery";
import Board from "./board.js";

function PlayPage(props) {

    const query = querySearch(props.location.search);
    const noBot = 'noBot' in query;
    const playerSide = query['side'];

    return (
        <div className="mainContainer" id="container">
            <Board noBot={noBot} playerSide={playerSide}/>
        </div>
    );
}

export default PlayPage;