import React from 'react';
import Card from 'antd/lib/card';
import Spin from 'antd/lib/spin';
import {Trans} from 'lingui-react';
import './Logging.scss';

export default function Loading() {
	return <div className="logging-page">
		<Card className="logging-inner" bordered={false} style={{ width: 300 }}>
			<Spin className="logging-spinner" size="large" />
			<div><Trans>Logging you in...</Trans></div>
		</Card>
	</div>;
}