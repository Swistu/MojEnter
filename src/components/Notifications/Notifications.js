import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Observable } from 'rxjs';
import { database } from 'firebase';
import { useHistory } from 'react-router'

import './Notifications.css';

const Notifications = ({ toggleSupportMenuHandler }) => {
  const { realtimeDatabaseUser, firebaseUser } = useSelector(state => state.authenticationReducer);

  const [notificationList, setNotificationList] = useState(null)
  const history = useHistory();

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
            <div className="message__item" key={notification} onClick={() => { readNotifications(notification.key); toggleSupportMenuHandler(); history.push({ pathname: `/dashboard/show-order`, state: { "orderUID": notification.orderUID } }) }}>
              <div className="message__image">
                <div className="rounded-circle notification__image">
                  <i className="fas fa-file-download"></i>
                </div>
                {/* <img src="https://www.adminmart.com/src/assets/images/users/1.jpg" className="rounded-circle" alt="" /> */}
              </div>
              <div className="message__item__details">
                <div className="message__sender">
                  {notification.content}
                </div>
                <div className="message__time">
                  <time>{notification.time}</time>
                </div>
              </div>
            </div>
          </React.Fragment>);
          break;
        case "Message":
          setNotificationList(old => <React.Fragment>
            {old}
            <div className="message__item" key={notification} onClick={() => { readNotifications(notification.key); toggleSupportMenuHandler(); history.push({ pathname: `/dashboard/messages`, state: { "orderUID": notification.orderUID } }) }}>
              <div className="message__image">
                <div className="rounded-circle notification__image">
                  <i className="fas fa-comment-dots"></i>
                </div>
              </div>
              <div className="message__item__details">
                <div className="message__sender">
                  {notification.content}
                </div>
                <div className="message__time">
                  <time>{notification.time}</time>
                </div>
              </div>
            </div>
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
    <div className="notifications" id="notifications">

      {notificationList !== null ? <React.Fragment>
        <div className="readMore">Sprwadz wszystkie <i className="fa fa-angle-right" style={{ marginLeft: "6px" }}></i></div>
        {notificationList}
      </React.Fragment> : <div className="readMore">Brak powiadomień</div>}
    </div>
  );
}

export default Notifications;