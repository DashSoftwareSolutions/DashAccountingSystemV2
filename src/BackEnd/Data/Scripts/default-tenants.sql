DO $$
DECLARE
    DEFAULT_ASSET_TYPE_USD INT;
BEGIN
    SELECT "Id" FROM "AssetType" WHERE "Name" = 'USD'
    INTO DEFAULT_ASSET_TYPE_USD;

    IF (DEFAULT_ASSET_TYPE_USD IS NULL) THEN
        RAISE NOTICE 'Could not find U.S. Dollars Asset Type.  You might need to run the common lookups seed data script first.  Bailing out...';
    ELSE
        IF NOT EXISTS (SELECT 1 FROM "Tenant" WHERE LOWER("Name") = LOWER('Example Corporation') LIMIT 1) THEN
            INSERT INTO "Tenant" ( "Name", "DefaultAssetTypeId" )
            VALUES ( 'Example Corporation', DEFAULT_ASSET_TYPE_USD );
        END IF;

        IF NOT EXISTS (SELECT 1 FROM "Tenant" WHERE LOWER("Name") = LOWER('Dash Software Solutions, Inc.') LIMIT 1) THEN
            INSERT INTO "Tenant" ( "Name" "DefaultAssetTypeId" )
            VALUES ( 'Dash Software Solutions, Inc.', DEFAULT_ASSET_TYPE_USD );
        END IF;
    END IF;
END
$$ LANGUAGE plpgsql;
