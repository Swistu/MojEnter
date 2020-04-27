import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Header from './Header/Header';
import Footer from './Footer/Footer';
import Modal from '../UI/Modal/Modal';
import './Layout.css';

const Layout = ({ children, ...props }) => {
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
