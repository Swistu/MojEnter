import React from 'react';
import { useSelector } from 'react-redux';

import Header from './Header/Header';
import Modal from '../UI/Modal/Modal';

import Breadrcrumbs from '../Breadcrumbs/Breadcrumbs'

import './Layout.css';

const Layout = ({ children, history }) => {
    const { title, component, showModal} = useSelector(state => state.modalReducer);




    return (
        <div className="wrapper">
            <Header />
            <main>
                <Breadrcrumbs />
                {/* {breadcrumbs.map((item) => {
                    return <p>{item}</p>
                })} */}
                {children}
            </main>
            <Modal showModal={showModal} title={title} component={component} />
        </div>
    );
};

export default Layout;
