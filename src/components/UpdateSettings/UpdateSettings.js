import React, { useEffect } from 'react';
import { database } from 'firebase';

import { Form as getFormInputs } from './Form';
import useForm from '../../hooks/useForm/useForm';

const UpdateSettings = ({ currentOrderNumber }) => {
  useEffect(() => {
    changeValue("currentOrderNumber", currentOrderNumber);
    // eslint-disable-next-line
  }, [])

  const updateData = () => {
    database().ref("appSettings/").update({
      "currentOrderNumber": values.currentOrderNumber,
    });
  }

  const { handleSubmit, values, renderInputs, changeValue } = useForm(updateData, getFormInputs());
  return (
    <React.Fragment>
      <form onSubmit={handleSubmit}>
        {renderInputs()}
      </form>
    </React.Fragment>
  )
}

export default UpdateSettings;