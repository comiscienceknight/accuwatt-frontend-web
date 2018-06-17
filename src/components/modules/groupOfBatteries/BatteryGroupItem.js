import React from 'react';
import { Col, Popconfirm, Icon } from 'antd';
import {withRouter, Link} from 'react-router-dom';
import batteriesImg from '../../../images/groupofbatteries.png';
import './BatteryGroupItem.scss';
import {getUser} from '../../../utils/Authentication/userSessionStorage';

const BatteryGroupItem = withRouter(({groupName, groupId, numberOfBattery, onDelete, onEdit}) => {
	let link = '/batteries/' + groupId + '/' + groupName;
	
	let user = getUser();
	let btns = <div />;
	if(user.USER_DATA.role === 'ADMINISTRATEUR'){
		btns = (<div style={{position:'absolute', top:'75px',right:'20px'}} >
			<Popconfirm title={'Sûre de supprimer le group ' + groupName + '?'} 
				onConfirm={()=>{onDelete(groupId);}} okText="Oui" cancelText="Non">
				<Icon type="delete" />
			</Popconfirm>
			<div>
				<Icon type="edit" onClick={()=>{onEdit(groupId, groupName);}} />
			</div>
		</div>);
	}
	return (
		<Col className="gutter-row battery-group-item" 
			xs={{span: 24}} sm={{span: 8}} md={{span: 6}} lg={{span: 4}} 
			style={{marginTop:'10px', marginBottom:'20px', textAlign: 'center'}}>
			<Link to={link}>
				<img src={batteriesImg} 
					style={{width:'100px', marginLeft:'auto', marginRight:'auto', marginTop:'10px'}} />
				<div style={{textAlign:'center', marginBottom:'10px'}}>
					{groupName} [{numberOfBattery}]
				</div>
			</Link>
			
			{btns}
		</Col>
		
	);
});

export default BatteryGroupItem;