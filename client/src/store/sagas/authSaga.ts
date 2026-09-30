import { API_URL } from '@/config';
import { call, put, takeLatest } from 'redux-saga/effects';
import axios, { type AxiosResponse } from 'axios';
import { LoginAction, RegisterAction, SearchAction } from './interface';
import {
	LOGIN_REQUEST,
	LOGIN_SUCCESS,
	LOGIN_FAILURE,
	REGISTER_REQUEST,
	REGISTER_SUCCESS,
	REGISTER_FAILURE,
	REFRESH_FAILURE,
	REFRESH,
	REFRESH_REQUEST,
	GET_ACCOUNT_FAILURE,
	GET_ACCOUNT,
	GET_ACCOUNT_REQUEST,
	SEARCH_REQUEST,
	SEARCH,
	SEARCH_FAILURE,
	ADD_FRIEND_REQUEST,
	ADD_FRIEND,
	ADD_FRIEND_FAILURE,
} from '../actions/actions';

axios.defaults.withCredentials = true;

function* login(action: LoginAction) {
	try {
		const response: AxiosResponse = yield call(
			axios.post,
			`${API_URL}/auth/login`,
			action.payload
		);
		localStorage.setItem('access_token', response.data.access.accessToken);
		yield put({ type: LOGIN_SUCCESS, payload: response.data });
	} catch (error) {
		yield put({
			type: LOGIN_FAILURE,
			payload: { error: (error as Error).message },
		});
	}
}

function* register(action: RegisterAction) {
	try {
		const response = yield call(
			axios.post,
			`${API_URL}/auth/register`,
			action.payload,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		);

		localStorage.setItem('access_token', response.data.access.accessToken);
		yield put({ type: REGISTER_SUCCESS, payload: response.data });
	} catch (error) {
		yield put({
			type: REGISTER_FAILURE,
			payload: { error: (error as Error).message },
		});
	}
}
function* refresh() {
	try {
		const response = yield call(
			axios.post,
			`${API_URL}/auth/refresh`,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		);
		localStorage.setItem('access_token', response.data.accessToken);

		yield put({ type: REFRESH, payload: response.data });
	} catch (e) {
		yield put({
			type: REFRESH_FAILURE,
			payload: { error: (e as Error).message },
		});
	}
}
function* getAccount() {
	try {
		const response = yield call(
			axios.post,
			`${API_URL}/auth/getAccount`,
			{ accessToken: localStorage.getItem('access_token') }
		);

		yield put({ type: GET_ACCOUNT, payload: response.data });
	} catch (e) {
		yield put({
			type: GET_ACCOUNT_FAILURE,
			payload: { error: (e as Error).message },
		});
	}
}
function* serchFriend(action: SearchAction) {
	try {
		const response = yield call(
			axios.post,
			`${API_URL}/users/search`,
			{
				accessToken: localStorage.getItem('access_token'),
				content: action.payload.content,
			}
		);

		yield put({ type: SEARCH, payload: response.data });
	} catch (e) {
		yield put({
			type: SEARCH_FAILURE,
			payload: { error: (e as Error).message },
		});
	}
}
function* frinedAdd(action) {
	try {
		const response = yield call(
			axios.post,
			`${API_URL}/users/add_friends`,
			{
				accessToken: localStorage.getItem('access_token'),
				id: action.payload.id,
			}
		);

		yield put({ type: ADD_FRIEND, payload: response.data });
	} catch (e) {
		yield put({
			type: ADD_FRIEND_FAILURE,
			payload: { error: (e as Error).message },
		});
	}
}

export default function* authSaga() {
	yield takeLatest(LOGIN_REQUEST, login);
	yield takeLatest(REGISTER_REQUEST, register);
	yield takeLatest(REFRESH_REQUEST, refresh);
	yield takeLatest(GET_ACCOUNT_REQUEST, getAccount);
	yield takeLatest(SEARCH_REQUEST, serchFriend);
	yield takeLatest(ADD_FRIEND_REQUEST, frinedAdd);
}
