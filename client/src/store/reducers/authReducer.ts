import {
	LOGIN_SUCCESS,
	LOGIN_FAILURE,
	REGISTER_SUCCESS,
	REGISTER_FAILURE,
	REFRESH,
	REFRESH_FAILURE,
	GET_ACCOUNT,
	GET_ACCOUNT_FAILURE,
	SEARCH_FAILURE,
	SEARCH,
} from '../actions/actions';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AuthState {
	token: string | null;
	error: unknown;
	image: string | null;
	ok?: boolean;
	refresh: boolean;
	user: any;
	userSearch: any;
	chat: any[];
}

interface AuthAction {
	type: string;
	payload?: any;
}

const initialState: AuthState = {
	token: null,
	error: null,
	image: null,
	ok: false,
	refresh: false,
	user: [],
	userSearch: [],
	chat: [],
};

const authReducer = (state: AuthState = initialState, action: AuthAction): AuthState => {
	switch (action.type) {
		case LOGIN_SUCCESS:
			return {
				...state,
				token: action.payload.token,
				image: action.payload.image,
			};
		case LOGIN_FAILURE:
		case REGISTER_FAILURE:
			return { ...state, error: action.payload.error };
		case REGISTER_SUCCESS:
			return {
				...state,
				token: action.payload.accessToken,
				image: action.payload.image,
				ok: action.payload.ok,
			};
		case REFRESH:
			return {
				...state,
				token: action.payload.accessToken,
				refresh: true,
				ok: true,
			};
		case REFRESH_FAILURE:
			return { ...state, error: action.payload.error, refresh: false };
		case GET_ACCOUNT:
			return {
				...state,
				image: action.payload.image,
				ok: action.payload.ok,
				user: action.payload,
			};
		case GET_ACCOUNT_FAILURE:
			return { ...state, error: action.payload.error, ok: undefined };
		case SEARCH:
			return { ...state, userSearch: action.payload };
		case SEARCH_FAILURE:
			return { ...state, error: action.payload.error };
		case 'CHAT':
			return { ...state, chat: action.payload };
		default:
			return state;
	}
};

export default authReducer;
