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

  const [ordersData, setOrdersData] = useState([]);
  const [listOfOrders, setListOfOrders] = useState(null);
  const [accountType, setAccountType] = useState(null);
  const [userData, setUserData] = useState(null)
  const [userOrders, setUserOrders] = useState(null)
  const [sortHelper, setSortHelper] = useState(false);

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

    if (userData && userData.orders && accountType === "user")
      getUserOrders();
  }, [userData, accountType])


  useEffect(() => {
    const getOrderData = (orderUID) => {
      database().ref("orders/" + orderUID).once("value")
        .then(snapshot => {
          if (snapshot && snapshot.val()) {
            const data = snapshot.val();
            const obj = {
              ...data,
              "orderUID": orderUID
            }
            setOrdersData(prev => [...prev, obj]);
          }
        })
    }

    if (accountType) {
      if (accountType !== "user") {
        database().ref("orders/").once("value")
          .then(snapshot => {
            if (snapshot && snapshot.val()) {
              const data = snapshot.val();
              const listOfOrdersUID = Object.keys(data);

              listOfOrdersUID.forEach(element => {
                const obj = {
                  ...data[element],
                  "orderUID": element
                }
                setOrdersData(prev => [...prev, obj]);
              });
            }
          })
      } else {
        if (userOrders)
          for (let i = 0; i < userOrders.length; i++) {
            getOrderData(userOrders[i]);
          }
      }
    }
  }, [accountType, userOrders, history])

  useEffect(() => {
    const renderTable = () => {
      const obj = ordersData.map((item, i) => {
        return <tr key={item.orderUID} onClick={() => redirectToOrder(item.orderUID)} className="link">
          <td label="ID"><span>{++i}</span></td>
          <td label="Zlecenie"><span>{item.orderID}</span></td>
          <td label="Klient"><span>{item.client}</span></td>
          <td label="Telefon"><span>{item.telNumber}</span></td>
          <td label="Urządzenie"><span>{item.deviceName}</span></td>
          <td label="Koszt"><span>{item.cost}zł</span></td>
          <td label="Termin zakończenia"><span>{item.endDate}</span></td>
        </tr>
      })

      setListOfOrders(obj)
    }

    if (ordersData) {
      renderTable();
    }
  }, [ordersData])


  const sortTable = (propName) => {
    function GetSortOrder(prop) {
      return function (a, b) {
        if (a[prop] > b[prop]) {
          return 1;
        } else if (a[prop] < b[prop]) {
          return -1;
        }
        return 0;
      }
    }

    ordersData.sort(GetSortOrder(propName));

    if (sortHelper)
      ordersData.reverse();

    const obj = ordersData.map((item, i) => {
      return <tr key={item.orderUID} onClick={() => redirectToOrder(item.orderUID)} className="link">
        <td label="ID"><span>{++i}</span></td>
        <td label="Zlecenie"><span>{item.orderID}</span></td>
        <td label="Klient"><span>{item.client}</span></td>
        <td label="Telefon"><span>{item.telNumber}</span></td>
        <td label="Urządzenie"><span>{item.deviceName}</span></td>
        <td label="Koszt"><span>{item.cost}zł</span></td>
        <td label="Termin zakończenia"><span>{item.endDate}</span></td>
      </tr>
    })

    setListOfOrders(obj)
    setSortHelper(prev => !prev)
  }

  const redirectToOrder = (order) => {
    history.push({ pathname: `/dashboard/zlecenie`, state: { "orderUID": order } });
  }

  return (
    <React.Fragment>
      <Card>
        {listOfOrders ?
          <React.Fragment>
            <Input type="button" className="btn btn--light " value="Wszystkie Zlecenia" />
            <Input type="button" className="btn btn--warning " value="Zlecenia w trakcie" />
            <Input type="button" className="btn btn--success " value="Zrealizowane Zlecenia" />
            <table className="table table-responsive" id="allOrders">
              <thead>
                <tr>
                  <th>ID</th>
                  <th onClick={() => { sortTable("orderUID") }}>Zlecenie</th>
                  <th onClick={() => { sortTable("client") }}>Klient</th>
                  <th onClick={() => { sortTable("telNumber") }}>Telefon</th>
                  <th onClick={() => { sortTable("deviceName") }}>Urządzenie</th>
                  <th onClick={() => { sortTable("cost") }}>Koszt</th>
                  <th onClick={() => { sortTable("endDate") }}>Termin zakończenia</th>
                </tr>
              </thead>
              <tbody>
                {listOfOrders}
              </tbody>
            </table>
          </React.Fragment>
          : <Spinner />}
      </Card>
    </React.Fragment>
  );
}

export default ShowOrders;