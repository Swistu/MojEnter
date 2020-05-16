import React, { useState, useEffect } from 'react';
import { database } from 'firebase';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import Input from '../../UI/Input/Input';

const AddNote = ({ orderUID }) => {
  const [currentMemo, setCurrentMemo] = useState();
  const [content, setContent] = useState("");

  useEffect(() => {
    database().ref("ordersMemo/" + orderUID).once("value", (snapshot) => {
      if (snapshot && snapshot.val()) {
        const data = snapshot.val();

        console.log(data);

        setCurrentMemo(data);
      } else {
        console.log(snapshot);
      }
    })
  }, [orderUID])

  const addMemo = () => {
    if (content) {
      database().ref('ordersMemo/' + orderUID).set(content)
        .then(console.log("dodano"));
    }
  }

  return (
    <React.Fragment>
      <CKEditor
        editor={ClassicEditor}
        data={currentMemo}
        onChange={(event, editor) => {
          const data = editor.getData();
          console.log({ event, editor, data });
          setContent(data);
        }}
      />

      <Input type="button" className="btn btn--success" value="Zatwierdź" onClick={addMemo} />
    </React.Fragment>
  )
}

export default AddNote;
