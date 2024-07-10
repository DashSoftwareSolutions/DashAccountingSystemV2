import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import {
    ConnectedProps,
    connect,
} from 'react-redux';
import { RootState } from '../../app/globalReduxStore';

type OwnPropTypes = {
    id: string;
    children: React.ReactNode;
};

const mapStateToProps = (state: RootState) => ({
    mainContentContainerHeight: state.application.mainContentContainerHeight,
});

const connector = connect(mapStateToProps);

type ReduxPropTypes = ConnectedProps<typeof connector>;

type PropTypes = ReduxPropTypes & OwnPropTypes;

function MainPageContent({
    children,
    id,
    mainContentContainerHeight,
}: PropTypes) {
    return (
        <div id={id}>
            <Scrollbars
                autoHide
                style={{ height: mainContentContainerHeight - 175 }}
            >
                <div className="scrollable-content-container">
                    {children}
                </div>
            </Scrollbars>
        </div>
    );
}

export default connector(MainPageContent);
