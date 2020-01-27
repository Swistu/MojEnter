import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from '../Layout/Layout';
import Home from '../Home/Home';
import AddOrder from '../AddOrder/AddOrder';

const Dashboard = (props) => {


	return (
		<Layout>
			<Switch>
				<Route exact path="/dashboard/" component={Home} />
				<Route exact path="/dashboard/add-order" component={AddOrder} />
			</Switch>
		</Layout>
	);
}

export default Dashboard;