import React from 'react';

import Header from './Header/Header';
import Footer from './Footer/Footer';

import './Layout.css';

const Layout = ( { children }, props ) => {

	return (
        <div className="wrapper">
            <Header />
            <main>
                {children}
            </main>
        </div>
	);
};

export default Layout;
