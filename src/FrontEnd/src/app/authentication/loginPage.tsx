import React, {
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import {
    useNavigate,
    useSearchParams,
} from 'react-router-dom';
import {
    Alert,
    Button,
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    Row,
} from 'reactstrap';
import { actionCreators as loginActionCreators } from './redux';
import dashHeroImage from '../../assets/dash-hero-image.jpeg';
import Loader from '../../common/components/loader';
import {
    ILogger,
    Logger,
} from '../../common/logging';
import usePrevious from '../../common/utilities/usePrevious';
import { actionCreators as bootstrapActionCreators } from '../applicationRedux';
import { RootState } from '../globalReduxStore';

const logger: ILogger = new Logger('Login Page');
const bemBlockName: string = 'login_page';

const mapStateToProps = (state: RootState) => ({
    hasLoginError: state.authentication.hasLoginError,
    isFetchingBootstrap: state.application.isFetchingBootstrap,
    isLoggedIn: state.authentication.isLoggedIn,
    isLoggingIn: state.authentication.isLoggingIn,
});

const mapDispatchToProps = {
    login: loginActionCreators.login,
    requestBootstrapInfo: bootstrapActionCreators.requestBootstrapInfo,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropTypes = ConnectedProps<typeof connector>;

function LoginPage(props: PropTypes) {
    const {
        hasLoginError,
        isFetchingBootstrap,
        isLoggedIn,
        isLoggingIn,
        login,
        requestBootstrapInfo,
    } = props;

    const navigate = useNavigate();
    const [searchParams, _] = useSearchParams(); // eslint-disable-line @typescript-eslint/no-unused-vars
    const returnUrl = useMemo(() => searchParams.get('returnUrl') ?? '/app', [searchParams]);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const wasLoggedIn = usePrevious(isLoggedIn);
    const wasFetchingBootstrap = usePrevious(isFetchingBootstrap);

    useEffect(() => {
        if (!wasLoggedIn && isLoggedIn) {
            logger.info('We just successfully logged in.');
            requestBootstrapInfo();
        }
    }, [
        isLoggedIn,
        requestBootstrapInfo,
        wasLoggedIn,
    ]);

    useEffect(() => {
        if (wasFetchingBootstrap && !isFetchingBootstrap) {
            logger.info('We just finished fetching the bootstrap info.');
            navigate(returnUrl, { replace: true });
        }
    });

    const onClickLogin = () => {
        login(email, password);
    }

    const onEmailChanged = (e: React.FormEvent<HTMLInputElement>) => {
        setEmail(e.currentTarget.value ?? '');
    };

    const onPasswordChanged = (e: React.FormEvent<HTMLInputElement>) => {
        setPassword(e.currentTarget.value ?? '');
    };

    const onPasswordKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter') {
            login(email, password);
        }
    };

    if (isFetchingBootstrap) {
        return (<Loader />);
    }

    return (
        <Row className = "mt-4">
            <Col>
                <img src = { dashHeroImage } alt = "Dash!" />
            </Col>

            <Col>
                <h1>Log in</h1>

                <Form className="mt-4">
                    <FormGroup>
                        <Label for={`${bemBlockName}--email_input`}>
                            Email
                        </Label>
                        <Input
                            autoComplete="username"
                            autoFocus
                            id={`${bemBlockName}--email_input`}
                            name="email"
                            onChange={onEmailChanged}
                            tabIndex={0}
                            type="email"
                            value={email}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for={`${bemBlockName}--password_input`}>
                            Password
                        </Label>
                        <Input
                            autoComplete="current-password"
                            id={`${bemBlockName}--password_input`}
                            name="password"
                            onChange={onPasswordChanged}
                            onKeyDown={onPasswordKeyDown}
                            tabIndex={0}
                            type="password"
                            value={password}
                        />
                    </FormGroup>
                </Form>

                <Button
                    className="btn-lg btn-primary mt-4"
                    disabled={isLoggingIn}
                    onClick={onClickLogin}
                    tabIndex={0}
                >
                    {isLoggingIn ? 'Logging In...' : 'Log In'}
                </Button>

                {hasLoginError && (
                    <Alert color="danger" className="mt-5">
                        <h4 className="alert-heading">
                            Login Failed
                        </h4>
                        <p className="mb-0">
                            Email (username) and/or password was incorrect.<br />
                            Please recheck them and try again.
                        </p>
                    </Alert>
                )}
            </Col>
        </Row >
    );
}

export default connector(LoginPage);
