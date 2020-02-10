import React, { useState, useEffect } from 'react';
import firebase, { auth, database } from 'firebase';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from '../../actions/';
import Input from '../UI/Input/Input'

import './Login.css';
import Spinner from '../UI/Spinner/Spinner';
import useForm from '../../hooks/useForm/useForm';
import Registration from '../Registration/Registration';

const Login = (props) => {
	let itemsToCheck;
	const user = useSelector(state => state.authenticationReducer.user);
	const dispatch = useDispatch();

	const [isLogging, setIsLogging] = useState(false);
	const [isSigningup, setIsSigningup] = useState(false);
	const [googleSignIn, setGoogleSignIn] = useState(false);
	const [googleAccountReady, setGoogleAccountReady] = useState(false);
	const [showRegisterForm, setShowRegisterForm] = useState(false);

	useEffect(() => {
		if (user) {
			props.history.push("/dashboard");
		}
	}, [user])

	useEffect(() => {

	}, [googleSignIn]);

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



	function signIn() {
		setIsLogging(true);

		auth().signInWithEmailAndPassword(values.emailFB, values.passwordFB)
			.catch(error => {
				errors.emailFB = "";
				errors.passwordFB = "";
				setIsLogging(false);
			});
	}



	const signInGoogle = () => {
		setIsLogging(true);
		setGoogleSignIn(true);
		var provider = new firebase.auth.GoogleAuthProvider();

		auth().useDeviceLanguage();
		auth().signInWithPopup(provider).then(function (data) {
			const userRef = database().ref('users/' + data.user.uid);

			userRef.once("value", (snapshot) => {
				if (!snapshot.exists()) {
					const payLoad = {
						accountType: "Annomyous"
					}
					userRef.set(payLoad).then(setGoogleAccountReady(true))
				} else {
					setGoogleAccountReady(true);
				}
			})
		});
	}

	const showRegisterHandler = () => {
		setShowRegisterForm(!showRegisterForm)
	}

	return (
		user ? <Spinner /> : <div className="auth__box">
			<div className="auth__image" style={{ backgroundImage: "url(https://cdn.pixabay.com/photo/2018/07/01/16/52/hardware-3509891_960_720.jpg)" }}>
			</div>
			<div className="auth__form">
				<div className="auth__desc">
					{showRegisterForm ? <Registration showRegisterHandler={showRegisterHandler} /> : isLogging ? <Spinner /> : <React.Fragment>
						<h2 className="auth__header">Zaloguj się</h2>
						<p className="text">Wprowadź adres Email, żeby zalogować się do panelu.</p>
						<form onSubmit={handleSubmit}>

							{(errors.emailFB === "" || errors.passwordFB === "") && <p className={"feedback feedback--invalid"} style={{ marginTop: "20px" }}>Podany email lub hasło jest błędne</p>}
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
						</form>


						<img src="/assets/btn_google_signin_light_normal_web@2x.png" onClick={signInGoogle} style={{ width: "60%" }} />
						<p style={{ marginTop: "26px" }}>Nie posiadasz konta? <span className="text-danger link" onClick={showRegisterHandler}>Utwórz je</span></p>
						{/* <button className="btn btn--dark" > Zarejestruj sie </button> */}
					</React.Fragment>}



				</div>
			</div>
		</div >
	);
}

export default Login;