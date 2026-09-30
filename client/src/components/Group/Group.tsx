import React from 'react';
import PostTimestamp from '../PostTimestamp/PostTimestamp';
import './Group.css';

function Group({
	nameGroup,
	lastMessage,
	lastTime,
	read,
	iconGroup,
	online = false,
}) {
	return (
		<div className="group group">
			<div className="icon_group">
				<img src={iconGroup} alt="" />
				<div className={online ? 'green' : 'gray'}></div>
			</div>
			<div className="text_info">
				<h3>{nameGroup}</h3>
				<p>{lastMessage}</p>
			</div>
			<div className="info_time">
				<div className="time">
					<PostTimestamp createdAt={lastTime} />
				</div>
				<div className="read">
					<img src={`${read}.png`} alt="" />
				</div>
			</div>
		</div>
	);
}

export default Group;
