import React, { useState } from 'react';

import NavItem from './NavItem/NavItem';

import './Header.css';



const Header = ({ ...props }) => {

	const [toggleMenu, setToggleMenu] = useState(false);

	const toggleMenuHandler = () => {
		setToggleMenu(toggleMenu => !toggleMenu);
	}

	const logOut = () => {

	}


	return (
		<header className="main__header">
			<div className="main__menu">
				<div className="navigation__toggler" onClick={toggleMenuHandler}>
					<div className="burger">
						<span className="burger__line"></span>
						<span className="burger__line"></span>
						<span className="burger__line"></span>
					</div>
				</div>
				<div className="logo">
					<a href="/dashboard">
						<img src="https://taniej.net/skins/default/rwd_shoper/images/logo.png" alt="Enter Serwis" />
					</a>
				</div>
			</div>
			<nav className={`main__navigation ${toggleMenu ? "active" : ""}`}>
				<ul>
					<NavItem type="link" name="Kokpit" to="/dashboard" icon="home" onClick={toggleMenuHandler} />
					<NavItem type="divider" onClick={toggleMenuHandler} />

					<NavItem type="group" name="Aplikacja" onClick={toggleMenuHandler} />

					<NavItem type="link" name="Dodaj zlecenie" to="/dashboard/add-order" icon="plus-circle" onClick={toggleMenuHandler} />

					<NavItem type="group" name="Ustawienia" onClick={toggleMenuHandler} />
					<NavItem type="link" name="Wyloguj się" to="/" icon="sign-out-alt" onClick={() => { toggleMenuHandler(); logOut() }} />
				</ul>
			</nav>
		</header>
	)
}

export default Header;