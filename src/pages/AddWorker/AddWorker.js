import React, { useState } from 'react';
import { auth, functions } from 'firebase';

import { Form as getFormInputs } from './Form';

import useForm from '../../hooks/useForm/useForm';
import Card from '../../components/UI/Card/Card';
import Spinner from '../../components/UI/Spinner/Spinner';

import './AddWorker.css';

const AddWorer = () => {

	const [addingWorker, setAddingWorker] = useState(false);
	const [userAdd, setUserAdd] = useState(false);
	const [userAddError, setUserAddError] = useState(false);

	const addWorker = () => {
		setAddingWorker(true);

		const serverAddWorker = functions().httpsCallable('addWorker');
		const serverResposne = auth().currentUser.getIdToken().then(async tokenID => {
			return await serverAddWorker({
				email: values.email,
				password: values.passwordFB,
				firstName: values.firstName,
				lastName: values.lastName,
				token: tokenID
			}).then(result => {
				return result;
			})
		})

		serverResposne
			.then(isWorkerAdd => {
				if (isWorkerAdd)
					setUserAdd(true);
			})
			.catch(() => {
				setUserAddError(<p>Wystąpił błąd przy dodawaniu pracownika. Sprobój ponownie później.</p>)
			})

		setAddingWorker(false);
	}

	const { handleSubmit, values, renderInputs } = useForm(addWorker, getFormInputs());
	return (
		<React.Fragment>
			<Card>
				{userAdd ? <p>Poprawnie dodano użytkownika</p> : addingWorker ? <Spinner /> :
					<React.Fragment>
						<form onSubmit={handleSubmit}>
							{
								renderInputs()
							}
						</form>
						{userAddError ? userAddError : null}
					</React.Fragment>
				}
			</Card>
		</React.Fragment>
	)
}

export default AddWorer;