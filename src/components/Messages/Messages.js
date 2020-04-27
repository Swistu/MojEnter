import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { database } from 'firebase';

import Card from '../UI/Card/Card'
import Input from '../UI/Input/Input';
import useForm from '../../hooks/useForm/useForm';
import Spinner from '../UI/Spinner/Spinner';

import './Messages.css';

const Messages = ({ history, ...props }) => {
	const { data } = useSelector(state => state.authenticationReducer);

  console.log(data);
  const [newMessage, setNewMessage] = useState("");
  const [allMessages, setAllMessages] = useState();
  const [allOrdersMessages, setAllOrdersMessages] = useState();
  const [loadingMessages, setLoadingMessages] = useState(false);
  let orderUniqueID = false;
  let orderID;


  if (history.location.state !== null) {
    orderUniqueID = history.location.state.orderUID;
    orderID = history.location.state.orderID;
  }



  useEffect(() => {
    database().ref('ordersMessage/').on("value", (snapshot) => {

      if (snapshot && snapshot.val()) {
        const data = snapshot.val();

        const keyOfHistory = Object.keys(data);
        const historyLength = keyOfHistory.length;


        setAllOrdersMessages(keyOfHistory.map((messageUID, i) => {
          console.log(messageUID);
          return <div key={messageUID} className="person" onClick={() => history.push({ pathname: `/dashboard/messages`, state: { "orderUID": messageUID } })}>
            <p className="messageAuthor">2020/04/234</p>
            <p className="messageDesc">{messageUID}</p>
            <p className="messageTime">15:34</p>
          </div>
        }))
        setLoadingMessages(false);
      } else {
        console.error(snapshot);
        setLoadingMessages(false);
      }
    })
  }, [])

  useEffect(() => {
    setLoadingMessages(true);
    database().ref('ordersMessage/' + orderUniqueID).on("value", (snapshot) => {

      if (snapshot && snapshot.val()) {
        const data = snapshot.val();

        const keyOfHistory = Object.keys(data);
        const historyLength = keyOfHistory.length;

        console.log(data.Message);

        setAllMessages(keyOfHistory.map((messageUID, i) => {
          console.log(messageUID);
          return <p key={messageUID}>{data[messageUID].Message}</p>
        }))
        setLoadingMessages(false);
      } else {
        console.error(snapshot);
        setLoadingMessages(false);
      }
    })
  }, [orderUniqueID])


  const addMessage = () => {
    const MessageRef = database().ref('ordersMessage/' + orderUniqueID).push();
    const MessageUniqueID = MessageRef.key;

    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date+' '+time;



    const Message = {
      "Message": newMessage,
      "From": data.accountType,
      "DateTime": dateTime,
    }

    MessageRef.set(Message)
      .catch(error => console.error(error));
  }



  return (
    <React.Fragment>
      <Card>
        {/* <h5 onClick={() => history.push({ pathname: `/dashboard/`})}>Utwórz nową wiadomość</h5> */}
        <h2>Wszystkie wiadomosci</h2>
        <div className="chatPeople">
          {allOrdersMessages}
          <div class="allMessages">
            {orderUniqueID ? loadingMessages ? <Spinner /> : allMessages : null}
          </div>

          {orderUniqueID ?
            <React.Fragment>
              <Input type="text" placeholder="Napisz wiadomość" style={{ border: "none", borderTop: "1px solid #edf2f9", marginTop: "200px" }} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
              <Input type="button" className="btn btn--light" value="Wyślij" onClick={addMessage} />
            </React.Fragment>
            : null}

        </div>
      </Card>
    </React.Fragment>
  )
}

export default Messages;