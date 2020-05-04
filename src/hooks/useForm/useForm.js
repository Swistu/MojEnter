import { useState, useEffect } from 'react';
import validate from './validate';

const getElementName = (formElements) => {
  return formElements.reduce((previousValue, currentValue, i) => {
    if (i === 1)
      return { [previousValue.name]: previousValue.value ? previousValue.value : "", [currentValue.name]: currentValue.value ? currentValue.value : "" }
    else
      return { ...previousValue, [currentValue.name]: currentValue.value ? currentValue.value : "" }
  });
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

  const handleSubmit = event => {
    event.preventDefault();
    setErrors(validate(values));
    setIsSubmitting(true);
  }

  return {
    handleChange,
    handleSubmit,
    isSubmitting,
    values,
    errors
  }
}

export default useForm;