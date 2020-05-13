import React, { useState, useEffect } from 'react';
import { auth, database } from 'firebase';

import { checkAccounType } from '../../../utility/checkAccountType';
// import { getUserData } from '../../../utility/getUserData';

import NavItem from '../../NavItem/NavItem';
import Notifications from '../../Notifications/Notifications';

import './Header.css';


const Header = () => {
	const [routes, setRoutes] = useState(null);
	const [numberOfNotifications, setNumberOfNotifications] = useState(0);

	useEffect(() => {
		if (auth().currentUser) {
			checkAccounType().then(accountType => {
				if (accountType === "user")
					setRoutes(
						<React.Fragment>
							<NavItem type="link" name="Przypisz zlecenie" to="/dashboard/przypisz-zlecenie" icon="file-download" />
						</React.Fragment>
					)
				else if (accountType === "worker")
					setRoutes(
						<React.Fragment>
							<NavItem type="link" name="Dodaj zlecenie" to="/dashboard/dodaj-zlecenie" icon="plus-circle" />
						</React.Fragment>
					)
				else if (accountType === "admin")
					setRoutes(
						<React.Fragment>
							<NavItem type="link" name="Dodaj pracownika" to="/dashboard/dodaj-pracownika" icon="user-plus" />
							<NavItem type="link" name="Dodaj zlecenie" to="/dashboard/dodaj-zlecenie" icon="plus-circle" />
						</React.Fragment>
					)
			})
		}
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		const checkNotifications = (data) => {
			const keyOfAllOrders = Object.keys(data);
			let i = 0;

			keyOfAllOrders.map((orderMessageUID) => {
				if (data[orderMessageUID].read === "false")
					i++
				return null;
			});
			setNumberOfNotifications(i);
		}

		checkAccounType().then(accountType => {
			if (accountType === "admin" || accountType === "worker")
				database().ref('notifications/admin').on("value", (snapshot) => {
					if (snapshot && snapshot.val())
						checkNotifications(snapshot.val());
				})
			else
				database().ref('notifications/' + auth().currentUser.uid).on("value", (snapshot) => {
					if (snapshot && snapshot.val())
						checkNotifications(snapshot.val());
				})
		})


		if (routes) {
			const submenuItems = document.querySelectorAll(".support__menu-options > li");
			submenuItems.forEach(item => {
				item.addEventListener("click", () => {
					submenuItems.forEach(allItems => {
						if (item !== allItems)
							allItems.classList.remove("active");
					});
					if (item.classList.contains("active"))
						item.classList.remove("active");
					else
						item.classList.add("active");
				});
			})

			document.querySelector("main")
				.addEventListener("click", () => {
					submenuItems.forEach(allItems => {
						allItems.classList.remove("active");
					});
				});
			document.querySelectorAll(".main__navigation > ul > li.nav__item").forEach(item => {
				item.addEventListener("click", () => {
					submenuItems.forEach(allItems => {
						allItems.classList.remove("active");
					});
				});
			})
		}

		// eslint-disable-next-line
	}, [routes])

	const logOut = () => {
		auth().signOut();
	}

	return (
		auth().currentUser ?
			<header className="main__header">
				<div className="main__menu">
					<div className="burger">
						<span className="burger__line"></span>
						<span className="burger__line"></span>
						<span className="burger__line"></span>
					</div>
					<div className="logo">
						<a href="/dashboard">
							<picture>
								<source media="(min-width: 768px) and (max-width: 1170px)" srcSet="https://lh6.googleusercontent.com/-itERaVqG-kg/AAAAAAAAAAI/AAAAAAAAAAA/A1g0tvNwCsY/s48-p-k-no-ns-nd/photo.jpg" />
								<img src="https://taniej.net/skins/default/rwd_shoper/images/logo.png" alt="Enter Serwis" />
							</picture>
						</a>
					</div>
					<div className="menu-more fas fa-ellipsis-h"></div>
					<div className="support__menu">
						<ul className="support__menu-options" >
							<li className="nav__icon">
								<i className="fas fa-bell"></i>
								<div id="notifications__number" className="rounded-circle">{numberOfNotifications}</div>
								<ul className="support__menu-submenu" >
									<Notifications />
								</ul>
							</li>
							<li className="nav__icon" id="menu__account">
								{
									auth().currentUser.photoURL !== null ?
										<img className="rounded-circle userImage" src={auth().currentUser.photoURL} alt="" /> :
										<i className="fas fa-user-circle userImage" style={{ color: "#7c8798" }}></i>
								}
								{/* {
								getUserData() ?
									<div className="greeting">
										<span className="text-light">Witaj,</span>
										<span className="userName">{getUserData().name}</span>
										<i className="fas fa-chevron-down text-light" style={{ fontSize: 15 }}></i>
									</div>
									: null
							} */}

								<ul className="support__menu-submenu">
									<NavItem type="link" name="Konto" to="/dashboard/konto" icon="user-cog" />
									<NavItem type="divider" />
									<NavItem type="link" name="Wyloguj się" to="/" icon="power-off" onClick={logOut} />
								</ul>
							</li>
						</ul>
					</div>
					<nav className="main__navigation">
						<ul>
							<NavItem type="link" name="Dashboard" to="/dashboard" icon="home" />
							<NavItem type="divider" />
							<NavItem type="group" name="Aplikacja" />
							{routes}
							<NavItem type="link" name="Zlecenia" to="/dashboard/zlecenia" icon="file-alt" />
							<NavItem type="link" name="Wiadomości" to="/dashboard/wiadomosci" icon="comments" />
							<NavItem type="link" name="Ustawienia" to="/dashboard/ustawienia" icon="cog" />
							<NavItem type="divider" />
							<NavItem type="link" name="Wyloguj się" to="/" icon="sign-out-alt" onClick={logOut} />
						</ul>
					</nav>
				</div>
			</header>
			: null
	)
}

export default Header;