'use client';
import { useAppSelector } from '@/store/hooks';

import React from 'react';
import Login from '@/components/Login/Login';

export default function LoginApp() {
	const ok = useAppSelector((state) => state.ok);

	return ok ? <div>Вы уже авторизаваны</div> : <Login />;
}
