import React from 'react';
import Input from '../UI/Input/Input';

const OrderSummary = ({ values, orderAccepted }) => {

  return (
    <React.Fragment>
        <Input value={values.orderNumber} descName={"Zlecenie nr:"} disabled />
        <Input value={values.client} descName={"Dla:"} disabled />
        <Input value={values.telNumber} descName={"Telefon:"} disabled />
        <Input value={values.address} descName={"Adres:"} disabled />
        <Input value={values.accessory} descName={"Wyposażenie:"} disabled />
        <Input value={values.deviceName} descName={"Nazwa urządzenia"} disabled />
        <Input value={values.deviceSerialNumber} descName={"Nr. seryjny sprzętu:"} disabled />
        <Input value={values.commission} descName={"Zlecenie:"} disabled />
        <Input value={values.customerComment} descName={"Informacje od klienta:"} disabled />
        <Input value={values.vendorComment} descName={"Uwagi przyjmującego:"} disabled />
        <Input value={values.cost} descName={"Koszt:"} disabled />
        <Input value={values.endDate} descName={"Planowany termin realizacji:"} disabled />
        <Input value="Zatwierdź" type="button" className="btn btn--success"
          onClick={() => {
            orderAccepted();
          }}
        />
    </React.Fragment>
  )
}

export default OrderSummary;