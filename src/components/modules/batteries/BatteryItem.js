import React from 'react';
import { Col, Icon, Popconfirm, ButtonGroup } from 'antd';
import {withRouter } from 'react-router-dom';
import './BatteryItem.scss';
import batteryImgOpen from '../../../images/battery-open.png';
import batteryImgStop from '../../../images/battery-stop.png';
import {getUser} from '../../../utils/Authentication/userSessionStorage';


const BatteryItem = withRouter(({
	batteryDevEUI, batteryName, stateOpenStop, onBatteryClick, batteryId, deleteBattery, editBattery}) => {
	let batteryImgUrl = batteryImgOpen;
	if(stateOpenStop == 0){
		batteryImgUrl = batteryImgStop;
	}

	let btns = (<div style={{position:'absolute', top:'75px',right:'25px'}} >
		<Popconfirm title={'Sûre de supprimer la batterie ' + batteryDevEUI + '?'} 
			onConfirm={()=>{deleteBattery(batteryDevEUI);}} okText="Oui" cancelText="Non">
			<Icon type="delete" />
		</Popconfirm>
		<div onClick={()=>{editBattery(batteryDevEUI, batteryName);}} >
			<Icon type="edit" />
		</div>
	</div>);
	
	let user = getUser();
	if(user.USER_DATA.role === 'VISITEUR'){
		btns = (<div />);
	}
	return (
		<Col className="gutter-row battery-group-item" 
			xs={{span: 24}} sm={{span: 8}} md={{span: 6}} lg={{span: 4}} 
			style={{marginTop:'10px', marginBottom:'20px', textAlign: 'center'}}>
			<div>
				<div style={{textAlign:'center', marginBottom:'10px', paddingTop:'10px'}}
					onClick={()=>{onBatteryClick(batteryId, batteryName, batteryDevEUI);}}>
					<img src={batteryImgUrl} 
						style={{width:'100px', marginLeft:'auto', marginRight:'auto'}} />
					<div style={{textAlign:'center', marginBottom:'1px'}}>
						{batteryDevEUI}
					</div>
					<div style={{textAlign:'center', marginBottom:'10px'}}>
						{batteryName} 
					</div>
				</div>
				
				{btns}
			</div>
		</Col> 
	);
});

export default BatteryItem;