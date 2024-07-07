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
import { actionCreators } from './data';

const logger: ILogger = new Logger('Login Page');
const bemBlockName: string = 'login_page';

const mapStateToProps = (state: ApplicationState) => ({
    isLoggedIn: state.authentication.isLoggedIn,
    isLoggingIn: state.authentication.isLoggingIn,
});

const mapDispatchToProps = {
    ...actionCreators,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropTypes = ConnectedProps<typeof connector>;

function LoginPage(props: PropTypes) {
    const {
        isLoggedIn,
        isLoggingIn,
        login,
    } = props;

    const navigate = useNavigate();
    const [searchParams, _] = useSearchParams();
    const returnUrl = useMemo(() => searchParams.get('returnUrl') ?? '/app', [searchParams]);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    useEffect(() => {
        if (isLoggedIn) {
            navigate(returnUrl, { replace: true });
        }
    }, [isLoggedIn]);
    

    const onClickLogin = () => {
        login(email, password);
    }

    const onEmailChanged = (e: React.FormEvent<HTMLInputElement>) => {
        setEmail(e.currentTarget.value ?? '');
    };

    const onPasswordChanged = (e: React.FormEvent<HTMLInputElement>) => {
        setPassword(e.currentTarget.value ?? '');
    };

    return (
        <Row className="mt-4">
            <Col>
                <img src={dashHeroImage} alt="Dash!" />
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
        </Row>
    );
}

export default connector(LoginPage);
