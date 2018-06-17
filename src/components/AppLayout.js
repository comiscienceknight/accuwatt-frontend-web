import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {withRouter, Link} from 'react-router-dom';
import {renderRoutes} from 'react-router-config';
import Layout from 'antd/lib/layout';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import Menu from 'antd/lib/menu';
import Modal from 'antd/lib/modal';
import apiClient from '../apiClient';
// import Breadcrumb from './Breadcrumb';
import Navigation from './Navigation';
import LogoutLink from './LogoutLink';
import LanguageSelect from './LanguageSelect';
import {Trans} from 'lingui-react';
import logo from '../images/accuwatt-logo.png';
import './AppLayout.scss';

const { Header, Content, Sider } = Layout;

const mapStateToProps = (state) => {
	return {
		authData: state.user.data,
	};
};

class AppLayout extends React.Component {

	state = {
		mainMenuCollapsed: false,
		rightSiderCollapsed: true
	};

	toggleMainMenu = () => {
		this.setState({
			mainMenuCollapsed: !this.state.mainMenuCollapsed,
		});
	}

	toggleRightSider = () => {
		this.setState({
			rightSiderCollapsed: !this.state.rightSiderCollapsed
		});
	}

	async modifyPassword () {
		const {authData} = this.props;

		const modal = Modal.info({
			title: <p>
				<Trans>Sending your request...</Trans>
				<Icon type="loading"/>
			</p>,
			onOk() {},
		});

		const response = await apiClient.fetch('/Token/ForgetPassword', {
			method: 'GET',
			headers: new Headers({'Content-Type': 'application/json'}),
			params: {
				'userName': authData.user_name
			}
		});

		modal.destroy();

		if (response.status === 200) {
			Modal.success({
				content: <Trans>You will receive an email to continue to change your password.</Trans>,
			});

		} else {
			Modal.error({
				content: <Trans>Some error occured, please try again later.</Trans>,
			});
		}
	}

	componentDidMount() {
		const {authData} = this.props;
	}

	render() {
		return (
			<Layout className="app-layout">
				<Header className="app-header">
					<Button
						size="large" className="main-menu-trigger"
						icon={this.state.mainMenuCollapsed ? 'menu-unfold' : 'menu-fold'}
						onClick={this.toggleMainMenu} />
					<div className="logo">
						<Link to="/"><img src={logo} alt="logo-tuding"/></Link>
					</div>
					<LanguageSelect />
					<div className="right">
						<div className="action user-menu">
							<Menu mode="horizontal" selectedKeys={null}>
								<Menu.SubMenu
									title={
										<span>
											<Icon type="user" />
											{this.props.authData.user_name.split('@')[0]}
										</span>
									}>
									<Menu.Item>
										<div onClick={() => {
											this.modifyPassword();
										}}>
											<Icon type="user"/><Trans>Edit Password</Trans>
										</div>
									</Menu.Item>
									<Menu.Divider />
									<Menu.Item>
										<LogoutLink />
									</Menu.Item>
								</Menu.SubMenu>
							</Menu>
						</div>
					</div>
				</Header>
				<Layout className="app-main">
					<Sider
						className="app-main-menu"
						width={180}
						collapsed={this.state.mainMenuCollapsed}>
						<Navigation />
					</Sider>
					<Layout className="page-content-wrapper">
						{/* <Breadcrumb /> */}
						<Content className="page-content">
							{renderRoutes(this.props.route.routes)}
						</Content>
					</Layout>
					<Sider
						className={classNames({
							'app-right-sider': true,
							'hidden': this.state.rightSiderCollapsed
						})}
						width={300}
						collapsed={this.state.rightSiderCollapsed}>
					</Sider>
				</Layout>
			</Layout>
		);
	}
}

export default withRouter(connect(mapStateToProps)(AppLayout));