import React, { useState } from 'react';
import { auth, database } from 'firebase';

import Input from '../UI/Input/Input';
import useForm from '../../hooks/useForm/useForm';
import Spinner from '../UI/Spinner/Spinner';

const Registration = ({ showRegisterHandler, ...props }) => {
  let itemsToCheck;
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

    setRegistrationInProgress(true);
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
    registrationInProgress ? <Spinner /> : <React.Fragment>
      <h2 className="auth__header">Zarejestruj się</h2>
      <form onSubmit={handleSubmit}>

        {/* {(errors.passwordFB2 === "" || errors.passwordFB === "") && <p className={"feedback feedback--invalid"} style={{ marginTop: "20px" }}>Podane hasła nie są identyczne</p>} */}
        {renderInputs.payLoad.map((res) => {
          if (res.type !== "submit")
            return <React.Fragment key={res.name}>
              <Input
                {...res}
                onChange={handleChange}
                value={values[res.name]}
                className={isSubmitting ? errors[res.name] || errors[res.name] === "" ? "input--invalid" : "input--valid" : null}
              />
              {errors[res.name] && <p className={"feedback feedback--invalid"}>{errors[res.name]}</p>}
            </React.Fragment>
          else
            return <React.Fragment key={res.name}>
              <Input {...res} />
            </React.Fragment>
        })}
      </form>
      <p style={{ marginTop: "26px" }}>Posiadasz konto? <span onClick={showRegisterHandler} className="text-danger link">Zaloguj się</span></p>
    </React.Fragment>
  )
}

export default Registration;