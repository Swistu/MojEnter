

export const Form = () => [
	{
		"type": "text",
		"descName": "Zlecenie nr:",
		"name": "orderNumber",
		"value": "Wczytywanie",
		"readOnly": "readOnly"
	},
	{
		"type": "select",
		"options": [
			{ "value": "", "showValue": "--Wybierz opcje--" },
			{ "value": "a", "showValue": "Płatna" },
			{ "value": "b", "showValue": "Bezpłatna" },
			{ "value": "d", "showValue": "Ustawa dot. sprzedaży" },
			{ "value": "c", "showValue": "Gwarancja producenta" },
		],
		"descName": "Typ usługi:",
		"name": "claimType",
	},
	{
		"type": "text",
		"placeholder": "Wprowadź adres E-mail",
		"descName": "Adres E-mail:",
		"name": "email",
	},
	{
		"type": "text",
		"placeholder": "Wprowadź dla kogo jest zlecenie",
		"descName": "Dla:",
		"name": "client",
	},
	{
		"type": "text",
		"placeholder": "Wprowadź ulice",
		"descName": "Ulica:",
		"name": "address",
	},
	{
		"type": "tel",
		"placeholder": "Wprowadź numer telefonu",
		"descName": "Telefon:",
		"name": "telNumber",
	},
	{
		"type": "text",
		"placeholder": "Wprowadź Urządzenie",
		"descName": "Urządzenie:",
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
		"placeholder": "Wprowadź numer seryjne sprzętu",
		"descName": "Nr. seryjne sprzętu:",
		"name": "deviceSerialNumber",
	},
	{
		"type": "text",
		"placeholder": "Wprowadź hasła, piny do urządzenia",
		"descName": "Hasła, pin:",
		"name": "devicePassword",
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
		"placeholder": "Wprowadź koszt usługi",
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

