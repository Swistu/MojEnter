import React from 'react';
import { useSelector } from 'react-redux';

import Header from './Header/Header';
import Modal from '../UI/Modal/Modal';

import './Layout.css';

const Layout = ({ children }) => {
    const { title, component, showModal} = useSelector(state => state.modalReducer);

    return (
        <div className="wrapper">
            <Header />
            <main>
                {children}
            </main>
            <Modal showModal={showModal} title={title} component={component} />
        </div>
    );
};

export default Layout;
