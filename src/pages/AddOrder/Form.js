export const Form = () => {
	const todayDate = () => {
		const today = new Date();
		const year = today.getFullYear();
		const month = today.getMonth() < 9 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1
		return year + "/" + month;
	}

	return [
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
	];
}
