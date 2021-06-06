import React, { useState, useEffect, memo, useRef, useCallback } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link,
    Redirect,
    useHistory
  } from "react-router-dom";
import './MainPage.css'
import kingblack from '../images/kingblack.png';
import kingwhite from '../images/kingwhite.png';
import useWebSocket from '../utils/websockets.js';

const CreateModal = (props) => {

    const history = useHistory();
    const { websocket, saveWebsocket } = useWebSocket();
    const [room, setRoom] = useState(null);
    const [sideChosen, setSideChosen] = useState(1); // 1 is random, 0 white, 2 black
    const [side, setSide] = useState(null);

    
    var botSide;
    if(sideChosen === 0) botSide = "white";
    if(sideChosen === 2) botSide = "black";
    else botSide = Math.random() < 0.5 ? "white" : "black";

    const style = {
        backgroundColor: props.isOpen !== null ? "rgb(0,0,0,0.3)" : "rgb(0,0,0,0)"
    }

    if(room === 'ready') history.push(`/chess/play?side=${side}&noBot`);

    return (
        props.isOpen ? 
        <div className="mainPageModalBackground" onClick={(e) => e.target.className == "mainPageModalBackground" ? props.onOutsideClick() : null} style={style}>
           <div className="mainPageModal">
            <div className="sideSelect">
                    <div className="modalButtonContainer" style={{ backgroundColor: sideChosen === 0 ? "gray" : null}} onPointerDown={() => setSideChosen(0)}>
                        <img className="mainModalButton"src={kingwhite}/>
                    </div>
                    <div className="modalButtonContainer" style={{ backgroundColor: sideChosen === 1 ? "gray" : null}} onPointerDown={() => setSideChosen(1)}>
                        <div className="mainModalButton">Random</div>
                    </div>
                    <div className="modalButtonContainer" style={{ backgroundColor: sideChosen === 2 ? "gray" : null}} onPointerDown={() => setSideChosen(2)}>
                        <img className="mainModalButton" src={kingblack}/>
                    </div>
                </div>
                <div className="gameSelect">
                    {
                        room ? 
                            room
                        :
                            <>
                                <button onClick={() => createWebsocket(saveWebsocket, setRoom, 'create', null, sideChosen, setSide)}>Create Game</button>
                                <Link to={`chess/play?side=${botSide}`}><button>Play Against Bot</button></Link>
                            </>
                    }
                    
                </div>
           </div>
        </div>
        :
        null
    )
}


const JoinModal = (props) => {

    const history = useHistory();
    const { websocket, saveWebsocket } = useWebSocket();
    const [room, setRoom] = useState(null);
    const [side, setSide] = useState(null);

    const style = {
        backgroundColor: props.isOpen !== null ? "rgb(0,0,0,0.3)" : "rgb(0,0,0,0)"
    }

    if(room === 'ready') history.push(`/chess/play?side=${side}&noBot`);

    return (
        props.isOpen ? 
        <div className="mainPageModalBackground" onClick={(e) => e.target.className == "mainPageModalBackground" ? props.onOutsideClick() : null} style={style}>
           <div className="mainPageModal">
                <input type="text" onChange={(e) => setRoom(e.target.value)}></input>
                <button onClick={() => createWebsocket(saveWebsocket, setRoom, 'join', room, null, setSide)}>Join room</button>
           </div>
        </div>
        :
        null
    )
}




const createWebsocket = (setws, setRoom, action, room, sideChosen, setSide) => {
    const isDev = process.env.NODE_ENV == "development";
    console.log(isDev);
    const url = isDev ? "ws://localhost:5000" : "wss://polar-badlands-38570.herokuapp.com";
    const socket = new WebSocket(url);

    socket.addEventListener('open', function (event) {
        if(action === 'create') {
            var side;
            if(sideChosen === 0) side = "white";
            if(sideChosen === 2) side = "black";
            else side = Math.random() < 0.5 ? "white" : "black";
            socket.send(JSON.stringify({
                type: 'create',
                data: {
                    side: side
                }
            }));
        }
        
        if(action === 'join') {
            socket.send(JSON.stringify({
                type: 'join',
                data: {
                    roomNum: room
                }
            }));
        }

    });

    socket.addEventListener('message', message => {
        const {type, data} = JSON.parse(message.data);

        if(type === 'created') {
            setRoom(data.roomNum);
        }

        if(type === 'ready') {
            setSide(data.side);
            setRoom('ready');
        }

        if(type === 'noRoom') {
            console.log('no such room!');
        }

    });
    
    setws(socket);
}

const MainPage = () => {

    const [modalOpen, setModalOpen] = useState(0);
    
    return (
    <div className="background">
        <CreateModal onOutsideClick={() => setModalOpen(0)} isOpen={modalOpen === 1}/>
        <JoinModal onOutsideClick={() => setModalOpen(0)} isOpen={modalOpen === 2}/>
        <button onClick={() => setModalOpen(1)}>Play Game</button>
        <button onClick={() => setModalOpen(2)}>Join game</button>
    </div>
    );
  };

  export default MainPage;