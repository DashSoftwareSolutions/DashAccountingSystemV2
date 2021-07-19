import * as React from 'react';
import { isNil } from 'lodash';
import ClassNames from 'classnames';
import Amount from '../models/Amount';
import AmountType from '../models/AmountType';

interface AmountDisplayProps {
    amount: Amount;
    className?: string;
    id?: string;
    locale?: string;
    normalBalanceType?: AmountType;
    showCurrency?: boolean;
}

const defaultProps: Pick<AmountDisplayProps, 'locale' | 'normalBalanceType' | 'showCurrency'> = {
    locale: 'en-US',
    normalBalanceType: undefined,
    showCurrency: false,
};

const defaultClassName = 'amount-display';

const AmountDisplay: React.FC<AmountDisplayProps> = ({ amount, className, id, locale, normalBalanceType, showCurrency }: AmountDisplayProps) => {
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

AmountDisplay.defaultProps = defaultProps;

export default AmountDisplay;