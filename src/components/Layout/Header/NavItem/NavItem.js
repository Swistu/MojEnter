import React from 'react';

import { NavLink } from 'react-router-dom';

const NavItem = ({ name, icon, className, type, toggleMenuHandler, highlightLink, ...props }) => {

  let item = "";
  if(highlightLink == null){
    highlightLink = true;
  }
  switch (type) {
    case "link":
      item = (
        <li className="nav__item">
          <NavLink exact={true} activeClassName={highlightLink? "active" : "" } className={`nav__link ${className}`} {...props}><i className={`fas fa-${icon}`}></i><span className="nav__link__name">{name}</span></NavLink>
        </li>
      );
      break;
    case "icon":
      item = (
        <li className="nav__icon">
          <i className={`fas fa-${icon}`} {...props}></i>
        </li>
      );
      break;
    case "icon-link":
      item = (
        <li className="nav__icon-link">
          <NavLink exact={true} {...props}><i className={`fas fa-${icon}`}></i></NavLink>
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
    default:
      break;
  }

  return (item)
}

export default NavItem;