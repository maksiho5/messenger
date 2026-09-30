import React from 'react';
import Group from '../Group/Group';
import './NavigationChatsSearch.css';
function NavigationChatsSearch({ search }) {
	const chats = [
		{
			name: 'Друзья навсегда',
			lastMessage: 'Хахахахах',
			lastTime: 'Сегодня, 21.52',
			iconGroup: 'icon_grup.svg',
		},
		{
			name: 'Чат 1',
			lastMessage: 'Как дела?',
			lastTime: 'Вчера, 15.30',
			iconGroup: 'icon_grup.svg',
		},
	];

	const filteredChats = search
		? chats.filter((chat) =>
				chat.name.toLowerCase().includes(search.toLowerCase())
			)
		: chats;

	console.log(
		filteredChats.length ? (
			<div className="row">
				{filteredChats.map((chat, index) => (
					<Group
						key={index}
						nameGroup={chat.name}
						lastMessage={chat.lastMessage}
						lastTime={chat.lastTime}
						iconGroup={chat.iconGroup}
						read={'read'}
					/>
				))}
			</div>
		) : (
			''
		)
	);

	return (
		<>
			{filteredChats.length ? (
				<div className="group content">
					<div className="row">
						{filteredChats.map((chat, index) => (
							<Group
								key={index}
								nameGroup={chat.name}
								lastMessage={chat.lastMessage}
								lastTime={chat.lastTime}
								iconGroup={chat.iconGroup}
								read={'read'}
							/>
						))}
					</div>
				</div>
			) : (
				<>
					<h2 className="err_search">Не найдено такого чата</h2>
				</>
			)}
		</>
	);
}

export default NavigationChatsSearch;
