import React from 'react';

import './MessageBox.css';

const MessageBox = ({ children, className, ...props }) => {

  return (
    <div className={`message__box ${className ? className : ""}`} {...props}>
      {children}
    </div>
  )
}

export default MessageBox;