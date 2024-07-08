import React from 'react';
import {
    isEmpty,
    isNil,
    sortBy,
    trim,
} from 'lodash';
import {
    Col,
    ListGroup,
    ListGroupItem,
    Row,
} from 'reactstrap';
import { DateTime } from 'luxon';
import {
    Amount,
    AmountType,
    TransactionStatus,
} from '../../../common/models';
import AmountDisplay from '../../../common/components/amountDisplay';
import TransactionStatusLabel from '../../../common/components/transactionStatusLabel';
import { DEFAULT_ASSET_TYPE } from '../../../common/constants';
import { JournalEntry } from './models';

function JournalEntryDetails({
    bemBlockName,
    journalEntry
}: {
    bemBlockName: string;
    journalEntry?: JournalEntry
}) {
    if (isNil(journalEntry)) {
        return (<React.Fragment></React.Fragment>);
    }

    const formattedEntryDate = DateTime.fromISO(journalEntry.entryDate ?? '').toLocaleString(DateTime.DATE_SHORT);

    const formattedPostDate = !isNil(journalEntry.postDate) ?
        DateTime.fromISO(journalEntry.postDate).toLocaleString(DateTime.DATE_SHORT) :
        'N/A';

    const basisDate = DateTime.fromISO(journalEntry.postDate ?? journalEntry.entryDate ?? '');
    const period = `${basisDate.year} Q${basisDate.quarter}`; // TODO: Maybe _someday_ support custom accounting period scheme other than calendar year

    const totalDebits = journalEntry.accounts
        .filter((a) => a?.amount?.amountType === AmountType.Debit)
        .map((a) => a?.amount?.amount ?? 0)
        .reduce((sum, next) => sum + next, 0);

    const totalCredits = journalEntry.accounts
        .filter((a) => a?.amount?.amountType === AmountType.Credit)
        .map((a) => a?.amount?.amount ?? 0)
        .reduce((sum, next) => sum + next, 0);

    const defaultAssetType = !isEmpty(journalEntry.accounts) ?
        journalEntry.accounts[0]?.amount?.assetType ?? DEFAULT_ASSET_TYPE :
        DEFAULT_ASSET_TYPE;

    const totalDebitsAmount: Amount = {
        amount: totalDebits,
        amountType: AmountType.Debit,
        assetType: defaultAssetType,
    };

    const totalCreditsAmount: Amount = {
        amount: totalCredits,
        amountType: AmountType.Credit,
        assetType: defaultAssetType,
    };

    return (
        <React.Fragment>
            <ListGroup>
                <ListGroupItem>
                    <Row>
                        <Col md={2}><strong>Transaction #</strong></Col>
                        <Col md={4}>{journalEntry.entryId}</Col>
                        <Col md={2}><strong>Check #</strong></Col>
                        <Col md={4}>{journalEntry.checkNumber?.toString() ?? 'N/A'}</Col>
                    </Row>
                </ListGroupItem>
                <ListGroupItem>
                    <Row>
                        <Col md={2}><strong>Entry Date</strong></Col>
                        <Col md={4}>{formattedEntryDate}</Col>
                        <Col md={2}><strong>Post Date</strong></Col>
                        <Col md={4}>{formattedPostDate}</Col>
                    </Row>
                </ListGroupItem>
                <ListGroupItem>
                    <Row>
                        <Col md={2} style={{ paddingTop: 4 }}><strong>Status</strong></Col>
                        <Col md={4}>
                            <TransactionStatusLabel status={journalEntry.status ?? TransactionStatus.Pending} />
                        </Col>
                        <Col md={2}><strong>Period</strong></Col>
                        <Col md={4}>{period}</Col>
                    </Row>
                </ListGroupItem>
                <ListGroupItem>
                    <Row>
                        <Col md={2}><strong>Description</strong></Col>
                        <Col md={10}>{journalEntry.description}</Col>
                    </Row>
                </ListGroupItem>
                <ListGroupItem>
                    <Row>
                        <Col md={2}><strong>Note</strong></Col>
                        <Col md={10}>{journalEntry.note ?? 'N/A'}</Col>
                    </Row>
                </ListGroupItem>
            </ListGroup>
            <table className="table" id={`${bemBlockName}--accounts_table`}>
                <thead>
                    <tr>
                        <th className="col-md-6">Account</th>
                        <th className="col-md-2">Asset Type</th>
                        <th className="col-md-2" style={{ textAlign: 'right' }}>Debit</th>
                        <th className="col-md-2" style={{ textAlign: 'right' }}>Credit</th>
                    </tr>
                </thead>
                <tbody>
                    {sortBy(
                        journalEntry.accounts,
                        (a) => a?.amount?.amountType === AmountType.Debit ? 1 : 2,
                        (a) => a?.accountNumber,
                    ).map((account) => {
                        const {
                            accountId,
                            accountName,
                            accountNumber,
                            amount
                        } = account;

                        if (isNil(amount)) {
                            return (<></>);
                        }

                        const assetTypeName = trim(`${amount.assetType?.name ?? ''} ${amount.assetType?.symbol ?? ''}`);

                        const safeAccountId = accountId ?? '';

                        return (
                            <tr key={safeAccountId}>
                                <td>{`${accountNumber} - ${accountName}`}</td>
                                <td>{assetTypeName}</td>
                                <td style={{ textAlign: 'right' }}>
                                    {
                                        amount.amountType === AmountType.Debit ? (
                                            <AmountDisplay
                                                amount={amount}
                                                showCurrency
                                            />
                                        ) : null
                                    }
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    {
                                        amount.amountType === AmountType.Credit ? (
                                            <AmountDisplay
                                                amount={amount}
                                                showCurrency
                                            />
                                        ) : null
                                    }
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <td className="col-md-6">
                            <strong>TOTALS</strong>
                        </td>
                        <td className="col-md-2" />
                        <td className="col-md-2 fw-bold text-end">
                            <AmountDisplay
                                amount={totalDebitsAmount}
                                showCurrency
                            />
                        </td>
                        <td className="col-md-2 fw-bold text-end">
                            <AmountDisplay
                                amount={totalCreditsAmount}
                                showCurrency
                            />
                        </td>
                    </tr>
                </tfoot>
            </table>
        </React.Fragment>
    );
}

export default JournalEntryDetails;
