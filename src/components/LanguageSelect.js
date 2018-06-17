import React from 'react';
import {connect} from 'react-redux';
import {setLanguage} from '../redux/Translations/actions';
import Select from 'antd/lib/select';
import Icon from 'antd/lib/icon';
import './LanguageSelect.scss';


const languages = {
	fr_FR: 'Français',
	en_US: 'English',
	it_IT: 'Italiano',
	de_DE: 'Deutsche',
	es_ES: 'Español'
};

const mapStateToProps = (state) => {
	return {
		language: state.trans.language,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleChangeLanguage: (language) => dispatch(setLanguage(language))
	};
};

class LanguageSelect extends React.Component {
	render() {
		return (
			<div className="language-select">
				<Select
					className="language-select-field"
					defaultValue={this.props.language}
					style={{ width: 120 }}
					onChange={this.props.handleChangeLanguage}>
					{Object.keys(languages).map(language =>
						<Select.Option value={language} key={language} disabled>
							{languages[language]}
						</Select.Option>
					)}
				</Select>
				<Icon className="global-icon" type="global"/>
			</div>

		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelect);
