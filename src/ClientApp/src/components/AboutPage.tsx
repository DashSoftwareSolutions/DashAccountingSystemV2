import * as React from 'react';
import { Col, Row } from 'reactstrap';

const AboutPage = () => (
    <Row>
        <Col>
            <img src="/images/dash-hero-image.jpeg" alt="Dash!" />
        </Col>
        <Col>
            <h4>Welcome to</h4>
            <h1>Dash Accounting System v2.0</h1>
            <p>Built with:</p>
            <ul>
                <li><a href='https://get.asp.net/'>ASP.NET Core</a> and <a href='https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx'>C#</a> for cross-platform server-side code</li>
                <li><a href='https://facebook.github.io/react/'>React</a> and <a href='https://redux.js.org/'>Redux</a> for client-side code</li>
                <li><a href='http://getbootstrap.com/'>Bootstrap</a> for layout and styling</li>
            </ul>
        </Col>
    </Row>
);

export default AboutPage;