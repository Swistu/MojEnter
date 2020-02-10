import React, { useEffect, useState } from 'react'
import { database } from 'firebase';

import Card from '../../UI/Card/Card';
import Spinner from '../../UI/Spinner/Spinner';
import Input from '../../UI/Input/Input';

const ShowOrders = (props) => {
  const { history } = props;

  const [listOfOrders, setListOfOrders] = useState(null);

  useEffect(() => {
    database().ref("orders").on("value", (snapshot) => {
      if (snapshot && snapshot.val()) {

        const data = snapshot.val();
        const listOfOrdersUID = Object.keys(data);
        let i = 1;
        setListOfOrders(listOfOrdersUID.map(order => <tr key={order} onClick={() => redirectToOrder(order)} className="link">
          <td>{i++}</td>
          <td>{data[order].orderID}</td>
          <td>{data[order].client}</td>
          <td>{data[order].telNumber}</td>
          <td>{data[order].deviceName}</td>
          <td>{data[order].cost}zł</td>
          <td>{data[order].endDate}</td>
        </tr>))
      } else {
        console.error("Brak danych pod danym endpoint'em");
        setListOfOrders(<h2>Brak danych</h2>)
      }
    })
  }, [])

  const redirectToOrder = (order) => {
    history.push({ pathname: `/dashboard/show-order`, state: { "orderUID": order } });
  }
  return (
    <React.Fragment>
      {/* <h1 className="page__title">Zlecenia</h1> */}
      <div style={{display: "flex", flexDirection: "column"}}>
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