import React, { useState, useEffect } from 'react';

import Input from '../UI/Input/Input'

import './Login.css';

const Login = (props) => {

	const [login, setLogin] = useState();
	const [password, setPassword] = useState();



	const signIn = (e) => {
		e.preventDefault();


	}


	const signUp = (e) => {
		e.preventDefault();


	}


	return (
		<div className="auth__box">
			<div className="auth__image" style={{ backgroundImage: "url(https://cdn.pixabay.com/photo/2018/07/01/16/52/hardware-3509891_960_720.jpg)" }}>
			</div>
			<div className="auth__form">
				<div className="auth__desc">
					<h2 className="auth__header">Zaloguj się</h2>
					<p className="text">Wprowadź numer zlecenie albo Email, aby zalogować się do panelu.</p>
					<form style={{ marginTop: "26px" }}>
							<Input type="text" placeholder="Wprowadź login" descName="Użytkownik:" name="login" onChange={(e) => setLogin(e.target.value)} />
							<Input type="password" placeholder="Wprowadź hasło" descName="Hasło:" name="password" onChange={(e) => setPassword(e.target.value)} />
							<button className="btn btn--dark" onClick={e => signIn(e)} style={{ marginRight: 50 }}> zaloguj sie </button>
							<button className="btn btn--dark" onClick={e => signUp(e)}> zarejestruj sie </button>
					</form>
				</div>
			</div>
		</div>
	)
}

export default Login;