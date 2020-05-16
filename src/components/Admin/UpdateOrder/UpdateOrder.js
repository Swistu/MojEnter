import React, { useState } from 'react';
import { database } from 'firebase';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import Input from '../../UI/Input/Input';

const UpdateOrder = ({ orderUID }) => {

  const d = new Date();
  const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', seconds: '2-digit' };
  const date = d.toLocaleDateString('pl-PL', dateOptions);

  const [content, setContent] = useState();
  const [orderStatus, setOrderStatus] = useState("inProgress");

  const updateOrder = () => {
    const ordersHistoryRef = database().ref('ordersHistory/' + orderUID).push();
    const payLoad = {
      status: orderStatus,
      date: date,
      description: content ? content : ""
    }

    ordersHistoryRef.set(payLoad)
  }


  return (
    <React.Fragment>
      <label htmlFor="orderStatus">
        <h2 className="card__title">Wybierz status:</h2>
      </label>
      <select id="orderStatus" className="form-control" onChange={e => setOrderStatus(e.target.value)}>
        <option value="inProgress" defaultValue>W trakcie</option>
        <option value="waiting">Oczekiwanie</option>
        <option value="ready" >Do odbioru</option>
        <option value="done" >Zrealizowane</option>
      </select>

      <h2 className="card__title">Dodaj notatke:</h2>
      <CKEditor
        editor={ClassicEditor}
        onChange={(event, editor) => {
          const data = editor.getData();
          console.log({ event, editor, data });
          setContent(data);
        }}
      />

      <Input type="button" className="btn btn--success" value="Zatwierdź" onClick={updateOrder} />
    </React.Fragment>
  )
}

export default UpdateOrder;
