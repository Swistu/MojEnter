import React, { useState } from 'react';
import { database, auth } from 'firebase';

import Card from '../../UI/Card/Card';
import Input from '../../UI/Input/Input';
import Spinner from '../../UI/Spinner/Spinner';
import useForm from '../../../hooks/useForm/useForm';
import { useSelector } from 'react-redux';

const AssignOrder = () => {
  let itemsToCheck;
  const [isValidatingAssign, setIsValidatingAssign] = useState(false);
  const { firebaseUser } = useSelector(state => state.authenticationReducer);
  const renderInputs = {
    payLoad: [
      {
        "type": "text",
        "descName": "Numer zlecenia:",
        "placeholder": "Wprowadź numer zlecenia",
        "name": "unassignedorderUniqueID",
      },
      {
        "type": "submit",
        "name": "sendForm",
        "value": "Przypisz zlecenie",
        "className": "btn btn--light"
      },
    ]
  };

  renderInputs.payLoad.map(res => {
    itemsToCheck = {
      ...itemsToCheck,
      [res.name]: res.value ? res.value : ""
    }
  });

  const { handleChange, handleSubmit, values, errors, isSubmitting } = useForm(assignOrder, itemsToCheck);


  function assignOrder() {
    setIsValidatingAssign(true);

    var user = auth().currentUser;

    // Logged User
    if (user) {
      let promises = [];

      const unassignedOrdersRef = database().ref('unassignedOrders/' + values.unassignedorderUniqueID);
      const userRef = database().ref('users/' + user.uid);
      const userOrders = database().ref('users/' + user.uid + '/orders');

      unassignedOrdersRef.once("value")
        .then(snapshot => {
          // Vaild orderUID
          if (snapshot.exists() && snapshot.val() !== null) {
            const data = snapshot.val();

            //Change userType to user
            promises.push(
              userRef.update({
                "accountType": "User",
              })
            );
            // Assign new order to account
            promises.push(
              userOrders.push({
                "orderUniqueID": data.orderUniqueID
              })
            );

            // Delete from unnasigned form when others done
            Promise.all(promises).then((res) => {
              unassignedOrdersRef.remove();
              console.log("usunieto stary wpis");
              setIsValidatingAssign(false);
            });

          } else {
            errors.unassignedorderUniqueID = "Zlecenie o podanym numerze nie istnieje albo zostało już przypisane";
            setIsValidatingAssign(false);
          }
        })


    } // checkUser
  } // assignOrderHandler()

  console.log(firebaseUser);

  const sendMail = () => {
    auth().currentUser.sendEmailVerification();
  }

  return (
    <React.Fragment>
      <Card>
        {firebaseUser.emailVerified ?
          <form onSubmit={handleSubmit}>
            {
              isValidatingAssign ? <Spinner /> :
                renderInputs.payLoad.map((res) => {
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