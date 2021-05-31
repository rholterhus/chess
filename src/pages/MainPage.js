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
import {ReactComponent as WhiteKing} from '../images/whiteking.svg';
import {ReactComponent as BlackKing} from '../images/blackking.svg';





const MainPage = () => {
    return (
    <div className="background">
        <div className="row">
            <Link to="/chessFrontend/test">
            <div className="whiteKingContainer">
                <WhiteKing/>
            </div>
            </Link>
            <Link to="/chessFrontend/test">
            <div className="blackKingContainer">
                <BlackKing/>
            </div>
            </Link>
        </div>
    </div>
    );
  };

  export default MainPage;