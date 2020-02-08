import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { auth } from 'firebase';

import Layout from '../Layout/Layout';
import Home from '../Home/Home';
import AddOrder from '../Admin/AddOrder/AddOrder';
import AssignOrder from '../User/AssignOrder/AssignOrder';
import ShowOrders from '../Admin/ShowOrders/ShowOrders';
import NotFound from '../NotFound/NotFound';
import ShowOrder from '../Admin/ShowOrder.js/ShowOrder';

const Dashboard = (props) => {

	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		auth().onAuthStateChanged( user => {
			if (user) {
				setIsAuthenticated(true);
			}else{
				props.history.push("/");
			}
		});
	}, []);

	const routes = (
		<Layout>
			<Switch>
				<Route exact path="/dashboard/" component={Home} />
				<Route exact path="/dashboard/add-order" component={AddOrder} />
				<Route exact path="/dashboard/assign-order" component={AssignOrder} />
				<Route exact path="/dashboard/show-orders" component={ShowOrders} />
				<Route exact path="/dashboard/show-order" component={ShowOrder} />

				<Route component={NotFound} />
			</Switch>
		</Layout>
	);
	
	return (isAuthenticated?routes:null);
}

export default Dashboard;