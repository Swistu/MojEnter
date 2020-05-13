import React, { useEffect, useState } from 'react';
import { Switch, Route } from "react-router-dom";
import { auth } from 'firebase';

import NotFound from './pages/NotFound/NotFound';

import Dashboard from './components/Dashboard/Dashboard';
import PreLoader from './components/PreLoader/PreLoader';
import AuthLayout from './components/AuthLayout/AuthLayout';

import './style.css';

const App = () => {
	const [showPreLoader, setShowPreLoader] = useState(true);

	useEffect(() => {
		auth().onIdTokenChanged(currentUser => {
			if (currentUser) {
				setShowPreLoader(false);
			} else {
				setShowPreLoader(false);
			}
		});
	}, [])

	return (
		<React.Fragment>
			<PreLoader show={showPreLoader} />
			<Switch>
				<Route exact path="/" component={AuthLayout} />
				<Route exact path="/rejestracja" component={AuthLayout} />
				<Route exact path="/przypomnienie-hasla" component={AuthLayout} />
				<Route path="/dashboard" component={Dashboard} />
				<Route component={NotFound} />
			</Switch>
		</React.Fragment>
	)
}
export default App;

