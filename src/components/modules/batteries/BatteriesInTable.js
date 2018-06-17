import React from 'react';
import { Table, Button } from 'antd';
import './Batteries.scss';
import {withRouter} from 'react-router-dom';
import batteryImgOpen from '../../../images/battery-open.png';
import batteryImgStop from '../../../images/battery-stop.png';
import {getUser} from '../../../utils/Authentication/userSessionStorage';


const BatteriesInTable = withRouter(({batteries, onBatteryClick, onEditBattery}) => {
	let columnBtns = {
		title: '',
		dataIndex: 'id',
		key: 'id',
		width: 130,
		render: (record, model) => 
			<div style={{textAlign: 'center'}}>
				<Button onClick={() => onBatteryClick(model.id, model.batteryName, model.devEUI)} size="small" icon="eye" />
				<Button onClick={() => onEditBattery(model.devEUI, model.batteryName)} size="small" icon="edit" />
			</div>
	};
	let user = getUser();
	if(user.USER_DATA.role === 'VISITEUR'){
		columnBtns = {
			title: '',
			dataIndex: 'id',
			key: 'id',
			width: 90,
			render: (record, model) => 
				<div style={{textAlign: 'center'}}>
					<Button onClick={() => onBatteryClick(model.id, model.batteryName, model.devEUI)} size="small" icon="eye" />
				</div>
		};
	}
	let columns = [
		columnBtns,
		{
			title: 'Status',
			dataIndex: 'stateOpenClose',
			key: 'stateOpenClose',
			width: 70,
			render: text => <img src={text === 0 ? batteryImgStop : batteryImgOpen}
				style={{width:20}} />
		}, 
		{
			title: 'Dev EUI',
			dataIndex: 'devEUI',
			width: 150,
			key: 'devEUI',
		}, 
		{
			title: 'Nom',
			dataIndex: 'batteryName',
			key: 'batteryName',
		}
	]
	return (
		<div style={{marginTop:5}}>
			<Table columns={columns} dataSource={batteries} />,
		</div>
	);
});

export default BatteriesInTable;