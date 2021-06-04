import React, { useState, useEffect, memo, useRef, useCallback } from 'react';import FitText from '@kennethormandy/react-fittext'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link,
    Redirect
  } from "react-router-dom";
import './MainPage.css'
import kingblack from '../images/kingblack.png';
import kingwhite from '../images/kingwhite.png';

const Modal = (props) => {

    const style = {
        backgroundColor: props.isOpen !== null ? "rgb(0,0,0,0.3)" : "rgb(0,0,0,0)"
    }

    return (
        props.isOpen ? 
        <div className="mainPageModalBackground" onClick={(e) => e.target.className == "mainPageModalBackground" ? props.onOutsideClick() : null} style={style}>
           <div className="mainPageModal">
               {props.children}
           </div>
        </div>
        :
        null
    )

}


const createWebsocket = (setws) => {
    const socket = new WebSocket('ws://localhost:5000');
    // Connection opened
    socket.addEventListener('open', function (event) {
        socket.send('Hello Server!');
    });
    setws(socket);
}

const MainPage = () => {

    const [modalOpen, setModalOpen] = useState(0);
    const [ws, setws] = useState(null);
    
    

    return (
    <div className="background">
        <Modal onOutsideClick={() => setModalOpen(0)} isOpen={modalOpen === 1}>
            <div className="sideSelect">
                <div className="modalButtonContainer">
                    <img className="mainModalButton"src={kingwhite}/>
                </div>
                <div className="modalButtonContainer">
                    <div className="mainModalButton">Random</div>
                </div>
                <div className="modalButtonContainer">
                    <img className="mainModalButton" src={kingblack}/>
                </div>
            </div>
            <div className="gameSelect">
                <button onClick={() => createWebsocket(setws)}>Create Game</button>
                <Link to="play?side=white"><button>Play Against Bot</button></Link>
            </div>
        </Modal>
        <Modal onOutsideClick={() => setModalOpen(0)} isOpen={modalOpen === 2}>
            Join
        </Modal>
        <button onClick={() => setModalOpen(1)}>Play Game</button>
        <button onClick={() => setModalOpen(2)}>Join game</button>
    </div>
    );
  };

  export default MainPage;