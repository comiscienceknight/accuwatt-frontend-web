import {createStore as _createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {routerMiddleware} from 'react-router-redux';
import appReducers from './reducers';
import Registry from '../utils/CodeSplitting/store/registry/registry';
import registryMiddleware from '../utils/CodeSplitting/store/registry/middleware';

export default function createStore(history, initialState = {}) {

	const reduxRouterMiddleware = routerMiddleware(history);
	const registry = new Registry(appReducers);
	let finalCreateStore = applyMiddleware(
		registryMiddleware(registry),
		reduxRouterMiddleware,
		thunkMiddleware
	);

	// if we have redux devtools installed hook into it.
	if (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
		finalCreateStore = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(finalCreateStore);
	}

	const store = finalCreateStore(_createStore)(
		registry.initialReducers,
		initialState
	);

	registry.store = store;

	return store;
}

