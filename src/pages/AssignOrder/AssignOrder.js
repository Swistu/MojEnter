import React, { useState } from 'react';
import { database, auth } from 'firebase';
import { useSelector } from 'react-redux';

import { Form as getFormInputs } from './Form';
import useForm from '../../hooks/useForm/useForm';

import Card from '../../components/UI/Card/Card';
import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spinner/Spinner';

const AssignOrder = () => {
  const [isValidatingAssign, setIsValidatingAssign] = useState(false);
  const [orderAssigned, setOrderAssigned] = useState(false);
  const { firebaseUser } = useSelector(state => state.authenticationReducer);

  const assignOrder = () => {
    setIsValidatingAssign(true);

    const promises = [];
    const unassignedOrdersRef = database().ref('unassignedOrders/' + values.unassignedOrderUID);
    unassignedOrdersRef.once("value", snapshot => {
      if (snapshot && snapshot.val()) {
        const data = snapshot.val();
        const userRef = database().ref('users/' + firebaseUser.uid);
        const userOrders = database().ref('users/' + firebaseUser.uid + '/orders');
        const ordersRef = database().ref('orders/' + data.orderUID);

        promises.push(
          userRef.update({
            "accountType": "User",
          })
        );
        promises.push(
          userOrders.push({
            "orderUID": data.orderUID
          })
        );
        promises.push(
          ordersRef.update({
            "userUID": firebaseUser.uid
          })
        );

        Promise.all(promises).then((res) => {
          unassignedOrdersRef.remove();
          setIsValidatingAssign(false);
          setOrderAssigned(true);
        });

        if (firebaseUser) {
          const notificationsRef = database().ref('notifications/' + firebaseUser.uid).push();
          const today = new Date();
          const time = today.getHours() + ':' + today.getMinutes();
          const dateTime = time;
          const notificationsData = {
            "content": "Przypisałeś zlecenie do swojego konta.",
            "time": dateTime,
            "orderUID": data.orderUID,
            "type": "NewOrder",
            "read": "false",
          }
          notificationsRef.set(notificationsData)
            .catch(error => console.error(error));
        }
      } else {
        errors.unassignedOrderUID = "Zlecenie o podanym numerze nie istnieje albo zostało już przypisane";
        setIsValidatingAssign(false);
      }
    })
  }

  const sendMail = () => {
    auth().currentUser.sendEmailVerification();
  }

  const renderFormInputs = () => {
    return getFormInputs().map((res) => {
      if (res.type !== "submit")
        return <React.Fragment key={res.name}>
          <Input
            {...res}
            onChange={handleChange}
            value={values[res.name]}
            className={isSubmitting ? errors[res.name] ? "input--invalid" : "input--valid" : null}
          />
          {errors[res.name] && <p className={"feedback feedback--invalid"}>{errors[res.name]}</p>}
        </React.Fragment>
      else
        return <React.Fragment key={res.name}>
          <Input {...res} />
        </React.Fragment>
    })
  }

  const { handleChange, handleSubmit, values, errors, isSubmitting } = useForm(assignOrder, getFormInputs());
  return (
    <React.Fragment>
      <Card>
        {firebaseUser.emailVerified ?
          orderAssigned ? <p>Przypisano poprawnie zlecenie</p> :
            <form onSubmit={handleSubmit}>
              {
                isValidatingAssign ? <Spinner /> :
                  renderFormInputs()
              }
            </form> :
          <React.Fragment>
            Wyślij email weryfikacyjny, aby aktywować konto.
            <Input type="button" className="btn btn--light" onClick={sendMail} value="Wyślij" />
          </React.Fragment>
        }

      </Card>
    </React.Fragment>
  )
}

export default AssignOrder;