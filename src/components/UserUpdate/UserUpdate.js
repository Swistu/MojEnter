import React, { useEffect } from 'react';
import { database } from 'firebase';
import Input from '../UI/Input/Input';
import useForm from '../../hooks/useForm/useForm';
import { useSelector } from 'react-redux';

const UserUpdate = () => {
  const { firebaseUser, data } = useSelector(state => state.authenticationReducer)

  let itemsToCheck;
  const renderInputs = {
    payLoad: [
      {
        "type": "text",
        "descName": "Nazwa:",
        "placeholder": "Imie, nazwisko lub firma",
        "name": "displayName",
        "value": data.name ? data.name : ""
      },
      {
        "type": "tel",
        "descName": "Telefon:",
        "placeholder": "Wprowadź numer telefonu",
        "name": "telNumber",
        "value": data.phoneNumber ? data.phoneNumber : ""
      },
      {
        "type": "text",
        "descName": "Adres:",
        "placeholder": "Wprowadź ulice",
        "name": "address",
        "value": data.address ? data.address : ""
      },
      {
        "type": "submit",
        "name": "sendForm",
        "value": "Aktualizuj",
        "className": "btn btn--success"
      },
    ]
  };
  renderInputs.payLoad.map(res => {
    itemsToCheck = {
      ...itemsToCheck,
      [res.name]: res.value ? res.value : ""
    }
  });

  const { handleChange, handleSubmit, values, errors, isSubmitting } = useForm(updateData, itemsToCheck);

  function updateData() {
    database().ref("users/" + firebaseUser.uid).update({
      name: values.displayName,
      phoneNumber: values.telNumber,
      address: values.address,
    });
  }

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit}>
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
    </React.Fragment>
  )
}

export default UserUpdate;