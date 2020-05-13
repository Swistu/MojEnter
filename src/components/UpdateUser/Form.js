import { useSelector } from 'react-redux';


export const Form = () => {
  const { realtimeDatabaseUser } = useSelector(state => state.authenticationReducer)
  
  return [
    {
      "type": "text",
      "descName": "Nazwa:",
      "placeholder": "Imie, nazwisko lub firma",
      "name": "displayName",
      "value": realtimeDatabaseUser.name ? realtimeDatabaseUser.name : ""
    },
    {
      "type": "tel",
      "descName": "Telefon:",
      "placeholder": "Wprowadź numer telefonu",
      "name": "telNumber",
      "value": realtimeDatabaseUser.phoneNumber ? realtimeDatabaseUser.phoneNumber : ""
    },
    {
      "type": "text",
      "descName": "Adres:",
      "placeholder": "Wprowadź ulice",
      "name": "address",
      "value": realtimeDatabaseUser.address ? realtimeDatabaseUser.address : ""
    },
    {
      "type": "submit",
      "name": "sendForm",
      "value": "Aktualizuj",
      "className": "btn btn--success"
    },
  ];
}