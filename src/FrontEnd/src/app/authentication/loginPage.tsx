import React, {
    useEffect,
    useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
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
import {
    ILogger,
    Logger,
} from '../../common/logging';

const logger: ILogger = new Logger('Login Page');
const bemBlockName: string = 'login_page';

function LoginPage() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const onClickLogin = () => {
        logger.info('Log me in!');
    }

    const onUsernameChanged = (e: React.FormEvent<HTMLInputElement>) => {
        setUsername(e.currentTarget.value ?? '');
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
                            tabIndex={0}
                            type="email"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for={`${bemBlockName}--password_input`}>
                            Password
                        </Label>
                        <Input
                            id={`${bemBlockName}--password_input`}
                            name="password"
                            tabIndex={0}
                            type="password"
                        />
                    </FormGroup>
                </Form>

                <Button
                    className="btn-primary mt-4"
                    onClick={onClickLogin}
                    tabIndex={0}
                >
                    Log In
                </Button>
            </Col>
        </Row>
    );
}

export default LoginPage;