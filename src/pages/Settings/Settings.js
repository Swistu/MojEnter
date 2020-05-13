import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { database } from 'firebase';

import { SHOW } from '../../store/actionTypes';
import { modal } from '../../store/actions';

import UpdateSettings from '../../components/UpdateSettings/UpdateSettings';
import Input from '../../components/UI/Input/Input';
import Card from '../../components/UI/Card/Card';

const Settings = () => {
  const dispatch = useDispatch();

  const [currentOrderNumber, setCurrentOrderNumber] = useState("");

  useEffect(() => {
    database().ref('appSettings/').once("value", (snapshot) => {
      if (snapshot && snapshot.val()) {
        const data = snapshot.val();
        setCurrentOrderNumber(data.currentOrderNumber);
      }
    });
  }, [])

  return (
    <Card>
      <p>Aktaulny numer zlecenia:</p>
      <Input value={currentOrderNumber} />

      <Input type="submit" className="btn btn--light" value="Aktualizuj" onClick={() => dispatch(modal(SHOW, "Zmień ustawienia", <UpdateSettings currentOrderNumber={currentOrderNumber}/>))} />
    </Card>
  )
}

export default Settings;