import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import Menu from 'antd/lib/menu';
import Icon from 'antd/lib/icon';
import { Trans } from 'lingui-react';
import './Navigation.scss';
import {getUser} from '../utils/Authentication/userSessionStorage';

class Navigation extends React.Component {

	getCurrentSelectedKeys () {
		return [this.props.location.pathname];
	}

	render () {
		let userMenu = (<Menu.Item key="/users">
			<NavLink to="/users">
				<Icon type="usergroup-add"/>
				<span><Trans>Gestions des utilisateurs</Trans></span>
			</NavLink>
		</Menu.Item>);
		let user = getUser();
		if(user.USER_DATA.role === 'VISITEUR')
			userMenu = <div />;
		const defaultSelectedKeys = this.getCurrentSelectedKeys();
		return (
			<Menu
				selectedKeys={defaultSelectedKeys}
				className="navigation"
				mode="inline"
				theme="light"
				defaultOpenKeys={['subNav']}>

				<Menu.Item key="/">
					<NavLink to="/">
						<Icon type="api"/>
						<span><Trans>Groupes de batteries</Trans></span>
					</NavLink>
				</Menu.Item>
				{userMenu}				
			</Menu>
		);
	}
}

export default withRouter(Navigation);
