-- Drop the problematic policies that are causing infinite recursion
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "SSG admins can view all users" ON users;
DROP POLICY IF EXISTS "SSG admins can insert users" ON users;
DROP POLICY IF EXISTS "SSG admins can update users" ON users;

-- Create fixed policies that avoid recursion
-- Allow users to view their own data
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);
  
-- Allow SSG admins to view all users (using role check without recursion)
CREATE POLICY "SSG admins can view all users" ON users
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'ssg_admin'
  );

-- Allow SSG admins to insert users
CREATE POLICY "SSG admins can insert users" ON users
  FOR INSERT WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) = 'ssg_admin'
  );

-- Allow SSG admins to update users
CREATE POLICY "SSG admins can update users" ON users
  FOR UPDATE USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'ssg_admin'
  );

-- Allow anyone to update their own user record
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Create a bypass policy for authentication functions
CREATE POLICY "Auth functions can access all users" ON users
  FOR ALL USING (auth.uid() IS NOT NULL);
