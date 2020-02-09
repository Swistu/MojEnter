import React from 'react';

import './Modal.css';
import Input from '../Input/Input';

const Modal = ({ closeModal, showModal, title, content, ...props }) => {
  return (
    showModal?
    <div className={`modal ${showModal?"active":""}`} >
      <div className="modal__box">
        <div className="modal__content">
          <div className="modal__header">
            <div className="modal__inner-content">
              <div className="modal__title">{title}</div>
              <div className="modal__exit" onClick={closeModal}>x</div>
            </div>
          </div>
          <div className="modal__body">
            <div className="modal__inner-content">
              {content}
              <Input type="button" className="btn btn--danger" value="Anuluj" onClick={closeModal} />
            </div>
          </div>
        </div>
      </div>
    </div>:null
  )
}

export default Modal;