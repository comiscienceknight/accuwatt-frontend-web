import fetch from 'node-fetch';
import * as constants from './actionTypes';
import {setUser, getUser, clearUser, USER_DATA, REFRESH_TOKEN} from './userSessionStorage';

const dataToRequestFormBody = data => {
	const formBody = [];
	for (const property in data) {
		const encodedKey = encodeURIComponent(property);
		const encodedValue = encodeURIComponent(data[property]);
		formBody.push(encodedKey + '=' + encodedValue);
	}
	return formBody.join('&');
};

export const refreshToken = () => {
	const currentUser = getUser();
	const refreshToken = currentUser ? currentUser[REFRESH_TOKEN] : null;
	const userData = currentUser ? currentUser[USER_DATA] : null;
	if (refreshToken && userData) {
		return new Promise((resolve, reject) => {
			const formBody = dataToRequestFormBody({
				refreshToken: refreshToken,
				userName: userData.user_name,
				grantType: 'refresh_token'
			});
			fetch(AppConfig.apiEntryPoint + '/Token/Auth?' + formBody).then(
				(response) => {
					if (response.status === 200) {
						response.json().then(body => {
							if (parseInt(body.code) === 999) {
								// const userData = JSON.parse(body.data);
								const userData = JSON.parse(body.data.result);
								setUser(userData);
								const user = getUser();
								appStore.dispatch({
									type: constants.USER_LOGGED_IN,
									payload: user[USER_DATA]
								});
								resolve();
							} else {
								logout();
								reject();
							}
						});
					} else {
						logout();
						reject();
					}
				},
				() => {
					logout();
					reject();
				}
			);
		});
	} else {
		logout();
	}
};

const runLoginRequest = data => {
	const formBody = dataToRequestFormBody(data);
	return fetch(AppConfig.apiEntryPoint + '/Token/Auth?' + formBody).then(
		(response) => {
			if (response.status === 200) {
				response.json().then(body => {
					if (parseInt(body.code) === 999) {						
						const userData = JSON.parse(body.data);
						setUser(userData);
						const user = getUser();
						appStore.dispatch({
							type: constants.USER_LOGGED_IN,
							payload: user[USER_DATA]
						});
					} else {
						logout();
					}
				});
			} else {
				logout();
			}
		},
		() => {
			logout();
		}
	);
};

export const login = data => () => {
	appStore.dispatch({
		type: constants.USER_LOGGING_IN
	});
	return runLoginRequest(data);
};

export function logout() {
	clearUser();
	appStore.dispatch({
		type: constants.USER_LOGGED_OUT
	});
}
