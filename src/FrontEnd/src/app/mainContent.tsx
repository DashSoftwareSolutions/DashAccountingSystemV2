import React, {
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import { RootState } from './globalReduxStore';
import { actionCreators } from './applicationRedux';
import {
    ILogger,
    Logger,
} from '../common/logging';

const logger: ILogger = new Logger('Main Content Container');

type OwnPropTypes = {
    children: React.ReactNode;
};

const mapStateToProps = (state: RootState) => ({
    height: state.application.mainContentContainerHeight,
});

const mapDispatchToProps = {
    setHeight: actionCreators.setMainContentContainerHeight,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxPropTypes = ConnectedProps<typeof connector>;

type PropTypes = ReduxPropTypes & OwnPropTypes;

function MainContent({
    children,
    height,
    setHeight,
}: PropTypes) {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            setHeight(elementRef.current?.offsetHeight ?? 0);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    logger.info('Height:', height);

    return (
        <div className="container main-content-container" ref={elementRef}>
            {children}
        </div>
    );
}

export default connector(MainContent);
