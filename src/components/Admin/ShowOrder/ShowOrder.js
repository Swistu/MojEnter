import React, { useEffect, useState } from 'react';
import { database } from 'firebase';

import Card from '../../UI/Card/Card';
import Spinner from '../../UI/Spinner/Spinner';
import './ShowOrder.css';
import Input from '../../UI/Input/Input';
import Modal from '../../UI/Modal/Modal';
import AddNote from '../AddNote/AddNote';
import UpdateOrder from '../UpdateOrder/UpdateOrder';

const ShowOrder = (props) => {
  const { history } = props;
  let orderUniqueID;

  if (!history.location.state)
    history.push({ pathname: `/dashboard/show-orders` });
  else
    orderUniqueID = history.location.state.orderUID;

  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const [modalTitle, setModalTitle] = useState(false);
  const [modalContent, setModalContent] = useState(false);

  const [orderMemo, setOrderMemo] = useState(null);
  const [orderHistory, setOrderHistory] = useState(null);
  const [lodaingMemo, setLoadingMemo] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [historyList, setHistoryList] = useState();
  const [historyDescription, setHistoryDescription] = useState();

  const statusTypeHandler = (status) => {

    let statusText;
    switch (status) {
      case "new":
        statusText = "Przyjęte";
        break;
      case "inProgress":
        statusText = "W trakcie";
        break;
      case "waiting":
        statusText = "Oczekiwanie";
        break;
      case "ready":
        statusText = "Do odbioru";
        break;
      case "done":
        statusText = "Zrealizowane";
        break;
      default:
    }

    return statusText;
  }
  useEffect(() => {
    database().ref("orders/" + orderUniqueID).once("value", (snapshot) => {
      if (snapshot && snapshot.val()) {
        const data = snapshot.val();

        setCurrentOrder(data);
      } else {
        console.error(snapshot);
      }
    })

    database().ref("ordersMemo/" + orderUniqueID).on("value", (snapshot) => {
      if (snapshot && snapshot.val()) {
        const data = snapshot.val();

        setOrderMemo(data);
        setLoadingMemo(false);
      } else {
        console.error(snapshot);
        setLoadingMemo(false);
      }
    })

    database().ref("ordersHistory/" + orderUniqueID).on("value", (snapshot) => {
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
        setOrderHistory(data);
        setLoadingHistory(false);
      } else {
        console.error(snapshot);
        setLoadingHistory(false);
      }
    })
  }, [orderUniqueID])

  const modalHandler = (title, content) => {
    setModalTitle(title)
    setModalContent(content)
    setShowModal(prev => !prev);
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
            <Input type="submit" className="btn btn--light" value="Aktualizuj zlecenie" onClick={() => modalHandler("Aktualizuj zlecenie", <UpdateOrder orderUID={orderUniqueID} />)} />
            <Input type="submit" className="btn btn--warning" value="Dodaj notatke" onClick={() => modalHandler("Dodaj notke", <AddNote orderUID={orderUniqueID} />)} />
            {/* <Input type="submit" className="btn btn--danger" value="Zakończ zlecenie" /> */}
          </div>
        </React.Fragment> : <Spinner />}
      </Card>
      <Card>
        <h2 className="card__title">Notatka dla wydającego</h2>
        {lodaingMemo ? <Spinner /> : orderMemo ? <div className="initialStyles" dangerouslySetInnerHTML={{ __html: orderMemo }} /> : "Brak notatki"}
      </Card>
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
      <Modal closeModal={modalHandler} showModal={showModal} title={modalTitle} content={modalContent} />
    </React.Fragment>
  );
}

export default ShowOrder;