import React from 'react';
import { Row, Col } from 'antd';
import './Batteries.scss';
import {withRouter} from 'react-router-dom';

const BatteryModalControl = withRouter(({batteryState}) => {
	let stateValidityData = (batteryState.stateValidityData === 1? 'oui' : 'non');
	let stateBroken  = (batteryState.stateBroken === 1 ? 'oui':'non');
	let stateSwitch  = (batteryState.StateSwitch === 1 ? 'oui':'non');
	let stateSecurity  = (batteryState.stateSecurity === 1 ? 'oui':'non');
	let stateSeparate  = (batteryState.StateSeparate === 1 ? 'Séparé':'Couplé');
	let volt = (batteryState.volt + ' V');
	let energy  = ((batteryState.energy/1000) +  ' (en kWh)');
	let power = ((batteryState.power/1000) +  ' (en kW)');
	return (
		<div>
			<div style={{marginTop:8,marginBottom:10}}>
				<Row>
					<Col span={12}>
						Donnée Validé:
					</Col>
					<Col span={12} style={{fontWeight:500}}>
						{stateValidityData}
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						Disjoncté:
					</Col>
					<Col span={12} style={{fontWeight:500}}>
						{stateBroken}
					</Col>
				</Row>
				<Row>
					<Col span={12}>
					Commutation en cours:
					</Col>
					<Col span={12} style={{fontWeight:500}}>
						{stateSwitch}
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						Arret d'urgence:
					</Col>
					<Col span={12} style={{fontWeight:500}}>
						{stateSecurity}
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						Séparé/Couplé Séparé:
					</Col>
					<Col span={12} style={{fontWeight:500}}>
						{stateSeparate}
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
						Energie disponible:
					</Col>
					<Col span={12} style={{fontWeight:500}}>
						{energy}
					</Col>
				</Row>
				<Row >
					<Col span={12} >
						Puissance instantané:
					</Col>
					<Col span={12} style={{fontWeight:500}}>
						{power}
					</Col>
				</Row>
			</div>
		</div>
		
	);
});

export default BatteryModalControl;