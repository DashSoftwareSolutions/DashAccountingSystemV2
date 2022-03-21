﻿import * as React from 'react';
import { Col, Row } from 'reactstrap';

const PrivacyPage = () => (
    <Row>
        <Col>
            <img src="/images/dash-hero-image.jpeg" alt="Dash!" />
        </Col>
        <Col>
            <h1>Dash Accounting System v2.0</h1>
            <h2>Privacy Policy</h2>
            <p>
                {'Please read this privacy policy (\u201ccookie policy\u201d, \u201cpolicy\u201cd carefully before using the Dash Accounting System website (\u201cwebsite\u201d, \u201cservice\u201d, \u201csystem\u201d) operated by Dash Software Solutions, Inc. (\u201cus\u201d, \u201cwe\u201d, \u201cour\u201d).'}
            </p>
            <h4>Collection of Personal Information</h4>
            <p>
                First Name, Last Name and Email Address are required to create an account and use the service.
                This information is stored only for account and profile management and system usage purposes.
                It is not shared with any third-party for any purpose except as required by U.S. federal or California state law (e.g. responding to a lawfully issued subpeona).
                The system does not currently require nor use a Mobile Phone Number as part of the user account/profile, but may do so in the future.
            </p>
            <h4>Email and Mobile Phone (SMS) Communications</h4>
            <p>
                All communications are for system usage and account management purposes.  No marketing communications are presently sent.
            </p>
            <h4>Cookies</h4>
            <h5>What are cookies?</h5>
            <p>
                {'Cookies are simple text files that are stored on your computer or mobile device by a website\u2019s server. Each cookie is unique to your web browser. It will contain some anonymous information such as a unique identifier, the website\u2019s domain name, and some digits and numbers.'}
            </p>
            <h5>What types of cookies do we use?</h5>
            <em>Necessary cookies</em>
            <p>
                Necessary cookies allow us to offer you the best possible experience when accessing and
                navigating through our website and using its features. For example, these cookies let us
                recognize that you have created an account and have logged into that account.
            </p>
            <em>Functionality cookies</em>
            <p>
                Functionality cookies let us operate the site in accordance with the choices you make. For
                example, we will recognize your username and remember how you customized the site during
                future visits.
            </p>
            <h5>How to delete cookies?</h5>
            <p>
                If you want to restrict or block the cookies that are set by our website, you can do so through
                your browser setting. Alternatively, you can visit
                <a href="https://www.internetcookies.org">www.internetcookies.org</a>, which contains
                comprehensive information on how to do this on a wide variety of browsers and devices. You
                will find general information about cookies and details on how to delete cookies from your
                device.
            </p>
            <h5>Contacting us</h5>
            <p>
                If you have any questions about this policy or our use of cookies, please contact us.
            </p>
            <p>
                Privay policy adapted from <a href="https://www.websitepolicies.com/blog/sample-cookie-policy-template">https://www.websitepolicies.com/blog/sample-cookie-policy-template</a>.
            </p>
        </Col>
    </Row>
);

export default PrivacyPage;