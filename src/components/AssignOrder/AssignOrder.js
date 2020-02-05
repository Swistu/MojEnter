import React, { useState } from 'react';
import firebase from 'firebase';

import Card from '../UI/Card/Card';
import Input from '../UI/Input/Input';
import Spinner from '../UI/Spinner/Spinner';

const AssignOrder = () => {

  const [isValidatingAssign, setIsValidatingAssign] = useState(false);
  const [unassignedorderUniqueID, setUnassignedOrderUniqueID] = useState("");


  const assignOrderHandler = (e) => {
    e.preventDefault();
    setIsValidatingAssign(true);

    var user = firebase.auth().currentUser;

    // Logged User
    if (user) {
      let promises = [];

      const unassignedOrdersRef = firebase.database().ref('unassignedOrders/' + unassignedorderUniqueID);
      const userRef = firebase.database().ref('users/' + user.uid);
      const userOrders = firebase.database().ref('users/' + user.uid + '/orders');

      unassignedOrdersRef.once("value")
        .then(snapshot => {
          // Vaild orderUID
          if (snapshot.exists && snapshot.val() !== null) {
            const data = snapshot.val();

            //Change userType to user
            promises.push(
              userRef.update({
                "accountType": "User",
                "client": data.clientUniqueID
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
                })
            );

            Promise.all(promises).then((res) => {
              // Delete from unnasigned form
              unassignedOrdersRef.remove();
              console.log("usunieto stary wpis");
              setIsValidatingAssign(false);
            });

          } else {
            console.error("Record not exist");
            setIsValidatingAssign(false);
          }
        })


    } // checkUser
  } // assignOrderHandler()

  return (
    <Card>
      <form onSubmit={e => assignOrderHandler(e)}>
        {isValidatingAssign ? <Spinner /> :
          <React.Fragment>
            <Input descName="Identyfikator zlecenia" type="text" placeholder="Wprowadź identyfikator" name="orderUID" onChange={(e) => setUnassignedOrderUniqueID(e.target.value)} />
            <Input type="submit" value="Przypisz zlecenie" />
          </React.Fragment>
        }
      </form>
    </Card>
  )
}

export default AssignOrder;