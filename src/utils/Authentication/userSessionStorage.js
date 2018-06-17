import {Headers} from 'node-fetch';

export const AUTH_TOKEN = 'AUTH_TOKEN';

export const REFRESH_TOKEN = 'REFRESH_TOKEN';

export const USER_DATA = 'USER_DATA';

export const USER_LOGGED_IN_TIME = 'USER_LOGGED_IN_TIME';

export const checkUserTokenValid = () => {
	const currentUser = getUser();
	const timestampNow = Math.ceil(new Date().valueOf() / 1000);
	if (currentUser[USER_DATA] && currentUser[USER_LOGGED_IN_TIME]) {
		return parseInt(currentUser[USER_LOGGED_IN_TIME]) + parseInt(currentUser[USER_DATA].expires_in) > timestampNow;
	}
	return false;
};

export const addUserTokenToRequestOptions = (options = {}) => {
	const currentUser = getUser();
	const requestHeaders = options.headers || new Headers();
	if (currentUser[AUTH_TOKEN]) {
		requestHeaders.set('Authorization', `${currentUser[USER_DATA].token_type} ${currentUser[AUTH_TOKEN]}`);
	}
	return {
		...options,
		headers: requestHeaders
	};
};

const setToken = (tokenName, tokenValue) => {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(tokenName, tokenValue);
	}
};

const clearToken = (tokenName) => {
	if (typeof localStorage !== 'undefined') {
		localStorage.removeItem(tokenName);
	}
};

const getToken = tokenName => {
	if (typeof localStorage !== 'undefined') {
		return localStorage.getItem(tokenName);
	} else {
		return null;
	}
};

export const clearUser = () => {
	clearToken(AUTH_TOKEN);
	clearToken(REFRESH_TOKEN);
	clearToken(USER_DATA);
	clearToken(USER_LOGGED_IN_TIME);
};

export const setUser = (userData) => {	
	if (userData) {
		const currentTimeStamp = Math.floor(new Date().getTime() / 1000);
		setToken(AUTH_TOKEN, userData.access_token);
		setToken(REFRESH_TOKEN, userData.refresh_token);
		setToken(USER_DATA, JSON.stringify(userData));
		setToken(USER_LOGGED_IN_TIME, currentTimeStamp);
	}
};

export const getUser = () => {
	return {
		[USER_DATA]: JSON.parse(getToken(USER_DATA)),
		[AUTH_TOKEN]: getToken(AUTH_TOKEN),
		[REFRESH_TOKEN]: getToken(REFRESH_TOKEN),
		[USER_LOGGED_IN_TIME]: getToken(USER_LOGGED_IN_TIME)
	};
};

export const setUserFromToken = () => {
	const userData = getToken(USER_DATA);
	if (userData) {
		setUser(JSON.parse(userData));
	}

};