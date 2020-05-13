import React, { useState } from 'react';
import { functions, auth } from 'firebase';

import { Form as getFormInputs } from './Form';
import useForm from '../../hooks/useForm/useForm';

import Card from '../../components/UI/Card/Card';
import Spinner from '../../components/UI/Spinner/Spinner';

const AssignOrder = () => {
  const [isValidatingAssign, setIsValidatingAssign] = useState(false);
  const [orderAssigned, setOrderAssigned] = useState(false);

  const assignOrder = () => {
    setIsValidatingAssign(true);

    const assignOrderFunc = functions().httpsCallable('assignOrder');

    const responseAssignOrder = auth().currentUser.getIdToken().then(async tokenID => {
      return await assignOrderFunc({ unassignedOrderUID: values.unassignedOrderUID, token: tokenID }).then(result => {
        return result;
      })
    })

    responseAssignOrder
      .then((response) => {
        console.log(response);
        if (response.data === null)
          errors.unassignedOrderUID = "Podany numer zlecenia nie istnieje lub został już przypisany.";
        else if (response.data === true)
          setOrderAssigned(true)
        else if (response.data === false)
          errors.unassignedOrderUID = "Podany numer zlecenia nie istnieje lub został już przypisany.";

      })
      .catch(() => {
        console.loh("error")
        // errors.unassignedOrderUID = "Podany numer zlecenia nie istnieje lub został już przypisany.";
      })
      .finally(() => {
        setIsValidatingAssign(false);
      })
  }

  const { handleSubmit, values, renderInputs, errors } = useForm(assignOrder, getFormInputs());
  return (
    <React.Fragment>
      <Card>
        {
          orderAssigned ? <p>Przypisano poprawnie zlecenie</p> :
            <form onSubmit={handleSubmit}>
              {
                isValidatingAssign ? <Spinner /> :
                  renderInputs()
              }
            </form>
        }
      </Card>
    </React.Fragment>
  )
}

export default AssignOrder;