import * as React from 'react';
import {
    Button,
    Col,
    Form,
    Input,
    Row,
} from 'reactstrap';

interface ReportDateRangeSelectorProps {
    bemBlockName: string;
    dateRangeEnd: string | null; // Date in YYYY-MM-DD
    dateRangeStart: string | null; // Date in YYYY-MM-DD
    onDateRangeEndChanged: Function;
    onDateRangeStartChanged: Function;
    onRunReport: Function;
}

const ReportDateRangeSelector: React.FC<ReportDateRangeSelectorProps> = ({
    bemBlockName,
    dateRangeEnd,
    dateRangeStart,
    onDateRangeEndChanged,
    onDateRangeStartChanged,
    onRunReport,
}) => {
    const onDateRangeEndInputChanged = (event: React.FormEvent<HTMLInputElement>) => {
        onDateRangeEndChanged(event.currentTarget.value);
    }

    const onDateRangeStartInputChanged = (event: React.FormEvent<HTMLInputElement>) => {
        onDateRangeStartChanged(event.currentTarget.value);
    }

    const onRunReportButtonClicked = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        onRunReport();
    }

    return (
        <Form style={{ marginBottom: 22 }}>
            <Row form>
                {/* TODO: Add preset ranges select */}
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
                <Col md={2}>
                    <Button
                        color="success"
                        id={`${bemBlockName}--run_report_button`}
                        onClick={onRunReportButtonClicked}
                    >
                        Run Report
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}

export default ReportDateRangeSelector