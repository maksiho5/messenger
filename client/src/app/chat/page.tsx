'use client';
import { useAppSelector } from '@/store/hooks';
import { API_URL } from '@/config';

import {
	getAccountRequest,
	refreshRequest,
	seacrhRequest,
} from '@/store/actions/actions';
import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import './chat.css';
import NavigationChats from '@/components/NavigationChats/NavigationChats';
import ChatSearch from '@/components/ChatSearch/ChatSearch';
import SearchBar from '@/components/SearchBar/SearchBar';
import { useSocketConnection } from '@/socket/socket';
function Chat() {
	const dispatch = useDispatch();
	const router = useRouter();
	const ok = useAppSelector((state) => state.ok);
	const image = useAppSelector((state) => state.image);
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(true);
	const [searchHistory, setSearchHistory] = useState(true);
	const navigationChatsRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		if (localStorage.getItem('access_token')) {
			(async () => {
				setLoading(true);
				try {
					await dispatch(getAccountRequest());
					if (ok === undefined) await dispatch(refreshRequest());
				} catch (e) {
					console.error(e);
				} finally {
					setLoading(false);
				}
			})();
		} else {
			setLoading(false);
		}
	}, [dispatch, ok]);

	useEffect(() => {
		if (!ok) router.replace('/');
	}, [ok, router]);

	useSocketConnection();

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
	};

	const handleSearchFocus = () => {
		if (navigationChatsRef.current) {
			navigationChatsRef.current.style.cssText =
				'background-color: #ffffff;width: 486px; height: 100%;border-radius: 25px; box-shadow: 0 4px 5px 2px #79c5ef61; padding: 25px;';
			setSearchHistory(false);
		}
	};

	const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			dispatch(seacrhRequest({ content: search }));
		}
	};
	const handleSearchClear = () => {
		if (search) {
			if (navigationChatsRef.current) {
				navigationChatsRef.current.style.cssText = '';
				setSearchHistory(true);
				setSearch('');
			}
		}
	};

	if (loading) return <div>loading</div>;

	return (
		<div className="container">
			<div className="row">
				<div className="navigation">
					<img
						src={`${API_URL}${image}`}
						alt="User Icon"
						className="icon"
					/>
					<div className="navigator">
						{[
							'codicon_home.svg',
							'Vector.svg',
							'bx_bell.svg',
							'settings.png',
						].map((src) => (
							<img key={src} src={src} alt="" />
						))}
					</div>
					<img src="exit.svg" alt="Exit" className="button_exit" />
				</div>
				<div className="navigation_friend">
					<SearchBar
						search={search}
						handleSearchChange={handleSearchChange}
						onFocus={handleSearchFocus}
						handleKeyDown={handleKeyDown}
						onClear={handleSearchClear}
					/>
					<div className="navigation_chats" ref={navigationChatsRef}>
						{searchHistory ? (
							<>
								<NavigationChats />
							</>
						) : search ? (
							<ChatSearch search={search} />
						) : (
							''
						)}
					</div>
				</div>
				<div className="chat"></div>
			</div>
		</div>
	);
}

export default Chat;
