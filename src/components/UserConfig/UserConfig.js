import React, { useState } from 'react';
import { auth, database } from 'firebase';
import { useSelector } from 'react-redux';

import Input from '../UI/Input/Input';
import useForm from '../../hooks/useForm/useForm';
import Spinner from '../UI/Spinner/Spinner';
import Card from '../UI/Card/Card';

const UserConfig = ({ ...props }) => {
  let itemsToCheck;
  const user = useSelector(state => state.authenticationReducer.user);

  const [registrationInProgress, setRegistrationInProgress] = useState();

  const renderInputs = {
    payLoad: [
      {
        "type": "text",
        "descName": "Email:",
        "placeholder": "Wprowadź email",
        "name": "emailFB",
      },
      {
        "type": "password",
        "descName": "Hasło:",
        "placeholder": "Wprowadź hasło",
        "name": "passwordFB",
      },
      {
        "type": "password",
        "descName": "Powtórz hasło:",
        "placeholder": "Wprowadź hasło",
        "name": "passwordFB2",
      },
      {
        "type": "submit",
        "name": "sendForm",
        "value": "Zarejestruj się",
        "className": "btn btn--dark"
      },
    ]
  };
  renderInputs.payLoad.map(res => {
    itemsToCheck = {
      ...itemsToCheck,
      [res.name]: res.value ? res.value : ""
    }
  });

  const { handleChange, handleSubmit, values, errors, isSubmitting } = useForm(signUp, itemsToCheck);

  function signUp() {

    auth().createUserWithEmailAndPassword(values.emailFB, values.passwordFB)
      .then((data) => {
        const userRef = database().ref('users/' + data.user.uid);
        const payLoad = {
          accountType: "Annomyous"
        }
        userRef.set(payLoad)
          .catch(error => console.error(error));
      })
      .catch(error => {
        console.error(error);
        if (error.code = "auth/email-already-in-use")
          errors.emailFB = "Konto z podanym email już istnieje";
        setRegistrationInProgress(false);
      }
      );
  }

  return (
    <Card>
      {user ?
        <React.Fragment>
          <section className="info__box">
            <p className="info__title">Dane konta: </p>
            <p>Nazwa: {user.displayName ? user.displayName : "brak"}</p>
            <p>Email: {user.email}</p>
            <p>Email zweryfikowany: {user.email ? "tak" : "nie"}</p>
            <p>Telefon: {user.phoneNumber ? user.phoneNumber : "brak"}</p>
          </section>

          <section className="info__box">
            <p className="info__title">Dodatkowe informacje:</p>
            <p>Ostatnie logowanie: {user.metadata.lastSignInTime}</p>
            <p>Utworzenie konta: {user.metadata.creationTime}</p>
          </section>

          <Input type="submit" className="btn btn--light" value="Aktualizuj dane" />
        </React.Fragment>
        : "nima"}
    </Card>
  )
}

export default UserConfig