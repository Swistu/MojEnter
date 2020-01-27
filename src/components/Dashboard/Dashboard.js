import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';

import Layout from '../Layout/Layout';
import Home from '../Home/Home';

const Dashboard = (props) => {


	return (
			<Layout>
				<Route exact path="/dashboard/" component={Home} />

			</Layout>
	);
}

export default Dashboard;