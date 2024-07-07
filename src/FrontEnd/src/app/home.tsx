import React, {
    useEffect,
    useState,
} from 'react';
import {
    Button,
    Col,
    Row,
} from 'reactstrap';
import dashHeroImage from '../assets/dash-hero-image.jpg';
import {
    ILogger,
    Logger,
} from '../common/logging';
import Loader from '../common/components/loader';

const logger: ILogger = new Logger('Home Page');

function HomePage() {
    const onClickGoToAppButton = (() => {
        logger.info('Let\'s go!');
    });

    return (
        <div>Home Page</div>
    );
}

export default HomePage;