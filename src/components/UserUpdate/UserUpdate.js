import React from 'react';
import { database } from 'firebase';
import Input from '../UI/Input/Input';
import useForm from '../../hooks/useForm/useForm';
import { useSelector } from 'react-redux';

const UserUpdate = () => {
  const { realtimeDatabaseUser, firebaseUser } = useSelector(state => state.authenticationReducer)

  const renderInputs = {
    payLoad: [
      {
        "type": "text",
        "descName": "Nazwa:",
        "placeholder": "Imie, nazwisko lub firma",
        "name": "displayName",
        "value": realtimeDatabaseUser.name ? realtimeDatabaseUser.name : ""
      },
      {
        "type": "tel",
        "descName": "Telefon:",
        "placeholder": "Wprowadź numer telefonu",
        "name": "telNumber",
        "value": realtimeDatabaseUser.phoneNumber ? realtimeDatabaseUser.phoneNumber : ""
      },
      {
        "type": "text",
        "descName": "Adres:",
        "placeholder": "Wprowadź ulice",
        "name": "address",
        "value": realtimeDatabaseUser.address ? realtimeDatabaseUser.address : ""
      },
      {
        "type": "submit",
        "name": "sendForm",
        "value": "Aktualizuj",
        "className": "btn btn--success"
      },
    ]
  };

  const itemsToCheck = () => {
    return renderInputs.payLoad.reduce((previousValue, currentValue, i) => {
      if (i === 1)
        return { [previousValue.name]: previousValue.value ? previousValue.value : "", [currentValue.name]: currentValue.value ? currentValue.value : "" }
      else
        return { ...previousValue, [currentValue.name]: currentValue.value ? currentValue.value : "" }
    });
  }

  const updateData = () => {
    database().ref("users/" + firebaseUser.uid).update({
      name: values.displayName,
      phoneNumber: values.telNumber,
      address: values.address,
    });
  }
  
  const { handleChange, handleSubmit, values, errors, isSubmitting } = useForm(updateData, itemsToCheck());
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