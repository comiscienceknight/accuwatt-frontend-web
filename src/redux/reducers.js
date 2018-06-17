import {routerReducer} from 'react-router-redux';
import {reducer as routeDispatcherReducer} from 'react-router-dispatcher';
import authReducers from '../utils/Authentication/reducers';
import translationsReducers from './Translations/reducers';

const appReducers = {
	user: authReducers,
	trans: translationsReducers,
	router: routerReducer,
	routeDispatcher: routeDispatcherReducer
};

export default appReducers;