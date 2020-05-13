import React, { useEffect, useState, useRef } from 'react'
import { database, auth } from 'firebase';
import { useHistory } from 'react-router';

import { checkAccounType } from '../../utility/checkAccountType';
import { getUserData } from '../../utility/getUserData';

import Card from '../../components/UI/Card/Card';
import Spinner from '../../components/UI/Spinner/Spinner';
import Input from '../../components/UI/Input/Input';

import './ShowOrders.css';

const ShowOrders = () => {
  const history = useHistory();

  const [listOfOrders, setListOfOrders] = useState(null);
  const [accountType, setAccountType] = useState(null);
  const [userData, setUserData] = useState(null)
  const [userOrders, setUserOrders] = useState(null)
  const orderCounter = useRef(1);

  useEffect(() => {
    const getAsyncData = async () => {
      const accountTypeResponse = await checkAccounType();
      const userDataResponse = await getUserData();

      setAccountType(accountTypeResponse);
      setUserData(userDataResponse);
    }

    getAsyncData();
  }, [])

  useEffect(() => {
    const getUserOrders = () => {
      setUserOrders(Object.keys(userData.orders))
    }

    if (userData && accountType === "user")
      getUserOrders();
  }, [userData, accountType])


  useEffect(() => {
    const getOrderData = (orderUID) => {
      database().ref("orders/" + orderUID).once("value", (snapshot) => {
        if (snapshot && snapshot.val()) {
          const data = snapshot.val();
          setListOfOrders(prev => {
            return <React.Fragment>
              {prev}
              <tr key={orderUID} onClick={() => redirectToOrder(orderUID)} className="link">
                <td label="ID"><span>{orderCounter.current}</span></td>
                <td label="Zlecenie"><span>{data.orderID}</span></td>
                <td label="Klient"><span>{data.client}</span></td>
                <td label="Telefon"><span>{data.telNumber}</span></td>
                <td label="Urządzenie"><span>{data.deviceName}</span></td>
                <td label="Koszt"><span>{data.cost}zł</span></td>
                <td label="Termin zakończenia"><span>{data.endDate}</span></td>
              </tr>
            </React.Fragment>
          });

          orderCounter.current = orderCounter.current + 1;
        }
      })
    }

    if (accountType && (userOrders || (accountType === "worker" || accountType === "admin"))) {
      if (accountType === "worker" || accountType === "admin") {
        database().ref("orders/").once("value", (snapshot) => {
          if (snapshot && snapshot.val()) {
            const data = snapshot.val();
            const listOfOrdersUID = Object.keys(data);

            setListOfOrders(listOfOrdersUID.map((orderUID, i) => <tr key={orderUID} onClick={() => redirectToOrder(orderUID)} className="link">
              <td label="ID"><span>{++i}</span></td>
              <td label="Zlecenie"><span>{data[orderUID].orderID}</span></td>
              <td label="Klient"><span>{data[orderUID].client}</span></td>
              <td label="Telefon"><span>{data[orderUID].telNumber}</span></td>
              <td label="Urządzenie"><span>{data[orderUID].deviceName}</span></td>
              <td label="Koszt"><span>{data[orderUID].cost}zł</span></td>
              <td label="Termin zakończenia"><span>{data[orderUID].endDate}</span></td>
            </tr>
            ));
          } else
            setListOfOrders(<h1>Brak danych w bazie</h1>);
        })
      } else {
        getOrderData();

        for (let i = 0; i < userOrders.length; i++) {
          getOrderData(userOrders[i]);
        }
      }
    }

    const redirectToOrder = (order) => {
      history.push({ pathname: `/dashboard/zlecenie`, state: { "orderUID": order } });
    }
  }, [accountType, userOrders, history])

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