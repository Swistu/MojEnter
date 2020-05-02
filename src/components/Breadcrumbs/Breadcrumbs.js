import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router'
import { useSelector } from 'react-redux';

import "./Breadcrumbs.css";

const Breadcrumbs = () => {
  const history = useHistory();

	const { realtimeDatabaseUser } = useSelector(state => state.authenticationReducer);

  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [pageTitle, setPageTitle] = useState("");
  
  useEffect(() => {
    const breadcrumbList = history.location.pathname.replace("-", " ").split("/");

    setPageTitle(breadcrumbList[breadcrumbList.length - 1]);
    setBreadcrumbs(breadcrumbList.map((item, i) => {
      if (i > 0)
        return <li className="breadcrumb__item" key={`breadcrumb${i}`}>{item}</li>;
      else
        return null;
    }));
  }, [history.location.pathname])

  return (
    <div className="breadcrumb">
      <h1 className="page__title">{pageTitle === "dashboard" ? `Dzień dobry, ${realtimeDatabaseUser.name}!` : pageTitle}</h1>
      <ul className="breadcrumb__list">
        {breadcrumbs}
      </ul>
    </div>
  )
}

export default Breadcrumbs;