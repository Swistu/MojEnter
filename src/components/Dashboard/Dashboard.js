import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { auth } from 'firebase';

import Layout from '../Layout/Layout';
import Home from '../Home/Home';
import AddOrder from '../AddOrder/AddOrder';

const Dashboard = (props) => {

	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const routes = (
		<Layout>
			<Switch>
				<Route exact path="/dashboard/" component={Home} />
				<Route exact path="/dashboard/add-order" component={AddOrder} />
			</Switch>
		</Layout>
	);

	useEffect(() => {
		auth().onAuthStateChanged( user => {
			if (user) {
				setIsAuthenticated(true);
			}else{
				props.history.push("/");
			}
		});
	}, []);



	return (isAuthenticated?routes:null);
}

export default Dashboard;