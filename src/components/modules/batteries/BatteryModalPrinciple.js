import React from 'react';
import { Row, Col } from 'antd';
import './Batteries.scss';
import {withRouter} from 'react-router-dom';
import signalLevel1 from '../../../images/signal-level-1.png';
import signalLevel2 from '../../../images/signal-level-2.png';
import signalLevel3 from '../../../images/signal-level-3.png';
import signalLevel4 from '../../../images/signal-level-4.png';
import signalLevel5 from '../../../images/signal-level-5.png';

const getSignalLevelImageSrc = (batterySignalLevel)=>{
	if(batterySignalLevel === 5)
		return signalLevel5;
	else if(batterySignalLevel === 4)
		return signalLevel4;
	else if(batterySignalLevel === 3)
		return signalLevel3;
	else if(batterySignalLevel === 2)
		return signalLevel2;
	else if(batterySignalLevel === 1)
		return signalLevel1;
	else if(batterySignalLevel < 1)
		return signalLevel1;
	else if(batterySignalLevel > 5)
		return signalLevel5;
	else
		return signalLevel5;
}

const BatteryModalPrinciple = withRouter(({batteryState}) => {
	let etat = (batteryState.stateOpenClose !== 0? 'Marche' : 'Arrêt');
	let mode = (batteryState.stateMode === 0 ? 'Automatique':'Manuel');
	let charge = '';
	let autonomie = (batteryState.batteryLife + ' heures');
	let volt = (batteryState.volt + ' V');
	let temperature  = (batteryState.temperature +  '°c');
	let signalLevel = getSignalLevelImageSrc(batteryState.signalLevel);
	let timeStampStr = (batteryState.timeStamp === undefined ? '' : batteryState.timeStamp.replace('T', ' '));
	let stateBrokenError = (batteryState.stateBroken === 1 ? 'Erreur: la batterie à disjoncté ....' : '');
	let stateSecurity = (batteryState.stateSecurity === 1 ? 'Erreur: le bouton d\'urgence est activé' : '');
	return (
		<div>
			<h3>
				le {timeStampStr}
			</h3>
			<div style={{marginTop:5,marginBottom:10}}>
				<Row>
					<Col span={12}>
						Etat:
					</Col>
					<Col span={12} style={{fontWeight:500}}>
						{etat}
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						Mode:
					</Col>
					<Col span={12} style={{fontWeight:500}}>
						{mode}
					</Col>
				</Row>
				<Row>
					<Col span={12}>
					Charge:
					</Col>
					<Col span={12} style={{fontWeight:500}}>
						{charge}
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						Autonomie:
					</Col>
					<Col span={12} style={{fontWeight:500}}>
						{autonomie}
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						Tension:
					</Col>
					<Col span={12} style={{fontWeight:500}}>
						{volt}
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						Température:
					</Col>
					<Col span={12} style={{fontWeight:500}}>
						{temperature}
					</Col>
				</Row>
				<Row style={{marginTop:'8px'}}>
					<Col span={12} style={{marginTop:'6px'}}>
						Niveau du signal:
					</Col>
					<Col span={12} style={{fontWeight:500}}>
						<img src={signalLevel} style={{width:'28px'}} />
					</Col>
				</Row>
				<Row style={{marginTop:'8px'}}>
					<Col span={24}>
						<div style={{color:'red'}}>{stateBrokenError}</div>
						<div style={{color:'red'}}>{stateSecurity}</div>
					</Col>
				</Row>
			</div>
		</div>
		
	);
});

export default BatteryModalPrinciple;