import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from "react-router-dom";
import { initializeApp } from 'firebase';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import allReducer from './store/reducers';
import { Provider } from 'react-redux';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  allReducer,
  composeEnhancers(applyMiddleware(thunk)),
);
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

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  , document.getElementById('root')
);

serviceWorker.unregister();
