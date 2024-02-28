import AccountSelectOption from './accountSelectOption.model';

export default interface AccountCategoryList {
    category: string;
    accounts: AccountSelectOption[];
}