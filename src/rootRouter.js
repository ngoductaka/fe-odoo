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

export const history = createBrowserHistory();
export const UseRouter = () => {
    const userRole = useSelector(state => _.get(state, 'app.user.userrole', {}));
    const route = useMemo(() => {
        try {
            if (!userRole) return [];
            
            if (userRole === 13) {
                return private_route;
            } else {
                // return MAP_ROLE[2];
            }
        } catch (err) {
            // return private_route
        }
    }, [userRole])

    return route;

};
export default function RootRouter() {
    const dispatch = useDispatch();
    const route = UseRouter();

    const isLogin = useSelector(isLoginSelector);
    useEffect(() => {
        dispatch(fetchMasterData());
        dispatch(fetchItemCodeData());
        dispatch(fetchLocations());
    }, [dispatch]);
    return (
        <Router>
            <Switch>
                {public_route.map(({ exact = true, ...route }) => (
                    <Route key={route.path} exact={true} path={route.path}>
                        <route.Com />
                    </Route>
                ))}
                {route ? route.map(({ exact = true, ...route }) => (
                    <Route key={route.path} exact={true} path={route.path}>
                        <route.Com />
                    </Route>
                )) : null}
                <Route path='*' >
                    {isLogin ? <NotFound />: <Redirect to="/login" />}
                </Route>
            </Switch>
        </Router>
    );
}
