import React, { useState } from 'react';
import { database, auth } from 'firebase';

import Card from '../../UI/Card/Card';
import Input from '../../UI/Input/Input';
import Spinner from '../../UI/Spinner/Spinner';
import useForm from '../../../hooks/useForm/useForm';

const AssignOrder = () => {
  let itemsToCheck;
  const [isValidatingAssign, setIsValidatingAssign] = useState(false);

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

            console.log(data);
            //Change userType to user
            promises.push(
              userRef.update({
                "accountType": "User",
              })
                .catch(error => {
                  console.error(error)
                })
                .then(console.log("Zmieniono annonymous => user")));




            // Assign new order to account
            promises.push(

              userOrders.push({
                "orderUniqueID": data.orderUniqueID
              })
                .then(res => {
                  console.log("Dodano zamowienie do usera")
                })
                .catch(error => {
                  console.error(error)
                  console.log(data);
                })
            );

            Promise.all(promises).then((res) => {
              // Delete from unnasigned form
              unassignedOrdersRef.remove();
              console.log("usunieto stary wpis");
              setIsValidatingAssign(false);
            });

          } else {
            errors.unassignedorderUniqueID = "Zlecenie o podanym numerze nie istnieje";
            setIsValidatingAssign(false);
          }
        })


    } // checkUser
  } // assignOrderHandler()



  return (
    <React.Fragment>
      <h1 className="page__title">Przypisz zlecenie</h1>
      <Card>
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
                    {Object.entries(errors).length === 0 && errors.constructor === Object ? null : <p className={"feedback feedback--invalid"}>{"Proszę poprawić błędy w formularzu"}</p>}
                  </React.Fragment>
              })
          }
        </form>
      </Card>
    </React.Fragment>
  )
}

export default AssignOrder;