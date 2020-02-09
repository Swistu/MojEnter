import React, { useEffect, useState } from 'react'
import firebase from 'firebase';

import Card from '../../UI/Card/Card';
import Spinner from '../../UI/Spinner/Spinner';

const ShowOrders = () => {

  const [listOfOrders, setListOfOrders] = useState(null);

  const database = firebase.database();

  useEffect(() => {
    database.ref("orders").on("value", (snapshot) => {
      if (snapshot && snapshot.val()) {

        const data = snapshot.val();
        const listOfOrdersUID = Object.keys(data);
        let i = 1;
        setListOfOrders(listOfOrdersUID.map(order => <tr key={order}>
          <td>{i++}</td>
          <td>{data[order].orderID}</td>
          <td>{data[order].deviceName}</td>
          <td>{data[order].cost}zł</td>
          <td>{data[order].endDate}</td>
        </tr>))


      } else {
        console.error("Brak danych pod danym endpoint'em");
        setListOfOrders(<h2>Nie można pobrać danych</h2>)
      }
    })
  }, [])
  return (
    <React.Fragment>
      <h1 className="page__title">Zlecenia</h1>
      <Card>


        {listOfOrders ? <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Zlecenie nr.</th>
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