import React from 'react';
import {
    isNil,
    trim,
} from 'lodash';
import { AssetType } from '../../../common/models';

type PropTypes = {
    assetTypes: AssetType[];
    id: string;
    name: string;
    onChange: (selected: AssetType | null) => void;
    value: number | null;
};

function AssetTypeSelector(props: PropTypes) {
    const {
        assetTypes,
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
        const selectedAssetType = assetTypes.find((at) => at.id === parseInt(selectedOption.value));

        onChange(selectedAssetType ?? null);
    };

    return (
        <select
            className="selectpicker form-control"
            data-width="auto"
            id={id}
            name={name}
            onChange={onSelectionChanged}
            value={!isNil(value) ? value : ''}
        >
            <option value="">Select</option>
            {assetTypes.map((at) => ((
                <option key={at.id} value={at.id}>
                    {trim(`${at.name} ${at.symbol ?? ''}`)}
                </option>
            )))}
        </select>
    );
}

export default AssetTypeSelector;
