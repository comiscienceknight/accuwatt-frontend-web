import asyncRoute from '../../../utils/CodeSplitting/asyncRoute/asyncRoute';

const Users = asyncRoute(
	() => import(
		/* webpackChunkName: "home" */
		'./Users')
);

export const routes = [{
	path: '/users',
	exact: true,
	component: Users
}];