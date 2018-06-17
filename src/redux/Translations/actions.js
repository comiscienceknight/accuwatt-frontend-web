import {SET_LANGUAGE, USER_PREFERRED_LANGUAGE} from './constants';

export const setLanguage = language => {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(USER_PREFERRED_LANGUAGE, language);
	}
	return {
		type: SET_LANGUAGE,
		language: language
	};
};