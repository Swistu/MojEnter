import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { database } from 'firebase';

import Card from '../../components/UI/Card/Card';
import Spinner from '../../components/UI/Spinner/Spinner';
import Input from '../../components/UI/Input/Input';

const ShowOrders = ({ history }) => {
  const { realtimeDatabaseUser } = useSelector(state => state.authenticationReducer);

  const [listOfOrders, setListOfOrders] = useState(null);


  useEffect(() => {
    database().ref("orders").on("value", (snapshot) => {
      if (snapshot && snapshot.val()) {
        const data = snapshot.val();
        const listOfOrdersUID = Object.keys(data);


        if (realtimeDatabaseUser.accountType !== "Admin") {
          const userOrders = realtimeDatabaseUser.orders;
          const keyOfUserOrders = Object.keys(userOrders);
          let i = 1;
          setListOfOrders(keyOfUserOrders.map(userOrdersUID => {
            return listOfOrdersUID.map((order) => {
              if (order === realtimeDatabaseUser.orders[userOrdersUID].orderUID)
                return <tr key={order} onClick={() => redirectToOrder(order)} className="link">
                  <td>{i++}</td>
                  <td>{data[order].orderID}</td>
                  <td>{data[order].client}</td>
                  <td>{data[order].telNumber}</td>
                  <td>{data[order].deviceName}</td>
                  <td>{data[order].cost}zł</td>
                  <td>{data[order].endDate}</td>
                </tr>
              else
                return null
            })
          }))
        } else {
          setListOfOrders(listOfOrdersUID.map((order, i) => <tr key={order} onClick={() => redirectToOrder(order)} className="link">
            <td>{++i}</td>
            <td>{data[order].orderID}</td>
            <td>{data[order].client}</td>
            <td>{data[order].telNumber}</td>
            <td>{data[order].deviceName}</td>
            <td>{data[order].cost}zł</td>
            <td>{data[order].endDate}</td>
          </tr>
          ))
        }
      } else {
        console.error("Brak danych pod danym endpoint'em");
        setListOfOrders(<React.Fragment><tr></tr><h2>Brak danych</h2></React.Fragment>)
      }
    })

    const redirectToOrder = (order) => {
      history.push({ pathname: `/dashboard/zlecenie`, state: { "orderUID": order } });
    }
  }, [history, realtimeDatabaseUser])

  return (
    <React.Fragment>
      <Card>
        <Input type="button" className="btn btn--light " value="Wszystkie Zlecenia" />
        <Input type="button" className="btn btn--warning " value="Zlecenia w trakcie" />
        <Input type="button" className="btn btn--success " value="Zrealizowane Zlecenia" />
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