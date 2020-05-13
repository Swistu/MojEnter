import React, { useState, useEffect } from 'react';
import firebase, { auth, database, functions } from 'firebase';
import { useDispatch } from 'react-redux';

import { Form as getFormInputs } from './Form';
import { modal } from '../../store/actions';
import { SHOW, HIDE } from '../../store/actionTypes'
import useForm from '../../hooks/useForm/useForm';

import OrderSummary from '../../components/OrderSummary/OrderSummary'
import Card from '../../components/UI/Card/Card';
import Spinner from '../../components/UI/Spinner/Spinner';
import NewOrderExcelFile from '../../components/Admin/NewOrderExcelFile/NewOrderExcelFile';

import './AddOrder.css';

const AddOrder = () => {
	const today = new Date();
	const dispatch = useDispatch();

	const [addingOrder, setAddingOrder] = useState(false);
	const [newOrderAccepted, setNewOrderAccepted] = useState(false);
	const [orderAddingSuccesful, setOrderAddingSuccesful] = useState(false);

	const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', seconds: '2-digit' };
	const orderAddDate = today.toLocaleDateString('pl-PL', dateOptions);

	const checkOrder = () => {
		dispatch(modal(SHOW, "Podsumowanie", <OrderSummary values={values} orderAccepted={orderAccepted} />));
	}

	const orderAccepted = () => {
		dispatch(modal(HIDE));
		setNewOrderAccepted(true)
		addOrder();
	}

	const addOrder = () => {
		setAddingOrder(true);
		const addMessage = functions().httpsCallable('checkUserByMail');

		const orderOwner = auth().currentUser.getIdToken().then(async tokenID => {
			return await addMessage({ email: values.email, token: tokenID }).then(result => {
				return result;
			})
		})

		orderOwner.then(ownerUID => {
			const orderRef = database().ref("orders/").push();
			const orderUID = orderRef.key;
			const userOrdersRef = database().ref('users/' + ownerUID.data + "/orders");
			const ordersHistoryRef = database().ref('ordersHistory/' + orderUID).push();
			const orderOwnerUIDRef = database().ref('orderOwnerUID/' + orderUID);
			const appSettingsRef = database().ref('appSettings/');
			const unassignedOrderRef = database().ref('unassignedOrders/').push();
			const currentOrderNumber = values.orderNumber.substring(values.orderNumber.lastIndexOf('/') + 1)

			const order = {
				"orderID": values.orderNumber,
				"claimType": values.claimType,
				"client": values.client,
				"address": values.address,
				"email": values.email,
				"telNumber": values.telNumber,
				"deviceName": values.deviceName,
				"accessory": values.accessory,
				"deviceSerialNumber": values.deviceSerialNumber,
				"devicePassword": values.devicePassword,
				"vendorComment": values.vendorComment,
				"customerComment": values.customerComment,
				"commission": values.commission,
				"cost": values.cost,
				"endDate": values.endDate,
				"userUID": ownerUID.data ? ownerUID.data : "unassignedOrder"
			}
			const orderHistory = {
				"status": "new",
				"date": orderAddDate,
				"description": "Zlecenie zostało przyjęte."
			}
			const appSettings = {
				"currentOrderNumber": parseInt(currentOrderNumber, "10") + 1
			}
			const orderOwner = {
				"userUID": ownerUID.data ? ownerUID.data : "unassignedOrder"
			}
			const userOrders = {
				[orderUID]: true
			}
			const unassignedOrder = {
				"orderUID": orderUID
			}

			unassignedOrderRef.set(unassignedOrder);
			orderOwnerUIDRef.set(orderOwner);
			ordersHistoryRef.set(orderHistory);
			orderRef.set(order);
			appSettingsRef.update(appSettings);

			if (ownerUID.data) {
				userOrdersRef.update(userOrders);

				const notificationsRef = database().ref('notifications/' + ownerUID.data).push();
				const notificationsData = {
					"orderUID": orderUID,
					"timestamp": firebase.database.ServerValue.TIMESTAMP,
					"type": "newOrder",
					"read": "false",
				}
				notificationsRef.set(notificationsData);
			}
			setOrderAddingSuccesful(true);
		})

		setOrderAddingSuccesful(true);
		setAddingOrder(false);
	}

	useEffect(() => {
		const today = new Date();
		const year = today.getFullYear();
		const month = today.getMonth() < 9 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1

		database().ref('appSettings/').on("value", (snapshot) => {
			if (snapshot && snapshot.val()) {
				const data = snapshot.val();

				changeValue("orderNumber", year + "/" + month + "/" + data.currentOrderNumber);
			}
		});
		// eslint-disable-next-line
	}, [])

	const { handleSubmit, values, renderInputs, changeValue } = useForm(checkOrder, getFormInputs());
	return (
		<React.Fragment>
			<Card>
				<form onSubmit={handleSubmit}>
					{
						newOrderAccepted ? addingOrder ? <Spinner />
							: orderAddingSuccesful ?
								<NewOrderExcelFile data={values} />
								: "Wystapił problem przy dodawaniu zlecenia"
							: renderInputs()
					}
				</form>
			</Card>
		</React.Fragment>
	)
}

export default AddOrder;