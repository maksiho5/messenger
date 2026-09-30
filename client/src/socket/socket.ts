import { SOCKET_URL } from '@/config';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store/hooks';
import { io } from 'socket.io-client';

const socket = io(SOCKET_URL);

const useSocketConnection = () => {
	const user = useAppSelector((state) => state.user);
	const dispatch = useDispatch();

	useEffect(() => {
		if (user !== undefined) {
			const handleConnect = () => {
				socket.emit('userStatusUpdate', {
					userId: user.id,
					online: true,
				});

				socket.emit('getChats', { userId: user.id });
			};

			const handleDisconnect = () => {
				socket.emit('userStatusUpdate', {
					userId: user.id,
					online: false,
				});
			};

			const handleGetChats = () => {
				socket.emit('getChats', { userId: user.id });
			};

			// Обработчик для получения чатов
			socket.on('getChats', (chats) => {
				dispatch({ type: 'CHAT', payload: chats });
			});

			socket.on('connect', handleConnect);
			socket.on('disconnect', handleDisconnect);

			handleGetChats();

			const handleBeforeUnload = () => {
				handleDisconnect(); // Отправляем обновления перед закрытием
			};

			window.addEventListener('beforeunload', handleBeforeUnload);

			return () => {
				socket.off('connect', handleConnect);
				socket.off('disconnect', handleDisconnect);
				socket.off('getChats');
				window.removeEventListener('beforeunload', handleBeforeUnload);
			};
		}
	}, [user]);

	return socket;
};

export { useSocketConnection };
