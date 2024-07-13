import {
    FormEvent,
    MouseEvent,
    useState,
} from 'react';
import { noop } from 'lodash';
import {
    Button,
    Col,
    Form,
    Input,
    Row,
} from 'reactstrap';
import DateRangeMacroSelector from './dateRangeMacroSelector';
import {
    DateRange,
    DateRangeMacroType,
} from '../models';

function ReportParametersAndControls({
    bemBlockName,
    dateRangeEnd,
    dateRangeStart,
    defaultDateRangeMacro,
    isRequestingExcelDownload,
    onDownloadExcel,
    onRunReport,
    showDownloadExcelButton,
}: {
    bemBlockName: string;
    dateRangeEnd: string | null; // Date in YYYY-MM-DD
    dateRangeStart: string | null; // Date in YYYY-MM-DD
    defaultDateRangeMacro?: DateRangeMacroType,
    isRequestingExcelDownload?: boolean;
    onDownloadExcel?: () => void;
    onRunReport: (dateRange: DateRange) => void;
    showDownloadExcelButton?: boolean;
}) {
    const onDownloadExcelSafe = onDownloadExcel ?? noop;
    const showDownloadExcelButtonSafe = showDownloadExcelButton ?? false;
    const isRequestingExcelDownloadSafe = isRequestingExcelDownload ?? false;

    const [selectedDateRangeMacro, setSelectedDateRangeMacro] = useState(defaultDateRangeMacro ?? DateRangeMacroType.Custom);
    const [currentDateRangeStart, setCurrentDateRangeStart] = useState(dateRangeStart);
    const [currentDateRangeEnd, setCurrentDateRangeEnd] = useState(dateRangeEnd);

    const onDateRangeEndInputChanged = (event: FormEvent<HTMLInputElement>) => {
        setCurrentDateRangeEnd(event.currentTarget.value);

        if (selectedDateRangeMacro !== DateRangeMacroType.Custom) {
            setSelectedDateRangeMacro(DateRangeMacroType.Custom);
        }
    };

    const onDateRangeStartInputChanged = (event: FormEvent<HTMLInputElement>) => {
        setCurrentDateRangeStart(event.currentTarget.value);

        if (selectedDateRangeMacro !== DateRangeMacroType.Custom) {
            setSelectedDateRangeMacro(DateRangeMacroType.Custom);
        }
    };

    const onDownloadExcelButtonClicked = (event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        onDownloadExcelSafe();
    };

    const onRunReportButtonClicked = (event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        onRunReport({ dateRangeStart: currentDateRangeStart ?? '', dateRangeEnd: currentDateRangeEnd ?? '' });
    };

    const onDateRangeMacroSelectionChanged = (selectedMacro: DateRangeMacroType, dateRange: DateRange) => {
        setSelectedDateRangeMacro(selectedMacro);
        setCurrentDateRangeStart(dateRange.dateRangeStart);
        setCurrentDateRangeEnd(dateRange.dateRangeEnd);
    };

    return (
        <Form style={{ marginBottom: 22 }}>
            <Row className="g-2">
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
                        value={currentDateRangeStart ?? ''}
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
                        value={currentDateRangeEnd ?? ''}
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
