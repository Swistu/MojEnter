import React, { useState, useEffect } from 'react';
import { Observable } from 'rxjs';
import { database, auth } from 'firebase';
import { useHistory } from 'react-router'

import { checkAccounType } from '../../utility/checkAccountType';

import MessageBox from '../MessageBox/MessageBox';
import MessageItem from '../MessageBox/MessageItem/MessageItem';
import NavItem from '../NavItem/NavItem';

import './Notifications.css';

const Notifications = () => {
  const history = useHistory();

  const [notificationList, setNotificationList] = useState(null)
  const [accountType, setAccountType] = useState(null);

  useEffect(() => {
    const getAsyncData = async () => {
      const accountTypeResponse = await checkAccounType();

      setAccountType(accountTypeResponse);
    }
    getAsyncData();
  }, [])

  useEffect(() => {
    if (accountType !== null) {
      const notificationsData$ = Observable.create(observer => {
        if (accountType === "admin" || accountType === "worker")
          database().ref('notifications/admin').limitToLast(4).on("child_added", (snapshot) => {
            if (snapshot && snapshot.val()) {
              const data = { ...snapshot.val(), "key": snapshot.key };

              observer.next(data);
            }
          })
        else
          database().ref('notifications/' + auth().currentUser.uid).limitToLast(4).on("child_added", (snapshot) => {
            if (snapshot && snapshot.val()) {
              const data = { ...snapshot.val(), "key": snapshot.key };

              observer.next(data);
            }
          })
      });

      notificationsData$.subscribe(notification => {
        switch (notification.type) {
          case "newOrder":
            setNotificationList(old => <React.Fragment>
              {old}
              <MessageItem
                className={notification.read === "false" ? "unread" : ""}
                label={notification.type}
                title="Nowe zlecenie"
                descriptionFirst="Przypisano zlecenie do Twojego konta."
                descriptionSecond={notification.time}
                icon="fas fa-file-download"
                key={notification.key}
                onClick={() => {
                  readNotifications(notification.key);
                  history.push({ pathname: `/dashboard/zlecenie`, state: { "orderUID": notification.orderUID } })
                }}
              />
            </React.Fragment>);
            break;
          case "message":
            setNotificationList(old => <React.Fragment>
              {old}
              <MessageItem
                className={notification.read === "false" ? "unread" : ""}
                label={notification.type}
                title="Nowa wiadomość"
                descriptionFirst={notification.from}
                descriptionSecond={notification.time}
                icon="fas fa-comment-dots"
                key={notification.key}
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
    }

    // eslint-disable-next-line
  }, [accountType])

  useEffect(() => {
    if (notificationList) {
      const notificationItems = document.querySelectorAll("#notifications__submmenu > .message__box > .message__item ");
      notificationItems.forEach(item => {
        item.addEventListener("click", () => {
          if (item.classList.contains("unread"))
            item.classList.remove("unread");
        })
      })
    }
  }, [notificationList])

  const readNotifications = (notificationUID) => {
    if (accountType === "admin" || accountType === "worker")
      database().ref("notifications/admin/" + notificationUID).update({ "read": "true" })
    else
      database().ref("notifications/" + auth().currentUser.uid + "/" + notificationUID).update({ "read": "true" })
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