import { isNil } from 'lodash';
import ClassNames from 'classnames';
import {
    Amount,
    AmountType
} from '../models';

const defaultClassName = 'amount-display';

function AmountDisplay({
    amount,
    className,
    id,
    locale = 'en-US',
    normalBalanceType,
    showCurrency = false,
}: {
    amount: Amount;
    className?: string;
    id?: string;
    locale?: string;
    normalBalanceType?: AmountType;
    showCurrency?: boolean;
}) {
    const allClassNames = ClassNames(defaultClassName, className);
    const amountNumber = amount.amount ?? 0;

    if (isNil(normalBalanceType)) {
        return (
            <span
                className={allClassNames}
                id={id}
            >
                {Math.abs(amountNumber ?? 0)
                    .toLocaleString(
                        locale,
                        {
                            style: showCurrency ? 'currency' : undefined,
                            currency: showCurrency ? amount.assetType?.name : undefined,
                            minimumFractionDigits: 2,
                        })}
            </span>
        );
    }

    const amountType = amount.amountType;
    const isAmountNormal = amountType === normalBalanceType || amountNumber === 0;
    const amountSignAdjustor = amountType === AmountType.Credit ?
        (isAmountNormal && amountNumber !== 0 ? -1 : 1) :
        (isAmountNormal ? 1 : -1);

    const correctedAmount = amountNumber * amountSignAdjustor;

    return (
        <span
            className={allClassNames}
            id={id}
        >
            {correctedAmount
                .toLocaleString(
                    locale,
                    {
                        style: showCurrency ? 'currency' : undefined,
                        currency: showCurrency ? amount.assetType?.name : undefined,
                        minimumFractionDigits: 2,
                    })}
        </span>
    );
}

export default AmountDisplay;