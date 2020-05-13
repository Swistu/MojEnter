import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router'

import NavItem from '../NavItem/NavItem';

import "./Breadcrumbs.css";

const Breadcrumbs = () => {
  const history = useHistory();

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
      <h1 className="page__title">{pageTitle === "dashboard" ? `Panel głowny` : pageTitle}</h1>
      <ul className="breadcrumb__list">
        {breadcrumbs}
      </ul>
    </div>
  )
}

export default Breadcrumbs;