
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { isLoginSelector } from '../../app_state/login';
import { ROUTES } from '../../_config/route';

function PrivateRoute({ children, ...rest }) {
    const isLogin = useSelector(isLoginSelector);
    return (
        <Route
            {...rest}
            render={({ location }) =>
                isLogin ? <div>{children}</div> : (
                    <Redirect
                        to={{
                            pathname: `/${ROUTES.LOGIN}`,
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}

export default PrivateRoute;

