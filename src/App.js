import React, { useEffect, useState } from 'react';
import { Switch, Route } from "react-router-dom";
import { auth, database } from 'firebase';
import { useDispatch } from 'react-redux';

import { authentication } from './store/actions';

import Login from './pages/Login/Login';
import NotFound from './pages/NotFound/NotFound';

import Dashboard from './components/Dashboard/Dashboard';
import PreLoader from './components/PreLoader/PreLoader';

import './style.css';

const App = () => {
	const dispatch = useDispatch();

	const [showPreLoader, setShowPreLoader] = useState(true);

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

						setTimeout(() => {
							setShowPreLoader(false);
						}, 200)
					}
				})
			} else setShowPreLoader(false);
		});
	}, [dispatch])

	return (
		<React.Fragment>
			<PreLoader show={showPreLoader} />
			<Switch>
				<Route exact path="/" component={Login} />
				<Route path="/dashboard" component={Dashboard} />
				<Route component={NotFound} />
			</Switch>
		</React.Fragment>
	)
}
export default App;

