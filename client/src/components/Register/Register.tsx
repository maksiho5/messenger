import { useAppSelector } from '@/store/hooks';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
	getAccountRequest,
	refreshRequest,
	registerRequest,
} from '@/store/actions/actions';
import { useForm } from 'react-hook-form';
function Register() {
	const dispatch = useDispatch();
	const { register, handleSubmit } = useForm();
	const ok = useAppSelector((state) => state.ok);
	const refresh = useAppSelector((state) => state.refresh);

	const [loading, setLoading] = useState(true);
	useEffect(() => {
		if (localStorage.getItem('access_token')) {
			async function getAccount() {
				setLoading(true);
				try {
					await dispatch(getAccountRequest());
					if (ok === undefined) {
						await dispatch(refreshRequest());
					} else {
						setLoading(false);
					}
				} catch (e) {
					console.error(e);
				} finally {
					setLoading(false);
				}
			}

			getAccount();
		} else {
			setLoading(false);
		}
	}, [dispatch, ok, refresh]);

	const onSubmit = (data) => {
		if (data.password !== data.confirm_password) {
			alert('Пароли не равны');
			return;
		}

		const formData = new FormData();
		formData.append('name', data.name);
		formData.append('email', data.email);
		formData.append('password', data.password);
		formData.append('file', data.file[0]);
		dispatch(registerRequest(formData));
	};
	if (loading) {
		return <div>loading</div>;
	}
	return (
		<>
			{loading ? (
				<div>Загрузка...</div>
			) : (
				<div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gray-50">
					<h3 className="text-4xl font-bold text-purple-600">
						Регистрация
					</h3>
					{ok ? (
						<h1>Вы уже авторизованы</h1>
					) : (
						<div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-md sm:rounded-lg">
							<form onSubmit={handleSubmit(onSubmit)}>
								<div>
									<label
										htmlFor="name"
										className="block text-sm font-medium text-gray-700"
									>
										Name
									</label>
									<input
										type="text"
										{...register('name')}
										className="block w-full mt-1 border-gray-300 rounded-md"
									/>
								</div>
								<div className="mt-4">
									<label
										htmlFor="email"
										className="block text-sm font-medium text-gray-700"
									>
										Email
									</label>
									<input
										type="email"
										{...register('email')}
										className="block w-full mt-1 border-gray-300 rounded-md"
									/>
								</div>
								<div className="mt-4">
									<label
										htmlFor="password"
										className="block text-sm font-medium text-gray-700"
									>
										Password
									</label>
									<input
										type="password"
										{...register('password')}
										className="block w-full mt-1 border-gray-300 rounded-md"
									/>
								</div>
								<div className="mt-4">
									<label
										htmlFor="confirm_password"
										className="block text-sm font-medium text-gray-700"
									>
										Confirm Password
									</label>
									<input
										type="password"
										{...register('confirm_password')}
										className="block w-full mt-1 border-gray-300 rounded-md"
									/>
								</div>
								<div className="mt-4">
									<label
										htmlFor="file"
										className="block text-sm font-medium text-gray-700"
									>
										Аватар аккаунта
									</label>
									<input
										{...register('file')}
										type="file"
										className="block w-full mt-1 border-gray-300 rounded-md"
									/>
								</div>
								<div className="flex items-center justify-end mt-4">
									<a href="/login" className="text-sm">
										Вход
									</a>
									<button
										type="submit"
										className="inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white bg-gray-900 border rounded-md"
									>
										Регистрация
									</button>
								</div>
							</form>
						</div>
					)}
				</div>
			)}
		</>
	);
}

export default Register;
