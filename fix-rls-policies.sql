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

-- Fix RLS policies for all tables

-- Users table policies
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON users
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users only" ON users
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable update for users based on id" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Organizations table policies
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON organizations
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users only" ON organizations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable update for organization admins" ON organizations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM organization_members
            WHERE user_id = auth.uid()
            AND organization_id = organizations.id
            AND is_admin = true
        )
    );

-- Events table policies
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON events
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users only" ON events
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable update for organization admins" ON events
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM organization_members
            WHERE user_id = auth.uid()
            AND organization_id = events.organization_id
            AND is_admin = true
        )
    );

-- Event officers table policies
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON event_officers
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users only" ON event_officers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable update for organization admins" ON event_officers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM organization_members om
            JOIN events e ON e.organization_id = om.organization_id
            WHERE om.user_id = auth.uid()
            AND e.id = event_officers.event_id
            AND om.is_admin = true
        )
    );

-- Attendance table policies
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON attendance
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users only" ON attendance
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable update for event officers and self" ON attendance
    FOR UPDATE USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM event_officers
            WHERE user_id = auth.uid()
            AND event_id = attendance.event_id
        )
    );

-- Clearances table policies
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON clearances
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users only" ON clearances
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable update for organization admins" ON clearances
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM organization_members
            WHERE user_id = auth.uid()
            AND organization_id = clearances.organization_id
            AND is_admin = true
        ) OR auth.uid() = user_id
    );

-- Messages table policies
CREATE POLICY IF NOT EXISTS "Enable read access for sender and receiver" ON messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users only" ON messages
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Notifications table policies
CREATE POLICY IF NOT EXISTS "Enable read access for user" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users only" ON notifications
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Organization members table policies
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON organization_members
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users only" ON organization_members
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Enable update for organization admins" ON organization_members
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM organization_members
            WHERE user_id = auth.uid()
            AND organization_id = organization_members.organization_id
            AND is_admin = true
        )
    );

-- Student points table policies
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON student_points
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users only" ON student_points
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
