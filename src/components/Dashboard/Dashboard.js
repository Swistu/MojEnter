import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import firebase, { auth } from 'firebase';

import { checkAccounType } from '../../utility/checkAccountType'

import Layout from '../Layout/Layout';

import Home from '../../pages/Home/Home';
import AddOrder from '../../pages/AddOrder/AddOrder';
import AddWorer from '../../pages/AddWorker/AddWorker';
import AssignOrder from '../../pages/AssignOrder/AssignOrder';
import ShowOrder from '../../pages/ShowOrder/ShowOrder';
import ShowOrders from '../../pages/ShowOrders/ShowOrders';
import UserConfig from '../../pages/UserConfig/UserConfig'
import Messages from '../../pages/Messages/Messages'
import NotFound from '../../pages/NotFound/NotFound';
import Notifications from '../../pages/Notifications/Notifications';
import Settings from '../../pages/Settings/Settings';

const Dashboard = ({ history }) => {
	const [routes, setRoutes] = useState();

	useEffect(() => {
		firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
	}, [])

	useEffect(() => {
		if (auth().currentUser) {
			if (auth().currentUser.emailVerified)
				checkAccounType().then(accountType => {
					if (accountType === "user")
						setRoutes(
							<React.Fragment>
								<Route exact path="/dashboard/przypisz-zlecenie" component={AssignOrder} />
							</React.Fragment>)
					else if (accountType === "worker")
						setRoutes(
							<React.Fragment>
								<Route exact path="/dashboard/dodaj-zlecenie" component={AddOrder} />
							</React.Fragment>)
					else if (accountType === "admin")
						setRoutes(
							<React.Fragment>
								<Route exact path="/dashboard/dodaj-zlecenie" component={AddOrder} />
								<Route exact path="/dashboard/dodaj-pracownika" component={AddWorer} />
							</React.Fragment>)
				})
			else
				history.push("/");
		} else
			history.push("/");
	}, [history]);

	return (
		auth().currentUser ?
			<Layout>
				<Switch>
					<Route exact path="/dashboard/" component={Home} />
					<Route exact path="/dashboard/konto" component={UserConfig} />
					<Route exact path="/dashboard/zlecenia" component={ShowOrders} />
					<Route exact path="/dashboard/zlecenie" component={ShowOrder} />
					<Route exact path="/dashboard/wiadomosci" component={Messages} />
					<Route exact path="/dashboard/ustawienia" component={Settings} />
					<Route exact path="/dashboard/powiadomienia" component={Notifications} />
					{routes}
					<Route component={NotFound} />
				</Switch>
			</Layout>
			: null
	);
}

export default Dashboard;