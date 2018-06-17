import ApiClient, {
	API_ENTRY_POINT,
	REQUEST_RUNNER,
	CHECK_USER_AUTH,
	ADD_USER_AUTH_INFO_TO_REQUEST_OPTIONS,
	USER_AUTH_NOT_VALID_CALLBACK
} from './utils/ApiClient/ApiClient';
import fetch from './utils/fetch/fetch';
import {
	checkUserTokenValid,
	addUserTokenToRequestOptions,
} from './utils/Authentication/userSessionStorage';
import {refreshToken} from './utils/Authentication/actions';

const apiClient = new ApiClient({
	[API_ENTRY_POINT]: AppConfig.apiEntryPoint,
	[REQUEST_RUNNER]: fetch,
	[CHECK_USER_AUTH]: checkUserTokenValid,
	[ADD_USER_AUTH_INFO_TO_REQUEST_OPTIONS]: addUserTokenToRequestOptions,
	[USER_AUTH_NOT_VALID_CALLBACK]: refreshToken,
});

export default apiClient;