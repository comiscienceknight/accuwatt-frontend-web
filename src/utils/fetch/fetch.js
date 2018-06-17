import React from 'react';
import fetch, {Headers} from 'node-fetch';
import {Trans} from 'lingui-react';
import Modal from 'antd/lib/modal';

export default (url, options = {}) => {
	const params = options.params;
	let paramsStr = '';
	if (params) {
		paramsStr = Object.keys(params).map(function (k) {
			if (Array.isArray(params[k])) {
				const keyE = encodeURIComponent(k + '[]');
				return params[k].map(function (subData) {
					return keyE + '=' + encodeURIComponent(subData);
				}).join('&');
			} else {
				return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
			}
		}).join('&');
		paramsStr = '?' +paramsStr;
	}
	url += paramsStr;

	const requestHeaders = options.headers || new Headers();

	return new Promise((resolve, reject) => {
		fetch(url, {
			...options,
			headers: requestHeaders,
		}).then(
			(response) => {
				resolve(response);
			},
			(error) => {
				Modal.error({
					title: <Trans>Server Error</Trans>,
					content: <Trans>Something went wrong, please try again later...</Trans>,
				});
				reject(error);
			}
		);
	});
};