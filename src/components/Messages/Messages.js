import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { database } from 'firebase';

import Card from '../UI/Card/Card'
import Input from '../UI/Input/Input';
import useForm from '../../hooks/useForm/useForm';
import Spinner from '../UI/Spinner/Spinner';

import './Messages.css';

const Messages = ({ history, ...props }) => {
  const { data, firebaseUser } = useSelector(state => state.authenticationReducer);

  const [newMessage, setNewMessage] = useState("");
  const [contactItem, setContactItem] = useState();

  const [loadingMessages, setLoadingMessages] = useState(false);
  const [orderMessages, setOrderMessages] = useState();
  const [orderUniqueID, setOrderUniqueID] = useState(history.location.state ? history.location.state.orderUID : null);
  const [orderID, setOrderID] = useState(history.location.state ? history.location.state.orderID : null);

  useEffect(() => {
    database().ref('latestMessage/').on("value", (snapshot) => {
      if (snapshot && snapshot.val()) {
        const data = snapshot.val();

        const keyOfHistory = Object.keys(data);
        const historyLength = keyOfHistory.length;

        const test = keyOfHistory.map((orderMessageUID, i) => {
          return <div className="message__item" key={orderMessageUID} onClick={() => { setOrderID(data[orderMessageUID].orderID); setOrderUniqueID(orderMessageUID); }}>
            <div className="message__image">
              <img src="https://www.adminmart.com/src/assets/images/users/1.jpg" className="image-cirlce" alt="" />
            </div>
            <div className="message__item__details">
              <div className="message__sender">
                {data[orderMessageUID].Author}
              </div>
              <div className="message__orderdID">
                {data[orderMessageUID].orderID}
              </div>
              <div className="message__time">
                <time>{data[orderMessageUID].Message.substr(0, 20)}{data[orderMessageUID].Message.length > 19 ? "..." : ""}</time>
              </div>
            </div>
          </div>
        })
        setContactItem(test.reverse());
      } else {
        setContactItem(<p style={{ textAlign: "center", padding: "20px" }}>Utwórz rozmowe, aby dodać ją do listy</p>)
      }
    })
  }, [])

  useEffect(() => {
    setLoadingMessages(true);
    database().ref('ordersMessage/' + orderUniqueID).orderByChild('DateTime').on("value", (snapshot) => {

      if (snapshot && snapshot.val()) {
        const data = snapshot.val();

        const keyOfHistory = Object.keys(data);
        const historyLength = keyOfHistory.length;

        setOrderMessages(keyOfHistory.map((messageUID, i) => {
          if (firebaseUser.uid === data[messageUID].From) {
            return (
              <div className="message__item sender-me" key={messageUID}>
                <div className="message__item__details">
                  <div className="message__subject">
                    {data[messageUID].Message}
                  </div>
                  <div className="message__time">
                    <time>{data[messageUID].DateTime}</time>
                  </div>
                </div>
              </div>
            )
          } else {
            return (
              <div className="message__item" key={messageUID}>
                <div className="message__image">
                  <img src="https://www.adminmart.com/src/assets/images/users/1.jpg" className="image-cirlce" alt="" />
                </div>
                <div className="message__item__details">
                  <div className="message__sender">
                    {data[messageUID].Author}
                  </div>
                  <div className="message__subject">
                    {data[messageUID].Message}
                  </div>
                  <div className="message__time">
                    <time>{data[messageUID].DateTime}</time>
                  </div>
                </div>
              </div>
            )
          }

        }))
        // setLoadingMessages(false);
      } else {
        console.error(snapshot);
        // setLoadingMessages(false);
      }
    })
  }, [orderUniqueID])


  const addMessage = () => {
    if (orderUniqueID !== null) {
      const ordersMessageRef = database().ref('ordersMessage/' + orderUniqueID).push();
      const MessageUniqueID = ordersMessageRef.key;

      const latestMessageRef = database().ref('latestMessage/' + orderUniqueID);

      const today = new Date();
      const date = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate();
      const time = today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();
      const dateTime = date + '' + time;

      const ordersMessageData = {
        "Message": newMessage,
        "From": firebaseUser.uid,
        "Author": data.name,
        "DateTime": dateTime,
      }

      const latestMessageData = {
        "Message": newMessage,
        "From": firebaseUser.uid,
        "Author": data.name,
        "DateTime": dateTime,
        "orderID": orderID
      }

      ordersMessageRef.set(ordersMessageData)
        .catch(error => console.error(error))
        .finally(setNewMessage(""));

      latestMessageRef.set(latestMessageData)
        .catch(error => console.error(error));
    }
  }



  return (
    <React.Fragment>
      <a href="tel:+48600153737" >Zadzwoń!</a>
      <Card style={{ paddingBottom: "0" }}>
        {/* <h5 onClick={() => history.push({ pathname: `/dashboard/`})}>Utwórz nową wiadomość</h5> */}
        <h2>Wiadomości</h2>
        <div className="messages__box">
          <div className="contact__box">
            {contactItem}
          </div>

          <div className="chat__box">
            {orderID !== null ? <p style={{ textAlign: "center" }}>Zlecenie {orderID}</p> : null}
            {orderMessages}
            {orderID !== null ? <div className="createNewMessage">
              <Input type="text" placeholder="Napisz wiadomość" id="newMessage" value={newMessage} onChange={(e) => { setNewMessage(e.target.value) }} />
              <div id="sendMessage" onClick={addMessage}>
                <i class="fas fa-paper-plane"></i>
              </div>
            </div> : null}


          </div>
        </div>
      </Card>
    </React.Fragment >
  )
}

export default Messages;