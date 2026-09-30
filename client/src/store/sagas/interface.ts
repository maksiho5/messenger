import {
	LOGIN_REQUEST,
	REGISTER_REQUEST,
	SEARCH_REQUEST,
} from '../actions/actions';

export interface LoginAction {
	type: typeof LOGIN_REQUEST;
	payload: {
		email: string;
		password: string;
	};
}

export interface RegisterAction {
	type: typeof REGISTER_REQUEST;
	payload: {
		name: string;
		email: string;
		password: string;
		file: File;
	};
}
export interface SearchAction {
	type: typeof SEARCH_REQUEST;
	payload: {
		content: string;
	};
}

export interface ErrorPayload {
	error: string;
}
