import asyncRoute from '../../../utils/CodeSplitting/asyncRoute/asyncRoute';

const Batteries = asyncRoute(
	() => import(
		/* webpackChunkName: "home" */
		'./Batteries')
);

export const routes = [{
	path: '/batteries/:groupId/:groupName',
	exact: true,
	component: Batteries
}];