import React, { useEffect } from 'react';
import { auth } from 'firebase';
import { useHistory, Switch, Route } from 'react-router-dom';

import Registration from '../../components/Registration/Registration';
import PasswordRecover from '../PasswordRecover/PasswordRecover';
import Login from '../../pages/Login/Login';

import './AuthLayout.css';

const AuthLayout = () => {
  const history = useHistory();

  useEffect(() => {
    auth().onIdTokenChanged(firebaseUser => {
      if (firebaseUser && firebaseUser.emailVerified)
        history.push("/dashboard");
    });
  }, [history])

  return (
    <div className="auth__box">
      <div className="auth__image" style={{ backgroundImage: "url(https://cdn.pixabay.com/photo/2018/07/01/16/52/hardware-3509891_960_720.jpg)" }}>
      </div>
      <div className="auth__form">
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/rejestracja" component={Registration} />
          <Route exact path="/przypomnienie-hasla" component={PasswordRecover} />
        </Switch>
      </div>
    </div>
  );
}

export default AuthLayout;