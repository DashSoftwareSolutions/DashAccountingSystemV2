import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import {
    Button,
    Col,
    Row,
} from 'reactstrap';
import dashHeroImage from '../assets/dash-hero-image.jpeg';
import { ApplicationState } from './store';
import {
    ILogger,
    Logger,
} from '../common/logging';

const logger: ILogger = new Logger('Home Page');

const mapStateToProps = (state: ApplicationState) => ({
    isLoggedIn: state.authentication.isLoggedIn,
});

const connector = connect(mapStateToProps);

type PropTypes = ConnectedProps<typeof connector>;

function HomePage(props: PropTypes) {
    const { isLoggedIn } = props;
    const navigate = useNavigate();

    const onClickGoToAppButton = useCallback(() => {
        if (isLoggedIn) {
            navigate('/app');
        } else {
            navigate(`/login?returnUrl=${encodeURIComponent('/app')}`);
        }
    }, [isLoggedIn]);

    return (
        <Row className="mt-4">
            <Col>
                <img src={dashHeroImage} alt="Dash!" />
            </Col>
            <Col>
                <h4>Welcome to</h4>
                <h1>Dash Accounting System v2.0</h1>
                <p>Built with:</p>
                <ul>
                    <li><a href="https://get.asp.net" rel="external nofollow noreferrer" target="_blank">ASP.NET Core</a> and <a href="https://learn.microsoft.com/en-us/dotnet/csharp" rel="external nofollow noreferrer" target="_blank">C#</a> for cross-platform server-side code</li>
                    <li><a href="https://react.dev" rel="external nofollow noreferrer" target="_blank">React</a> and <a href="https://redux.js.org" rel="external nofollow noreferrer" target="_blank">Redux</a> (with <a href="https://www.typescriptlang.org" rel="external nofollow noreferrer" target="_blank">TypeScript</a>) for client-side code</li>
                    <li><a href="http://getbootstrap.com" rel="external nofollow noreferrer" target="_blank">Bootstrap</a> for layout and styling</li>
                </ul>

                <Button className="btn-lg btn-primary mt-4" onClick={onClickGoToAppButton}>Go to the Application</Button>
            </Col>
        </Row>
    );
}

export default connector(HomePage);
