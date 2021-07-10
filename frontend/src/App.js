import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header/Header';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Courses from './components/Courses/Courses';
import { BrowserRouter as Router, Route } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="container-fluid">
        <Router>
          <Header />
          <Route path="/" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <Route path="/courses" exact component={Courses} />
        </Router>
      </div>
    );
  }
}

export default App;
