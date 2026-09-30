'use client'; // Включаем клиентский рендеринг для использования Redux на клиенте

import { Provider } from 'react-redux';
import store from '@/store/store';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
	return <Provider store={store}>{children}</Provider>;
}
