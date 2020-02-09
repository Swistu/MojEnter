import firebase from 'firebase';

const validate = (values) => {
  let errors = {};
  const itemsToCheck = Object.keys(values);

  itemsToCheck.map((fieldName) => checkItem(fieldName));

  function checkItem(fieldName) {
    switch (fieldName) {
      case "orderNumber":
        if (!values.orderNumber) {
          errors.orderNumber = "Numer zlecenia wymagany";
        } else if (!/\d{4}\/\d{2}\/\d{1,}/.test(values.orderNumber)) {
          errors.orderNumber = "Numer zlecenie musi być w formacie yyyy/mm/0";
        }
        break;
      case "email":
        if (!values.email) {
          errors.email = "Proszę podać adres email";
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
          errors.email = "Zły adres email";
        }
        break;
      case "cost":
        if (!values.cost) {
          errors.cost = "Pole wymagane";
        } else if (isNaN(values.cost)) {
          errors.cost = "Koszt może być tylko liczbą";
        }
        break;
      case "telNumber":
        if (!values.telNumber) {
          errors.telNumber = "Pole wymagane";
        } else if (!/\d{9}/.test(values.telNumber)) {
          errors.telNumber = "Numer musi posiadać 9 cyfr";
        }
        break;
      case "password":
        if (!values.password) {
          errors.password = "Hasło jest wymagane";
        } else if (values.password.length < 9) {
          errors.password = "Hasło musi posiadać długość conajmniej 8 znaków";
        }
        break;
      case "passwordFB":
        if (!values.passwordFB) {
          errors.passwordFB = "Proszę podać hasło";
        }
        break;
      case "emailFB":
        if (!values.emailFB) {
          errors.emailFB = "Proszę podać adres email";
        } else if (!/\S+@\S+\.\S+/.test(values.emailFB)) {
          errors.emailFB = "Zły adres email";
        }
        break;
      case "unsignedOrderNumber":
        if (!values.unsignedOrderNumber) {
          errors.unsignedOrderNumber = "Proszę podać numer zlecenia";
        }
        break;


      default:
        if (!values[fieldName] && fieldName !== "sendForm") {
          errors[fieldName] = "Pole wymagane";
        }
        break;
    }

  }
  return errors;
}

export default validate;