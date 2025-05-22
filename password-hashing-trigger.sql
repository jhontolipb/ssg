-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create a function to hash passwords
CREATE OR REPLACE FUNCTION hash_password()
RETURNS TRIGGER AS $$
BEGIN
  -- Only hash if it's not already hashed
  IF NEW.password_hash IS NOT NULL AND NEW.password_hash NOT LIKE '$2a$%' THEN
    NEW.password_hash = crypt(NEW.password_hash, gen_salt('bf'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically hash passwords
DROP TRIGGER IF EXISTS hash_password_trigger ON users;
CREATE TRIGGER hash_password_trigger
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION hash_password();
