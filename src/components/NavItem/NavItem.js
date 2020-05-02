import React from 'react';

import { NavLink } from 'react-router-dom';

const NavItem = ({ name, icon, className, type, toggleMenuHandler, highlightLink, children, ...props }) => {
  const itemType = () => {
    if (highlightLink === undefined) {
      highlightLink = true;
    }

    switch (type) {
      case "link":
        return (
          <li className="nav__item">
            <NavLink exact={true} activeClassName={highlightLink ? "active" : ""} className={`nav__link ${className}`} {...props}><i className={`fas fa-${icon}`}>{children}</i><span className="nav__link__name">{name}</span></NavLink>
          </li>
        );
      case "icon":
        return (
          <li className="nav__icon">
            <i className={`fas fa-${icon}`} {...props}>{children}</i>
          </li>
        );
      case "icon-withText":
        return (
          <li className="nav__icon">
            <i className={`fas fa-${icon}`} {...props}></i>
            {children}
          </li>
        );
      case "icon-link":
        return (
          <li className="nav__icon-link">
            <NavLink exact={true} {...props}><i className={`fas fa-${icon}`}></i>{children}</NavLink>

          </li>
        );
      case "divider":
        return <li className="nav__divider">{children}</li>
      case "group":
        return <li className="nav__group">{name}{children}</li>
      case "redirect":
        return <NavLink exact={true} {...props}>{children}</NavLink>
      default:
        return null;
    }
  }
  return itemType()
}

export default NavItem;