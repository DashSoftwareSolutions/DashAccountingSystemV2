import React, { useEffect } from 'react';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Col,
    Row,
} from 'reactstrap';
import { actionCreators } from './redux';
import dashHeroImage from '../../assets/dash-hero-image.jpeg';
import {
    ILogger,
    Logger,
} from '../../common/logging';
import usePrevious from '../../common/utilities/usePrevious';
import { RootState } from '../globalReduxStore';

const logger: ILogger = new Logger('Logout Page');

const mapStateToProps = (state: RootState) => ({
    isLoggedIn: state.authentication.isLoggedIn,
    isLoggingOut: state.authentication.isLoggingOut,
});

const mapDispatchToProps = {
    logout: actionCreators.logout,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropTypes = ConnectedProps<typeof connector>;

function LogoutPage(props: PropTypes) {
    const {
        isLoggedIn,
        isLoggingOut,
        logout,
    } = props;

    const navigate = useNavigate();
    const wasLoggingOut = usePrevious(isLoggingOut);

    useEffect(() => {
        if (wasLoggingOut && !isLoggingOut) {
            logger.info('We just finished logging out');
            navigate('/');
        }
    }, [
        isLoggingOut,
        navigate,
        wasLoggingOut,
    ]);

    const onClickLogout = () => {
        logout();
    };

    return (
        <Row className="mt-4">
            <Col>
                <img
                    alt="Dash!"
                    src={dashHeroImage}
                />
            </Col>

            <Col>
                <h1>Logout</h1>

                {isLoggedIn ? (
                    <Button
                        className="btn-lg btn-primary mt-4"
                        disabled={isLoggingOut}
                        onClick={onClickLogout}
                        tabIndex={0}
                    >
                        {isLoggingOut ? 'Logging Out...' : 'Click to Log Out'}
                    </Button>
                ): (
                    <p>You have successfully logged out of the application.</p>
                )}
            </Col>
        </Row>
    );
}

export default connector(LogoutPage);
