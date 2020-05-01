import React, { useEffect } from 'react';
import { Switch, Route } from "react-router-dom";
import { auth, database } from 'firebase';
import { useDispatch } from 'react-redux';

import { authentication } from './store/actions';

import Login from './pages/Login/Login';
import NotFound from './pages/NotFound/NotFound';

import Dashboard from './components/Dashboard/Dashboard';

import './style.css';

const App = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		auth().onAuthStateChanged(firebaseUser => {
			if (firebaseUser) {
				database().ref("users/" + firebaseUser.uid).on("value", (snapshot) => {
					if (snapshot && snapshot.val()) {
						const realtimeDatabaseUser = snapshot.val();
						const firebaseData = {
							"user": firebaseUser.displayName,
							"emailVerified": firebaseUser.emailVerified,
							"creationTime": firebaseUser.metadata.creationTime,
							"lastSignInTime": firebaseUser.metadata.lastSignInTime,
							"displayName": firebaseUser.providerData[0].displayName,
							"email": firebaseUser.providerData[0].email,
							"phoneNumber": firebaseUser.providerData[0].phoneNumber,
							"photoURL": firebaseUser.providerData[0].photoURL,
							"providerId": firebaseUser.providerData[0].providerId,
							"uid": firebaseUser.uid,
						}

						dispatch(authentication(firebaseData, realtimeDatabaseUser));
					}
				})
			}
		});
	}, [dispatch])

	return (
		<Switch>
			<Route exact path="/" component={Login} />
			<Route path="/dashboard" component={Dashboard} />

			<Route component={NotFound} />
		</Switch>
	)
}
export default App;

