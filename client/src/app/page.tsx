'use client';
import { useAppSelector } from '@/store/hooks';
import { useDispatch } from 'react-redux';
import { getAccountRequest } from '@/store/actions/actions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Register from '@/components/Register/Register';

export default function App() {
	const router = useRouter();
	const dispatch = useDispatch();
	const ok = useAppSelector((state) => state.ok);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkAuthentication = async () => {
			setLoading(true);
			if (localStorage.getItem('access_token')) {
				await dispatch(getAccountRequest());
			}
			setLoading(false);
		};

		checkAuthentication();
	}, [dispatch]);

	useEffect(() => {
		if (ok) {
			router.push('/chat');
		}
	}, [ok, router]);

	if (loading) return <div>Loading...</div>;

	return ok ? null : <Register />;
}
