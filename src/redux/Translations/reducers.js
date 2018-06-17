import {SET_LANGUAGE, RESET_LANGUAGE, USER_PREFERRED_LANGUAGE} from './constants';

const userPreferredLanguage = (typeof localStorage !== 'undefined')
	? localStorage.getItem(USER_PREFERRED_LANGUAGE)
	: null;

const defaultLanguage = 'fr_FR';

const initialState = {
	language: userPreferredLanguage ? userPreferredLanguage : defaultLanguage
};

export default function (state = initialState, {type, language}) {
	switch (type) {
		case SET_LANGUAGE:
			return {language};
		case RESET_LANGUAGE:
			return {language: defaultLanguage};
		default:
			return state;
	}
}