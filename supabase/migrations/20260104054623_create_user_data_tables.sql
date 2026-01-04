/*
  # User Data Tables for Hanzi Realm

  1. New Tables
    - `user_profiles`
      - `id` (uuid, references auth.users)
      - `username` (text, unique)
      - `created_at` (timestamptz)
      - `last_login` (timestamptz)
    
    - `game_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `jade` (integer) - in-game currency
      - `current_streak` (integer) - current correct answer streak
      - `best_streak` (integer) - best streak achieved
      - `questions_answered` (integer) - total questions answered
      - `bosses_defeated` (integer) - total bosses defeated
      - `world_number` (integer) - current world
      - `grade_level` (integer) - difficulty level (1-6)
      - `words_learned` (text[]) - array of learned characters
      - `updated_at` (timestamptz)
    
    - `companions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `companion_id` (text) - companion identifier
      - `name` (text) - companion name
      - `emoji` (text) - companion emoji
      - `avatar_seed` (text) - avatar generation seed
      - `rarity` (text) - common/rare/legendary
      - `buff_type` (text) - jade_boost/streak_shield/combo_master
      - `buff_value` (numeric) - buff strength
      - `is_active` (boolean) - currently equipped
      - `unlocked_at` (timestamptz)
    
    - `game_settings`
      - `user_id` (uuid, primary key, references user_profiles)
      - `audio_language` (text) - zh-CN or zh-HK
      - `use_eleven_labs` (boolean)
      - `audio_speed` (numeric)
      - `bgm_volume` (numeric)
      - `theme` (text) - meadow/magma/cyber
      - `updated_at` (timestamptz)
    
    - `world_map_state`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `world_id` (integer)
      - `nodes` (jsonb) - map node data
      - `updated_at` (timestamptz)
    
    - `character_mastery`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `character` (text) - Chinese character
      - `correct_count` (integer)
      - `total_attempts` (integer)
      - `last_reviewed_at` (timestamptz)
      - `next_review_at` (timestamptz)
      - `mastery_level` (integer) - 0-5 scale
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
    - Authenticated users required for all operations
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create game_progress table
CREATE TABLE IF NOT EXISTS game_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  jade integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  best_streak integer DEFAULT 0,
  questions_answered integer DEFAULT 0,
  bosses_defeated integer DEFAULT 0,
  world_number integer DEFAULT 1,
  grade_level integer DEFAULT 1,
  words_learned text[] DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE game_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON game_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own progress"
  ON game_progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert own progress"
  ON game_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create companions table
CREATE TABLE IF NOT EXISTS companions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  companion_id text NOT NULL,
  name text NOT NULL,
  emoji text NOT NULL,
  avatar_seed text NOT NULL,
  rarity text NOT NULL,
  buff_type text NOT NULL,
  buff_value numeric NOT NULL,
  is_active boolean DEFAULT false,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(user_id, companion_id)
);

ALTER TABLE companions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own companions"
  ON companions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own companions"
  ON companions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own companions"
  ON companions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own companions"
  ON companions FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create game_settings table
CREATE TABLE IF NOT EXISTS game_settings (
  user_id uuid PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  audio_language text DEFAULT 'zh-CN',
  use_eleven_labs boolean DEFAULT true,
  audio_speed numeric DEFAULT 0.75,
  bgm_volume numeric DEFAULT 0.1,
  theme text DEFAULT 'meadow',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE game_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON game_settings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own settings"
  ON game_settings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert own settings"
  ON game_settings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create world_map_state table
CREATE TABLE IF NOT EXISTS world_map_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  world_id integer NOT NULL,
  nodes jsonb NOT NULL DEFAULT '[]',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, world_id)
);

ALTER TABLE world_map_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own map state"
  ON world_map_state FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own map state"
  ON world_map_state FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own map state"
  ON world_map_state FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create character_mastery table (for future spaced repetition)
CREATE TABLE IF NOT EXISTS character_mastery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  character text NOT NULL,
  correct_count integer DEFAULT 0,
  total_attempts integer DEFAULT 0,
  last_reviewed_at timestamptz DEFAULT now(),
  next_review_at timestamptz DEFAULT now(),
  mastery_level integer DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, character)
);

ALTER TABLE character_mastery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own mastery data"
  ON character_mastery FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own mastery data"
  ON character_mastery FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own mastery data"
  ON character_mastery FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_game_progress_user_id ON game_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_companions_user_id ON companions(user_id);
CREATE INDEX IF NOT EXISTS idx_world_map_state_user_id ON world_map_state(user_id);
CREATE INDEX IF NOT EXISTS idx_character_mastery_user_id ON character_mastery(user_id);
CREATE INDEX IF NOT EXISTS idx_character_mastery_next_review ON character_mastery(user_id, next_review_at);