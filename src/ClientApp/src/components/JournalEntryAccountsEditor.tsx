﻿import * as React from 'react';
import {
    Alert,
    Button,
    Input,
} from 'reactstrap';
import {
    find,
    filter,
    isEmpty,
    isFinite,
    isNil,
    map,
    reduce,
} from 'lodash';
import {
    ILogger,
    Logger,
} from '../common/Logging'; import Account from '../models/Account';
import { isStringNullOrWhiteSpace } from '../common/StringUtils';
import AssetType from '../models/AssetType';
import Mode from '../models/Mode';
import AccountCategoryList from '../models/AccountCategoryList';
import AccountSelector from './AccountSelector';
import AccountSelectOption from '../models/AccountSelectOption';
import AssetTypeSelector from './AssetTypeSelector';
import AmountType from '../models/AmountType';
import JournalEntryAccount from '../models/JournalEntryAccount';
import Amount from '../models/Amount';

interface JournalEntryAccountsEditorProps {
    accounts: Account[];
    accountSelectOptions: AccountCategoryList[];
    assetTypes: AssetType[];
    isEntryUnbalanced: boolean;
    journalEntryAccounts: JournalEntryAccount[];
    mode: Mode;
    onAccountAdded: Function;
    onAccountAmountChanged: Function;
    onAccountRemoved: Function;
    totalCredits: number;
    totalDebits: number;
}

interface JournalEntryAccountsEditorState {
    addAccountId: string | null;// GUID - ID of selected Account
    addAccountName: string | null; // Name of selected Account
    addAccountNumber: number | null; // Acct # of selected Account
    addAssetType: AssetType | null;
    addCredit: number | null;
    addDebit: number | null;
}

const canAddAccount = (state: JournalEntryAccountsEditorState): boolean => {
    const {
        addAccountId,
        addAccountName,
        addAccountNumber,
        addAssetType,
        addCredit,
        addDebit,
    } = state;

    return !isNil(addAccountId) &&
        !isStringNullOrWhiteSpace(addAccountName) &&
        !isNil(addAccountNumber) &&
        !isNil(addAssetType) &&
        ((addCredit || 0) > 0 || (addDebit || 0) > 0);
};

const getNewAccount = (state: JournalEntryAccountsEditorState): JournalEntryAccount => {
    const {
        addAccountId,
        addAccountName,
        addAccountNumber,
        addAssetType,
        addCredit,
        addDebit,
    } = state;

    let amount: number = 0;
    let amountType: AmountType = AmountType.Debit;

    if (!isNil(addDebit) && addDebit > 0) {
        amount = addDebit;
    } else if (!isNil(addCredit) && addCredit > 0) {
        amount = addCredit * -1;
        amountType = AmountType.Credit;
    }

    const newAccountAmount: Amount = {
        assetType: addAssetType,
        amount,
        amountType,
    };

    return {
        accountId: addAccountId,
        accountName: addAccountName,
        accountNumber: addAccountNumber,
        amount: newAccountAmount,
    };
}

class JournalEntryAccountsEditor extends React.PureComponent<JournalEntryAccountsEditorProps, JournalEntryAccountsEditorState> {
    private logger: ILogger;
    private bemBlockName: string = 'journal_entry_accounts_editor';

    public constructor(props: JournalEntryAccountsEditorProps) {
        super(props);

        this.logger = new Logger('Journal Entry Accounts Editor');

        const { assetTypes } = props;
        const defaultAssetType = !isEmpty(assetTypes) ? assetTypes[0] : null;

        this.state = {
            addAccountId: null,
            addAccountName: null,
            addAccountNumber: null,
            addAssetType: defaultAssetType,
            addCredit: null,
            addDebit: null,
        };

        this.onAccountSelected = this.onAccountSelected.bind(this);
        this.onAddClick = this.onAddClick.bind(this);
        this.onAddCreditAmountChanged = this.onAddCreditAmountChanged.bind(this);
        this.onAddDebitAmountChanged = this.onAddDebitAmountChanged.bind(this);
        this.onAssetTypeSelected = this.onAssetTypeSelected.bind(this);
        this.onEditCreditAmountChanged = this.onEditCreditAmountChanged.bind(this);
        this.onEditDebitAmountChanged = this.onEditDebitAmountChanged.bind(this);
        this.onRemoveAccountClick = this.onRemoveAccountClick.bind(this);
    }

    public componentDidUpdate(prevProps: JournalEntryAccountsEditorProps) {
        const { assetTypes: prevAssetTypes } = prevProps;
        const { assetTypes: nextAssetTypes } = this.props;
        const { addAssetType } = this.state;

        if (!isEmpty(nextAssetTypes) &&
            isEmpty(prevAssetTypes) &&
            isNil(addAssetType)) {
            this.setState({ addAssetType: nextAssetTypes[0] });
        }
    }

    public render() {
        const {
            accountSelectOptions,
            assetTypes,
            isEntryUnbalanced,
            journalEntryAccounts,
            totalCredits,
            totalDebits,
        } = this.props;

        const {
            addAccountId,
            addAssetType,
            addCredit,
            addDebit,
        } = this.state;

        const alreadySelectedAccountIds = map(journalEntryAccounts, acct => acct.accountId ?? '');

        return (
            <div id={this.bemBlockName}>
                <div className="row" style={{ minHeight: '66px' }}>
                    <div className="col-md-6">
                        <h4>Journal Entry Account Details</h4>
                    </div>
                    <div className="col-md-6">
                        <Alert color="warning" isOpen={isEntryUnbalanced}>
                            Entry is not balanced
                        </Alert>
                    </div>
                </div>
                <table className="table" id={`${this.bemBlockName}--accounts_table`}>
                    <thead>
                        <tr>
                            <th className="col-md-5">Account</th>
                            <th className="col-md-2">Asset Type</th>
                            <th className="col-md-2">Debit</th>
                            <th className="col-md-2">Credit</th>
                            <th className="col-md-1"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {map(journalEntryAccounts, (account) => {
                            const {
                                accountId,
                                accountName,
                                accountNumber,
                                amount: amountObject
                            } = account;

                            const {
                                amount,
                                amountType,
                                assetType
                            } = amountObject ?? {};

                            const assetTypeName = assetType?.name ?? '';

                            const creditAmount = !isNil(amount) && amountType === AmountType.Credit ?
                                -1 * amount ?? 0 :
                                null;

                            const debitAmount = !isNil(amount) && amountType === AmountType.Debit ?
                                amount ?? 0 :
                                null;

                            const safeAccountId = accountId ?? '';

                            return (
                                <tr key={safeAccountId}>
                                    <td className="col-md-5" style={{ verticalAlign: 'middle' }}>
                                        <Input
                                            readOnly
                                            style={{ border: 'none', width: '100%' }}
                                            type="text"
                                            value={`${accountNumber} - ${accountName}`}
                                        />
                                    </td>
                                    <td className="col-md-2" style={{ verticalAlign: 'middle' }}>
                                        <Input
                                            readOnly
                                            style={{ border: 'none', width: '100%' }}
                                            type="text"
                                            value={assetTypeName}
                                        />
                                    </td>
                                    <td className="col-md-2">
                                        <Input
                                            id={`${this.bemBlockName}--edit_debit_amount_input_${safeAccountId}`}
                                            onChange={(e) => this.onEditDebitAmountChanged(e, safeAccountId)}
                                            style={{ textAlign: 'right' }}
                                            type="number"
                                            value={debitAmount?.toString() ?? ''}
                                        />
                                    </td>
                                    <td className="col-md-2">
                                        <Input
                                            id={`${this.bemBlockName}--edit_credit_amount_input_${safeAccountId}`}
                                            name="check_number_input"
                                            onChange={(e) => this.onEditCreditAmountChanged(e, safeAccountId)}
                                            style={{ textAlign: 'right' }}
                                            type="number"
                                            value={creditAmount?.toString() ?? ''}
                                        />
                                    </td>
                                    <td className="col-md-1" style={{ textAlign: 'right' }}>
                                        <Button
                                            color="danger"
                                            id={`${this.bemBlockName}--remove_account_button_${safeAccountId}`}
                                            onClick={(e) => this.onRemoveAccountClick(e, safeAccountId)}
                                        >
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="col-md-5">
                                <strong>TOTALS</strong>
                            </td>
                            <td className="col-md-2" />
                            <td className="col-md-2" style={{ textAlign: 'right' }}>
                                {/* TODO/FIXME: Be aware of asset type and user locale */}
                                {totalDebits.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
                            </td>
                            <td className="col-md-2" style={{ textAlign: 'right' }}>
                                {/* TODO/FIXME: Be aware of asset type and user locale */}
                                {totalCredits.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
                            </td>
                            <td className="col-md-1" />
                        </tr>
                        <tr>
                            <td className="col-md-5">
                                <AccountSelector
                                    accountSelectOptions={accountSelectOptions ?? []}
                                    disabledAccountIds={alreadySelectedAccountIds ?? []}
                                    id={`${this.bemBlockName}--add_account_selector`}
                                    name="account_selector"
                                    onChange={this.onAccountSelected}
                                    value={addAccountId ?? ''}
                                />
                            </td>
                            <td className="col-md-2">
                                <AssetTypeSelector
                                    assetTypes={assetTypes ?? []}
                                    id={`${this.bemBlockName}--add_account_asset_type_selector`}
                                    name="asset_type_selector"
                                    onChange={this.onAssetTypeSelected}
                                    value={addAssetType?.id ?? null}
                                />
                            </td>
                            <td className="col-md-2">
                                <Input
                                    id={`${this.bemBlockName}--add_account_debit_amount_input`}
                                    onChange={this.onAddDebitAmountChanged}
                                    style={{ textAlign: 'right' }}
                                    type="number"
                                    value={addDebit?.toString() ?? ''}
                                />
                            </td>
                            <td className="col-md-2">
                                <Input
                                    id={`${this.bemBlockName}--add_account_credit_amount_input`}
                                    onChange={this.onAddCreditAmountChanged}
                                    style={{ textAlign: 'right' }}
                                    type="number"
                                    value={addCredit?.toString() ?? ''}
                                />
                            </td>
                            <td className="col-md-1" style={{ textAlign: 'right' }}>
                                <Button
                                    color="primary"
                                    disabled={!canAddAccount(this.state)}
                                    id={`${this.bemBlockName}--add_account_button`}
                                    onClick={this.onAddClick}
                                    style={{ width: '100%' }}
                                >
                                    Add
                                </Button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        );
    }

    private onAccountSelected(selectedAccountOption: AccountSelectOption | null) {
        if (!isNil(selectedAccountOption)) {
            const { accounts } = this.props;

            const selectedAccount = find(accounts, (a) => a.id === selectedAccountOption.id);

            if (!isNil(selectedAccount)) {
                this.setState({
                    addAccountId: selectedAccount.id,
                    addAccountName: selectedAccount.name,
                    addAccountNumber: selectedAccount.accountNumber,
                });

                return;
            }
        }

        this.setState({
            addAccountId: null,
            addAccountName: null,
            addAccountNumber: null,
        });
    }

    private onAddClick(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault();

        if (canAddAccount(this.state)) {
            const { onAccountAdded } = this.props;
            const newAccount = getNewAccount(this.state);
            onAccountAdded(newAccount);

            this.setState({
                addAccountId: null,
                addAccountName: null,
                addAccountNumber: null,
                addCredit: null,
                addDebit: null,
            })
        } else {
            this.logger.debug('Not enough information to add new account');
        }
    }

    onAddCreditAmountChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const parsedAmount = parseFloat(event.currentTarget.value);

        const safeValueForUpdate = isFinite(parsedAmount) ?
            parsedAmount :
            null;

        this.setState({ addCredit: safeValueForUpdate });
    }

    onAddDebitAmountChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const parsedAmount = parseFloat(event.currentTarget.value);

        const safeValueForUpdate = isFinite(parsedAmount) ?
            parsedAmount :
            null;

        this.setState({ addDebit: safeValueForUpdate });
    }

    private onAssetTypeSelected(selectedAssetType: AssetType | null) {
        if (!isNil(selectedAssetType)) {
            this.setState({ addAssetType: selectedAssetType });
        } else {
            this.setState({ addAssetType: null });
        }
    }

    onEditCreditAmountChanged(event: React.ChangeEvent<HTMLInputElement>, accountId: string) {
        const parsedAmount = parseFloat(event.currentTarget.value);
        const { onAccountAmountChanged } = this.props;
        onAccountAmountChanged(accountId, isFinite(parsedAmount) ? -1 * parsedAmount : null);
    }

    onEditDebitAmountChanged(event: React.ChangeEvent<HTMLInputElement>, accountId: string) {
        const parsedAmount = parseFloat(event.currentTarget.value);
        const { onAccountAmountChanged } = this.props;
        onAccountAmountChanged(accountId, isFinite(parsedAmount) ? parsedAmount : null);
    }

    onRemoveAccountClick(event: React.MouseEvent<HTMLElement>, accountId: string) {
        event.stopPropagation();
        const { onAccountRemoved } = this.props;
        onAccountRemoved(accountId);
    }
}

export default JournalEntryAccountsEditor;
