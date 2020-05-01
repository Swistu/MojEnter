import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { SHOW } from '../../store/actionTypes';
import { modal } from '../../store/actions';

import UserUpdate from '../../components/UserUpdate/UserUpdate';
import Input from '../../components/UI/Input/Input';
import Card from '../../components/UI/Card/Card';

const UserConfig = () => {
  const { realtimeDatabaseUser, firebaseUser } = useSelector(state => state.authenticationReducer);
  const dispatch = useDispatch();

  return (
    <Card>
      {firebaseUser ?
        <React.Fragment>
          <section className="info__box">
            <p className="info__title">Dane konta: </p>
            <p>Nazwa: {realtimeDatabaseUser.name ? realtimeDatabaseUser.name : "brak"}</p>
            <p>Email: {firebaseUser.email}</p>
            <p>Adres: {realtimeDatabaseUser.address ? realtimeDatabaseUser.address : "brak"}</p>
            <p>Email zweryfikowany: {firebaseUser.email ? "tak" : "nie"}</p>
            <p>Telefon: {realtimeDatabaseUser.phoneNumber ? realtimeDatabaseUser.phoneNumber : "brak"}</p>
          </section>

          <section className="info__box">
            <p className="info__title">Dodatkowe informacje:</p>
            <p>Ostatnie logowanie: {firebaseUser.lastSignInTime}</p>
            <p>Utworzenie konta: {firebaseUser.creationTime}</p>
          </section>

          <Input type="submit" className="btn btn--light" value="Aktualizuj dane" onClick={() => dispatch(modal(SHOW, "Zmień dane", <UserUpdate />))} />
        </React.Fragment>
        : "Brak danych"}
    </Card>
  )
}

export default UserConfig