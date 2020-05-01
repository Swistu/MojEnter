import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { auth, database } from 'firebase';

import { authentication } from '../../../store/actions';
import checkNotifications from '../../../utility/checkNotifications';
import NavItem from '../../NavItem/NavItem';
import Notifications from '../../Notifications/Notifications';

import './Header.css';

const Header = ({ history }) => {
	const dispatch = useDispatch();
	const { firebaseUser } = useSelector(state => state.authenticationReducer);

	const [toggleMenu, setToggleMenu] = useState(false);
	const [toggleSupportMenu, setToggleSupportMenu] = useState(false);
	const [toggleExtendedSupportMenu, setToggleExtendedSupportMenu] = useState(false);
	const [routes, setRoutes] = useState();
	const [extendedMenuLinks, setExtendedMenuLinks] = useState();
	const [notificationsNumber, setNotificationsNumber] = useState(0);

	useEffect(() => {
		if (firebaseUser) {
			database().ref("/users/" + firebaseUser.uid).on("value", (snapshot) => {
				if (snapshot && snapshot.val()) {
					const data = snapshot.val();

					switch (data.accountType) {
						case "Annomyous":
							setRoutes(
								<React.Fragment>
									<NavItem type="link" name="Kokpit" to="/dashboard" icon="home" onClick={toggleMenuHandler} />
									<NavItem type="divider" onClick={toggleMenuHandler} />


									<NavItem type="group" name="Aplikacja" onClick={toggleMenuHandler} />
									<NavItem type="link" name="Przypisz zlecenie" to="/dashboard/assign-order" icon="file-download" onClick={toggleMenuHandler} />
									{/* <NavItem type="link" name="Wiadomości" to="/dashboard/messages" icon="comments" onClick={toggleMenuHandler} /> */}

									{/* <NavItem type="group" name="Ustawienia" onClick={toggleMenuHandler} />
									<NavItem type="link" name="Konto" to="/dashboard/user" icon="user-cog" onClick={toggleMenuHandler} /> */}

									<NavItem type="link" name="Wyloguj się" to="/" icon="sign-out-alt" onClick={() => { toggleMenuHandler(); logOut() }} />
								</React.Fragment>
							)
							break;
						case "User":
							setRoutes(
								<React.Fragment>
									<NavItem type="link" name="Kokpit" to="/dashboard" icon="home" onClick={toggleMenuHandler} />
									<NavItem type="divider" onClick={toggleMenuHandler} />

									<NavItem type="group" name="Aplikacja" onClick={toggleMenuHandler} />

									<NavItem type="link" name="Przypisz zlecenie" to="/dashboard/assign-order" icon="file-download" onClick={toggleMenuHandler} />
									<NavItem type="link" name="Zlecenia" to="/dashboard/show-orders" icon="file-alt" onClick={toggleMenuHandler} />
									<NavItem type="link" name="Wiadomości" to="/dashboard/messages" icon="comments" onClick={toggleMenuHandler} />

									{/* <NavItem type="group" name="Ustawienia" onClick={toggleMenuHandler} />
									<NavItem type="link" name="Konto" to="/dashboard/user" icon="user-cog" onClick={toggleMenuHandler} /> */}

									<NavItem type="link" name="Wyloguj się" to="/" icon="sign-out-alt" onClick={() => { toggleMenuHandler(); logOut() }} />
								</React.Fragment>
							)
							break;
						case "Admin":
							setRoutes(
								<React.Fragment>
									<NavItem type="link" name="Kokpit" to="/dashboard" icon="home" onClick={toggleMenuHandler} />
									<NavItem type="divider" onClick={toggleMenuHandler} />

									<NavItem type="group" name="Aplikacja" onClick={toggleMenuHandler} />

									<NavItem type="link" name="Dodaj zlecenie" to="/dashboard/add-order" icon="plus-circle" onClick={toggleMenuHandler} />
									<NavItem type="link" name="Zlecenia" to="/dashboard/show-orders" icon="file-alt" onClick={toggleMenuHandler} />
									<NavItem type="link" name="Wiadomości" to="/dashboard/messages" icon="comments" onClick={toggleMenuHandler} />

									{/* <NavItem type="link" name="Dodaj admina" to="/dashboard/add-admin" icon="user" onClick={toggleMenuHandler} /> */}

									{/* <NavItem type="group" name="Ustawienia" onClick={toggleMenuHandler} />
									<NavItem type="link" name="Konto" to="/dashboard/user" icon="user-cog" onClick={toggleMenuHandler} /> */}

									<NavItem type="link" name="Wyloguj się" to="/" icon="sign-out-alt" onClick={() => { toggleMenuHandler(); logOut() }} />
								</React.Fragment>
							)
							break;
							default:
								break;
					}
				}
			});
		}
		const logOut = () => {
			dispatch(authentication(null, null));
			auth().signOut();
		}
	}, [firebaseUser, dispatch]);

	const toggleMenuHandler = () => {
		setToggleMenu(toggleMenu => !toggleMenu);
		setToggleSupportMenu(false);
		setToggleExtendedSupportMenu(false);
	}
	const toggleSupportMenuHandler = () => {
		setToggleSupportMenu(toggleSupportMenu => !toggleSupportMenu);
		setToggleMenu(false);
		setToggleExtendedSupportMenu(false);
	}
	const toggleExtendedSupportMenuHandler = () => {
		setToggleExtendedSupportMenu(toggleExtendedSupportMenu => !toggleExtendedSupportMenu);
	}
	const logOut = () => {
		dispatch(authentication(null, null));
		auth().signOut();
	}


	const notificationsNumberHandler = (number) => {
		setNotificationsNumber(number);
	}

	console.log(notificationsNumber);
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
			<div className={`support__menu ${toggleSupportMenu ? "show" : ""}`}>
				<ul className="support__menu-options" >
					<NavItem type="icon" icon="bell" style={{position: "relative"}} onClick={() => {
						toggleExtendedSupportMenuHandler();
						setExtendedMenuLinks(
							<React.Fragment>
								<Notifications history={history} toggleSupportMenuHandler={toggleSupportMenuHandler}/>
							</React.Fragment>)
					}}><div id="notifications__number" className="rounded-circle">{checkNotifications}</div></NavItem>


					<NavItem type="icon" icon="user-circle" onClick={() => {
						toggleExtendedSupportMenuHandler();
						setExtendedMenuLinks(
							<React.Fragment>
								<NavItem type="link" name="Konto" to="/dashboard/user" icon="user-cog" highlightLink={false} onClick={toggleSupportMenuHandler} />
								<NavItem type="link" name="Wyloguj się" to="/" icon="power-off" onClick={() => { logOut() }} />
							</React.Fragment>)
					}} />
				</ul>

			</div>
			<div className={`support__extended_menu ${toggleExtendedSupportMenu ? "show" : "a"}`}>
				<ul className="support__extended_menu-options">
					{extendedMenuLinks}
				</ul>
			</div>
		</header>
	)
}

export default Header;