import { useAppSelector } from '@/store/hooks';
import { API_URL } from '@/config';
import React from 'react';
import Group from '../Group/Group';

function NavigationChats() {
	const chat = useAppSelector((state) => state.chat);
	const newChat: typeof chat = [];
	chat.forEach((el) => {
		newChat.push(el);
	});

	return (
		<>
			<div className="groups">
				<h2 className="title">Группы</h2>
				<div className="row">
					{/* Здесь можно добавить отображение групп, если нужно */}
				</div>
			</div>
			<div className="friends">
				<h2 className="title">Люди</h2>
				<div className="row">
					{chat.map((el) => {
						return (
							<Group
								key={el.id}
								nameGroup={el.friendAccount.name}
								lastMessage={el.friendAccount.lastMessage}
								lastTime={el.friendAccount.lastOnline}
								iconGroup={
									API_URL +
									el.friendAccount.image
								}
								online={el.friendAccount.online}
								read={el.friendAccount.isRead ? 'read' : ''}
							/>
						);
					})}
				</div>
			</div>
		</>
	);
}

export default NavigationChats;
