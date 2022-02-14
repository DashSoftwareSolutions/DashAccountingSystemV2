import * as React from 'react';
import {
    Button,
    Col,
    Form,
    Input,
    Row,
} from 'reactstrap';
import { noop } from 'lodash';
import DateRange from '../models/DateRange';
import DateRangeMacroType from '../models/DateRangeMacroType';
import DateRangeMacroSelector from './DateRangeMacroSelector';

interface ReportParametersAndControlsProps {
    bemBlockName: string;
    dateRangeEnd: string | null; // Date in YYYY-MM-DD
    dateRangeStart: string | null; // Date in YYYY-MM-DD
    defaultDateRangeMacro?: DateRangeMacroType,
    isRequestingExcelDownload?: boolean;
    onDateRangeEndChanged: Function;
    onDateRangeStartChanged: Function;
    onDownloadExcel?: Function;
    onRunReport: Function;
    showDownloadExcelButton?: boolean;
}

const ReportParametersAndControls: React.FC<ReportParametersAndControlsProps> = ({
    bemBlockName,
    dateRangeEnd,
    dateRangeStart,
    defaultDateRangeMacro,
    isRequestingExcelDownload,
    onDateRangeEndChanged,
    onDateRangeStartChanged,
    onDownloadExcel,
    onRunReport,
    showDownloadExcelButton,
}) => {
    const onDownloadExcelSafe = onDownloadExcel ?? noop;
    const showDownloadExcelButtonSafe = showDownloadExcelButton ?? false;
    const isRequestingExcelDownloadSafe = isRequestingExcelDownload ?? false;

    const [selectedDateRangeMacro, setSelectedDateRangeMacro] = React.useState(defaultDateRangeMacro ?? DateRangeMacroType.Custom);

    const onDateRangeEndInputChanged = (event: React.FormEvent<HTMLInputElement>) => {
        onDateRangeEndChanged(event.currentTarget.value);

        if (selectedDateRangeMacro !== DateRangeMacroType.Custom) {
            setSelectedDateRangeMacro(DateRangeMacroType.Custom);
        }
    }

    const onDateRangeStartInputChanged = (event: React.FormEvent<HTMLInputElement>) => {
        onDateRangeStartChanged(event.currentTarget.value);

        if (selectedDateRangeMacro !== DateRangeMacroType.Custom) {
            setSelectedDateRangeMacro(DateRangeMacroType.Custom);
        }
    }

    const onDownloadExcelButtonClicked = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        onDownloadExcelSafe();
    }

    const onRunReportButtonClicked = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        onRunReport();
    }

    const onDateRangeMacroSelectionChanged = (selectedMacro: DateRangeMacroType, dateRange: DateRange) => {
        setSelectedDateRangeMacro(selectedMacro);
        onDateRangeStartChanged(dateRange.dateRangeStart);
        onDateRangeEndChanged(dateRange.dateRangeEnd);
    };

    return (
        <Form style={{ marginBottom: 22 }}>
            <Row form>
                <Col md={3}>
                    <DateRangeMacroSelector
                        id={`${bemBlockName}--date_range_macro_select`}
                        onChange={onDateRangeMacroSelectionChanged}
                        value={selectedDateRangeMacro}
                    />
                </Col>
                <Col md={2}>
                    <Input
                        id={`${bemBlockName}--date_range_start_input`}
                        name="date_range_start_input"
                        onChange={onDateRangeStartInputChanged}
                        type="date"
                        value={dateRangeStart ?? ''}
                    />
                </Col>
                <Col className="align-self-center no-gutters text-center" md={1} style={{ flex: '0 1 22px' }}>
                    to
                </Col>
                <Col md={2}>
                    <Input
                        id={`${bemBlockName}--date_range_end_input`}
                        name="date_range_end_input"
                        onChange={onDateRangeEndInputChanged}
                        type="date"
                        value={dateRangeEnd ?? ''}
                    />
                </Col>
                <Col md={4}>
                    <Button
                        color="success"
                        id={`${bemBlockName}--run_report_button`}
                        onClick={onRunReportButtonClicked}
                        style={showDownloadExcelButtonSafe ? { marginRight: 11, width: 140 } : { width: 140 }}
                    >
                        Run Report
                    </Button>
                    {showDownloadExcelButtonSafe ? (
                        <Button
                            color="primary"
                            disabled={isRequestingExcelDownloadSafe}
                            id={`${bemBlockName}--download_excel_button`}
                            onClick={onDownloadExcelButtonClicked}
                            style={{ width: 140 }}
                        >
                            {isRequestingExcelDownloadSafe ? 'Downloading...' : 'Download Excel'}
                        </Button>
                    ) : null}
                </Col>
            </Row>
        </Form>
    );
}

export default ReportParametersAndControls;