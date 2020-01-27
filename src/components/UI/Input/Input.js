import React from 'react';

const Input = ({type, name, placeholder, descName, ...props}) => {

    return(
        <label>
            <span className="label__text">{descName}</span>
            <input type={type} name={name} placeholder={placeholder} {...props} />
        </label>
    )
}

export default Input;