import React, { useState, useEffect } from 'react';
import { auth } from 'firebase'
import { useDispatch } from 'react-redux';

// import { checkAccounType } from '../../utility/checkAccountType';
import { getUserData } from '../../utility/getUserData';

import { SHOW } from '../../store/actionTypes';
import { modal } from '../../store/actions';

import UpdateUser from '../../components/UpdateUser/UpdateUser';
import Input from '../../components/UI/Input/Input';
import Card from '../../components/UI/Card/Card';

const UserConfig = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    getUserData().then(snapshot => {
      const data = snapshot;
      setUserData({
        "name": data.name,
        "email": data.email,
        "adress": data.adress,
        "telephone": data.telephone,
      });
    });
  }, [])


  return (
    <Card>
      {
        auth().currentUser ?
          <React.Fragment>
            <section className="info__box">
              <p className="info__title">Dane konta: </p>
              <p>Nazwa: {userData ? userData.name : "brak"}</p>
              <p>Email: {userData ? userData.email : "brak"}</p>
              <p>Adres: {userData ? userData.address : "brak"}</p>
              <p>Telefon: {userData ? userData.phoneNumber : "brak"}</p>
            </section>
            <Input type="submit" className="btn btn--light" value="Aktualizuj dane" onClick={() => dispatch(modal(SHOW, "Zmień dane", <UpdateUser userData={userData} />))} />
          </React.Fragment>
          : "Brak danych"
      }
    </Card>
  )
}

export default UserConfig