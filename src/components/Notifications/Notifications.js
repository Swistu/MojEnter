import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Observable } from 'rxjs';
import { database } from 'firebase';
import { useHistory } from 'react-router'

import MessageBox from '../MessageBox/MessageBox';
import MessageItem from '../MessageBox/MessageItem/MessageItem';
import NavItem from '../NavItem/NavItem';

import './Notifications.css';

const Notifications = () => {
  const history = useHistory();
  
  const { realtimeDatabaseUser, firebaseUser } = useSelector(state => state.authenticationReducer);

  const [notificationList, setNotificationList] = useState(null)

  useEffect(() => {
    const notificationsData$ = Observable.create(observer => {
      if (realtimeDatabaseUser.accountType === "Admin") {
        database().ref('notifications/admin').on("child_added", (snapshot) => {
          if (snapshot && snapshot.val()) {
            const data = { ...snapshot.val(), "key": snapshot.key };

            observer.next(data);
          }
        })
      } else if (firebaseUser.uid) {
        database().ref('notifications/' + firebaseUser.uid).on("child_added", (snapshot) => {
          if (snapshot && snapshot.val()) {
            const data = { ...snapshot.val(), "key": snapshot.key };

            observer.next(data);
          }
        })
      }
    });

    notificationsData$.subscribe(notification => {
      switch (notification.type) {
        case "NewOrder":
          setNotificationList(old => <React.Fragment>
            {old}
            <MessageItem
              className={notification.read === "false" ? "unread" : ""}
              label={notification.type}
              title="Nowe zlecenie"
              descriptionFirst="Przypisano zlecenie do Twojego konta."
              descriptionSecond={notification.time}
              icon="fas fa-file-download"
              key={notification}
              onClick={() => {
                readNotifications(notification.key);
                history.push({ pathname: `/dashboard/zlecenie`, state: { "orderUID": notification.orderUID } })
              }}
            />
          </React.Fragment>);
          break;
        case "Message":
          setNotificationList(old => <React.Fragment>
            {old}
            <MessageItem
              className={notification.read === "false" ? "unread" : ""}
              label={notification.type}
              title="Nowa wiadomość"
              descriptionFirst="Otrzymano nową wiadomość."
              descriptionSecond={notification.time}
              icon="fas fa-comment-dots"
              key={notification}
              onClick={() => {
                readNotifications(notification.key);
                history.push({ pathname: `/dashboard/wiadomosci`, state: { "orderUID": notification.orderUID } })
              }}
            />
          </React.Fragment>);
          break;
        default:
          break;
      }
    });
    // eslint-disable-next-line
  }, [realtimeDatabaseUser, firebaseUser])

  const readNotifications = (notificationUID) => {
    if (realtimeDatabaseUser.accountType === "Admin")
      database().ref("notifications/admin/" + notificationUID).update({ "read": "true" })
    else
      database().ref("notifications/" + firebaseUser.uid + "/" + notificationUID).update({ "read": "true" })
  }

  return (
    <div id="notifications__submmenu" className="notifications__list">
      {
        notificationList !== null ?
          <React.Fragment>
            <NavItem type="redirect" to={"/dashboard/powiadomienia"}>
              <div className="readMore">Sprwadz wszystkie <i className="fa fa-angle-right" style={{ marginLeft: "6px" }}></i></div>
            </NavItem>
            <MessageBox style={{ display: "flex", flexDirection: "column-reverse" }}>
              {notificationList}
            </MessageBox>
          </React.Fragment> :
          <div className="readMore">Brak powiadomień</div>
      }
    </div>
  );
}

export default Notifications;