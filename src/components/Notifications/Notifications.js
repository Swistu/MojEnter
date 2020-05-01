import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Observable } from 'rxjs';
import { database } from 'firebase';

import './Notifications.css';

const Notifications = ({ history, toggleSupportMenuHandler }) => {
  const { realtimeDatabaseUser, firebaseUser } = useSelector(state => state.authenticationReducer);

  const [notificationList, setNotificationList] = useState([])


  useEffect(() => {
    const notificationsData$ = Observable.create(observer => {
      if (realtimeDatabaseUser.accountType === "Admin") {
        database().ref('notifications/admin').on("child_added", (snapshot) => {
          if (snapshot && snapshot.val()) {
            const queryData = snapshot.val();

            observer.next(queryData);
          }
        })
      } else if (firebaseUser.uid) {
        database().ref('notifications/' + firebaseUser.uid).on("child_added", (snapshot) => {
          if (snapshot && snapshot.val()) {
            const queryData = snapshot.val();

            observer.next(queryData);
          }
        })
      }
    });

    notificationsData$.subscribe(notification => {
      switch (notification.type) {
        case "NewOrder":
          setNotificationList(old => <React.Fragment>
            {old}
            <div className="message__item" key={notification} onClick={() => { toggleSupportMenuHandler(); history.push({ pathname: `/dashboard/show-order`, state: { "orderUID": notification.orderUID } }) }}>
              <div className="message__image">
                <div className="rounded-circle notification__image">
                  <i class="fas fa-file-download"></i>
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
            <div className="message__item" key={notification} onClick={() => { toggleSupportMenuHandler(); history.push({ pathname: `/dashboard/messages`, state: { "orderUID": notification.orderUID } }) }}>
              <div className="message__image">
                <div className="rounded-circle notification__image">
                  <i class="fas fa-comment-dots"></i>
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
  }, [realtimeDatabaseUser, firebaseUser, history, toggleSupportMenuHandler])


  return (
    <div className="notifications" id="notifications" style={{ maxHeight: "240px", overflowY: "scroll" }}>
      {notificationList}
    </div>
  );
}

export default Notifications;