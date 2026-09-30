import { useAppSelector } from '@/store/hooks';
import { API_URL } from '@/config';
import React from 'react';
import Group from '../Group/Group';
import NavigationChatsSearch from '../NavigationChatsSearch/NavigationChatsSearch';
import './ChatSearch.css';
import { useDispatch } from 'react-redux';
import { frinedAddRequest } from '@/store/actions/actions';
function ChatSearch({ search }) {
	const dispatch = useDispatch();

	const searchUser = useAppSelector((state) => state.userSearch);

	const addFriend = () => {

		dispatch(frinedAddRequest({ id: searchUser.id }));
	};
	return (
		<>
			<div className="existing-chats">
				<h2 className="title">Новые чаты</h2>
				{!searchUser.err && searchUser.name ? (
					<div
						className="group content"
						data-id={searchUser.id}
						onClick={addFriend}
					>
						<Group
							nameGroup={searchUser.name}
							lastMessage={''}
							lastTime={searchUser.lastOnline}
							iconGroup={`${API_URL}${searchUser.image}`}
							read={''}
							online={searchUser.online}
						/>
					</div>
				) : (
					<>
						<h2 className="err_search">Такого пользователя нет</h2>
					</>
				)}
			</div>
			<div className="existing-chats top">
				<h2 className="title">Чаты</h2>
				{search ? <NavigationChatsSearch search={search} /> : ''}
			</div>
		</>
	);
}

export default ChatSearch;
