import React, { useState, useEffect } from 'react'
import firebase, { auth, database } from 'firebase';

import { checkAccounType } from '../../utility/checkAccountType';
import { getUserData } from '../../utility/getUserData';


import Card from '../../components/UI/Card/Card'
import Input from '../../components/UI/Input/Input';
import MessageBox from '../../components/MessageBox/MessageBox';
import MessageItem from '../../components/MessageBox/MessageItem/MessageItem';

import './Messages.css';
import Spinner from '../../components/UI/Spinner/Spinner';

const Messages = ({ history }) => {
  const [newMessage, setNewMessage] = useState("");
  const [contactItem, setContactItem] = useState();
  const [orderMessages, setOrderMessages] = useState();
  const [orderUID, setOrderUID] = useState(history.location.state ? history.location.state.orderUID : null);
  const [receiverUserUID, setReceiverUserUID] = useState(null);
  const [userData, setUserData] = useState(null)
  const [accountType, setAccountType] = useState(null);

  useEffect(() => {
    const getLastChatItem = async (userOrdersKey) => {
      const ordersLastMessage = [];

      for (let i = 0; i < userOrdersKey.length; i++) {
        await database().ref('ordersMessage/' + userOrdersKey[i]).limitToLast(1).once("value", (snapshot) => {
          if (snapshot && snapshot.val()) {
            const data = snapshot.val();
            const messageKey = Object.keys(data);
            const obj = {
              ...data[messageKey],
              "orderUID": userOrdersKey[i]
            }

            ordersLastMessage.push(obj);
          }
        })
      }
      return ordersLastMessage;
    }

    const getAllOrdersChat = async () => {
      let ordersLastMessage;
      let userOrdersKey;

      if (accountType !== "worker" && accountType !== "admin") {
        userOrdersKey = Object.keys(userData.orders)
        ordersLastMessage = await getLastChatItem(userOrdersKey)
      } else {
        const snapshot = await database().ref('orderOwnerUID').once("value");
        if (snapshot && snapshot.val()) {
          const data = snapshot.val();
          userOrdersKey = Object.keys(data);

          ordersLastMessage = await getLastChatItem(userOrdersKey);
        }
      }

      setContactItem(ordersLastMessage.map(lastMessage => <MessageItem
        key={lastMessage.orderUID}
        title={lastMessage.author}
        descriptionFirst={lastMessage.orderID}
        descriptionSecond={lastMessage.message.substr(0, 20)}
        imageURL="https://www.adminmart.com/src/assets/images/users/1.jpg"
        onClick={() => { setOrderUID(lastMessage.orderUID); }}
      />
      ));
    }

    if (userData !== null && accountType !== null)
      getAllOrdersChat();
  }, [userData, accountType])

  useEffect(() => {
    if (orderUID !== null) {
      if (accountType !== null) {
        if (accountType === "admin" || accountType === "worker") {
          database().ref('orderOwnerUID/' + orderUID).once("value", (snapshot) => {
            if (snapshot && snapshot.val()) {
              const data = snapshot.val();
              if (data.userUID)
                setReceiverUserUID(data.userUID);
              else
                setReceiverUserUID(null);
            }
          });
        } else setReceiverUserUID("admin");
      }

      database().ref('ordersMessage/' + orderUID).on("value", (snapshot) => {
        if (snapshot && snapshot.val()) {
          const data = snapshot.val();
          const keyOfMessages = Object.keys(data);

          setOrderMessages(keyOfMessages.map((messageUID, i) => <MessageItem
            key={messageUID}
            imageURL="https://www.adminmart.com/src/assets/images/users/1.jpg"
            title={auth().currentUser.uid === data[messageUID].from ? undefined : data[messageUID].author}
            className={auth().currentUser.uid === data[messageUID].from ? "sender-me" : null}
            descriptionFirst={data[messageUID].message}
            descriptionSecond={data[messageUID].datetime}
          />
          ))
        }
      })
    }
  }, [orderUID, accountType])

  useEffect(() => {
    const getAsyncData = async () => {
      const accountTypeResponse = await checkAccounType();
      const userDataResponse = await getUserData();

      setAccountType(accountTypeResponse);
      setUserData(userDataResponse);
    }

    getAsyncData();
  }, [])


  const addMessage = () => {
    if (orderUID !== null && newMessage !== "" && userData !== null && receiverUserUID !== null) {
      const ordersMessageRef = database().ref('ordersMessage/' + orderUID).push();
      const ordersMessageData = {
        "from": auth().currentUser.uid,
        "to": receiverUserUID,
        "author": userData.name,
        "timestamp": firebase.database.ServerValue.TIMESTAMP,
        "message": newMessage,
      };

      ordersMessageRef.set(ordersMessageData)
        .catch(error => console.error(error))
        .finally(setNewMessage(""));


      if (accountType !== null && (accountType === "admin" || accountType === "worker")) {
        const notificationsRef = database().ref('notifications/' + receiverUserUID).push();
        const notificationsData = {
          "orderUID": orderUID,
          "timestamp": firebase.database.ServerValue.TIMESTAMP,
          "type": "message",
          "read": "false",
        }

        notificationsRef.set(notificationsData);
      } else {
        const notificationsRef = database().ref('notifications/admin').push();
        const notificationsData = {
          "from": userData.name,
          "orderUID": orderUID,
          "timestamp": firebase.database.ServerValue.TIMESTAMP,
          "type": "message",
          "read": "false",
        }
        notificationsRef.set(notificationsData);
      }
    }
  }

  return (
    <React.Fragment>
      <Card style={{ paddingBottom: "0" }}>
        <div className="message__page">
          <div className="contact__box">
            <MessageBox>
              {contactItem ? contactItem : <Spinner />}
            </MessageBox>
          </div>
          <div className="chat__box">
            <MessageBox>
              {orderMessages}
            </MessageBox>
            {
              orderUID !== null ?
                <div className="createNewMessage">
                  <Input
                    type="text"
                    placeholder="Napisz wiadomość"
                    id="newMessage"
                    value={newMessage}
                    onKeyPress={(event) => { if (event.key === "Enter") addMessage() }}
                    onChange={(event) => { setNewMessage(event.target.value) }}
                  />
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