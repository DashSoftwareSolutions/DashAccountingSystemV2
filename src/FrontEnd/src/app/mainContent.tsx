import React, {
    useEffect,
    useRef,
} from 'react';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import { actionCreators } from './applicationRedux';
import { RootState } from './globalReduxStore';
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
            const newHeight = elementRef.current?.offsetHeight ?? 0;
            logger.debug('Resizing to height:', newHeight);
            setHeight(newHeight);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }

        // Suppressing "react-hooks/exhaustive-deps" to use an empty dependencies array for "component did mount" type semantics
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            className="container main-content-container"
            ref={elementRef}
        >
            {children}
        </div>
    );
}

export default connector(MainContent);
