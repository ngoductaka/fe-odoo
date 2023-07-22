import React, { useMemo } from 'react';
import './styles.css';
import { ArrowRightOutlined, ArrowLeftOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { GeneralHeader } from 'com/app_layout/general_header';
import { Route, Switch, useRouteMatch, Link, useHistory, useLocation } from 'react-router-dom';
import { ROUTES } from '_config/route';
const steps = [
    [
        { steps: 1, text: '1. Warehouse floor entry with RFID scanning and tagging.​', active: true, path: ROUTES.WAREHOUSE_IN },
        { steps: 2, text: '2. Material is kept in specific sectors​', active: true, path: ROUTES.LAYOUT },
        { steps: 3, text: '3. Update material information​', active: true, path: ROUTES.INPUT },
        { steps: 4, text: '4. Order management and handle stock out', active: true, path: ROUTES.ORDER },
    ],
]
const App = () => {
    const activeSteps = [1,2,3,4];
    return (
        <div>
            <GeneralHeader title='Process flow​' />
            <div className='wrapper-steps'>
                {steps[0].map((i, index) => (
                    <div key={index + ''} style={{ display: 'flex', alignItems: 'center', alignSelf: 'stretch' }}>
                        {index ? <ArrowRightOutlined style={{ margin: '0.3vw', fontSize: '1.4vw', fontWeight: '900' }} /> : null}
                        <Item activeSteps={activeSteps} key={index + ''} data={i} />
                    </div>
                ))}
            </div>

        </div>
    )
};

const Item = ({ data, activeSteps }) => {
    const history = useHistory();
    const active = activeSteps.includes(data.steps)
    return (
        <div onClick={() => {
            if (active) history.push(data.path)
        }} className={active ? 'item-step' : 'item-step inactive'}>
            <span>{data.text}</span>
        </div>
    )
}





export default App;