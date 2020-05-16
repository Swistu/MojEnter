import React, { useEffect } from 'react';
import { database, auth } from 'firebase';

import { Form as getFormInputs } from './Form';
import useForm from '../../hooks/useForm/useForm';

const UserUpdate = ({ userData }) => {

  useEffect(() => {

      changeValue("displayName", "userData.name");
      changeValue("telNumber", userData.telephone);
      changeValue("address", userData.address);
    

    console.log(userData);
    // updateForm();
  }, [])

  const updateData = () => {
    database().ref("users/" + auth().currentUser.uid).update({
      name: values.displayName,
      phoneNumber: values.telNumber,
      address: values.address,
    });
  }
  const { handleSubmit, values, renderInputs, changeValue } = useForm(updateData, getFormInputs());
  // changeValue("displayName", "a");
  return (
    <React.Fragment>
      <form onSubmit={handleSubmit}>
        {renderInputs()}
      </form>
    </React.Fragment>
  )
}

export default UserUpdate;