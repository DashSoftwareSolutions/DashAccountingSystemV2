import { isNil } from 'lodash';
import {
    useDebugValue,
    useMemo,
} from 'react';
import { DraftJournalEntryAccount } from './models';
import { Account } from '../chart-of-accounts/models';
import { AssetType } from '../../../common/models';
import useNamedState from '../../../common/utilities/useNamedState';

type ReturnType = [
    draft: DraftJournalEntryAccount,
    setAccount: (selectedAccount: Account | null) => void,
    setAssetType: (selectedAssetType: AssetType | null) => void,
    setCreditAmount: (amountAsString: string) => void,
    setDebitAmount: (amountAsString: string) => void,
    reset: () => void,
];

function useAddJournalEntryAccount(defaultAssetType?: AssetType | null): ReturnType {
    useDebugValue('Add Journal Entry Account');

    const emptyDraft: DraftJournalEntryAccount = useMemo(() => ({
        accountId: null,
        accountNumber: null,
        accountName: null,
        assetType: defaultAssetType ?? null,
        credit: null,
        creditAsString: null,
        debit: null,
        debitAsString: null,
    }), []); /* deliberately not depending on `defaultAssetType` here; not sure if that's correct or not.  Not a big deal right now since everything is in default USD anyhow. */ // eslint-disable-line react-hooks/exhaustive-deps

    const [journalEntryAccount, setJournalEntryAccount] = useNamedState<DraftJournalEntryAccount>(
        'JournalEntryAccount',
        { ...emptyDraft },
    );

    const setAccount = (selectedAccount: Account | null): void => {
        if (!isNil(selectedAccount)) {
            setJournalEntryAccount({
                ...journalEntryAccount,
                accountId: selectedAccount.id,
                accountName: selectedAccount.name,
                accountNumber: selectedAccount.accountNumber,
            });
        } else {
            setJournalEntryAccount({
                ...journalEntryAccount,
                accountId: null,
                accountNumber: null,
                accountName: null,
            });
        }
    };

    const setAssetType = (selectedAssetType: AssetType | null): void => {
        setJournalEntryAccount({
            ...journalEntryAccount,
            assetType: selectedAssetType,
        });
    };

    const setCreditAmount = (amountAsString: string): void => {
        const parsedAmount = parseFloat(amountAsString);

        const safeValueForUpdate = isFinite(parsedAmount) ?
            parsedAmount :
            null;

        setJournalEntryAccount({
            ...journalEntryAccount,
            credit: safeValueForUpdate,
            creditAsString: amountAsString,
        });
    };

    const setDebitAmount = (amountAsString: string): void => {
        const parsedAmount = parseFloat(amountAsString);

        const safeValueForUpdate = isFinite(parsedAmount) ?
            parsedAmount :
            null;

        setJournalEntryAccount({
            ...journalEntryAccount,
            debit: safeValueForUpdate,
            debitAsString: amountAsString,
        });
    };

    const reset = (): void => {
        setJournalEntryAccount({ ...emptyDraft });
    };

    return [
        journalEntryAccount,
        setAccount,
        setAssetType,
        setCreditAmount,
        setDebitAmount,
        reset,
    ];
}

export default useAddJournalEntryAccount;
