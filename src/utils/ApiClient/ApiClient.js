/**
 * Constant for API_ENTRY_POINT.
 */
export const API_ENTRY_POINT = 'API_ENTRY_POINT';
/**
 * Constant for REQUEST_RUNNER.
 */
export const REQUEST_RUNNER = 'requestRunner';
/**
 * Constant for INTERNATIONALIZATION.
 */
export const INTERNATIONALIZATION = 'internationalization';
/**
 * Constant for CHECK_USER_AUTH.
 */
export const CHECK_USER_AUTH = 'checkUserAuth';
/**
 * Constant for ADD_USER_AUTH_INFO_TO_REQUEST_OPTIONS.
 */
export const ADD_USER_AUTH_INFO_TO_REQUEST_OPTIONS = 'addUserAuthInfoToRequestOptions';
/**
 * Constant for USER_AUTH_NOT_VALID_CALLBACK.
 */
export const USER_AUTH_NOT_VALID_CALLBACK = 'userAuthNotValidCallback';

/**
 * Class ApiClient
 * @example
 * import ApiClient, {
 *      API_ENTRY_POINT,
 *      REQUEST_RUNNER,
 *      CHECK_USER_AUTH,
 *      ADD_USER_AUTH_INFO_TO_REQUEST_OPTIONS,
 *      INTERNATIONALIZATION,
 *      USER_AUTH_NOT_VALID_CALLBACK
 * } from 'utils/ApiClient/ApiClient';
 *
 * import fetchHydra from 'utils/hydra/fetchHydra';
 *
 * import {
 *      checkUserTokenValid,
 *      addUserTokenToRequestOptions,
 *      addLocaleToRequestOptions
 * } from 'utils/JWTAuthentication/userSessionStorage';
 *
 * import {refreshToken} from 'utils/JWTAuthentication/actions';
 *
 * const apiClient = new ApiClient({
 *      [API_ENTRY_POINT]: AppConfig.apiEntryPoint,
 *      [REQUEST_RUNNER]: fetchHydra,
 *      [INTERNATIONALIZATION]: addLocaleToRequestOptions,
 *      [CHECK_USER_AUTH]: checkUserTokenValid,
 *      [ADD_USER_AUTH_INFO_TO_REQUEST_OPTIONS]: addUserTokenToRequestOptions,
 *      [USER_AUTH_NOT_VALID_CALLBACK]: refreshToken,
 * });
 */
export default class ApiClient {
	/**
	 * Create a ApiClient.
	 * @param {Object} definition - constructor apiClient definition.
	 * @param {string} definition[API_ENTRY_POINT] - Api entry point url string.
	 * @param {function(url: string, options: Object): Promise} definition[REQUEST_RUNNER] - Method for running requests, promise as return.
	 * @param {function(options: Object): Object} definition[INTERNATIONALIZATION] - Method for adding locale info in request configurations.
	 * @param {function(): Boolean} definition[CHECK_USER_AUTH] - Method for checking user auth validity, boolean as return.
	 * @param {function(options: Object): Object} definition[ADD_USER_AUTH_INFO_TO_REQUEST_OPTIONS] - Method for adding user auth information in request configurations.
	 * @param {function(): Promise} definition[USER_AUTH_NOT_VALID_CALLBACK] - Callback function if user auth info not valid, promise as return.
	 */
	constructor(definition = {
		[API_ENTRY_POINT]: '',
		[REQUEST_RUNNER]: null,
		[INTERNATIONALIZATION]: null,
		[CHECK_USER_AUTH]: null,
		[ADD_USER_AUTH_INFO_TO_REQUEST_OPTIONS]: null,
		[USER_AUTH_NOT_VALID_CALLBACK]: null,

	}) {
		/**
		 * @type {string}
		 */
		this[API_ENTRY_POINT] = definition[API_ENTRY_POINT][definition[API_ENTRY_POINT].length - 1] === '/' ?
			definition[API_ENTRY_POINT] : definition[API_ENTRY_POINT] + '/';
		/**
		 * @type {function}
		 */
		this[REQUEST_RUNNER] = definition[REQUEST_RUNNER];
		/**
		 * @type {function}
		 */
		this[INTERNATIONALIZATION] = definition[INTERNATIONALIZATION];
		/**
		 * @type {function}
		 */
		this[CHECK_USER_AUTH] = definition[CHECK_USER_AUTH];
		/**
		 * @type {function}
		 */
		this[ADD_USER_AUTH_INFO_TO_REQUEST_OPTIONS] = definition[ADD_USER_AUTH_INFO_TO_REQUEST_OPTIONS];
		/**
		 * @type {function}
		 */
		this[USER_AUTH_NOT_VALID_CALLBACK] = definition[USER_AUTH_NOT_VALID_CALLBACK];
	}

	/**
	 * Method for updating request options (add auth header or language information).
	 * @param {Object} options - Original request options.
	 * @return {Object} - updated request options.
	 */
	updateRequestHeaders(options = {}) {
		if (this[ADD_USER_AUTH_INFO_TO_REQUEST_OPTIONS]) {
			options = this[ADD_USER_AUTH_INFO_TO_REQUEST_OPTIONS](options);
		}
		if (this[INTERNATIONALIZATION]) {
			options = this[INTERNATIONALIZATION](options);
		}
		return options;
	}

	/**
	 * Method for fetching api resources.
	 * @param {string} url - url string.
	 * @param {object} options - request configuration options.
	 * @return {Promise}.
	 */
	fetch(url = '', options = {}) {
		url = this[API_ENTRY_POINT] + (url[0] === '/' ? url.substring(1) : url);
		const valid = this[CHECK_USER_AUTH]();
		if (valid) {
			options = this.updateRequestHeaders(options);
			return this[REQUEST_RUNNER](url, options);
		} else {
			return new Promise((resolve, reject) => {
				this[USER_AUTH_NOT_VALID_CALLBACK]().then(
					() => {
						options = this.updateRequestHeaders(options);
						resolve(this[REQUEST_RUNNER](url, options));
					},
					() => {
						reject();
					}
				);
			});
		}
	}

}
