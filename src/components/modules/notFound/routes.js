import asyncRoute from '../../../utils/CodeSplitting/asyncRoute/asyncRoute';

const NotFoundPage = asyncRoute(
	() => import(
		/* webpackChunkName: "notFoundPage" */
		'./NotFoundPage')
);

export const routes = [{
	path: '/*',
	component: NotFoundPage
}];