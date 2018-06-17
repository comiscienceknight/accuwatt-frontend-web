import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import {setUserFromToken, getUser, USER_DATA} from './utils/Authentication/userSessionStorage';
import {refreshToken} from './utils/Authentication/actions';
import * as constants from './utils/Authentication/actionTypes';
import { AppContainer } from 'react-hot-loader';
import routes from './components/routes';
import App from './components/App';
import createStore from './redux/store';

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;

// create the redux router middleware
const history = createBrowserHistory();

global.appStore = createStore(history, preloadedState);

setUserFromToken();
const user = getUser();
if (user[USER_DATA]) {
	appStore.dispatch({
		type: constants.USER_LOGGING_IN
	});
	refreshToken();
}

const render = Component => {
	ReactDOM.hydrate(
		<AppContainer>
			<Component store={appStore} routes={routes} history={history}/>
		</AppContainer>,
		document.getElementById('main')
	);
};

window.onload = () => {
	render(App);
};

if (module.hot) {
	module.hot.accept('./components/App', () => {
		const nextApp = require('./components/App').default;
		render(nextApp) ;
	});
}
