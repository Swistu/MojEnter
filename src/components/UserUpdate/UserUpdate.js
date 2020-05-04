import React from 'react';
import { useSelector } from 'react-redux';
import { database } from 'firebase';

import { Form as getFormInputs } from './Form';
import useForm from '../../hooks/useForm/useForm';

import Input from '../UI/Input/Input';

const UserUpdate = () => {
  const { firebaseUser } = useSelector(state => state.authenticationReducer)

  const updateData = () => {
    database().ref("users/" + firebaseUser.uid).update({
      name: values.displayName,
      phoneNumber: values.telNumber,
      address: values.address,
    });
  }

  const renderFormInputs = () => {
    return getFormInputs().map((res) => {
      if (res.type !== "submit")
        return <React.Fragment key={res.name}>
          <Input {...res} onChange={handleChange} value={values[res.name]} className={isSubmitting ? errors[res.name] || errors[res.name] === "" ? "input--invalid" : "input--valid" : null} />
          {errors[res.name] && <p className={"feedback feedback--invalid"}>{errors[res.name]}</p>}
        </React.Fragment>
      else
        return <Input key={res.name} {...res} />
    })
  }

  const { handleChange, handleSubmit, values, errors, isSubmitting } = useForm(updateData, getFormInputs());
  return (
    <React.Fragment>
      <form onSubmit={handleSubmit}>
        {renderFormInputs()}
      </form>
    </React.Fragment>
  )
}

export default UserUpdate;