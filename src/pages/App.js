import React from 'react';
import './App.css';
import MainPage from './MainPage.js';
import AboutPage from './AboutPage.js';
import PlayPage from './playPage.js'
import TestPage from './TestPage.js'

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
       <Route exact path="/chess" component={MainPage} />
       <Route exact path="/chess/about" component={AboutPage} />
       <Route exact path="/chess/play" render={(props) => <PlayPage {...props}/>} />
       <Route exact path="/chess/test" render={(props) => <TestPage {...props}/>} />
      </Router>
    );
  }

  export default App;