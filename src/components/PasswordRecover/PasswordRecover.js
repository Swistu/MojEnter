import React, { useState } from 'react';
import { auth } from 'firebase';
import { useHistory } from 'react-router';

import { Form as getFormInputs } from './Form';
import useForm from '../../hooks/useForm/useForm';
import Spinner from '../UI/Spinner/Spinner';

const PasswordRecover = () => {
  const history = useHistory();
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const sendPasswordReset = () => {
    setSendingEmail(true);
    auth().sendPasswordResetEmail(values.emailFB, {url: 'http://localhost:3000'})
      .then(() => {
        setEmailSent(true);
      })
      .catch(() => {
        errors.emailFB = "Nie ma takiego użytkownika."
      })
      .finally(() => {
        setSendingEmail(false);
      })
  }

  const redirectToLogin = () => {
    history.push("/")
  }

  const { handleSubmit, values, errors, renderInputs } = useForm(sendPasswordReset, getFormInputs());
  return (
    <React.Fragment>
      <h2 className="auth__header">Odzyskaj hasło</h2>
      {sendingEmail ? <Spinner /> :
        emailSent ? <p>Na adres {values.emailFB} został wysłany link do zresetowania hasła.</p> :
          <React.Fragment>
            <form onSubmit={handleSubmit}>
              {renderInputs()}
            </form>
            <p style={{ marginTop: "26px" }}>Pamiętasz hasło? <span onClick={redirectToLogin} className="text-danger link">Zaloguj się</span></p>
          </React.Fragment>
      }
    </React.Fragment>
  );
}

export default PasswordRecover;