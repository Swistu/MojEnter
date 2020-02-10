import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { database } from 'firebase';

import Spinner from '../../UI/Spinner/Spinner';
import Input from '../../UI/Input/Input';

const UpdateOrder = ({ orderUID, ...props }) => {

  const d = new Date();
  const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', seconds: '2-digit' };
  const date = d.toLocaleDateString('pl-PL', dateOptions);

  const [content, setContent] = useState();
  const [orderStatus, setOrderStatus] = useState("inProgress");

  const updateOrder = () => {
    if (content && orderStatus && date) {
      const ordersHistoryRef = database().ref('ordersHistory/' + orderUID).push();
      const payLoad = {
        status: orderStatus,
        date: date,
        description: content
      }

      ordersHistoryRef.set(payLoad)
        .then(console.log("dodano"));
    } else {
      console.error("Nie moge zaktualizowac zlecenia");
    }
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
      <Editor
        apiKey="5pm48o3ipn3vwvjvx337kxdgnt1bsdaxlgbrw5s9e9cdv89w"
        init={{
          menubar: false,
          plugins: [
            'advlist autolink lists link image',
            'charmap print preview anchor help',
            'searchreplace visualblocks code',
            'insertdatetime media table paste wordcount'
          ],
          toolbar:
            'undo redo | formatselect | bold italic | \
            alignleft aligncenter alignright | \
            bullist numlist outdent indent image',
          inline_styles: true,
          height: 200
        }}
        onChange={(e) => setContent(e.target.getContent())} />

      <Input type="button" className="btn btn--success" value="Zatwierdź" onClick={updateOrder} />
    </React.Fragment>
  )
}

export default UpdateOrder;
