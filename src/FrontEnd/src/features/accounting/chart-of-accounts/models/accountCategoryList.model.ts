import AccountSelectOption from './accountSelectOption.model';

/**
 * Used to show a collection of Account select options, grouped by type/category.
 */
export default interface AccountCategoryList {
    /**
     * Type/category of Accounts
     */
    category: string;
    /**
     * Accounts of the specified type/category
     */
    accounts: AccountSelectOption[];
}
