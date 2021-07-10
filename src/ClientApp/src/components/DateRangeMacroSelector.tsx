import * as React from 'react';
import {
    computeDateRangeFromMacro,
    dateRangeMacroOptions,
} from '../common/DateRangeMacros';
import DateRangeMacroType from '../models/DateRangeMacroType';

interface DateRangeMacroSelectorProps {
    id: string;
    onChange: Function;
    value?: DateRangeMacroType;
}

const defaultProps: Pick<DateRangeMacroSelectorProps, 'value'> = {
    value: DateRangeMacroType.Custom,
};

const getSelectedMacro = (value: string): DateRangeMacroType => {
    return parseInt(value, 10) as DateRangeMacroType;
};

class DateRangeMacroSelector extends React.PureComponent<DateRangeMacroSelectorProps> {
    static defaultProps: Pick<DateRangeMacroSelectorProps, 'value'> = defaultProps;

    constructor(props: DateRangeMacroSelectorProps) {
        super(props);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
    }

    public render() {
        const {
            id,
            value,
        } = this.props;

        return (
            <select
                className="selectpicker form-control"
                data-width="auto"
                id={id}
                name="date-range-macro-selector"
                onChange={this.onSelectionChanged}
                value={value}
            >
                {Array.from(dateRangeMacroOptions.keys()).map((option) => ((
                    <option key={option} value={option}>{dateRangeMacroOptions.get(option)}</option>
                )))}
            </select>
        );
    }

    private onSelectionChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        const { onChange } = this.props;
        const selectElement = event.target;
        const selectedOption = selectElement.selectedOptions[0];
        const selectedMacro = getSelectedMacro(selectedOption.value);
        const dateRange = computeDateRangeFromMacro(selectedMacro);
        onChange(selectedMacro, dateRange);
    }
}

export default DateRangeMacroSelector;