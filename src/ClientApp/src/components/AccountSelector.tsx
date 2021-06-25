import * as React from 'react';
import {
    includes,
    isNil,
    kebabCase,
    map,
} from 'lodash';
import AccountCategoryList from '../models/AccountCategoryList';

interface AccountSelectorProps {
    accountSelectOptions: AccountCategoryList[];
    disabledAccountIds: string[];
    id: string;
    name: string;
    onChange: Function;
    value: string; // GUID - ID of selected Account
}

class AccountSelector extends React.PureComponent<AccountSelectorProps> {
    public constructor(props: AccountSelectorProps) {
        super(props);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
    }

    public render() {
        const {
            accountSelectOptions,
            disabledAccountIds,
            id,
            name,
            value,
        } = this.props;

        return (
            <select
                className="selectpicker form-control"
                id={id}
                name={name}
                onChange={this.onSelectionChanged}
                placeholder="Select an Account"
                value={!isNil(value) ? value : ''}
            >
                <option value="">Select an Account</option>
                {map(accountSelectOptions, (acctCategoryGroup) => ((
                    <optgroup
                        key={kebabCase(acctCategoryGroup.category)}
                        label={acctCategoryGroup.category}
                    >
                        {map(acctCategoryGroup.accounts, (account) => {
                            const isDisabled = includes(disabledAccountIds, account.id);

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

    private onSelectionChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        const { onChange } = this.props;

        const selectElement = event.target;

        if (selectElement.selectedIndex === -1) {
            console.log('Nothing selected');
            onChange(null);
        }

        const selectedOption = selectElement.selectedOptions[0];

        onChange({
            id: selectedOption.value,
            name: selectedOption.label,
        });
    }
}

export default AccountSelector;
