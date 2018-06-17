import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import {Trans} from 'lingui-react';
import _Breadcrumb from 'antd/lib/breadcrumb';
import Icon from 'antd/lib/icon';
import './Breadcrumb.scss';

const breadcrumbNameMap = {
	'/orders': <Trans>Orders</Trans>,
	'/orders/serials_management': <Trans>Serials Management</Trans>,
	'/makeorder/:orderId?/:draftKey?': <Trans>Maker Order</Trans>,
	'/draft': <Trans>Draft</Trans>
	// todo breadcrumb names to be completed with other modules routes
};

const Breadcrumb = withRouter((props) => {

	const { location } = props;

	const pathSnippets = location.pathname.split('/').filter(i => i);

	let extraBreadcrumbItems = [];

	for (let i = 0; i < pathSnippets.length; i++) {
		const url = `/${pathSnippets.slice(0, i + 1).join('/')}`;
		if (!breadcrumbNameMap[url]) {
			extraBreadcrumbItems.push(
				<_Breadcrumb.Item key={url}><Trans>Not Found</Trans></_Breadcrumb.Item>
			);
			break;
		} else {
			extraBreadcrumbItems.push(
				<_Breadcrumb.Item key={url}>
					<Link to={url}>
						{breadcrumbNameMap[url]}
					</Link>
				</_Breadcrumb.Item>
			);
		}
	}

	const breadcrumbItems = [(
		<_Breadcrumb.Item key="home">
			<Link to="/"><Icon type="home" /> <Trans>Home</Trans></Link>
		</_Breadcrumb.Item>
	)].concat(extraBreadcrumbItems);

	return (
		<_Breadcrumb className="breadcrumb">
			{breadcrumbItems}
		</_Breadcrumb>
	);

});

export default Breadcrumb;
