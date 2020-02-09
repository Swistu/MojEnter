import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { auth, database } from 'firebase';

import Layout from '../Layout/Layout';
import Home from '../Home/Home';
import AddOrder from '../Admin/AddOrder/AddOrder';
import AssignOrder from '../User/AssignOrder/AssignOrder';
import ShowOrders from '../Admin/ShowOrders/ShowOrders';
import NotFound from '../NotFound/NotFound';
import ShowOrder from '../Admin/ShowOrder/ShowOrder';

const Dashboard = (props) => {

	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [routes, setRoutes] = useState();

	useEffect(() => {
		auth().onAuthStateChanged(user => {
			if (user) {
				database().ref("/users/" + user.uid).once("value", (snapshot) => {
					if (snapshot && snapshot.val()) {
						const data = snapshot.val();

						switch (data.accountType) {
							case "Annomyous":
								setRoutes(
									<React.Fragment>
										<Route exact path="/dashboard/assign-order" component={AssignOrder} />
									</React.Fragment>)
								break;
							case "User":
								setRoutes(
									<React.Fragment>
										<Route exact path="/dashboard/assign-order" component={AssignOrder} />
										<Route exact path="/dashboard/show-orders" component={ShowOrders} />
										<Route exact path="/dashboard/show-order" component={ShowOrder} />
									</React.Fragment>)
								break;
							case "Admin":
								setRoutes(
									<React.Fragment>
										<Route exact path="/dashboard/add-order" component={AddOrder} />
										<Route exact path="/dashboard/show-orders" component={ShowOrders} />
										<Route exact path="/dashboard/show-order" component={ShowOrder} />
									</React.Fragment>)
								break;
							default:
						}
					}
				})
				setIsAuthenticated(true);
			} else {
				props.history.push("/");
			}
		});
	}, []);

	return (isAuthenticated ?
		<Layout>
			<Switch>
				<Route exact path="/dashboard/" component={Home} />
				{routes}
				<Route component={NotFound} />
			</Switch>
		</Layout>
		: null);
}

export default Dashboard;