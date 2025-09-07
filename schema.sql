-- 1. Create the 'profiles' table to store public user data
-- This table will be linked to the auth.users table provided by Supabase.
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rank TEXT NOT NULL DEFAULT 'Soldado',
  xp INT NOT NULL DEFAULT 0,
  stats JSONB NOT NULL DEFAULT '{
      "totalProblems": 0,
      "correctAnswers": 0,
      "currentStreak": 0,
      "maxStreak": 0,
      "averageTime": 0,
      "fastestTime": 0,
      "achievements": []
  }',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create a function to automatically create a profile when a new user signs up.
-- This function will be triggered by an event on the auth.users table.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- The 'name' for the profile is extracted from the metadata provided during sign-up.
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create a trigger that calls the function after a new user is created.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Enable Row Level Security (RLS) on the profiles table.
-- This is a key security feature in Supabase.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Create policies to define access rules for the profiles table.
-- Policy: Allow all users (authenticated or not) to view profiles.
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

-- Policy: Allow a user to update their own profile only.
CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Note on Achievements:
-- The initial state of achievements is set in the default JSONB value for the 'stats' column.
-- The application logic will be responsible for updating this JSONB object.
