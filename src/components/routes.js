import {userIsAuthenticatedRedir, userIsNotAuthenticatedRedir} from '../utils/Authentication/auth';
import LoginPage from './LoginPage';
import AppLayout from './AppLayout';
import {routes as NotFoundRoutes} from './modules/notFound/routes';
import {routes as BatteriesRoutes} from './modules/batteries/routes';
import {routes as GroupOfBatteriesRoutes} from './modules/groupOfBatteries/routes';
import {routes as UsersRoutes} from './modules/users/routes';

const moduleRoutes = [
	// ...HomeRoutes,
	// ...OrdersRoutes,
	// ...MakeOrderRoutes,
	// ...DraftRoutes,
	...BatteriesRoutes,
	...GroupOfBatteriesRoutes,
	...UsersRoutes
	// todo routes to be completed with other modules
];

const Login = userIsNotAuthenticatedRedir(LoginPage);
const LayoutComponent = userIsAuthenticatedRedir(AppLayout);

const routes = [
	{
		path: '/login',
		exact: true,
		component: Login
	}, 
	{
		path: '/',
		component: LayoutComponent,
		routes: [
			...moduleRoutes,
			...NotFoundRoutes
		]
	}];

export default routes;