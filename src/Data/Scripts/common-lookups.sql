DO $$
DECLARE
    ACCOUNT_TYPE_ASSET INTEGER;
    ACCOUNT_TYPE_LIABILITY INTEGER;
    ACCOUNT_TYPE_EQUITY INTEGER;
    ACCOUNT_TYPE_REVENUE INTEGER;
    ACCOUNT_TYPE_EXPENSE INTEGER;
BEGIN
    -- Account Types
    INSERT INTO "AccountType" ( "Name" )
    SELECT acct_type_name
    FROM UNNEST ( ARRAY [
        'Asset',
        'Liability',
        'Equity',
        'Revenue',
        'Expense'
    ] ) acct_type_name
    WHERE NOT EXISTS ( SELECT 1 FROM "AccountType" WHERE LOWER("Name") = LOWER(acct_type_name) );

    ACCOUNT_TYPE_ASSET := (SELECT "Id" FROM "AccountType" WHERE LOWER("Name") = LOWER('Asset'));
    ACCOUNT_TYPE_LIABILITY := (SELECT "Id" FROM "AccountType" WHERE LOWER("Name") = LOWER('Liability'));
    ACCOUNT_TYPE_EQUITY := (SELECT "Id" FROM "AccountType" WHERE LOWER("Name") = LOWER('Equity'));
    ACCOUNT_TYPE_REVENUE := (SELECT "Id" FROM "AccountType" WHERE LOWER("Name") = LOWER('Revenue'));
    ACCOUNT_TYPE_EXPENSE := (SELECT "Id" FROM "AccountType" WHERE LOWER("Name") = LOWER('Expense'));

    -- Account Sub Types
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_sub_type_row_type') THEN
        CREATE TYPE account_sub_type_row_type AS (
            "Name" VARCHAR(255),
            "AccountTypeId" INTEGER
        );
    END IF;

    INSERT INTO "AccountSubType" ( "Name", "AccountTypeId" )
    SELECT "Name", "AccountTypeId"
    FROM UNNEST ( ARRAY [
         -- Assets
         ( 'Bank Account', ACCOUNT_TYPE_ASSET )
        ,( 'Accounts Receivable (A/R)', ACCOUNT_TYPE_ASSET )
        ,( 'Other Current Assets', ACCOUNT_TYPE_ASSET )
        ,( 'Fixed Assets', ACCOUNT_TYPE_ASSET )
        ,( 'Other Assets', ACCOUNT_TYPE_ASSET )
         -- Liabilities
        ,( 'Accounts Payable (A/P)', ACCOUNT_TYPE_LIABILITY )
        ,( 'Credit Card', ACCOUNT_TYPE_LIABILITY )
        ,( 'Other Current Liabilities', ACCOUNT_TYPE_LIABILITY )
        ,( 'Long Term Liabilities', ACCOUNT_TYPE_LIABILITY )
         -- Equity
        ,( 'Equity', ACCOUNT_TYPE_EQUITY )
        ,( 'Retained Earnings', ACCOUNT_TYPE_EQUITY )
         -- Revenue
        ,( 'Operating Revenue', ACCOUNT_TYPE_REVENUE )
        ,( 'Other Income', ACCOUNT_TYPE_REVENUE )
         -- Expense
        ,( 'Cost of Goods Sold', ACCOUNT_TYPE_EXPENSE )
        ,( 'Operating Expense', ACCOUNT_TYPE_EXPENSE )
        ,( 'Other Expense', ACCOUNT_TYPE_EXPENSE )
    ]::account_sub_type_row_type[] ) the_new_account_sub_type
    WHERE NOT EXISTS ( SELECT 1 FROM "AccountSubType" WHERE LOWER("Name") = LOWER(the_new_account_sub_type."Name") );

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'asset_type_row_type') THEN
        CREATE TYPE asset_type_row_type AS (
            "Name" VARCHAR(255),
            "Description" VARCHAR(1024),
            "Symbol" VARCHAR(4)
        );
    END IF;

    -- Asset Types
    INSERT INTO "AssetType" ( "Name", "Description", "Symbol" )
    SELECT "Name", "Description", "Symbol"
    FROM UNNEST ( ARRAY [
         ( 'USD', 'United States Dollars', '$' )
        ,( 'GBP', 'British Pounds Sterling', '£' )
        ,( 'EUR', 'Euros', '€' )
        ,( 'JPY', 'Japanese Yen', '¥' )
        ,( 'CAD', 'Canadian Dollars', '$' )
        ,( 'NIO', 'Nicaraguan Córdobas', 'C$' )
        ,( 'BTC', 'Bitcoin', '₿' )
    ]::asset_type_row_type[] ) the_new_asset_type
    WHERE NOT EXISTS ( SELECT 1 FROM "AssetType" WHERE LOWER("Name") = LOWER(the_new_asset_type."Name") );

    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'asset_type_row_type') THEN
        DROP TYPE asset_type_row_type;
    END IF;
END
$$ LANGUAGE plpgsql;
