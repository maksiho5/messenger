import React from 'react';

const SearchBar = ({
	search,
	handleSearchChange,
	onFocus,
	handleKeyDown,
	onClear,
}) => {
	return (
		<div className="search">
			<input
				type="text"
				placeholder="Поиск"
				value={search}
				onChange={handleSearchChange}
				onKeyDown={handleKeyDown}
				onFocus={onFocus}
			/>
			<img
				src={search ? 'close.svg' : 'send.svg'}
				alt="Send"
				className="button_send"
				onClick={onClear}
			/>
		</div>
	);
};

export default SearchBar;
