import React, { useState, useEffect } from 'react';

import Input from '../UI/Input/Input'
import firebase from 'firebase';

import './Login.css';
import Spinner from '../UI/Spinner/Spinner';
import useForm from '../../hooks/useForm/useForm';

const Login = (props) => {
	let itemsToCheck;

	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const [login, setLogin] = useState();
	const [password, setPassword] = useState();
	const [isLogging, setIsLogging] = useState(false);

	const renderInputs = {
		payLoad: [
			{
				"type": "text",
				"descName": "Email:",
				"placeholder": "Wprowadź email",
				"name": "emailFB",
			},
			{
				"type": "password",
				"descName": "Hasło:",
				"placeholder": "Wprowadź hasło",
				"name": "passwordFB",
			},
			{
				"type": "submit",
				"name": "sendForm",
				"value": "Zaloguj się",
				"className": "btn btn--dark"
			},
		]
	};
	renderInputs.payLoad.map(res => {
		itemsToCheck = {
			...itemsToCheck,
			[res.name]: res.value ? res.value : ""
		}
	});

	const { handleChange, handleSubmit, values, errors, isSubmitting } = useForm(signIn, itemsToCheck);

	useEffect(() => {
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				setIsAuthenticated(true);
				props.history.push("/dashboard");
			}
		});
	}, []);

	function signIn() {
		setIsLogging(true);
		console.log(values.email);

		firebase.auth().signInWithEmailAndPassword(values.emailFB, values.passwordFB)
			.catch(error => {
				console.log(error.code);
				console.log(error.message);
				errors.emailFB = "";
				errors.passwordFB = "";

				console.log(errors)
				setIsLogging(false);
			});
	}

	const signUp = (e) => {
		e.preventDefault();
		setIsLogging(true);

		firebase.auth().createUserWithEmailAndPassword(login, password)
			.then((data) => {
				const userRef = firebase.database().ref('users/' + data.user.uid);
				const payLoad = {
					accountType: "Annomyous"
				}
				userRef.set(payLoad)
					.then()
					.catch(error => console.error(error));
			})
			.catch(
				setIsLogging(false)
			);
	}

	return (isAuthenticated ? <Spinner /> : <div className="auth__box">
		<div className="auth__image" style={{ backgroundImage: "url(https://cdn.pixabay.com/photo/2018/07/01/16/52/hardware-3509891_960_720.jpg)" }}>
		</div>
		<div className="auth__form">
			<div className="auth__desc">
				<h2 className="auth__header">Zaloguj się</h2>
				<p className="text">Wprowadź adres Email, żeby zalogować się do panelu.</p>
				<form onSubmit={handleSubmit}>
					{
						isLogging ? <Spinner /> :
							<React.Fragment>
								{(errors.emailFB === "" || errors.passwordFB === "") && <p className={"feedback feedback--invalid"} style={{marginTop: "20px"}}>Podany email lub hasło jest błędne</p>}
								{renderInputs.payLoad.map((res) => {
									if (res.type !== "submit")
										return <React.Fragment key={res.name}>
											<Input
												{...res}
												onChange={handleChange}
												value={values[res.name]}
												className={isSubmitting ? errors[res.name] || errors[res.name] === "" ? "input--invalid" : "input--valid" : null}
											/>
											{errors[res.name] && <p className={"feedback feedback--invalid"}>{errors[res.name]}</p>}
										</React.Fragment>
									else
										return <React.Fragment key={res.name}>
											<Input {...res} />
										</React.Fragment>
								})}
							</React.Fragment>
					}
				</form>
				<button className="btn btn--dark" > Zarejestruj sie </button>
			</div>
		</div>
	</div>);
}

export default Login;