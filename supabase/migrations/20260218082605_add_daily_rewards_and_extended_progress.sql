/*
  # Add Daily Rewards Table and Extended Progress Fields

  1. New Tables
    - `daily_rewards`
      - `user_id` (uuid, primary key, references user_profiles)
      - `last_claim_date` (date) - date of last daily reward claim
      - `consecutive_days` (integer) - streak of consecutive daily logins
      - `claimed_days` (integer[]) - array of all claimed day numbers
      - `updated_at` (timestamptz)

  2. Modified Tables
    - `game_progress`
      - Added `streak_shield_active` (boolean) - whether streak shield is active
      - Added `streak_shield_used` (boolean) - whether shield was used this session
      - Added `seen_question_ids` (text[]) - IDs of questions already seen

  3. Security
    - Enable RLS on `daily_rewards` table
    - Users can only access their own daily reward data
    - Standard CRUD policies for authenticated users

  4. Notes
    - Daily rewards are synced to cloud so clearing browser storage doesn't lose streak
    - Streak shield state is persisted across sessions
    - Seen question IDs prevent repetition across devices
*/

CREATE TABLE IF NOT EXISTS daily_rewards (
  user_id uuid PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  last_claim_date date,
  consecutive_days integer DEFAULT 0,
  claimed_days integer[] DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE daily_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily rewards"
  ON daily_rewards FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own daily rewards"
  ON daily_rewards FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own daily rewards"
  ON daily_rewards FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'game_progress' AND column_name = 'streak_shield_active'
  ) THEN
    ALTER TABLE game_progress ADD COLUMN streak_shield_active boolean DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'game_progress' AND column_name = 'streak_shield_used'
  ) THEN
    ALTER TABLE game_progress ADD COLUMN streak_shield_used boolean DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'game_progress' AND column_name = 'seen_question_ids'
  ) THEN
    ALTER TABLE game_progress ADD COLUMN seen_question_ids text[] DEFAULT '{}';
  END IF;
END $$;
