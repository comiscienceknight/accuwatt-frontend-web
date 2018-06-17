import React from 'react';
import {logout} from '../utils/Authentication/actions';
import {userIsAuthenticated} from '../utils/Authentication/auth';
import {Trans} from 'lingui-react';
import Icon from 'antd/lib/icon';

const LogoutLink = userIsAuthenticated(() => <div
	onClick={() => logout()}>
	<Icon type="logout"/><Trans>Log out</Trans>
</div>);

export default LogoutLink;