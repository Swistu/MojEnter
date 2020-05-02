import React, { useState } from 'react';
import { database } from 'firebase';
import { useDispatch } from 'react-redux';

import { modal } from '../../store/actions';
import { SHOW } from '../../store/actionTypes'
import useForm from '../../hooks/useForm/useForm';

import OrderSummary from '../../components/OrderSummary/OrderSummary'
import Input from '../../components/UI/Input/Input';
import Card from '../../components/UI/Card/Card';

import './AddOrder.css';


const AddOrder = () => {
	const today = new Date();
  const dispatch = useDispatch();

	const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', seconds: '2-digit' };
	const orderAddDate = today.toLocaleDateString('pl-PL', dateOptions);
	const [addingOrder, setAddingOrder] = useState(null);

	const todayDate = () => {
		const year = today.getFullYear();
		const month = today.getMonth() < 9 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1

		return year + "/" + month;
	}

	const renderInputs = {
		payLoad: [
			{
				"type": "text",
				"descName": "Zlecenie nr:",
				"name": "orderNumber",
				"value": todayDate()
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

	const itemsToCheck = () => {
		return renderInputs.payLoad.reduce((previousValue, currentValue, i) => {
			if (i === 1)
				return { [previousValue.name]: previousValue.value ? previousValue.value : "", [currentValue.name]: currentValue.value ? currentValue.value : "" }
			else
				return { ...previousValue, [currentValue.name]: currentValue.value ? currentValue.value : "" }
		});
	}

	const addOrder = () => {
		setAddingOrder(true);
		const ordersRef = database().ref('orders/').push();
		const orderUID = ordersRef.key;

		const unassignedOrdersRef = database().ref('unassignedOrders/').push();
		const unassignedOrderUID = unassignedOrdersRef.key;

		const ordersHistoryRef = database().ref('ordersHistory/' + orderUID).push();

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
			"orderUID": orderUID,
			"password": "123",
		}

		const orderHistory = {
			status: "new",
			date: orderAddDate,
			description: "Zlecenie zostało przyjęte."
		}

		ordersHistoryRef.set(orderHistory)
			.catch(error => console.error(error));
		ordersRef.set(order)
			.catch(error => console.error(error));

		unassignedOrdersRef.set(unassignedOrder)
			.then(() => {
				document.getElementById("test").innerHTML = "Numer zlecenie dla klienta: " + unassignedOrderUID;
			})
			.catch(error => {
				console.error(error)
			});

		setAddingOrder(false);
	}

	const checkOrder = () => {
		dispatch(modal(SHOW, "Podsumowanie", <OrderSummary values={values} addOrder={addOrder} addingOrder={addingOrder}/>));
	}

	const { handleChange, handleSubmit, values, errors, isSubmitting } = useForm(checkOrder, itemsToCheck());
	return (
		<React.Fragment>
			<Card>
				<h1 className="card__title">Dodaj zlecenie</h1>
				<form onSubmit={handleSubmit}>
					{
						renderInputs.payLoad.map((res) => {
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
						})
					}
					<div id="test"></div>
				</form>
			</Card>
		</React.Fragment>
	)
}

export default AddOrder;