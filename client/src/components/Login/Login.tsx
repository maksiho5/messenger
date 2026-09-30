import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import {
	getAccountRequest,
	loginRequest,
	refreshRequest,
} from '@/store/actions/actions';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

function Login() {
	const dispatch = useDispatch();
	const { register, handleSubmit } = useForm();
	const ok = useAppSelector((state) => state.ok);

	const refresh = useAppSelector((state) => state.refresh);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const cookie = document.cookie;
		if (cookie && localStorage.getItem('access_token')) {
			async function getAccount() {
				setLoading(true);
				try {
					await dispatch(getAccountRequest());
					if (ok === undefined) {
						await dispatch(refreshRequest());
					} else {
						setLoading(true);
					}
				} catch {
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
		dispatch(loginRequest(data));
	};

	if (loading) {
		return <div>loading</div>;
	}
	return (
		<div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gray-50">
			<h3 className="text-4xl font-bold text-purple-600">Вход</h3>
			<div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-md sm:rounded-lg">
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="mt-4">
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							Почта
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
							Пароль
						</label>
						<input
							type="password"
							{...register('password')}
							className="block w-full mt-1 border-gray-300 rounded-md"
						/>
					</div>
					<div className="flex items-center justify-end mt-4">
						<Link href="/" className="text-sm">
							Регистрация
						</Link>
						<button
							type="submit"
							className="inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white bg-gray-900 border rounded-md"
						>
							Вход
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Login;
