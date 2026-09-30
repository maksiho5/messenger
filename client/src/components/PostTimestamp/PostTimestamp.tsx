import { format, isToday, isYesterday } from 'date-fns';

const PostTimestamp = ({ createdAt }) => {
	const date = new Date(String(createdAt));
	const month = date.getMonth() + 1;
	const day = date.getDate();

	let formattedDate;

	if (isToday(date)) {
		formattedDate = `Сегодня, ${format(date, 'HH:mm')}`;
	} else if (isYesterday(date)) {
		formattedDate = `Вчера, ${format(date, 'HH:mm')}`;
	} else {
	}

	if (isToday(date) && isYesterday(date)) {
		formattedDate = `был(а) в ${day} ${month} ${format(date, 'HH:mm')}`;
	}

	return <span>{formattedDate}</span>;
};

export default PostTimestamp;
