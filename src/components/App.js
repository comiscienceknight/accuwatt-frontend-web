import React from 'react';
import {Switch} from 'react-router-dom';
import {Provider, connect} from 'react-redux';
import {ConnectedRouter} from 'react-router-redux';
import RouteDispatcher from 'react-router-dispatcher';
import {unpackCatalog} from 'lingui-i18n';
import {I18nProvider} from 'lingui-react';
import LocaleProvider from 'antd/lib/locale-provider/index';
import moment from 'moment';
import './App.scss';
import './ant-theme.less';

const mapStateToProps = (state) => {
	return {
		language: state.trans.language,
	};
};

class App extends React.Component {

	state = {
		language: this.props.language,
		catalogs: {},
		antI18n: {}
	}

	async loadLanguage (language) {
		let antI18n;
		const catalogs = await import(
			/* webpackMode: "lazy", webpackChunkName: "i18n-[index]" */
			`../../locale/${language}/messages.js`).then(unpackCatalog);
		if (language === 'zh_CN') {
			antI18n = null;
		} else {
			antI18n = await import(
				/* webpackMode: "lazy", webpackChunkName: "antI18n-[index]" */
				`antd/lib/locale-provider/${language}.js`);
		}
		this.setState(state => ({
			catalogs: {
				...state.catalogs,
				[language]: catalogs
			},
			antI18n: antI18n
		}));

	}

	componentDidMount () {
		this.loadLanguage(this.state.language);
	}

	shouldComponentUpdate (nextProps, { language, catalogs }) {
		if (language !== this.state.language && !catalogs[language]) {
			this.loadLanguage(language);
			return false;
		}

		return true;
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.language !== nextProps.language) {
			window.location.reload();
		}
	}

	render() {
		// required in development only (huge dependency)
		// const dev = process.env.NODE_ENV !== 'production' ? require('lingui-i18n/dev') : undefined

		// Does the environment support HTML 5 history
		const supportsHistory = typeof window !== 'undefined' && 'pushState' in window.history;

		const { language, catalogs, languageData, antI18n } = this.state;

		if (!catalogs[language]) return null;

		// set moment locale globally
		moment.locale(language);

		return (
			<LocaleProvider locale={antI18n}>
				<I18nProvider language={language} catalogs={catalogs} languageData={languageData}>
					<Provider store={this.props.store}>
						<ConnectedRouter history={this.props.history} forceRefresh={!supportsHistory}>
							<Switch>
								<RouteDispatcher routes={this.props.routes}/>
							</Switch>
						</ConnectedRouter>
					</Provider>
				</I18nProvider>
			</LocaleProvider>
		);
	}

}
export default connect(mapStateToProps)(App);


