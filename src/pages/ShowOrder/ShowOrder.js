import React, { useEffect, useState } from 'react';
import { database } from 'firebase';
import { useDispatch, useSelector } from 'react-redux';

import { modal } from '../../store/actions';
import { SHOW } from '../../store/actionTypes'

import AddNote from '../../components/Admin/AddNote/AddNote';
import UpdateOrder from '../../components/Admin//UpdateOrder/UpdateOrder';
import Card from '../../components/UI/Card/Card';
import Spinner from '../../components/UI/Spinner/Spinner';
import Input from '../../components/UI/Input/Input';

import './ShowOrder.css';

const ShowOrder = ({ history }) => {
  const dispatch = useDispatch();
  const { realtimeDatabaseUser } = useSelector(state => state.authenticationReducer)

  const [orderUID, setOrderUID] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderMemo, setOrderMemo] = useState(null);
  const [historyList, setHistoryList] = useState(null);
  const [historyDescription, setHistoryDescription] = useState(null);

  const [lodaingMemo, setLoadingMemo] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (!history.location.state)
      history.push({ pathname: `/dashboard/show-orders` });
    else
      setOrderUID(history.location.state.orderUID);
  }, [history, orderUID])

  const statusTypeHandler = (status) => {
    switch (status) {
      case "new":
        return "Przyjęte";
      case "inProgress":
        return "W trakcie";
      case "waiting":
        return "Oczekiwanie";
      case "ready":
        return "Do odbioru";
      case "done":
        return "Zrealizowane";
      default:
        return null;
    }
  }

  useEffect(() => {
    if (orderUID !== null) {
      database().ref("orders/" + orderUID).once("value", (snapshot) => {
        if (snapshot && snapshot.val()) {
          const data = snapshot.val();
          setCurrentOrder(data);
        } else console.error(snapshot);

      })

      setLoadingHistory(true);
      database().ref("ordersHistory/" + orderUID).on("value", (snapshot) => {
        if (snapshot && snapshot.val()) {
          const data = snapshot.val();
          const keyOfHistory = Object.keys(data);
          const historyLength = keyOfHistory.length;

          setHistoryList(keyOfHistory.map((orderUID, i) => {
            return <li onClick={() => changeHistoryDetails(orderUID)} id={"s" + orderUID} className={`tabs__item ${i + 1 === historyLength ? "active" : null}`} key={"s" + orderUID}>{data[orderUID].date} | {statusTypeHandler(data[orderUID].status)}</li>
          }))
          setHistoryDescription(keyOfHistory.map((orderUID, i) => {
            return <div onClick={() => changeHistoryDetails(orderUID)} id={"d" + orderUID} className={`tabs__pane ${i + 1 === historyLength ? "active" : null}`} key={"d" + orderUID} dangerouslySetInnerHTML={{ __html: data[orderUID].description }} />
          }))
          setLoadingHistory(false);
        } else {
          console.error(snapshot);
          setLoadingHistory(false);
        }
      })

      if (realtimeDatabaseUser.accountType === "Admin") {
        setLoadingMemo(true);
        database().ref("ordersMemo/" + orderUID).on("value", (snapshot) => {
          if (snapshot && snapshot.val()) {
            const data = snapshot.val();
            setOrderMemo(data);
            setLoadingMemo(false);
          } else {
            console.error(snapshot);
            setLoadingMemo(false);
          }
        })
      }
    }
  }, [orderUID, realtimeDatabaseUser])

  const modalHandler = (title, component) => {
    dispatch(modal(SHOW, title, component));
  }

  const changeHistoryDetails = (id) => {
    document.querySelector(".tabs__pane.active").classList.remove("active");
    document.querySelector(".tabs__item.active").classList.remove("active");
    document.getElementById("s" + id).classList.add("active");
    document.getElementById("d" + id).classList.add("active");
  }

  return (
    <React.Fragment>
      <Card>
        {currentOrder ? <React.Fragment>
          <p style={{ float: "right", fontWeight: "Bold", marginBottom: "15px" }} onClick={() => history.push({ pathname: `/dashboard/wiadomosci`, state: { "orderUID": orderUID } })}>Napisz wiadomość</p>
          <div style={{ clear: "both" }} />
          <div className="order__summary">
            <h2 className="card__title">Zlecenie: {currentOrder.orderID}</h2>
            <section className="info__box">
              <p className="info__title">Dane klienta:</p>
              <p>Klient: {currentOrder.client}</p>
              <p>Telefon: {currentOrder.telNumber}</p>
              <p>Adres: {currentOrder.address}</p>
            </section>
            <section className="info__box">
              <p className="info__title">Sprzęt:</p>
              <p>Wyposażenie: {currentOrder.accessory}</p>
              <p>Nazwa urządzenia: {currentOrder.deviceName}</p>
              <p>Numer seryjny: {currentOrder.deviceSerialNumber}</p>
            </section>
            <section className="info__box">
              <p className="info__title">Informacje:</p>
              <p>Uwagi klienta: {currentOrder.customerComment}</p>
              <p>Uwagi przyjmującego: {currentOrder.vendorComment}</p>
              <p>Planowany termin końcowy: {currentOrder.endDate}</p>
            </section>
            <section className="info__box">
              <p className="info__title">Serwis:</p>
              <p>Zlecenie: {currentOrder.commission}</p>
              <p>Koszt: {currentOrder.cost}zł</p>
            </section>

            {realtimeDatabaseUser.accountType === "Admin" ?
              <React.Fragment>
                <Input type="submit" className="btn btn--light" value="Aktualizuj zlecenie" onClick={() => modalHandler("Aktualizuj zlecenie", <UpdateOrder orderUID={orderUID} />)} />
                <Input type="submit" className="btn btn--warning" value="Dodaj notatke" onClick={() => modalHandler("Dodaj notke", <AddNote orderUID={orderUID} />)} />
              </React.Fragment> : null}
          </div>
        </React.Fragment> : <Spinner />}
      </Card>

      {realtimeDatabaseUser.accountType === "Admin" ?
        <Card>
          <h2 className="card__title">Notatka dla wydającego</h2>
          {lodaingMemo ? <Spinner /> : orderMemo ? <div className="initialStyles" dangerouslySetInnerHTML={{ __html: orderMemo }} /> : "Brak notatki"}
        </Card> : null}

      <Card>
        <h2 className="card__title">Historia zlecenia</h2>
        {loadingHistory ? <Spinner /> :
          <React.Fragment>
            <div className="tabs">
              <ul className="tabs__nav">
                {historyList}
              </ul>
              <div className="tabs__content">
                {historyDescription}
              </div>
            </div>
          </React.Fragment>
        }
      </Card>
      <Card>
        <h2 className="card__title">Objaśnienia statusów</h2>
        <section className="info__box">
          <p className="info__title">Przyjęte:</p>
          <p>Zlecenie zostało przyjęte i czeka na rozpoczęcia realizacji przez serwis.</p>
        </section>
        <section className="info__box">
          <p className="info__title">W trakcie:</p>
          <p>Zlecenie jest realizowane.</p>
        </section>
        <section className="info__box">
          <p className="info__title">Oczekiwanie:</p>
          <p>Realizacja zlecenia została chwilowo wstrzymana z powodu braku dostępnych cześci.</p>
        </section>
        <section className="info__box">
          <p className="info__title">Do odbioru:</p>
          <p>Zlecenie zostało zrealizowane i czeka na odbiór.</p>
        </section>
        <section className="info__box">
          <p className="info__title">Zrealizowane:</p>
          <p>Zlecenie zostało odeberane.</p>
        </section>
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