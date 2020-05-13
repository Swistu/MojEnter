import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router'

import Header from './Header/Header';
import Modal from '../UI/Modal/Modal';

import Breadrcrumbs from '../Breadcrumbs/Breadcrumbs'

import './Layout.css';

const Layout = ({ children }) => {
	const history = useHistory();
	const { title, component, showModal } = useSelector(state => state.modalReducer);
	const [pageName, setPageName] = useState("");

	useEffect(() => {
		const URL = history.location.pathname;
		setPageName(`${URL.substring(URL.lastIndexOf('/') + 1)}`);
	}, [history.location.pathname])

	return (
		<div className="wrapper">
			<Header />
			<main className={`page ${pageName}`}>
				<Breadrcrumbs />
				{children}
			</main>
			<Modal showModal={showModal} title={title} component={component} />
		</div>
	);
};

export default Layout;
