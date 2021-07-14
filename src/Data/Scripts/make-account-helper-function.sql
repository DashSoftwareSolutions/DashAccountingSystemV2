DROP FUNCTION IF EXISTS make_account(
     UUID
    ,INTEGER
    ,CHARACTER VARYING
    ,TEXT
    ,INTEGER
    ,INTEGER
    ,SMALLINT
    ,UUID);

﻿CREATE OR REPLACE FUNCTION make_account (
     IN the_tenant_id UUID
    ,IN the_account_number INTEGER
    ,IN the_account_name VARCHAR(255)
    ,IN the_account_description TEXT
    ,IN the_account_type_id INTEGER
    ,IN the_account_sub_type_id INTEGER
    ,IN the_asset_type_id INTEGER
    ,IN the_normal_balance_type SMALLINT
    ,IN created_by_user_id UUID
)
RETURNS UUID
AS $$
DECLARE
    existing_account_id UUID;
    existing_account_number INTEGER;
    existing_account_name VARCHAR(255);
    new_account_id UUID;
BEGIN
    -- Check for Tenant + Name Collision (Case-Insensitive)
    SELECT "Id","AccountNumber" FROM "Account"
         WHERE "TenantId" = the_tenant_id
           AND LOWER("Name") = LOWER(the_account_name)
         LIMIT 1
          INTO existing_account_id, existing_account_number;

    IF existing_account_id IS NOT NULL THEN
        RAISE NOTICE 'Account ''%'' already exists for Tenant ID % (Acct. Number %, Id %).  Bailing out...',
            the_account_name, the_tenant_id, existing_account_number, existing_account_id;
        RETURN NULL;
    END IF;

    -- Check for Tenant + Account Number Collision
    SELECT "Id","Name" FROM "Account"
         WHERE "TenantId" = the_tenant_id
           AND "AccountNumber" = the_account_number
         LIMIT 1
          INTO existing_account_id, existing_account_name;

      IF existing_account_id IS NOT NULL THEN
          RAISE WARNING 'Account Number % already exists for Tenant ID % but has a different name: ''%'' (Id %). Bailing out...',
            the_account_number, the_tenant_id, existing_account_name, existing_account_id;
      END IF;

    -- Should be safe to go ahead and create the account
    INSERT INTO "Account"
    (
         "TenantId"
        ,"AccountNumber"
        ,"Name"
        ,"Description"
        ,"AccountTypeId"
        ,"AccountSubTypeId"
        ,"AssetTypeId"
        ,"NormalBalanceType"
        ,"CreatedById"
    )
    VALUES
    (
         the_tenant_id
        ,the_account_number
        ,the_account_name
        ,the_account_description
        ,the_account_type_id
        ,the_account_sub_type_id
        ,the_asset_type_id
        ,the_normal_balance_type
        ,created_by_user_id
    )
    RETURNING "Id"
    INTO STRICT new_account_id;

    RETURN new_account_id;
END
$$ LANGUAGE plpgsql;
