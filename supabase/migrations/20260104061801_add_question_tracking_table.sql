/*
  # Add Question Tracking for Spaced Repetition

  1. New Tables
    - `question_attempts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `question_id` (text) - The level ID
      - `answered_correctly` (boolean)
      - `answered_at` (timestamptz)
      - `next_eligible_at` (timestamptz) - When this question can appear again
      - `streak_count` (integer) - Consecutive correct answers
      - `difficulty_score` (numeric) - 0-1 difficulty based on history

  2. Security
    - Enable RLS on `question_attempts` table
    - Add policy for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS question_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) NOT NULL,
  question_id text NOT NULL,
  answered_correctly boolean NOT NULL DEFAULT false,
  answered_at timestamptz DEFAULT now(),
  next_eligible_at timestamptz DEFAULT now(),
  streak_count integer DEFAULT 0,
  difficulty_score numeric DEFAULT 0.5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, question_id)
);

ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own question attempts"
  ON question_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own question attempts"
  ON question_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own question attempts"
  ON question_attempts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_question_attempts_user_eligible 
  ON question_attempts(user_id, next_eligible_at);
