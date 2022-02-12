import * as React from 'react';
import {
    find,
    isNil,
    map,
    trim,
} from 'lodash';
import AssetType from '../models/AssetType';

interface AssetTypeProps {
    assetTypes: AssetType[];
    id: string;
    name: string;
    onChange: Function;
    value: number | null;
}

class AssetTypeSelector extends React.PureComponent<AssetTypeProps> {
    public constructor(props: AssetTypeProps) {
        super(props);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
    }

    public render() {
        const {
            assetTypes,
            id,
            name,
            value,
        } = this.props;

        return (
            <select
                className="selectpicker form-control"
                data-width="auto"
                id={id}
                name={name}
                onChange={this.onSelectionChanged}
                placeholder="Select Currency or Asset"
                value={!isNil(value) ? value : ''}
            >
                <option value="">Select</option>
                {map(assetTypes, (at) => ((
                    <option key={at.id} value={at.id}>
                        {trim(`${at.name} ${at.symbol ?? ''}`)}
                    </option>
                )))}
            </select>
        );
    }

    private onSelectionChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        const { assetTypes, onChange } = this.props;
        const selectElement = event.target;

        if (selectElement.selectedIndex === -1) {
            onChange(null);
            return;
        }

        const selectedOption = selectElement.selectedOptions[0];
        const selectedAssetType = find(assetTypes, at => at.id === parseInt(selectedOption.value));

        onChange(selectedAssetType);
    }
}

export default AssetTypeSelector;