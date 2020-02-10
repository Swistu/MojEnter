import React, { useEffect, useState } from 'react'
import { database, auth } from 'firebase';

import Card from '../../UI/Card/Card';
import Spinner from '../../UI/Spinner/Spinner';
import Input from '../../UI/Input/Input';

const ShowOrders = (props) => {
  const { history } = props;

  const [listOfOrders, setListOfOrders] = useState(null);
  const [userOrdersUID, setUserOrdersUID] = useState(null);

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      database().ref("/users/" + user.uid + "/orders").on("value", (snapshot) => {
        const data = snapshot.val()

        const orderContainer = Object.keys(data);
        const ordersUID = orderContainer.map((UID) => {
          return data[UID].orderUniqueID;
        });

        setUserOrdersUID(ordersUID);
      });
    }
  }, [])

  useEffect(() => {
    if (userOrdersUID) {
      var promises = userOrdersUID.map(function (key) {
        return database().ref("/orders/").child(key).once("value");
      });

      Promise.all(promises).then(function (snapshots) {
        setListOfOrders(snapshots.map((snapshot, i = 0) => {
          const data = snapshot.val();
          return <tr key={snapshot.key} onClick={() => redirectToOrder(snapshot.key)} className="link">
            <td>{++i}</td>
            <td>{data.orderID}</td>
            <td>{data.client}</td>
            <td>{data.telNumber}</td>
            <td>{data.deviceName}</td>
            <td>{data.cost}zł</td>
            <td>{data.endDate}</td>
          </tr>
        }));
      });
    }
  }, [userOrdersUID])

  const redirectToOrder = (order) => {
    history.push({ pathname: `/dashboard/show-order`, state: { "orderUID": order } });
  }
  return (
    <React.Fragment>
      {/* <h1 className="page__title">Zlecenia</h1> */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Input type="button" className="btn btn--light " value="Wszystkie Zlecenia" />
        <Input type="button" className="btn btn--warning " value="Zlecenia w trakcie" />
        <Input type="button" className="btn btn--success " value="Zrealizowane Zlecenia" />
        {/* <Input type="button" className="btn btn--danger " value="Niezrealizowne zlecenia" /> */}
      </div>
      <Card>

        {listOfOrders ? <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Zlecenie nr.</th>
                <th>Klient</th>
                <th>Telefon</th>
                <th>Urządzenie</th>
                <th>Koszt</th>
                <th>Termin zakończenia</th>
              </tr>
            </thead>
            <tbody>
              {listOfOrders}
            </tbody>
          </table>
        </div> : <Spinner />}
      </Card>
    </React.Fragment>
  );
}

export default ShowOrders;