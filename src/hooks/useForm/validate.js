const validate = (values) => {
  const errors = {};
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
          errors.email = "Pole wymagane";
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
        } else if (values.passwordFB.length < 6) {
          errors.passwordFB = "Hasło musi zawierać conajmniej 6 znaków";
        } else if (values.passwordFB2 && values.passwordFB !== values.passwordFB2) {
          errors.passwordFB = "Hasła nie są identyczne";
        }
        break;
      case "passwordFB2":
        if (!values.passwordFB2) {
          errors.passwordFB2 = "Proszę podać hasło";
        } else if (values.passwordFB2.length < 6) {
          errors.passwordFB2 = "";
        } else if (values.passwordFB && values.passwordFB !== values.passwordFB2) {
          errors.passwordFB2 = "";
        }
        break;
      case "unassignedOrderUID":
        if (!values.unassignedOrderUID) {
          errors.unassignedOrderUID = "Proszę podać numer zlecenia";
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