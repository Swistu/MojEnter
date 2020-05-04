import React, { useState } from 'react';
import { database } from 'firebase';
import { useDispatch } from 'react-redux';

import { Form as getFormInputs } from './Form';
import { modal } from '../../store/actions';
import { SHOW, HIDE } from '../../store/actionTypes'
import useForm from '../../hooks/useForm/useForm';

import OrderSummary from '../../components/OrderSummary/OrderSummary'
import Input from '../../components/UI/Input/Input';
import Card from '../../components/UI/Card/Card';
import Spinner from '../../components/UI/Spinner/Spinner';

import './AddOrder.css';

const AddOrder = () => {
	const today = new Date();
	const dispatch = useDispatch();

	const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', seconds: '2-digit' };
	const orderAddDate = today.toLocaleDateString('pl-PL', dateOptions);
	const [addingOrder, setAddingOrder] = useState(false);
	const [newOrderAccepted, setNewOrderAccepted] = useState(false);
	const [orderAddingSuccesful, setOrderAddingSuccesful] = useState(false);

	const checkOrder = () => {
		dispatch(modal(SHOW, "Podsumowanie", <OrderSummary values={values} orderAccepted={orderAccepted} />));
	}

	const orderAccepted = () => {
		dispatch(modal(HIDE));
		setNewOrderAccepted(true)
		addOrder();
	}

	console.log(getFormInputs());

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

		ordersHistoryRef.set(orderHistory);
		ordersRef.set(order);
		unassignedOrdersRef.set(unassignedOrder)
			.then(() => {
				setOrderAddingSuccesful(true);
				document.getElementById("test").innerHTML = "Numer zlecenie dla klienta: " + unassignedOrderUID;
			});

		setAddingOrder(false);
	}


	const renderFormInputs = () => {
		return getFormInputs().map((res) => {
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


	const { handleChange, handleSubmit, values, errors, isSubmitting } = useForm(checkOrder, getFormInputs());
	return (
		<React.Fragment>
			<Card>
				<form onSubmit={handleSubmit}>
					{
						newOrderAccepted ? addingOrder ? <Spinner />
							: orderAddingSuccesful ? <div id="test"></div>
								: "Wystapił problem przy dodawaniu zlecenia"
							: renderFormInputs()
					}
				</form>
			</Card>
		</React.Fragment>
	)
}

export default AddOrder;