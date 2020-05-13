import React, { useState, useEffect } from 'react';
import validate from './validate';

import Input from '../../components/UI/Input/Input';

const getElementName = (formElements) => {
  if (formElements) {
    return formElements.reduce((previousValue, currentValue, i) => {
      if (i === 1)
        return { [previousValue.name]: previousValue.value ? previousValue.value : "", [currentValue.name]: currentValue.value ? currentValue.value : "" }
      else
        return { ...previousValue, [currentValue.name]: currentValue.value ? currentValue.value : "" }
    });
  } else
    return null;
}

const useForm = (callback, formElements) => {
  const [values, setValues] = useState(getElementName(formElements));
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback();
      setIsSubmitting(false);
    }
  }, [errors, isSubmitting, callback]);

  const handleChange = event => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value
    });
  }
  const changeValue = (name, value) => {
    setValues({
      ...values,
      [name]: value
    });
  }
  const changeError = (name, error) => {
    setErrors({
      ...errors,
      [name]: error
    });
  }
  const handleSubmit = event => {
    event.preventDefault();
    setErrors(validate(values));
    setIsSubmitting(true);
  }

  const renderInputs = () => {
    if (formElements)
      return formElements.map((res) => {
        if (res.type !== "submit")
          return <React.Fragment key={res.name}>
            <Input
              {...res}
              onChange={handleChange}
              value={values[res.name]}
              className={isSubmitting ? errors[res.name] || errors[res.name] === "" ? "input--invalid" : "input--valid" : null}
            />
            {errors[res.name] && <p className={"feedback feedback--invalid"}>{errors[res.name]}</p>}
          </React.Fragment>
        else
          return <React.Fragment key={res.name}>
            <Input {...res} />
          </React.Fragment>
      })
    else
      return null
  }

  return {
    handleChange,
    handleSubmit,
    renderInputs,
    changeValue,
    changeError,
    isSubmitting,
    values,
    errors
  }
}

export default useForm;