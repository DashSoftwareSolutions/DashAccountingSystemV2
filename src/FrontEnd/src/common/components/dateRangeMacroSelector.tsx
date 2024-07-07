import { ChangeEvent } from 'react';
import {
    computeDateRangeFromMacro,
    dateRangeMacroOptions,
} from '../utilities/dateRangeMacros';
import {
    DateRange,
    DateRangeMacroType,
} from '../models';

const getSelectedMacro = (value: string): DateRangeMacroType => {
    return parseInt(value, 10) as DateRangeMacroType;
};

function DateRangeMacroSelector({
    id,
    onChange,
    value = DateRangeMacroType.Custom,
}: {
    id: string;
    onChange: (selectedMacro: DateRangeMacroType, dateRange: DateRange) => void;
    value?: DateRangeMacroType;
}) {
    const onSelectionChanged = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectElement = event.target;
        const selectedOption = selectElement.selectedOptions[0];
        const selectedMacro = getSelectedMacro(selectedOption.value);
        const dateRange = computeDateRangeFromMacro(selectedMacro);
        onChange(selectedMacro, dateRange);
    };

    return (
        <select
            className="selectpicker form-control"
            data-width="auto"
            id={id}
            name="date-range-macro-selector"
            onChange={onSelectionChanged}
            value={value} 
        >
            {Array.from(dateRangeMacroOptions.keys()).map((option) => ((
                <option key={option} value={option}>{dateRangeMacroOptions.get(option)}</option>
            )))}
        </select>
    );
}

export default DateRangeMacroSelector