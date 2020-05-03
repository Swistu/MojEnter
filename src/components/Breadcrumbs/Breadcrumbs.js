import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router'
import { useSelector } from 'react-redux';

import "./Breadcrumbs.css";
import NavItem from '../NavItem/NavItem';

const Breadcrumbs = () => {
  const history = useHistory();

  const { realtimeDatabaseUser } = useSelector(state => state.authenticationReducer);

  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    const breadcrumbList = history.location.pathname.replace("-", " ").split("/");
    let link = "";
    setPageTitle(breadcrumbList[breadcrumbList.length - 1]);
    setBreadcrumbs(breadcrumbList.map((item, i) => {
      if (i > 0) {
        link = link + "/" + item.replace(" ", "-");

        if (i < breadcrumbList.length - 1)
          return <li className="breadcrumb__item" key={`breadcrumb${i}`}><NavItem type="redirect" to={link}>{item}</NavItem></li>;
        else
          return <li className="breadcrumb__item" key={`breadcrumb${i}`}>{item}</li>;
      }
      else
        return null
    }));
  }, [history.location.pathname])

  return (
    <div className="breadcrumb">
      {pageTitle === "dashboard" ?
        <h3 className="page__title" style={{ fontSize: 21 }}>Dzień dobry, {realtimeDatabaseUser.name}!</h3> :
        <h1 className="page__title">{pageTitle}</h1>
      }
      <ul className="breadcrumb__list">
        {breadcrumbs}
      </ul>
    </div>
  )
}

export default Breadcrumbs;