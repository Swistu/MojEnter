import React, { useEffect, useState } from 'react';
import firebase from 'firebase';

import Card from '../../UI/Card/Card';
import Spinner from '../../UI/Spinner/Spinner';
import './ShowOrder.css';
import Input from '../../UI/Input/Input';

const ShowOrder = (props) => {
  const { history } = props;
  let orderUniqueID;

  if (!history.location.state)
    history.push({ pathname: `/dashboard/show-orders` });
  else
    orderUniqueID = history.location.state.orderUID;

  const [currentOrder, setCurrentOrder] = useState(null);
  const database = firebase.database();

  useEffect(() => {
    console.log(database.ref("orders/" + orderUniqueID).once("value"));
    database.ref("orders/" + orderUniqueID).once("value", (snapshot) => {
      if (snapshot && snapshot.val()) {
        const data = snapshot.val();

        console.log(data);

        setCurrentOrder(data);
      } else {
        console.error(snapshot);
      }
    })
  }, [orderUniqueID])


  return (
    <React.Fragment>
      <Card>

        {currentOrder ? <React.Fragment>

          <div className="order__summary">
            <h2 className="card__title">Zlecenie: {currentOrder.orderID}</h2>
            <section className="info__box">
              <p className="info__title">Dane klienta:</p>
              <p>Klient: {currentOrder.client}</p>
              <p>Telefon: {currentOrder.telNumber}</p>
            </section>
            <section className="info__box">
              <p className="info__title">Sprzęt:</p>
              <p>Wyposażenie: {currentOrder.accessory}</p>
              <p>Nazwa urządzenia: {currentOrder.deviceName}</p>
              <p>Numer seryjny: {currentOrder.deviceSerialNumber}</p>
            </section>
            <section className="info__box">
              <p className="info__title">Serwis:</p>
              <p>Zlecenie: {currentOrder.commission}</p>
              <p>Uwagi klienta: {currentOrder.customerComment}</p>
              <p>Uwagi przyjmującego: {currentOrder.vendorComment}</p>
              <p>Planowany termin końcowy: {currentOrder.endDate}</p>
              <p>Koszt: {currentOrder.cost}</p>
            </section>
            <Input type="submit" className="btn btn--light" value="Aktualizuj zlecenie" />
          </div>
        </React.Fragment> : <Spinner />}
      </Card>
      <Card>
        <h2 className="card__title">Historia zlecenia</h2>
        <div className="tab__nav">
          <ul>
            <li>2020-02-01 12:23:11</li>
            <li>2020-02-01 12:23:11</li>
            <li>2020-02-01 12:23:11</li>
          </ul>
        </div>
      </Card>
      <Card>
        <h2 className="card__title">Kontakt</h2>
        <section className="info__box">
          <p className="info__title">Serwis:</p>
          <p>Telefon: 532-234-634</p>
          <p>Email: serwis@enter.pl</p>
        </section>
        <section className="info__box">
          <p className="info__title">Handel:</p>
          <p>Telefon: 634-233-122</p>
          <p>Email: handel@enter.pl</p>
        </section>
      </Card>
    </React.Fragment>
  );
}

export default ShowOrder;