import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { database } from 'firebase';

import Card from '../../components/UI/Card/Card'
import Input from '../../components/UI/Input/Input';

import './Messages.css';

const Messages = ({ history }) => {
  const { realtimeDatabaseUser, firebaseUser } = useSelector(state => state.authenticationReducer);

  const [newMessage, setNewMessage] = useState("");
  const [contactItem, setContactItem] = useState();
  const [orderMessages, setOrderMessages] = useState();
  const [orderUID, setOrderUID] = useState(history.location.state ? history.location.state.orderUID : null);
  const [receiverUserUID, setReceiverUserUID] = useState(null);

  useEffect(() => {
    if (realtimeDatabaseUser.accountType === "Admin") {
      database().ref('orders/' + orderUID).once("value", (snapshot) => {
        if (snapshot && snapshot.val()) {
          const data = snapshot.val();
          if (data.userUID)
            setReceiverUserUID(data.userUID);
          else
            setReceiverUserUID(null);
        }
      });
    } else setReceiverUserUID("Admin");
  }, [orderUID, realtimeDatabaseUser])

  useEffect(() => {
    database().ref('latestMessage/').on("value", (snapshot) => {
      if (snapshot && snapshot.val()) {
        const data = snapshot.val();
        const keyOfAllOrders = Object.keys(data);

        if (realtimeDatabaseUser.accountType !== "Admin") {
          const userOrders = realtimeDatabaseUser.orders;
          const keyOfUserOrders = Object.keys(userOrders);
          setContactItem(keyOfUserOrders.map(userOrdersUID =>
            keyOfAllOrders.map(orderMessageUID => {
              if (orderMessageUID === realtimeDatabaseUser.orders[userOrdersUID].orderUID)
                return <div className="message__item" key={orderMessageUID} onClick={() => { setOrderUID(orderMessageUID); }}>
                  <div className="message__image">
                    <img src="https://www.adminmart.com/src/assets/images/users/1.jpg" className="rounded-circle" alt="" />
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
              else
                return null
            })
          ));
        } else {
          setContactItem(keyOfAllOrders.map(orderMessageUID => <div className="message__item" key={orderMessageUID} onClick={() => { setOrderUID(orderMessageUID); }}>
            <div className="message__image">
              <img src="https://www.adminmart.com/src/assets/images/users/1.jpg" className="rounded-circle" alt="" />
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
          ));
        }
      } else {
        setContactItem(<p style={{ textAlign: "center", padding: "20px" }} > Utwórz rozmowe, aby dodać ją do listy</p >)
      }
    })
  }, [realtimeDatabaseUser])

  useEffect(() => {
    database().ref('ordersMessage/' + orderUID).orderByChild('DateTime').on("value", (snapshot) => {
      if (snapshot && snapshot.val()) {
        const data = snapshot.val();
        const keyOfMessages = Object.keys(data);

        setOrderMessages(keyOfMessages.map((messageUID, i) => {
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
                  <img src="https://www.adminmart.com/src/assets/images/users/1.jpg" className="rounded-circle" alt="" />
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
      }
    })
  }, [orderUID, firebaseUser])

  const addMessage = () => {
    if (orderUID !== null && newMessage !== "") {
      const ordersMessageRef = database().ref('ordersMessage/' + orderUID).push();
      const latestMessageRef = database().ref('latestMessage/' + orderUID);
      const today = new Date();
      const time = today.getHours() + ':' + today.getMinutes();
      const dateTime = time;
      const ordersMessageData = {
        "From": firebaseUser.uid,
        "Author": realtimeDatabaseUser.name,
        "DateTime": dateTime,
        "Message": newMessage,
      };
      const latestMessageData = {
        "From": firebaseUser.uid,
        "Author": realtimeDatabaseUser.name,
        "orderUID": orderUID,
        "DateTime": dateTime,
        "Message": newMessage,
      };

      ordersMessageRef.set(ordersMessageData)
        .catch(error => console.error(error))
        .finally(setNewMessage(""));
      latestMessageRef.set(latestMessageData)
        .catch(error => console.error(error));

      if (receiverUserUID !== null) {
        if (realtimeDatabaseUser.accountType === "Admin") {
          const notificationsRef = database().ref('notifications/' + receiverUserUID).push();
          const notificationsData = {
            "content": "Nowa wiadomość",
            "orderUID": orderUID,
            "time": dateTime,
            "type": "Message",
            "read": "false",
          }
          notificationsRef.set(notificationsData)
            .catch(error => console.error(error));
        } else {
          const notificationsRef = database().ref('notifications/admin').push();
          const notificationsData = {
            "content": "Nowa wiadomość",
            "orderUID": orderUID,
            "time": dateTime,
            "type": "Message",
            "read": "false",
          }
          notificationsRef.set(notificationsData)
            .catch(error => console.error(error));
        }
      }
    }
  }

  return (
    <React.Fragment>
      <Card style={{ paddingBottom: "0" }}>
        <div className="messages__box">
          <div className="contact__box">
            {contactItem}
          </div>
          <div className="chat__box">
            {orderMessages}
            {
              orderUID !== null ?
                <div className="createNewMessage">
                  <Input type="text" placeholder="Napisz wiadomość" id="newMessage" value={newMessage} onChange={(event) => { setNewMessage(event.target.value) }} />
                  <div id="sendMessage" onClick={addMessage}>
                    <i className="fas fa-paper-plane"></i>
                  </div>
                </div> : null
            }
          </div>
        </div>
      </Card>
    </React.Fragment>
  )
}

export default Messages;