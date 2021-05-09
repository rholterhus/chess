import React from 'react';
import FitText from '@kennethormandy/react-fittext'
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


const MainPage = () => {
    return (
    <div className="backgroundImage">
        <div className="title">Riley Holterhus Chess Project</div>
        <div className="centerBubble">
            <div className="dialogContainer">
                <div className="dialog">
                    <FitText>
                        Choose a side to play
                    </FitText>
                </div>
            </div>
            <div className="selection">
                <Link to="/play?side=black">
                    <img className="kingBlack" src={kingblack}/>
                </Link>
                <Link to="/play?side=white">
                    <img className="kingWhite" src={kingwhite}/>
                </Link>
            </div>
        </div>
        <Link to="/about">
            <div className="footerContainer">
                <div className="footer">
                    About
                </div>
            </div>
        </Link>
    </div>
    );
  };

  export default MainPage;