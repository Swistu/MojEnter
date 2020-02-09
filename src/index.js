import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from "react-router-dom";
import { initializeApp } from 'firebase';


const firebaseConfig = {
  apiKey: "AIzaSyB9sNvGZPdX4SnicxesT7hewYt8NN9xKqg",
  authDomain: "enter-serwis.firebaseapp.com",
  databaseURL: "https://enter-serwis.firebaseio.com",
  projectId: "enter-serwis",
  storageBucket: "enter-serwis.appspot.com",
  messagingSenderId: "1061019741083",
  appId: "1:1061019741083:web:3878e25d75b14fac10cf3e"
};

initializeApp(firebaseConfig);


ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
