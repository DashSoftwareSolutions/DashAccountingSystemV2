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
    Button,
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    Row,
} from 'reactstrap';
import dashHeroImage from '../../assets/dash-hero-image.jpeg';
import { ApplicationState } from '../store';
import {
    ILogger,
    Logger,
} from '../../common/logging';
import { actionCreators as bootstrapActionCreators } from '../bootstrap';
import { actionCreators as loginActionCreators } from './data';
import Loader from '../../common/components/loader';
import usePrevious from '../../common/utilities/usePrevious';

const logger: ILogger = new Logger('Login Page');
const bemBlockName: string = 'login_page';

const mapStateToProps = (state: ApplicationState) => ({
    isFetchingBootrap: state.bootstrap.isFetching,
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
        isFetchingBootrap,
        isLoggedIn,
        isLoggingIn,
        login,
        requestBootstrapInfo,
    } = props;

    const navigate = useNavigate();
    const [searchParams, _] = useSearchParams();
    const returnUrl = useMemo(() => searchParams.get('returnUrl') ?? '/app', [searchParams]);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const wasLoggedIn = usePrevious(isLoggedIn);
    const wasFetchingBootstrap = usePrevious(isFetchingBootrap);

    useEffect(() => {
        if (!wasLoggedIn && isLoggedIn) {
            logger.info('We just successfully logged.');
            requestBootstrapInfo();
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (wasFetchingBootstrap && !isFetchingBootrap) {
            logger.info('We just finished fetching the bootrap info.');
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

    if (isFetchingBootrap) {
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
            </Col>
        </Row >
    );
}

export default connector(LoginPage);
