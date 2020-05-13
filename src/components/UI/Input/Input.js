import React from 'react';

import './Input.css';

const Input = ({ type, name, placeholder, descName, options,  ...props }) => {

	const renderInput = () => {
		if (type === undefined)
			type = "text";

		switch (type) {
			case "text":
			case "password":
			case "date":
			case "tel":
			case "number":
			case "email":
				if (descName === undefined)
					return <input type={type} name={name} placeholder={placeholder} {...props} />;
				else
					return <label>
						<span className="label__text">{descName}</span>
						<input type={type} name={name} placeholder={placeholder} {...props} />
					</label>;
			case "submit":
			case "button":
				return <input type={type} name={name ? name : ""} {...props} value={props.value} />;
			case "select":
				if (descName === undefined)
					return <select name={name} {...props}>
						{options.map(option => <option value={option.value}>{option.showValue}</option>)}
					</select>;
				else
					return <label>
						<span className="label__text">{descName}</span>
						<select name={name} {...props}>
							{options.map(option => <option value={option.value} key={"key" + option.value}>{option.showValue}</option>)}
						</select>
					</label>;
			default:
				return null;
		}
	}

	return renderInput();
}

export default Input;