import { useState, useEffect } from 'react';
import validate from '../../utility/validate';

const useForm = (callback , checkItems) => {
  const [values, setValues] = useState(checkItems);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = event => {
    const {name, value} = event.target;
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

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback();
    }
  }, [errors]);

  return{
    handleChange,
    handleSubmit,
    isSubmitting,
    values,
    errors
  }
}

export default useForm;