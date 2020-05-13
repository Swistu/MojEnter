import React, { useState } from 'react';
import { auth, database } from 'firebase';

import { Form as getFormInputs } from './Form';
import useForm from '../../hooks/useForm/useForm';
import Spinner from '../UI/Spinner/Spinner';
import { useHistory } from 'react-router';

const Registration = () => {
	const history = useHistory();
  const [registrationInProgress, setRegistrationInProgress] = useState(false);
  const [emailSend, setEmailSend] = useState(false);

  const signUp = () => {
    setRegistrationInProgress(true);
    auth().createUserWithEmailAndPassword(values.emailFB, values.passwordFB)
      .then((firebaserUser) => {
        firebaserUser.user.sendEmailVerification({ url: 'http://localhost:3000' })
          .then(setEmailSend(true));
        const userRef = database().ref('users/' + firebaserUser.user.uid);
        const payLoad = {
          name: "",
          phoneNumber: "",
          address: "",
        }
        userRef.set(payLoad);
        setRegistrationInProgress(false);
      })
      .catch(error => {
        if (error.code === "auth/email-already-in-use") {
          errors.emailFB = "Konto z podanym email już istnieje";
        }
        setRegistrationInProgress(false);
      });
  }

  const redirectToLogin = () => {
    history.push("/")
  }

  const { handleSubmit, values, errors, renderInputs } = useForm(signUp, getFormInputs());
  return (
    registrationInProgress ? <Spinner style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }} /> :
      <React.Fragment>
        <h2 className="auth__header">Zarejestruj się</h2>
        {emailSend ?
          <React.Fragment>
            <p>Na adres {values.emailFB} wysłano link weryfikacyjny.</p>
            <p>Potwierdź go aby móc się zalogować.</p>
          </React.Fragment>
          :
          <React.Fragment>
            <form onSubmit={handleSubmit}>
              {renderInputs()}
            </form>
            <p style={{ marginTop: "26px" }}>Posiadasz konto? <span onClick={redirectToLogin} className="text-danger link">Zaloguj się</span></p>
          </React.Fragment>
        }
      </React.Fragment>
  )
}

export default Registration;