import React, { useCallback } from 'react';
import {
    ConnectedProps,
    connect,
    useDispatch,
} from 'react-redux';
import {
    Button,
    Col,
    Form,
    FormFeedback,
    FormGroup,
    Input,
    Label,
    Row,
} from 'reactstrap';
import { Dispatch } from 'redux';
import { RootState } from '../../app/globalReduxStore';
import IAction from '../../app/globalReduxStore/action.interface';
import {
    actionCreators as notificationActionCreators,
    NotificationLevel,
} from '../../app/notifications';
import MainPageContent from '../../common/components/mainPageContent';
import {
    ILogger,
    Logger,
} from '../../common/logging';
import { apiErrorHandler } from '../../common/utilities/errorHandling';
import { isStringNullOrWhiteSpace } from '../../common/utilities/stringUtils';
import useNamedState from '../../common/utilities/useNamedState';

const bemBlockName: string = 'manage_account_page';
const logger: ILogger = new Logger('Manage Account Page');

const mapStateToProps = (state: RootState) => ({
    accessToken: state.authentication.tokens?.accessToken ?? '',
});

const mapDispatchToProps = {
    showAlert: notificationActionCreators.showAlert,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ManageUserAccountPagePropTypes = ConnectedProps<typeof connector>;

function ManageUserAccountPage({
    accessToken,
    showAlert,
}: ManageUserAccountPagePropTypes) {
    const dispatch = useDispatch();

    const [oldPassword, setOldPassword] = useNamedState<string>('oldPassword', '');
    const [newPassword, setNewPassword] = useNamedState<string>('newPassword', '');
    const [confirmNewPassword, setConfirmNewPassword] = useNamedState<string>('confirmNewPassword', '');
    const [isSaving, setIsSaving] = useNamedState<boolean>('isSaving', false);

    const changePassword = useCallback(() => {
        logger.info('Changing password...');

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({
                oldPassword,
                newPassword,
                confirmPassword: confirmNewPassword,
            }),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        setIsSaving(true);

        fetch('/api/authentication/change-password', requestOptions)
            .then((response) => {
                if (!response.ok) {
                    apiErrorHandler.handleError(response, dispatch as Dispatch<IAction>);
                } else {
                    setConfirmNewPassword('');
                    setNewPassword('');
                    setOldPassword('');
                    showAlert(NotificationLevel.Success, 'Successfully change your password', true);
                }
            })
            .finally(() => {
                setIsSaving(false);
            });
    }, [
        accessToken,
        confirmNewPassword,
        dispatch,
        newPassword,
        oldPassword,
        setConfirmNewPassword,
        setIsSaving,
        setNewPassword,
        setOldPassword,
        showAlert,
    ]);

    const onChangePasswordClick = (e: React.MouseEvent) => {
        e.preventDefault();
        changePassword();
    };

    const onOldPasswordChanged = (e: React.FormEvent<HTMLInputElement>) => {
        setOldPassword(e.currentTarget.value);
    };

    const onNewPasswordChanged = (e: React.FormEvent<HTMLInputElement>) => {
        setNewPassword(e.currentTarget.value);
    };

    const onConfirmNewPasswordChanged = (e: React.FormEvent<HTMLInputElement>) => {
        setConfirmNewPassword(e.currentTarget.value);
    };

    const onConfirmNewPasaswordKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter') {
            changePassword();
        }
    };

    const canChangePassword = !isStringNullOrWhiteSpace(oldPassword) &&
        !isStringNullOrWhiteSpace(newPassword) &&
        !isStringNullOrWhiteSpace(confirmNewPassword) &&
        newPassword === confirmNewPassword;

    /* TODO:
     * * Better validation user experience
     * * Validate complexity requirements
     */ 

    return (
        <React.Fragment>
            <div
                className="page_header"
                id={`${bemBlockName}--header`}
            >
                <Row>
                    <Col>
                        <h1>My Account</h1>
                        <p className="page_header--subtitle">Settings</p>
                    </Col>
                </Row>
            </div>

            <MainPageContent id={`${bemBlockName}--content`}>
                <h4>Change My Password</h4>

                <Form style={{ marginTop: 22 }}>
                    <Row>
                        <Col
                            md={4}
                            sm={6}
                        >
                            <FormGroup>
                                <Label for={`${bemBlockName}--old_password_input`}>Current Password</Label>
                                <Input
                                    id={`${bemBlockName}--old_password_input`}
                                    name="old_password_input"
                                    onChange={onOldPasswordChanged}
                                    type="password"
                                    value={oldPassword}
                                />
                                <FormFeedback>{''}</FormFeedback>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col
                            md={4}
                            sm={6}
                        >
                            <FormGroup>
                                <Label for={`${bemBlockName}--new_password_input`}>New Password</Label>
                                <Input
                                    id={`${bemBlockName}--new_password_input`}
                                    name="new_password_input"
                                    onChange={onNewPasswordChanged}
                                    type="password"
                                    value={newPassword}
                                />
                                <FormFeedback>{''}</FormFeedback>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col
                            md={4}
                            sm={6}
                        >
                            <FormGroup>
                                <Label for={`${bemBlockName}--confirm_new_password_input`}>Confirm New Password</Label>
                                <Input
                                    id={`${bemBlockName}--confirm_new_password_input`}
                                    name="cofirm_new_password_input"
                                    onChange={onConfirmNewPasswordChanged}
                                    onKeyDown={onConfirmNewPasaswordKeyDown}
                                    type="password"
                                    value={confirmNewPassword}
                                />
                                <FormFeedback>{''}</FormFeedback>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Button
                        color="primary"
                        disabled={!canChangePassword || isSaving}
                        id={`${bemBlockName}--change_password_button`}
                        onClick={onChangePasswordClick}
                        style={{
                            marginTop: 22,
                            width: 190,
                        }}
                    >
                        {isSaving ? 'Changing Password ...' : 'Change Password'}
                    </Button>
                </Form>

            </MainPageContent>
        </React.Fragment>
    );
}

export default connector(ManageUserAccountPage);
