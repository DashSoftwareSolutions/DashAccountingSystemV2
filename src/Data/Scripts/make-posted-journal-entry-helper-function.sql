-- ===========================================================================
-- Helper function to create journal entries/transaction
-- ===========================================================================
DO $$
BEGIN
    IF NOT EXISTS ( SELECT 1 FROM pg_type WHERE typname = 'journal_entry_account' ) THEN
        CREATE TYPE journal_entry_account AS
        (
            account_id UUID,
            asset_type_id INTEGER,
            amount NUMERIC
        );
    END IF;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION make_posted_journal_entry (
    tenant_id UUID
   ,entry_date TIMESTAMP
   ,post_date TIMESTAMP
   ,description VARCHAR(2048)
   ,check_number SMALLINT
   ,user_id UUID
   ,note TEXT
   ,accounts journal_entry_account[]
)
RETURNS UUID
AS $$
DECLARE
    STATUS_POSTED INTEGER := 2;

    entry_number INTEGER;
    journal_entry_id UUID;
    account_number INTEGER;
    account_name VARCHAR;
    current_account journal_entry_account;
    transaction_timestamp TIMESTAMPTZ;
BEGIN
    -- Resolve next available Journal Entry/Transaction Number
    SELECT COALESCE(MAX("EntryId"),0) + 1 FROM "JournalEntry"
    WHERE "TenantId" = tenant_id
    INTO STRICT entry_number;

    RAISE NOTICE 'Journal Entry / Transaction # %', entry_number;

    transaction_timestamp := (now() AT TIME ZONE 'UTC');
    
    -- Insert Journal Entry
    INSERT INTO "JournalEntry"
    (
         "TenantId"
        ,"EntryId"
        ,"EntryDate"
        ,"PostDate"
        ,"Description"
        ,"CheckNumber"
        ,"Note"
        ,"Status"
        ,"Created"
        ,"CreatedById"
        ,"PostedById"
    )
    VALUES
    (
         tenant_id
        ,entry_number
        ,entry_date
        ,post_date
        ,description
        ,check_number
        ,note
        ,STATUS_POSTED
        ,transaction_timestamp
        ,user_id
        ,user_id
    )
    RETURNING "Id" INTO STRICT journal_entry_id;
    
    -- For Each Account
    FOREACH current_account IN ARRAY accounts LOOP
        -- Resolve Account Name and Account Number
        SELECT "AccountNumber", "Name"
        FROM "Account"
        WHERE "Id" = current_account.account_id
        INTO STRICT account_number, account_name;
    
        RAISE NOTICE 'Account ID % / % - %'
            ,current_account.account_id
            ,account_number
            ,account_name;
        
        -- Insert into JournalEntryAccount table
        INSERT INTO "JournalEntryAccount"
        (
             "JournalEntryId"
            ,"AccountId"
            ,"AssetTypeId"
            ,"Amount"
        )
        VALUES
        (
             journal_entry_id
            ,current_account.account_id
            ,current_account.asset_type_id
            ,current_account.amount
        );
        
    END LOOP;

    RETURN journal_entry_id;
END
$$ LANGUAGE plpgsql;