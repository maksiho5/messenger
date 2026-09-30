export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';
export const REFRESH = 'REFRESH';
export const REFRESH_FAILURE = 'REFRESH_FAILURE';
export const REFRESH_REQUEST = 'REFRESH_REQUEST';
export const GET_ACCOUNT_REQUEST = 'GET_ACCOUNT_REQUEST';
export const GET_ACCOUNT = 'GET_ACCOUNT';
export const GET_ACCOUNT_FAILURE = 'GET_ACCOUNT_FAILURE';

export const SEARCH = 'SEARCH';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';
export const SEARCH_REQUEST = 'SEARCH_REQUEST';

export const ADD_FRIEND_REQUEST = 'ADD_FRIEND_REQUEST';
export const ADD_FRIEND = 'ADD_FRIEND';
export const ADD_FRIEND_FAILURE = 'ADD_FRIEND_FAILURE';

export const loginRequest = <T>(data: T) => ({
	type: LOGIN_REQUEST,
	payload: data,
});
export const registerRequest = <T>(data: T) => ({
	type: REGISTER_REQUEST,
	payload: data,
});
export const refreshRequest = () => ({ type: REFRESH_REQUEST });
export const getAccountRequest = () => ({ type: GET_ACCOUNT_REQUEST });

export const seacrhRequest = <T>(data: T) => ({
	type: SEARCH_REQUEST,
	payload: data,
});

export const frinedAddRequest = <T>(data: T) => ({
	type: ADD_FRIEND_REQUEST,
	payload: data,
});
