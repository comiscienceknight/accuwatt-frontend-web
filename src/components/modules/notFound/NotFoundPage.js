import React from 'react';
import {Link} from 'react-router-dom';
import {Trans} from 'lingui-react';
import './NotFoundPage.scss';

export class NotFoundPage extends React.Component {
	componentWillMount() {
		const {staticContext} = this.props;
		if (staticContext) {
			staticContext.is404 = true;
		}
	}

	render() {
		return (
			<div className="not-found">
				<div className="not-found-inner">
					<h1>404</h1>
					<h2><Trans>Page not found!</Trans></h2>
					<p>
						<Link to="/"><Trans>Go back to the main page</Trans></Link>
					</p>
				</div>
			</div>
		);
	}
}

export default NotFoundPage;