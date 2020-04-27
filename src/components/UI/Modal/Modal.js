import React from 'react';

import { useDispatch } from 'react-redux';
import { HIDE } from '../../../store/actionTypes';
import { modal } from '../../../store/actions'
import Input from '../Input/Input';
import './Modal.css';

const Modal = ({ showModal, title, component, ...props }) => {
  const dispatch = useDispatch();

  return (
    showModal ?
      <div className={`modal ${showModal ? "active" : ""}`} >
        <div className="modal__box">
          <div className="modal__content">
            <div className="modal__header">
              <div className="modal__inner-content">
                <div className="modal__title">{title}</div>
                <div className="modal__exit" onClick={() => dispatch(modal(HIDE))}>x</div>
              </div>
            </div>
            <div className="modal__body">
              <div className="modal__inner-content">
                {component}
                <Input type="button" className="btn btn--danger" value="Anuluj" onClick={() => dispatch(modal(HIDE))} />
              </div>
            </div>
          </div>
        </div>
      </div> : null
  )
}

export default Modal;