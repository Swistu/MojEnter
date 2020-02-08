import React, { useState, useEffect } from 'react';
import firebase from 'firebase';

import './AddOrder.css';
import Input from '../../UI/Input/Input';
import Card from '../../UI/Card/Card';
import useForm from '../../../hooks/useForm/useForm';

const AddOrder = () => {
	const today = new Date();

	let todayMonth;
	let itemsToCheck;

	if (today.getMonth() < 9)
		todayMonth = "0" + (today.getMonth() + 1);
	else
		todayMonth = (today.getMonth() + 1);
	const todayDate = today.getFullYear() + "/" + todayMonth + "/";

	const renderInputs = {
		payLoad: [
			{
				"type": "text",
				"descName": "Zlecenie nr:",
				"name": "orderNumber",
				"value": todayDate
			},
			{
				"type": "text",
				"placeholder": "Wprowadź dla kogo jest zlecenie",
				"descName": "Dla:",
				"name": "client",
			},
			{
				"type": "tel",
				"placeholder": "Wprowadź numer telefonu",
				"descName": "Telefon:",
				"name": "telNumber",
			},
			{
				"type": "text",
				"placeholder": "Wprowadź adres",
				"descName": "Adres:",
				"name": "address",
			},
			{
				"type": "text",
				"placeholder": "Wprowadź nazwe urządzenia",
				"descName": "Nazwa urządzenia:",
				"name": "deviceName",
			},
			{
				"type": "text",
				"placeholder": "Wprowadź wyposażenie",
				"descName": "Wyposażenie:",
				"name": "accessory",
			},
			{
				"type": "text",
				"placeholder": "Wprowadź numer seryjny sprzętu",
				"descName": "Nr. seryjny sprzętu:",
				"name": "deviceSerialNumber",
			},
			{
				"type": "text",
				"placeholder": "Wprowadź uwagi jakie ma klient",
				"descName": "Informacje od klienta:",
				"name": "customerComment",
			},
			{
				"type": "text",
				"placeholder": "Wprowadź uwagi dot. sprzętu",
				"descName": "Uwagi przyjmującego:",
				"name": "vendorComment",
			},
			{
				"type": "text",
				"placeholder": "Wprowadź co jest do wykonania",
				"descName": "Zlecenie:",
				"name": "commission",
			},
			{
				"type": "number",
				"placeholder": "Wprowadź koszt naprawy",
				"descName": "Szacowany koszt:",
				"name": "cost",
			},
			{
				"type": "date",
				"placeholder": "Wybierz termin realizacji",
				"descName": "Planowany termin realizacji:",
				"name": "endDate",
			},
			{
				"type": "submit",
				"name": "sendForm",
				"value": "Dodaj zlecenie",
				"className": "btn btn--light"
			},
		]
	};



	renderInputs.payLoad.map(res => {
		itemsToCheck = {
			...itemsToCheck,
			[res.name]: res.value ? res.value : ""
		}
	});

	const { handleChange, handleSubmit, values, errors, isSubmitting } = useForm(addOrder, itemsToCheck);
	const [addingOrder, setAddingOrder] = useState(false);

	function addOrder(e) {
		setAddingOrder(true);

		const ordersRef = firebase.database().ref('orders/').push();
		const unassignedOrdersRef = firebase.database().ref('unassignedOrders/').push();

		const orderUniqueID = ordersRef.key;
		const unassignedOrderUniqueID = unassignedOrdersRef.key;

		const order = {
			"client": values.client,
			"address": values.address,
			"telNumber": values.telNumber,
			"orderID": values.orderNumber,
			"deviceName": values.deviceName,
			"accessory": values.accessory,
			"deviceSerialNumber": values.deviceSerialNumber,
			"cost": values.cost,
			"endDate": values.endDate,
			"commission": values.commission,
			"customerComment": values.customerComment,
			"vendorComment": values.vendorComment,
		}
		const unassignedOrder = {
			"orderUniqueID": orderUniqueID,
			"password": "123",
		}

		ordersRef.set(order)
			.then()
			.catch(error => console.error(error));

		unassignedOrdersRef.set(unassignedOrder)
			.then(res => {
				setAddingOrder(false);

				document.getElementById("test").innerHTML = "Numer zlecenie dla klienta: " + unassignedOrderUniqueID;
			})
			.catch(error => {
				console.error(error)
				setAddingOrder(false);
			});
	}

	return (
		<React.Fragment>

			<Card>
				<h1 className="card__title">Dodaj zlecenie</h1>
				<form onSubmit={handleSubmit}>
					{renderInputs.payLoad.map((res) => {
						if (res.type !== "submit")
							return <React.Fragment key={res.name}>
								<Input
									{...res}
									onChange={handleChange}
									value={values[res.name]}
									className={isSubmitting ? errors[res.name] ? "input--invalid" : "input--valid" : null}
								/>
								{errors[res.name] && <p className={"feedback feedback--invalid"}>{errors[res.name]}</p>}
							</React.Fragment>
						else
							return <React.Fragment key={res.name}>
								<Input {...res} />
								{Object.entries(errors).length === 0 && errors.constructor === Object ? null : <p className={"feedback feedback--invalid"}>{"Proszę poprawić błędy w formularzu"}</p>}
							</React.Fragment>
					})}
					<div id="test"></div>
				</form>
			</Card>
		</React.Fragment>
	)
}

export default AddOrder;

{
	/* <label htmlFor="type-client">
		<span className="label__text">Wybierz rodzaj klienta:</span>
	</label>
	<select id="type-client" className="form-control" onChange={e => setClientType(e.target.value)}>
		<option value="individual" defaultValue>Klient indywidalny</option>
		<option value="company">Firma</option>
	</select> */
}