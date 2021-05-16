import React from 'react';
import './App.css';
import MainPage from './MainPage.js';
import PlayPage from './PlayPage.js';
import AboutPage from './AboutPage.js';
import TestPage from './testingPage.js'

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
  useLocation
} from "react-router-dom";

function App() {
   
    return (
      <Router>
       <Route exact path="/chessFrontend" component={MainPage} />
       <Route exact path="/chessFrontend/play" component={PlayPage} />
       <Route exact path="/chessFrontend/about" component={AboutPage} />
       <Route exact path="/chessFrontend/test" component={TestPage} />
      </Router>
    );
  }

  export default App;