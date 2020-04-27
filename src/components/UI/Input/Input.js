import React from 'react';

import './Input.css';

const Input = ({ type, name, placeholder, descName, ...props }) => {

    let input;

    if (descName == null)
        input = <input type={type} name={name} placeholder={placeholder} {...props} />
    else {
        input = (<label>
            <span className="label__text">{descName}</span>
            <input type={type} name={name} placeholder={placeholder} {...props} />
        </label>)
    }
    return (
        input
    )
}

export default Input;