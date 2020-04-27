import React, { useState } from 'react';
import { auth, database } from 'firebase';
import { useSelector, useDispatch } from 'react-redux';

import { SHOW } from '../../store/actionTypes';
import { modal } from '../../store/actions';
import Input from '../UI/Input/Input';
import useForm from '../../hooks/useForm/useForm';
import Spinner from '../UI/Spinner/Spinner';
import Card from '../UI/Card/Card';
import UserUpdate from '../UserUpdate/UserUpdate';

const UserConfig = ({ ...props }) => {
  const { firebaseUser, data } = useSelector(state => state.authenticationReducer);
  const dispatch = useDispatch();

  return (
    <Card>
      {firebaseUser ?
        <React.Fragment>
          <section className="info__box">
            <p className="info__title">Dane konta: </p>
            <p>Nazwa: {data.name ? data.name : "brak"}</p>
            <p>Email: {firebaseUser.email}</p>
            <p>Adres: {data.address ? data.address : "brak"}</p>
            <p>Email zweryfikowany: {firebaseUser.email ? "tak" : "nie"}</p>
            <p>Telefon: {data.phoneNumber ? data.phoneNumber : "brak"}</p>
          </section>

          <section className="info__box">
            <p className="info__title">Dodatkowe informacje:</p>
            <p>Ostatnie logowanie: {firebaseUser.metadata.lastSignInTime}</p>
            <p>Utworzenie konta: {firebaseUser.metadata.creationTime}</p>
          </section>

          <Input type="submit" className="btn btn--light" value="Aktualizuj dane" onClick={() => dispatch(modal(SHOW, "Zmień dane", <UserUpdate />))} />
        </React.Fragment>
        : "Brak danych"}
    </Card>


  )
}

export default UserConfig