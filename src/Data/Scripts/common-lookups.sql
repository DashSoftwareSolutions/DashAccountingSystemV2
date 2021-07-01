DO $$
BEGIN
    -- AccountType
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

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'asset_type_row_type') THEN
        CREATE TYPE asset_type_row_type AS (
            "Name" VARCHAR(255),
            "Symbol" CHAR(1)
        );
    END IF;

    -- AssetType
    INSERT INTO "AssetType" ( "Name", "Symbol" )
    SELECT "Name", "Symbol"
    FROM UNNEST ( ARRAY [
         ( 'USD', '$' )
        ,( 'GBP', '£' )
        ,( 'EUR', '€' )
        ,( 'JPY', '¥' )
    ]::asset_type_row_type[] ) the_new_asset_type
    WHERE NOT EXISTS ( SELECT 1 FROM "AssetType" WHERE LOWER("Name") = LOWER(the_new_asset_type."Name") );

    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'asset_type_row_type') THEN
        DROP TYPE asset_type_row_type;
    END IF;
END
$$ LANGUAGE plpgsql;