-- ===========================================================================
-- Create "account_info_ user defined data type to assist in scripting
-- Account creation
-- ===========================================================================
DO $$
BEGIN
    IF NOT EXISTS ( SELECT 1 FROM pg_type WHERE typname = 'account_info' ) THEN
        CREATE TYPE account_info AS
        (
            acct_number INTEGER,
            acct_name VARCHAR(255),
            acct_description TEXT
        );
    END IF;
END
$$ LANGUAGE plpgsql;

-- ===========================================================================
-- CREATE CURRENT CHART OF ACCOUNTS
-- FOR TENANT "Dash Software Solutions, Inc."
-- Reference for convention/standard for account numbering:
-- https://strategiccfo.com/standard-chart-of-accounts/
-- ===========================================================================
DO $$
DECLARE
    TENANT_NAME VARCHAR := 'Dash Software Solutions, Inc.';

    -- Account Types
    ACCT_TYPE_ASSET INTEGER := (SELECT "Id" FROM "AccountType" WHERE "Name" = 'Asset');
    ACCT_TYPE_LIABILITY INTEGER := (SELECT "Id" FROM "AccountType" WHERE "Name" = 'Liability');
    ACCT_TYPE_EQUITY INTEGER := (SELECT "Id" FROM "AccountType" WHERE "Name" = 'Equity');
    ACCT_TYPE_REVENUE INTEGER := (SELECT "Id" FROM "AccountType" WHERE "Name" = 'Revenue');
    ACCT_TYPE_EXPENSE INTEGER := (SELECT "Id" FROM "AccountType" WHERE "Name" = 'Expense');

    -- Asset Type for U.S. Dollars
    ASSET_TYPE_USD INTEGER := (SELECT "Id" FROM "AssetType" WHERE "Name" = 'USD $');

    -- Balance Types
    BALANCE_TYPE_DEBIT SMALLINT := 1;
    BALANCE_TYPE_CREDIT SMALLINT := -1;

    -- Created By User
    CREATED_BY UUID := (SELECT "Id" FROM "AspNetUsers" WHERE "NormalizedUserName" = 'GROBERTS314@YAHOO.COM'); -- TODO: Change...???

    the_tenant_id UUID;
    accounts_to_create account_info[];
    current_account account_info;
BEGIN
    -- =======================================================================
    -- Ensure Tenant Exists
    -- =======================================================================
    SELECT "Id"
      FROM "Tenant"
     WHERE LOWER("Name") = LOWER(TENANT_NAME)
     LIMIT 1
      INTO the_tenant_id;

    IF the_tenant_id IS NULL THEN
        INSERT INTO "Tenant" ( "Name" )
        VALUES ( TENANT_NAME )
        RETURNING "Id" INTO STRICT the_tenant_id;
    END IF;

    -- =======================================================================
    -- BEGIN: ASSETS
    -- =======================================================================
    accounts_to_create := ARRAY [
        ROW(1010, 'Business Checking (2150)', 'Primary Cash Operating Account.  Wells Fargo Business Checking account ending in 2150.')::account_info,
        ROW(1020, 'Business Savings (3753)', 'Business Savings Account.  Wells Fargo Business Savings account ending in 3753.')::account_info,
        ROW(1210, 'Accounts Receivable (A/R)', 'Accounts Receivable (A/R) Account.')::account_info,
        ROW(1530, 'Vehicle - 2018 Toyota Highlander', 'Fixed Assets/Property, Plant & Equipment Vehicles account for 2018 Toyota Highlander.')::account_info,
        ROW(1540, 'Computer Equipment', 'Fixed Assets/Property, Plant & Equipment Computer Equipment account.  Computers and peripherals (monitors, printers, docking stations, etc.)')::account_info,
        ROW(1550, 'Fixed Asset Furniture', 'Fixed Assets/Property, Plant & Equipment Furniture & Fixtures account.  Business furniture (e.g. computer desk and chair, etc.)')::account_info,
        ROW(1940, 'Uncategorized Assets', 'Other Current Assets account.')::account_info
    ];

    FOREACH current_account IN ARRAY accounts_to_create LOOP
        PERFORM make_account(
             the_tenant_id
            ,current_account.acct_number
            ,current_account.acct_name
            ,current_account.acct_description
            ,ACCT_TYPE_ASSET
            ,ASSET_TYPE_USD
            ,BALANCE_TYPE_DEBIT
            ,CREATED_BY);        
    END LOOP;
    -- =======================================================================
    -- END: ASSETS
    -- =======================================================================

    -- =======================================================================
    -- BEGIN: LIABILITIES
    -- =======================================================================
    accounts_to_create := ARRAY [
        ROW(2160, 'Business Credit Card (4875)', 'Primary Business Credit Card.  Business platinum VISA, issued by Wells Fargo. Card Number ending in 4875.')::account_info,
        ROW(2710, 'Auto Loan - 2018 Toyota Highlander - Principal', 'Notes Payable Liability Account for Loan for 2018 Toyota Highlander.  Loan held by SchoolsFirst FCU.')::account_info,
        ROW(2711, 'Auto Loan - 2018 Toyota Highlander - Interest', 'Interest Payable Liability Account for Loan for 2018 Toyota Highlander.  Loan held by SchoolsFirst FCU.')::account_info
    ];

    FOREACH current_account IN ARRAY accounts_to_create LOOP
        PERFORM make_account(
             the_tenant_id
            ,current_account.acct_number
            ,current_account.acct_name
            ,current_account.acct_description
            ,ACCT_TYPE_LIABILITY
            ,ASSET_TYPE_USD
            ,BALANCE_TYPE_CREDIT
            ,CREATED_BY);        
    END LOOP;
    -- =======================================================================
    -- END: LIABILITIES
    -- =======================================================================

    -- =======================================================================
    -- BEGIN: OWNER'S EQUITY
    -- =======================================================================
    accounts_to_create := ARRAY [
        ROW(3100, 'Common Stock', 'Common Stock account for the corporation.  Initial stock offering consisted of 1,000 shares valued at USD $1,000.00.')::account_info,
        ROW(3300, 'Paid In Capital - Geoffrey Roberts', 'Owner''s Equity Additional Paid in Capital account for Geoffrey Roberts.  Geoffrey Roberts is presently the sole owner of Dash Software Solutions, Inc.')::account_info,
        ROW(3600, 'Shareholder Distributions - Geoffrey Roberts', 'Owner''s Equity Shareholder Distributions account for Geoffrey Roberts.  Geoffrey Roberts is presently the sole owner of Dash Software Solutions, Inc.')::account_info,
        ROW(3900, 'Retained Earnings', 'Owner''s Equity Retained Earnings account for the corporation.')::account_info
    ];

    FOREACH current_account IN ARRAY accounts_to_create LOOP
        PERFORM make_account(
             the_tenant_id
            ,current_account.acct_number
            ,current_account.acct_name
            ,current_account.acct_description
            ,ACCT_TYPE_EQUITY
            ,ASSET_TYPE_USD
            ,BALANCE_TYPE_CREDIT
            ,CREATED_BY);        
    END LOOP;
    -- =======================================================================
    -- END: OWNER'S EQUITY
    -- =======================================================================

    -- =======================================================================
    -- BEGIN: REVENUE
    -- =======================================================================
    accounts_to_create := ARRAY [
        ROW(4010, 'Payment for Services Rendered to SVCC', 'Revenue account for payments received from Saddleback Valley Community Church (SVCC) for contract software development and technical consulting services provided by Dash Software Solutions, Inc.')::account_info,
        ROW(4600, 'Interest Income', 'Revenue account for interest earned.')::account_info,
        ROW(4700, 'Cash Back Rewards', 'Revenue account for quarterly Cash Back Rewards payments from Well Fargo for rewards points earned on Business Platinum Credit Card.')::account_info
    ];

    FOREACH current_account IN ARRAY accounts_to_create LOOP
        PERFORM make_account(
             the_tenant_id
            ,current_account.acct_number
            ,current_account.acct_name
            ,current_account.acct_description
            ,ACCT_TYPE_REVENUE
            ,ASSET_TYPE_USD
            ,BALANCE_TYPE_CREDIT
            ,CREATED_BY);        
    END LOOP;
    -- =======================================================================
    -- END: REVENUE
    -- =======================================================================

    -- =======================================================================
    -- BEGIN: EXPENSES
    -- =======================================================================
    accounts_to_create := ARRAY [
        ROW(6100, 'Expenses - Auto', 'Expense account for business vehicle expenses other than fuel.')::account_info,
        ROW(6101, 'Expenses - Gasoline', 'Expense account for purchases of fuel for business vehicles.')::account_info,
        ROW(6200, 'Expenses - Bank Charges & Fees', 'Expense account for banking charges and fees.')::account_info,
        ROW(6400, 'Expenses - Employee Pension', 'Expense account for employer contributions to Employee Pension Plan (SEP IRA maintained by Thrivent Financial).')::account_info,
        ROW(6600, 'Charitable Giving', 'Expense account for charitable giving and donations made by the business that may not be expensable/tax-deductable.')::account_info,
        ROW(6601, 'Expenses - Gifts', 'Expense account for gifts made by the business that should be expensable/tax-deductable.')::account_info,
        ROW(6750, 'Expenses - Business Services', 'Expense account for "business services" which includes: accounting services, tax preparation for the business, cloud-hosted software services e.g. FreshBooks for time tracking & invoicing, DropBox for data backup & storage, web hosting, etc.')::account_info,
        ROW(6800, 'Expenses - Software Licensing', 'Expense account for software licensing costs for software used on business computers.  Costs for cloud-hosted software as a service should go in the "Expenses - Business Services" account instead.')::account_info,
        ROW(6850, 'Expenses - Repairs & maintenance', 'Expense account for equipment repairs and maintenance.')::account_info,
        ROW(6851, 'Expenses - Equipment Warranty', 'Expense account for equipment warranties (e.g. additional warranties or product protection plans purchased for business computers or peripherals).')::account_info,
        ROW(6900, 'Expenses - Business Meals & Entertainment', 'Expense account for business-related meals and entertainment.')::account_info,
        ROW(7000, 'Expenses - Payroll Taxes', 'Expense account for payroll taxes.  Usage is optional; all payroll-related expenses can be tracked under "Expenses - Payroll" account.  Since payroll and business tax preparation is handled externally there may not be a need to differentiate employeer or employee taxes from actual salary.')::account_info,
        ROW(7300, 'Expenses - Payroll', 'Expense account for payroll - salaries and other expenses, which may include employer contributed payroll taxes.  Since payroll and business tax preparation is handled externally there may not be a need to differentiate employeer or employee taxes from actual salary.')::account_info,
        ROW(7350, 'Expenses - Office Supplies', 'Expense account for consumable office supplies.  Includes kitchen and coffee supplies as well as computer-related supplies (ink/toner and paper for printers, etc.)')::account_info,
        ROW(7400, 'Expenses - Taxes Paind', 'Expense account for taxes paid.')::account_info,
        ROW(7500, 'Expenses - Utilities & Telecommunications', 'Expense account for business-related utilities & telecommunications bills.')::account_info
    ];

    FOREACH current_account IN ARRAY accounts_to_create LOOP
        PERFORM make_account(
             the_tenant_id
            ,current_account.acct_number
            ,current_account.acct_name
            ,current_account.acct_description
            ,ACCT_TYPE_EXPENSE
            ,ASSET_TYPE_USD
            ,BALANCE_TYPE_DEBIT
            ,CREATED_BY);        
    END LOOP;
    -- =======================================================================
    -- END: EXPENSES
    -- =======================================================================
END
$$ LANGUAGE plpgsql;