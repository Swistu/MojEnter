import React from 'react';
import Input from '../UI/Input/Input';

const OrderSummary = ({ values, orderAccepted }) => {

  return (
    <React.Fragment>
      <Input type="text" value={values.orderNumber} descName={"Zlecenie nr:"} disabled />
      <Input type="text" value={values.email} descName={"Email:"} disabled />
      <Input type="text" value={values.claimType} descName={"Typ usługi:"} disabled />
      <Input type="text" value={values.client} descName={"Dla:"} disabled />
      <Input type="text" value={values.telNumber} descName={"Telefon:"} disabled />
      <Input type="text" value={values.address} descName={"Adres:"} disabled />
      <Input type="text" value={values.accessory} descName={"Wyposażenie:"} disabled />
      <Input type="text" value={values.deviceName} descName={"Nazwa urządzenia"} disabled />
      <Input type="text" value={values.deviceSerialNumber} descName={"Nr. seryjny sprzętu:"} disabled />
      <Input type="text" value={values.devicePassword} descName={"Hasła, pin:"} disabled />
      <Input type="text" value={values.commission} descName={"Zlecenie:"} disabled />
      <Input type="text" value={values.customerComment} descName={"Informacje od klienta:"} disabled />
      <Input type="text" value={values.vendorComment} descName={"Uwagi przyjmującego:"} disabled />
      <Input type="text" value={values.cost} descName={"Koszt:"} disabled />
      <Input type="text" value={values.endDate} descName={"Planowany termin realizacji:"} disabled />
      <Input type="submit" value="Zatwierdź" className="btn btn--success"
        onClick={() => {
          orderAccepted();
        }}
      />
    </React.Fragment>
  )
}

export default OrderSummary;