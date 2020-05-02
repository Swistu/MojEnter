import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { auth, database } from 'firebase';

import { authentication } from '../../../store/actions';
import NavItem from '../../NavItem/NavItem';
import Notifications from '../../Notifications/Notifications';

import './Header.css';

const Header = () => {
	const dispatch = useDispatch();
	const { realtimeDatabaseUser, firebaseUser } = useSelector(state => state.authenticationReducer);

	const [toggleMenu, setToggleMenu] = useState(false);
	const [toggleSupportMenu, setToggleSupportMenu] = useState(false);
	const [routes, setRoutes] = useState();
	const [numberOfNotifications, setNumberOfNotifications] = useState(0);

	useEffect(() => {
		if (firebaseUser) {
			switch (realtimeDatabaseUser.accountType) {
				case "Annomyous":
					setRoutes(
						<React.Fragment>
							<NavItem type="link" name="Dashboard" to="/dashboard" icon="home" onClick={toggleMenuHandler} />
							<NavItem type="divider" onClick={toggleMenuHandler} />
							<NavItem type="group" name="Aplikacja" onClick={toggleMenuHandler} />
							<NavItem type="link" name="Przypisz zlecenie" to="/dashboard/przypisz-zlecenie" icon="file-download" onClick={toggleMenuHandler} />
							<NavItem type="link" name="Wyloguj się" to="/" icon="sign-out-alt" onClick={() => { toggleMenuHandler(); logOut() }} />
						</React.Fragment>
					)
					break;
				case "User":
					setRoutes(
						<React.Fragment>
							<NavItem type="link" name="Dashboard" to="/dashboard" icon="home" onClick={toggleMenuHandler} />
							<NavItem type="divider" onClick={toggleMenuHandler} />
							<NavItem type="group" name="Aplikacja" onClick={toggleMenuHandler} />
							<NavItem type="link" name="Przypisz zlecenie" to="/dashboard/przypisz-zlecenie" icon="file-download" onClick={toggleMenuHandler} />
							<NavItem type="link" name="Zlecenia" to="/dashboard/zlecenia" icon="file-alt" onClick={toggleMenuHandler} />
							<NavItem type="link" name="Wiadomości" to="/dashboard/wiadomosci" icon="comments" onClick={toggleMenuHandler} />
							<NavItem type="link" name="Wyloguj się" to="/" icon="sign-out-alt" onClick={() => { toggleMenuHandler(); logOut() }} />
						</React.Fragment>
					)
					break;
				case "Admin":
					setRoutes(
						<React.Fragment>
							<NavItem type="link" name="Dashboard" to="/dashboard" icon="home" onClick={toggleMenuHandler} />
							<NavItem type="divider" onClick={toggleMenuHandler} />
							<NavItem type="group" name="Aplikacja" onClick={toggleMenuHandler} />
							<NavItem type="link" name="Dodaj zlecenie" to="/dashboard/dodaj-zlecenie" icon="plus-circle" onClick={toggleMenuHandler} />
							<NavItem type="link" name="Zlecenia" to="/dashboard/zlecenia" icon="file-alt" onClick={toggleMenuHandler} />
							<NavItem type="link" name="Wiadomości" to="/dashboard/wiadomosci" icon="comments" onClick={toggleMenuHandler} />
							<NavItem type="link" name="Wyloguj się" to="/" icon="sign-out-alt" onClick={() => { toggleMenuHandler(); logOut() }} />
						</React.Fragment>
					)
					break;
				default:
					break;
			}
		}
		// eslint-disable-next-line
	}, [firebaseUser, dispatch]);

	useEffect(() => {
		const checkNotifications = (snapshot) => {
			const data = { ...snapshot.val(), "key": snapshot.key };
			const keyOfAllOrders = Object.keys(data);
			let i = 0;

			keyOfAllOrders.map((orderMessageUID) => {
				if (data[orderMessageUID].read === "false") {
					i++
				}
				return null;
			});
			setNumberOfNotifications(i);
		}

		if (realtimeDatabaseUser.accountType === "Admin") {
			database().ref('notifications/admin').on("value", (snapshot) => {
				if (snapshot && snapshot.val()) {
					checkNotifications(snapshot);
				}
			})
		} else {
			database().ref('notifications/' + firebaseUser.uid).on("value", (snapshot) => {
				if (snapshot && snapshot.val()) {
					checkNotifications(snapshot);
				}
			})
		}

		console.log(window.outerWidth);

		// eslint-disable-next-line
	}, [])



	const toggleMenuHandler = () => {
		setToggleMenu(toggleMenu => !toggleMenu);
		setToggleSupportMenu(false);
	}
	const toggleSupportMenuHandler = () => {
		setToggleSupportMenu(toggleSupportMenu => !toggleSupportMenu);
		setToggleMenu(false);
	}
	const logOut = () => {
		dispatch(authentication(null, null));
		auth().signOut();
	}
	return (
		<header className="main__header">
			<div className={`main__menu ${toggleSupportMenu ? "hide-shadow" : ""}`}>
				<div className="navigation__toggler" onClick={toggleMenuHandler}>
					<div className="burger">
						<span className="burger__line"></span>
						<span className="burger__line"></span>
						<span className="burger__line"></span>
					</div>
				</div>
				<div className="logo">
					<a href="/dashboard">
						<picture>
							<source media="(min-width: 768px) and (max-width: 1170px)" srcSet="https://lh6.googleusercontent.com/-itERaVqG-kg/AAAAAAAAAAI/AAAAAAAAAAA/A1g0tvNwCsY/s48-p-k-no-ns-nd/photo.jpg" />
							<img src="https://taniej.net/skins/default/rwd_shoper/images/logo.png" alt="Enter Serwis" />
						</picture>
					</a>
				</div>
				<div className="menu-more fas fa-ellipsis-h" onClick={toggleSupportMenuHandler}></div>
			</div>
			<nav className={`main__navigation ${toggleMenu ? "active" : ""}`}>
				<ul>
					{routes}
				</ul>
			</nav>
			<div className={`support__menu ${ toggleSupportMenu ? "show" : "hideSubmenu"}`}>
				<ul className="support__menu-options" >
					<li className="nav__icon" >
						<i className="fas fa-bell"></i>
						<div id="notifications__number" className="rounded-circle">{numberOfNotifications}</div>
						<ul className="support__menu-submenu" >
							<Notifications toggleSupportMenuHandler={toggleSupportMenuHandler} />
						</ul>
					</li>
					<li className="nav__icon" >
						<i className="fas fa-user-circle" ></i>
						Witaj, {realtimeDatabaseUser.name}
						<ul className="support__menu-submenu" id="menu__account" >
							<NavItem type="link" name="Konto" to="/dashboard/konto" icon="user-cog" highlightLink={false} onClick={toggleSupportMenuHandler} />
							<NavItem type="divider" />
							<NavItem type="link" name="Wyloguj się" to="/" icon="power-off" onClick={() => { logOut() }} />
						</ul>
					</li>
				</ul>
			</div>
		</header>
	)
}

export default Header;