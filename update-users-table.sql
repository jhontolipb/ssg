-- Remove the password_hash column from the users table if it exists
ALTER TABLE users DROP COLUMN IF EXISTS password_hash;

-- Make sure the users table has the correct structure
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS name VARCHAR(255) NOT NULL,
  ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE NOT NULL,
  ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'student',
  ADD COLUMN IF NOT EXISTS department VARCHAR(255),
  ADD COLUMN IF NOT EXISTS student_id VARCHAR(50),
  ADD COLUMN IF NOT EXISTS qr_code VARCHAR(255),
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
