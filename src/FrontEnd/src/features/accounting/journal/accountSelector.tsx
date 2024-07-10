import React from 'react';
import {
    isNil,
    kebabCase,
} from 'lodash';
import {
    AccountCategoryList,
    AccountSelectOption,
} from '../chart-of-accounts/models';

type PropTypes = {
    accountSelectOptions: AccountCategoryList[];
    disabledAccountIds: string[];
    id: string;
    name: string;
    onChange: (selectedValue: AccountSelectOption | null) => void;
    value: string; // GUID - ID of selected Account
};

function AccountSelector(props: PropTypes) {
    const {
        accountSelectOptions,
        disabledAccountIds,
        id,
        name,
        onChange,
        value,
    } = props;

    const onSelectionChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectElement = event.target;

        if (selectElement.selectedIndex === -1) {
            onChange(null);
            return;
        }

        const selectedOption = selectElement.selectedOptions[0];

        onChange({
            id: selectedOption.value,
            name: selectedOption.label,
        });
    };

    return (
        <select
            className="selectpicker form-control"
            id={id}
            name={name}
            onChange={onSelectionChanged}
            value={!isNil(value) ? value : ''}
        >
            <option value="">Select an Account</option>

            {accountSelectOptions.map((acctCategoryGroup) => ((
                <optgroup
                    key={kebabCase(acctCategoryGroup.category)}
                    label={acctCategoryGroup.category}
                >
                    {acctCategoryGroup.accounts.map((account) => {
                        const isDisabled = disabledAccountIds.includes(account.id);

                        return (
                            <option
                                disabled={isDisabled}
                                key={account.id}
                                value={account.id}
                            >
                                {account.name}
                            </option>
                        );
                    })}
                </optgroup>
            )))}
        </select>
    );
}

export default AccountSelector;
