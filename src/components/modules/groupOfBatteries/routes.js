import asyncRoute from '../../../utils/CodeSplitting/asyncRoute/asyncRoute';

const GroupOfBatteriesRoutes = asyncRoute(
	() => import(
		/* webpackChunkName: "home" */
		'./GroupOfBatteries')
);

export const routes = [{
	path: '/',
	exact: true,
	component: GroupOfBatteriesRoutes
}];