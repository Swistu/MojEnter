import React from 'react';

import { NavLink } from 'react-router-dom';

const NavItem = ({ name, to, icon, className, type, toggleMenuHandler, ...props }) => {

  let item = "";

  switch (type) {
    case "link":
      item = (
        <li className="nav__item">
          <NavLink exact={true} activeClassName='active' className={`nav__link ${className}`} to={to} {...props}><i className={`fas fa-${icon}`}></i>{name}</NavLink>
        </li>
      );
      break;
    case "divider":
      item = (
        <li className="nav__divider"></li>
      );
      break;
    case "group":
      item = (
        <li className="nav__group">{name}</li>
      );
      break;
  }

  return (item)
}

export default NavItem;