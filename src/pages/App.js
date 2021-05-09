import React from 'react';
import './App.css';
import MainPage from './MainPage.js';
import PlayPage from './PlayPage.js';
import AboutPage from './AboutPage.js';
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
       <Route exact path="/" component={MainPage} />
       <Route exact path="/play" component={PlayPage} />
       <Route exact path="/about" component={AboutPage} />
      </Router>
    );
  }

  export default App;