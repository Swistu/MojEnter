import React, { useEffect, useState } from 'react';

import './MessageItem.css';

const MessageItem = ({ title, className, descriptionFirst, descriptionSecond, imageURL, icon, ...props }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (imageURL !== undefined && icon !== undefined)
      console.error("Tylko 1 typ zdjecia! (image/icon)");
    else if (imageURL !== undefined)
      setImage("imageURL")
    else
      setImage("icon")
  }, [imageURL, icon])

  return (
    <div className={`message__item ${className ? className : ""}`} {...props}>
      <div className="image__box">
        <div className="message__image rounded-circle">
          {
            image === "imageURL" ?
              <img src={imageURL} alt="" className="rounded-circle" /> :
              <i className={icon}></i>
          }
        </div>
      </div>
      <div className="message__item__details">
        <div className="message__title">{title}</div>
        <div className="message__description firstItem">{descriptionFirst}</div>
        <div className="message__description secondItem">{descriptionSecond}</div>
      </div>
    </div>
  )
}

export default MessageItem;





