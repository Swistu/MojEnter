import React from 'react';
import {Switch, Route} from "react-router-dom";

import Login from './components/Login/Login';
import NotFound from './components/NotFound/NotFound';
import Dashboard from './components/Dashboard/Dashboard';

import './style.css';

const App = (props) => {

	return (
		<Switch>
			<Route exact path="/" component={Login} />
			<Route path="/dashboard" component={Dashboard} />

			<Route component={NotFound} />
		</Switch>
  )
}
export default App;

