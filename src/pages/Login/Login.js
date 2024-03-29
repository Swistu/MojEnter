import React, { useState } from 'react';
import { auth, database } from 'firebase';
import { useHistory } from 'react-router-dom';

import { Form as getFormInputs } from './Form';
import useForm from '../../hooks/useForm/useForm';
import Spinner from '../../components/UI/Spinner/Spinner';

import './Login.css';

const Login = () => {
	const history = useHistory();
	const [isLogging, setIsLogging] = useState(false);

	const signIn = () => {
		setIsLogging(true);
		auth().signInWithEmailAndPassword(values.email, values.passwordFB)
			.catch((error) => {
				console.log(error);
				errors.email = "";
				errors.passwordFB = "";
			})
			.finally(() => {
				setIsLogging(false)
			})
	}

	const signInGoogle = () => {
		setIsLogging(true);
		const provider = new auth.GoogleAuthProvider();
		auth().useDeviceLanguage();
		auth().signInWithPopup(provider)
			.then(data => {
				if (data) {
					const userRef = database().ref('users/' + data.user.uid);
					userRef.once("value", (snapshot) => {
						if (!snapshot.exists()) {
							const payLoad = {
								name: data.user.displayName,
								email: data.user.email,
								photoURL: data.user.photoURL,
								phoneNumber: data.user.phoneNumber,
							}
							userRef.set(payLoad)
						}
					})
				}
			})
			.finally(() => {
				setIsLogging(false)
			})
	}

	const redirectToRegistration = () => {
		history.push("/rejestracja");
	}
	const redirectToPasswordRecover = () => {
		history.push("/przypomnienie-hasla");
	}
	const { handleSubmit, values, errors, renderInputs } = useForm(signIn, getFormInputs());
	return (
		<React.Fragment>
			{
				isLogging ? <Spinner style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }} /> :
					<div className="auth__desc">
						<img src="https://www.adminmart.com/src/assets/images/big/icon.png" alt="wrapkit" />
						<h2 className="auth__header">Zaloguj się</h2>
						<p className="text">Wprowadź adres Email, żeby zalogować się do panelu.</p>
						<form onSubmit={handleSubmit}>
							{(errors.email === "" || errors.passwordFB === "") ? <p className={"feedback feedback--invalid"} style={{ marginTop: "20px" }}>Podany email lub hasło jest błędne</p> : null}
							{renderInputs()}
						</form>
						<div className="google__button" onClick={signInGoogle}><div className="googleIcon"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 48 48" className="abcRioButtonSvg"><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></g></svg></div><span>Zaloguj przez Google</span></div>
						<p style={{ marginTop: "40px" }}>Nie posiadasz konta? <span className="text-danger link" onClick={redirectToRegistration}>Utwórz je</span></p>
						{(errors.email === "" || errors.passwordFB === "") ? <p>Zapomniałeś hasło? <span className="text-danger link" onClick={redirectToPasswordRecover}>Przypomnij</span></p> : null}
					</div>
			}
		</React.Fragment>
	);
}

export default Login;