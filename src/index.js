import React from 'react';
import ReactDOM from 'react-dom';

// REDUX
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';

import { Skeleton } from 'antd';

// STYLES
import 'antd/dist/antd.css';
import './styled/index.css';
import './i18next';

//
import reportWebVitals from './reportWebVitals';
// import AppLayout from './com/app_layout';
import RootRouter from './rootRouter';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={<Skeleton />} persistor={persistor}>
                {/* <AppLayout> */}
                <RootRouter />
                {/* </AppLayout> */}
            </PersistGate>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
