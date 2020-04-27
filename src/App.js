import React, { useState, useEffect } from 'react';
import { Switch, Route } from "react-router-dom";
import { auth, database } from 'firebase';
import { useSelector, useDispatch } from 'react-redux';
import { authentication } from './store/actions';

import Login from './components/Login/Login';
import NotFound from './components/NotFound/NotFound';
import Dashboard from './components/Dashboard/Dashboard';

import './style.css';

const App = (props) => {
	const dispatch = useDispatch();

	useEffect(() => {
		auth().onAuthStateChanged(user => {
			if(user){
				database().ref("users/" + user.uid).on("value", (snapshot) => {
					if (snapshot && snapshot.val()) {
						const data = snapshot.val();
						dispatch(authentication(user, data));
					}
				})
			}
		});
	}, [])

	return (
		<Switch>
			<Route exact path="/" component={Login} />
			<Route path="/dashboard" component={Dashboard} />

			<Route component={NotFound} />
		</Switch>
	)
}
export default App;

