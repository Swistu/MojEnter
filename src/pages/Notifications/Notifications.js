import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { database } from 'firebase';

import Card from '../../components/UI/Card/Card';
import MessageBox from '../../components/MessageBox/MessageBox';
import MessageItem from '../../components/MessageBox/MessageItem/MessageItem';

const Notifications = ({ history }) => {
  const { realtimeDatabaseUser, firebaseUser } = useSelector(state => state.authenticationReducer);

  const [notificationList, setNotificationList] = useState(null);

  useEffect(() => {
    const notificationTitle = (notificationType) => {
      switch (notificationType) {
        case "NewOrder":
          return "Nowe zlecenie";
        case "Message":
          return "Nowa wiadomość";
        default:
          return ""
      }
    }
    const notificationDescription = (notificationType) => {
      switch (notificationType) {
        case "NewOrder":
          return "Przypisano zlecenie do Twojego konta.";
        case "Message":
          return "Otrzymano nową wiadomość.";
        default:
          return ""
      }
    }
    const notificationIcon = (notificationType) => {
      switch (notificationType) {
        case "NewOrder":
          return "fas fa-file-download";
        case "Message":
          return "fas fa-comment-dots";
        default:
          return ""
      }
    }
    const readNotifications = (notificationUID) => {
      if (realtimeDatabaseUser.accountType === "Admin")
        database().ref("notifications/admin/" + notificationUID).update({ "read": "true" })
      else
        database().ref("notifications/" + firebaseUser.uid + "/" + notificationUID).update({ "read": "true" })
    }
    const notificationRedirect = (notificationType, state) => {
      switch (notificationType) {
        case "NewOrder":
          history.push({ pathname: `/dashboard/zlecenie`, state: state })
          break;
        case "Message":
          history.push({ pathname: `/dashboard/wiadomosci`, state: state })
          break;
        default:
          return ""
      }
    }

    if (realtimeDatabaseUser.accountType === "Admin") {
      database().ref('notifications/admin').once("value", (snapshot) => {
        if (snapshot && snapshot.val()) {
          const data = snapshot.val();

          const keyOfNotification = Object.keys(data);

          setNotificationList(keyOfNotification.map((notificationUID) => {
            return <MessageItem
              className={data[notificationUID].read === "false" ? "unread" : ""}
              label={data[notificationUID].type}
              key={notificationUID}
              icon={notificationIcon(data[notificationUID].type)}
              title={notificationTitle(data[notificationUID].type)}
              descriptionFirst={notificationDescription(data[notificationUID].type)}
              descriptionSecond={data[notificationUID].time}
              onClick={() => {
                readNotifications(notificationUID);
                notificationRedirect(data[notificationUID].type, { "orderUID": data[notificationUID].orderUID })
              }}
            />
          }))
        }
      })
    } else if (firebaseUser.uid) {
      database().ref('notifications/' + firebaseUser.uid).once("value", (snapshot) => {
        if (snapshot && snapshot.val()) {
          const data = snapshot.val();

          const keyOfNotification = Object.keys(data);

          setNotificationList(keyOfNotification.map((notificationUID) => {
            return <MessageItem
              className={data[notificationUID].read === "false" ? "unread" : ""}
              label={data[notificationUID].type}
              key={notificationUID}
              icon={notificationIcon(data[notificationUID].type)}
              title={notificationTitle(data[notificationUID].type)}
              descriptionFirst={notificationDescription(data[notificationUID].type)}
              descriptionSecond={data[notificationUID].time}
              onClick={() => {
                readNotifications(notificationUID);
                notificationRedirect(data[notificationUID].type, { "orderUID": data[notificationUID].orderUID })
              }}
            />
          }))
        }
      })
    }
    //eslint-disable-next-line
  }, [realtimeDatabaseUser, firebaseUser])

  return (
    <Card>
      <MessageBox className="notifications__list">
        {notificationList}
      </MessageBox>
    </Card>
  )
}

export default Notifications;