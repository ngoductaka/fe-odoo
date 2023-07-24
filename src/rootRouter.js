import { memo, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import _ from 'lodash'
import { private_route, public_route, MAP_ROLE, ROUTES } from '_config/route';
import { fetchItemCodeData, fetchLocations, fetchMasterData } from 'app_state/master';
import { useDispatch, useSelector } from 'react-redux';
import PrivateRoute from 'helper/router/private_route';
import { isLoginSelector } from 'app_state/login';
import { createBrowserHistory } from 'history';
import NotFound from 'page/not_found';
import './i18next';
import Layout from 'com/in_app_layout';


export const history = createBrowserHistory();
export const UseRouter = () => {
    const route = useMemo(() => {
        return private_route
    }, [])
    return route;
};
export default function RootRouter() {
    const route = UseRouter();

    const isLogin = useSelector(isLoginSelector);
    return (
        <Router>
            <Switch>
                {public_route.map(({ exact = true, ...route }) => (
                    <Route key={route.path} exact={true} path={route.path}>
                        <route.Com />
                    </Route>
                ))}
                {/* {route ? route.map(({ exact = true, ...route }) => (
                    <Route key={route.path} exact={true} path={route.path}>
                        <route.Com />
                    </Route>
                )) : null} */}

                <Route path='/' >
                    <Layout>
                        <Switch>
                            {route ? route.map(({ exact = true, ...route }) => (
                                <Route key={route.path} exact={true} path={route.path}>
                                    <route.Com />
                                </Route>
                            )) : null}

                        </Switch>
                    </Layout>
                </Route>
                <Route path='*' >
                    {isLogin ? <NotFound /> : <Redirect to="/login" />}
                </Route>
            </Switch>
        </Router>
    );
}
