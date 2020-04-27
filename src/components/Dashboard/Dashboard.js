import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { auth, database } from 'firebase';
import { useSelector, useDispatch } from 'react-redux';

import Layout from '../Layout/Layout';
import Home from '../Home/Home';

import AddOrder from '../Admin/AddOrder/AddOrder';
import { default as ShowAdminOrders } from '../Admin/ShowOrders/ShowOrders';
import { default as ShowAdminOrder } from '../Admin/ShowOrder/ShowOrder';
import AssignOrder from '../User/AssignOrder/AssignOrder';

import { default as ShowUserOrders } from '../User/ShowOrders/ShowOrders';
import { default as ShowUserOrder } from '../User/ShowOrder/ShowOrder';

import UserConfig from '../UserConfig/UserConfig'
import Messages from '../Messages/Messages'
import NotFound from '../NotFound/NotFound';

const Dashboard = (props) => {
	const { firebaseUser } = useSelector(state => state.authenticationReducer);
	const [routes, setRoutes] = useState();

	useEffect(() => {
		if (firebaseUser) {
			database().ref("/users/" + firebaseUser.uid).on("value", (snapshot) => {
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
									<Route exact path="/dashboard/show-orders" component={ShowUserOrders} />
									<Route exact path="/dashboard/show-order" component={ShowUserOrder} />
								</React.Fragment>)
							break;
						case "Admin":
							setRoutes(
								<React.Fragment>
									<Route exact path="/dashboard/add-order" component={AddOrder} />
									<Route exact path="/dashboard/show-orders" component={ShowAdminOrders} />
									<Route exact path="/dashboard/show-order" component={ShowAdminOrder} />
								</React.Fragment>)
							break;
						default:
					}
				}
			})
		} else {
			props.history.push("/");
		}
	}, [firebaseUser]);

	return (firebaseUser ?
		<Layout>
			<Switch>
				<Route exact path="/dashboard/" component={Home} />
				<Route exact path="/dashboard/messages" component={Messages} />
				<Route exact path="/dashboard/user" component={UserConfig} />
				{routes}
				<Route component={NotFound} />
			</Switch>
		</Layout>
		: null);
}

export default Dashboard;