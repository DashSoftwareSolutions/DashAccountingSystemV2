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

    -- AssetType
    INSERT INTO "AssetType" ( "Name" )
    SELECT asset_type_name
    FROM UNNEST ( ARRAY [
        'USD $',
        'GBP £',
        'EUR €',
        'JPY ¥'
    ] ) asset_type_name
    WHERE NOT EXISTS ( SELECT 1 FROM "AssetType" WHERE LOWER("Name") = LOWER(asset_type_name) );
END
$$ LANGUAGE plpgsql;