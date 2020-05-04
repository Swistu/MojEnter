import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { database } from 'firebase';

import Card from '../../components/UI/Card/Card';
import Spinner from '../../components/UI/Spinner/Spinner';
import Input from '../../components/UI/Input/Input';

import './ShowOrders.css';

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
                  <td label="ID"><span>{i++}</span></td>
                  <td label="Zlecenie"><span>{data[order].orderID}</span></td>
                  <td label="Klient"><span>{data[order].client} serklmgs selrkgmslekr  gsergsergsergsergserg sergserg</span></td>
                  <td label="Telefon"><span>{data[order].telNumber}</span></td>
                  <td label="Urządzenie"><span>{data[order].deviceName}</span></td>
                  <td label="Koszt"><span>{data[order].cost}zł</span></td>
                  <td label="Termin zakończenia"><span>{data[order].endDate}</span></td>
                </tr>
              else
                return null
            })
          }))
        } else {
          setListOfOrders(listOfOrdersUID.map((order, i) => <tr key={order} onClick={() => redirectToOrder(order)} className="link">
            <td label="ID"><span>{++i}</span></td>
            <td label="Zlecenie"><span>{data[order].orderID}</span></td>
            <td label="Klient"><span>{data[order].client}</span></td>
            <td label="Telefon"><span>{data[order].telNumber}</span></td>
            <td label="Urządzenie"><span>{data[order].deviceName}</span></td>
            <td label="Koszt"><span>{data[order].cost}zł</span></td>
            <td label="Termin zakończenia"><span>{data[order].endDate}</span></td>
          </tr>
          ))
        }
      } else {
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
        {listOfOrders ?
          <table className="table table-responsive" id="allOrders">
            <thead>
              <tr>
                <th>ID</th>
                <th>Zlecenie</th>
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
          : <Spinner />}
      </Card>
    </React.Fragment>
  );
}

export default ShowOrders;