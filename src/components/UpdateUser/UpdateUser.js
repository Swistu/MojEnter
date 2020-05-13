import React from 'react';
import { useSelector } from 'react-redux';
import { database } from 'firebase';

import { Form as getFormInputs } from './Form';
import useForm from '../../hooks/useForm/useForm';

const UserUpdate = () => {
  const { firebaseUser } = useSelector(state => state.authenticationReducer)

  const updateData = () => {
    database().ref("users/" + firebaseUser.uid).update({
      name: values.displayName,
      phoneNumber: values.telNumber,
      address: values.address,
    });
  }

  const { handleSubmit, values, renderInputs } = useForm(updateData, getFormInputs());
  return (
    <React.Fragment>
      <form onSubmit={handleSubmit}>
        {renderInputs()}
      </form>
    </React.Fragment>
  )
}

export default UserUpdate;