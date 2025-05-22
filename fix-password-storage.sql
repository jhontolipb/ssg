-- Create a database trigger to hash passwords before insertion
CREATE OR REPLACE FUNCTION hash_password()
RETURNS TRIGGER AS $$
BEGIN
  -- Only hash the password if it's not already hashed (doesn't start with $2a$)
  IF NEW.password_hash IS NOT NULL AND NEW.password_hash NOT LIKE '$2a$%' THEN
    NEW.password_hash = crypt(NEW.password_hash, gen_salt('bf'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS hash_password_trigger ON users;

-- Create the trigger
CREATE TRIGGER hash_password_trigger
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION hash_password();

-- Make sure the pgcrypto extension is enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Make sure the password_hash column exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Update the auth.users table to enable email confirmations
UPDATE auth.config
SET email_confirm_required = true
WHERE email_confirm_required = false;
