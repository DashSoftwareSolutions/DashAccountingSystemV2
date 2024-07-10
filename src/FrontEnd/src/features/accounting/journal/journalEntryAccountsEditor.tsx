import React, {
    useCallback,
    useEffect,
    useMemo,
} from 'react';
import {
    Alert,
    Button,
    Input,
} from 'reactstrap';
import {
    find,
    isEmpty,
    isFinite,
    isNil,
    map,
    trim,
} from 'lodash';
import {
    Account,
    AccountCategoryList,
    AccountSelectOption,
} from '../chart-of-accounts/models';
import AccountSelector from './accountSelector';
import AssetTypeSelector from './assetTypeSelector';
import useAddJournalEntryAccount from './useAddJournalEntryAccount';
import {
    DraftJournalEntryAccount,
    JournalEntryAccount,
} from './models';
import { DEFAULT_ASSET_TYPE } from '../../../common/constants';
import AmountDisplay from '../../../common/components/amountDisplay';
import {
    ILogger,
    Logger,
} from '../../../common/logging';
import {
    Amount,
    AmountType,
    AssetType,
    Mode,
} from '../../../common/models';
import { isStringNullOrWhiteSpace } from '../../../common/utilities/stringUtils';
import usePrevious from '../../../common/utilities/usePrevious';

type PropTypes = {
    accounts: Account[];
    accountSelectOptions: AccountCategoryList[];
    assetTypes: AssetType[];
    entryHasMixedAssetTypes: boolean;
    entryIsUnbalanced: boolean;
    journalEntryAccounts: JournalEntryAccount[];
    mode: Mode;
    onAccountAdded: Function;
    onAccountAmountChanged: Function;
    onAccountRemoved: Function;
    totalCredits: number;
    totalDebits: number;
};

const logger: ILogger = new Logger('Journal Entry Account Editor');
const bemBlockName: string = 'journal_entry_accounts_editor';

const getCompletedJournalEntryAccount = (draft: DraftJournalEntryAccount): JournalEntryAccount => {
    let amount: number = 0;
    let amountAsString: string | null = null;
    let amountType: AmountType = AmountType.Debit;

    if (!isNil(draft.debit) && draft.debit > 0) {
        amount = draft.debit;
        amountAsString = draft.debitAsString;
    } else if (!isNil(draft.credit) && draft.credit > 0) {
        amount = draft.credit * -1;
        amountAsString = draft.creditAsString;
        amountType = AmountType.Credit;
    }

    const newAccountAmount: Amount = {
        assetType: draft.assetType,
        amount,
        amountAsString,
        amountType,
    };

    return {
        accountId: draft.accountId,
        accountName: draft.accountName,
        accountNumber: draft.accountNumber,
        amount: newAccountAmount,
    };
};

function JournalEntryAccountsEditor(props: PropTypes) {
    const {
        accounts,
        accountSelectOptions,
        assetTypes,
        entryHasMixedAssetTypes,
        entryIsUnbalanced,
        journalEntryAccounts,
        onAccountAdded,
        onAccountAmountChanged,
        onAccountRemoved,
        totalCredits,
        totalDebits,
    } = props;

    const prevAssetTypes = usePrevious(assetTypes);

    const defaultAssetType = useMemo(() => (!isEmpty(journalEntryAccounts) ?
        journalEntryAccounts[0]?.amount?.assetType ?? DEFAULT_ASSET_TYPE :
        DEFAULT_ASSET_TYPE), []);

    const [
        newJournalEntryAccount,
        setAccount,
        setAssetType,
        setCreditAmountForNewAccount,
        setDebitAmountForNewAccount,
        resetNewJournalEntryAccount,
    ] = useAddJournalEntryAccount(defaultAssetType);

    const isNewJournalEntryAccountComplete = useMemo(() => {
        return !isNil(newJournalEntryAccount.accountId) &&
            !isStringNullOrWhiteSpace(newJournalEntryAccount.accountName) &&
            !isNil(newJournalEntryAccount.accountNumber) &&
            !isNil(newJournalEntryAccount.assetType) &&
            ((newJournalEntryAccount.credit ?? 0) > 0 || (newJournalEntryAccount.debit ?? 0) > 0);
    }, [newJournalEntryAccount]);

    useEffect(() => {
        if (!isEmpty(assetTypes) &&
            isEmpty(prevAssetTypes)) {
            logger.info('Hey ma, we just received the asset types!');
            setAssetType(assetTypes[0]);
        }
    }, [
        assetTypes,
        prevAssetTypes,
    ]);

    const onAccountSelected = useCallback((selectedAccountOption: AccountSelectOption | null) => {
        const selectedAccount = !isNil(selectedAccountOption) ?
            accounts.find((a) => a.id === selectedAccountOption.id) ?? null :
            null;

        setAccount(selectedAccount);
    }, [setAccount]);

    const onAddClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();

        if (isNewJournalEntryAccountComplete) {
            const newAccount = getCompletedJournalEntryAccount(newJournalEntryAccount);
            onAccountAdded(newAccount);
            resetNewJournalEntryAccount();
        } else {
            logger.info('Not enough information to add new account');
        }
    }, [
        isNewJournalEntryAccountComplete,
        newJournalEntryAccount,
    ]);

    const onAddCreditAmountChanged = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setCreditAmountForNewAccount(event.currentTarget.value);
    }, [setCreditAmountForNewAccount]);

    const onAddDebitAmountChanged = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setDebitAmountForNewAccount(event.currentTarget.value);
    }, [setDebitAmountForNewAccount]);

    const onAssetTypeSelected = useCallback((selectedAssetType: AssetType | null) => {
        setAssetType(selectedAssetType);
    }, [setAssetType]);

    const onEditCreditAmountChanged = (event: React.ChangeEvent<HTMLInputElement>, accountId: string) => {
        const amountAsString = event.currentTarget.value;
        const parsedAmount = parseFloat(amountAsString);

        onAccountAmountChanged(
            accountId,
            amountAsString,
            isFinite(parsedAmount) ? -1 * parsedAmount : null,
        );
    };

    const onEditDebitAmountChanged = (event: React.ChangeEvent<HTMLInputElement>, accountId: string) => {
        const amountAsString = event.currentTarget.value;
        const parsedAmount = parseFloat(amountAsString);

        onAccountAmountChanged(
            accountId,
            amountAsString,
            isFinite(parsedAmount) ? parsedAmount : null,
        );
    };

    const onRemoveAccountClick = (event: React.MouseEvent<HTMLElement>, accountId: string) => {
        event.stopPropagation();
        onAccountRemoved(accountId);
    };

    const alreadySelectedAccountIds = journalEntryAccounts.map((acct) => acct.accountId ?? '');

    const totalDebitsAmount: Amount = {
        amount: totalDebits,
        amountType: AmountType.Debit,
        assetType: defaultAssetType,
    };

    const totalCreditsAmount: Amount = {
        amount: totalCredits,
        amountType: AmountType.Credit,
        assetType: defaultAssetType,
    };

    const hasProblem = entryHasMixedAssetTypes || entryIsUnbalanced;

    const problemDescription = entryIsUnbalanced ?
        'Entry is not balanced' :
        entryHasMixedAssetTypes ? 'Entry has mixed asset types' : null;

    return (
        <div id={bemBlockName}>
            <div className="row" style={{ minHeight: '66px' }}>
                <div className="col-md-6">
                    <h4>Journal Entry Account Details</h4>
                </div>
                <div className="col-md-6">
                    <Alert color="warning" isOpen={hasProblem}>
                        {problemDescription}
                    </Alert>
                </div>
            </div>
            <table className="table" id={`${bemBlockName}--accounts_table`}>
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
                            amountAsString,
                            amountType,
                            assetType,
                        } = amountObject ?? {};

                        const assetTypeName = trim(`${assetType?.name ?? ''} ${assetType?.symbol ?? ''}`);

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
                                        id={`${bemBlockName}--edit_debit_amount_input_${safeAccountId}`}
                                        onChange={(e) => onEditDebitAmountChanged(e, safeAccountId)}
                                        step="any"
                                        style={{ textAlign: 'right' }}
                                        type="number"
                                        value={amountType === AmountType.Debit ? amountAsString ?? '' : ''}
                                    />
                                </td>
                                <td className="col-md-2">
                                    <Input
                                        id={`${bemBlockName}--edit_credit_amount_input_${safeAccountId}`}
                                        onChange={(e) => onEditCreditAmountChanged(e, safeAccountId)}
                                        step="any"
                                        style={{ textAlign: 'right' }}
                                        type="number"
                                        value={amountType === AmountType.Credit ? amountAsString ?? '' : ''}
                                    />
                                </td>
                                <td className="col-md-1" style={{ textAlign: 'right' }}>
                                    <Button
                                        color="danger"
                                        id={`${bemBlockName}--remove_account_button_${safeAccountId}`}
                                        onClick={(e) => onRemoveAccountClick(e, safeAccountId)}
                                    >
                                        Remove
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                    <tr>
                        <td className="col-md-5">
                            <AccountSelector
                                accountSelectOptions={accountSelectOptions ?? []}
                                disabledAccountIds={alreadySelectedAccountIds ?? []}
                                id={`${bemBlockName}--add_account_selector`}
                                name="account_selector"
                                onChange={onAccountSelected}
                                value={newJournalEntryAccount.accountId ?? ''}
                            />
                        </td>
                        <td className="col-md-2">
                            <AssetTypeSelector
                                assetTypes={assetTypes ?? []}
                                id={`${bemBlockName}--add_account_asset_type_selector`}
                                name="asset_type_selector"
                                onChange={onAssetTypeSelected}
                                value={newJournalEntryAccount.assetType?.id ?? null}
                            />
                        </td>
                        <td className="col-md-2">
                            <Input
                                id={`${bemBlockName}--add_account_debit_amount_input`}
                                onChange={onAddDebitAmountChanged}
                                step="any"
                                style={{ textAlign: 'right' }}
                                type="number"
                                value={newJournalEntryAccount.debitAsString ?? ''}
                            />
                        </td>
                        <td className="col-md-2">
                            <Input
                                id={`${bemBlockName}--add_account_credit_amount_input`}
                                onChange={onAddCreditAmountChanged}
                                step="any"
                                style={{ textAlign: 'right' }}
                                type="number"
                                value={newJournalEntryAccount.creditAsString ?? ''}
                            />
                        </td>
                        <td className="col-md-1" style={{ textAlign: 'right' }}>
                            <Button
                                color="primary"
                                className="w-100"
                                disabled={!isNewJournalEntryAccountComplete}
                                id={`${bemBlockName}--add_account_button`}
                                onClick={onAddClick}
                            >
                                Add
                            </Button>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td className="col-md-5">
                            <strong>TOTALS</strong>
                        </td>
                        <td className="col-md-2" />
                        <td className="col-md-2 font-weight-bold text-right">
                            <AmountDisplay
                                amount={totalDebitsAmount}
                                showCurrency
                            />
                        </td>
                        <td className="col-md-2 font-weight-bold text-right">
                            <AmountDisplay
                                amount={totalCreditsAmount}
                                showCurrency
                            />
                        </td>
                        <td className="col-md-1" />
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default JournalEntryAccountsEditor;
