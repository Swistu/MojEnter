import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Layout from '../Layout/Layout';
import Home from '../Home/Home';

import AddOrder from '../../pages/AddOrder/AddOrder';
import AssignOrder from '../../pages/AssignOrder/AssignOrder';
import ShowOrder from '../../pages/ShowOrder/ShowOrder';
import ShowOrders from '../../pages/ShowOrders/ShowOrders';
import UserConfig from '../../pages/UserConfig/UserConfig'
import Messages from '../../pages/Messages/Messages'
import NotFound from '../../pages/NotFound/NotFound';

const Dashboard = ({ history }) => {
	const { realtimeDatabaseUser, firebaseUser } = useSelector(state => state.authenticationReducer);
	const [routes, setRoutes] = useState();

	useEffect(() => {
		if (firebaseUser) {
			switch (realtimeDatabaseUser.accountType) {
				case "Annomyous":
					setRoutes(
						<React.Fragment>
							<Route exact path="/dashboard/przypisz-zlecenie" component={AssignOrder} />
						</React.Fragment>)
					break;
				case "User":
					setRoutes(
						<React.Fragment>
							<Route exact path="/dashboard/przypisz-zlecenie" component={AssignOrder} />
							<Route exact path="/dashboard/zlecenia" component={ShowOrders} />
							<Route exact path="/dashboard/zlecenie" component={ShowOrder} />
							<Route exact path="/dashboard/wiadomosci" component={Messages} />
						</React.Fragment>)
					break;
				case "Admin":
					setRoutes(
						<React.Fragment>
							<Route exact path="/dashboard/dodaj-zlecenie" component={AddOrder} />
							<Route exact path="/dashboard/zlecenia" component={ShowOrders} />
							<Route exact path="/dashboard/zlecenie" component={ShowOrder} />
							<Route exact path="/dashboard/wiadomosci" component={Messages} />
						</React.Fragment>)
					break;
				default:
			}
		} else {
			history.push("/");
		}
	}, [firebaseUser, history, realtimeDatabaseUser]);

	return (firebaseUser ?
		<Layout>
			<Switch>
				<Route exact path="/dashboard/" component={Home} />
				<Route exact path="/dashboard/konto" component={UserConfig} />
				{routes}
				<Route component={NotFound} />
			</Switch>
		</Layout>
		: null);
}

export default Dashboard;