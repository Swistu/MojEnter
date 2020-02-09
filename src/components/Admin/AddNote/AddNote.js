import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Spinner from '../../UI/Spinner/Spinner';
import Input from '../../UI/Input/Input';
import { database } from 'firebase';
const AddNote = ({ orderUID, ...props }) => {

  const [loading, setLoading] = useState(true);
  const [currentMemo, setCurrentMemo] = useState();
  const [loadingMemo, setLoadingMemo] = useState(true);
  const [content, setContent] = useState("");

  useEffect(() => {
    database().ref("ordersMemo/" + orderUID).once("value", (snapshot) => {
      if (snapshot && snapshot.val()) {
        const data = snapshot.val();

        console.log(data);

        setCurrentMemo(data);
        setLoadingMemo(false);
      } else {
        console.log(snapshot);
        setLoadingMemo(false);
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
      {loadingMemo ? <Spinner /> : <Editor
        onInit={() => setLoading(false)}
        apiKey="5pm48o3ipn3vwvjvx337kxdgnt1bsdaxlgbrw5s9e9cdv89w"
        initialValue={currentMemo}
        init={{
          height: 500,
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
          inline_styles: true
        }}
        onChange={(e) => setContent(e.target.getContent())} />}

      <Input type="button" className="btn btn--success" value="Zatwierdź" onClick={addMemo} />
    </React.Fragment>
  )
}

export default AddNote;
