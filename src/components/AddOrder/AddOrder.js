import React, { useState } from 'react';
import firebase from 'firebase';

import './AddOrder.css';
import Input from '../UI/Input/Input';
import Card from '../UI/Card/Card';

const AddOrder = () => {

	const today = new Date();

	let todayMonth;

	if (today.getMonth() < 9)
		todayMonth = "0" + (today.getMonth() + 1);
	else
		todayMonth = (today.getMonth() + 1);

	const todayDate = today.getFullYear() + "/" + todayMonth + "/";
	const [addingOrder, setAddingOrder] = useState(false);

	const [name, setName] = useState("");
	const [surName, setSurName] = useState("");
	const [nip, setNip] = useState("");
	// const [email, setEmail] = useState("");
	const [address, setAddress] = useState("");
	const [telNumber, setTelNumber] = useState("");
	const [cost, setCost] = useState(0);
	const [endDate, setEndDate] = useState("");
	const [orderValue, setOrder] = useState("");
	const [customerComment, setCustomerComment] = useState("");
	const [vendorComment, setVendorComment] = useState("");

	const [commissionSend, setCommissionSend] = useState(false);
	const [clientType, setClientType] = useState("individual");
	const [orderNumber, setOrderNumber] = useState(todayDate);



	const addOrder = (e) => {
		e.preventDefault();
		setAddingOrder(true);

		const ordersRef = firebase.database().ref('orders/').push();
		const unassignedOrdersRef = firebase.database().ref('unassignedOrders/').push();
		const clientsRef = firebase.database().ref('clients/').push();

		const orderUniqueID = ordersRef.key;
		const unassignedOrderUniqueID = unassignedOrdersRef.key;
		const clientUniqueID = clientsRef.key;

		console.log(unassignedOrderUniqueID);
		

		const client = {
			"clientType": clientType,
			"address": address,
			"telNumber": telNumber,
			"Company": {
				"nip": nip,
			},
			"Individual": {
				"name": name,
				"surName": surName,
			}
		}
		const order = {
			"orderID": orderNumber,
			"cost": cost,
			"endDate": endDate,
			"order": orderValue,
			"customerComment": customerComment,
			"vendorComment": vendorComment,
			"clientUniqueID": clientUniqueID,
		}
		const unassignedOrder = {
			"orderUniqueID": orderUniqueID,
			"clientUniqueID": clientUniqueID,
			"password": "123",
		}

		ordersRef.set(order)
			.then()
			.catch(error => console.error(error));

		clientsRef.set(client)
			.then()
			.catch(error => console.error(error));

		unassignedOrdersRef.set(unassignedOrder)
			.then(res => {
				setAddingOrder(false);
				// document.getElementById("key").innerHTML = unassignedOrderUniqueID;
			})
			.catch(error => {
				console.error(error)
				setAddingOrder(false);
			});
	}





	return (
		<React.Fragment>

			<h1 className="page__title">Dodaj zlecenie</h1>
			<Card>
				<React.Fragment>
					<form onSubmit={(e) => addOrder(e)}>
						<Input type="text" name="orderNumber" defaultValue={orderNumber} descName="Zlecenie nr:" onChange={(e) => setOrderNumber(e.target.value)} />
						<label htmlFor="type-client">
							<span className="label__text">Wybierz rodzaj klienta:</span>
						</label>
						<select id="type-client" className="form-control" onChange={(e) => setClientType(e.target.value)}>
							<option value="individual" defaultValue>Klient indywidalny</option>
							<option value="company">Firma</option>
						</select>

						{
							clientType === "individual" ? (
								<React.Fragment>
									<Input type="text" placeholder="Wprowadź imię" descName="Imię:" name="name" onChange={(e) => setName(e.target.value)} />
									<Input type="text" placeholder="Wprowadź nazwisko" descName="Nazwisko:" name="surName" onChange={(e) => setSurName(e.target.value)} />
								</React.Fragment>) :
								<Input type="text" placeholder="Wprowadź NIP" descName="NIP:" name="nip" onChange={(e) => setNip(e.target.value)} />
						}

						{/* <Input type="email" placeholder="Wprowadź E-mail" descName="E-mail:" name="email" onChange={(e) => inputChangeHandler(e)}/> */}
						<Input type="tel" placeholder="Wprowadź numer telefonu" descName="Telefon:" name="telNumber" onChange={(e) => setTelNumber(e.target.value)} />
						<Input type="text" placeholder="Wprowadź adres" descName="Adres:" name="address" onChange={(e) => setAddress(e.target.value)} />
						<Input type="text" placeholder="Wprowadź uwagi jakie ma klient" descName="Uwagi klienta:" name="customerComment" onChange={(e) => setCustomerComment(e.target.value)} />
						<Input type="text" placeholder="Wprowadź uwagi dot. sprzętu" descName="Uwagi przyjmującego:" name="vendorComment" onChange={(e) => setVendorComment(e.target.value)} />
						<Input type="text" placeholder="Wprowadź co jest do wykonania" descName="Zlecenie:" name="commission" onChange={(e) => setOrder(e.target.value)} />
						<Input type="number" placeholder="Wprowadź koszt naprawy" descName="Szacowany koszt:" name="cost" onChange={(e) => setCost(e.target.value)} />
						<Input type="date" placeholder="Wprowadź imię" descName="Szacowany termin oddania:" name="endDate" onChange={(e) => setEndDate(e.target.value)} />
						<Input type="submit" value="Dodaj zlecenie" />
					</form>
					{/* <div id="Key"></div> */}
				</React.Fragment>
			</Card>
		</React.Fragment>

	)
}

export default AddOrder;