/*
  # Optimize RLS policies for query performance

  1. Changes
    - All 22 RLS policies across 7 tables updated to use `(select auth.uid())` 
      instead of bare `auth.uid()` to prevent per-row re-evaluation
    - Tables affected: user_profiles, game_progress, companions, game_settings,
      world_map_state, character_mastery, question_attempts

  2. Security
    - No security behavior changes - identical access control
    - Significant performance improvement at scale by caching auth.uid() once per query

  3. Important Notes
    - Each policy is dropped and recreated with the optimized pattern
    - All policies remain restricted to authenticated users only
*/

-- user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

-- game_progress
DROP POLICY IF EXISTS "Users can view own progress" ON game_progress;
CREATE POLICY "Users can view own progress"
  ON game_progress FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON game_progress;
CREATE POLICY "Users can update own progress"
  ON game_progress FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON game_progress;
CREATE POLICY "Users can insert own progress"
  ON game_progress FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- companions
DROP POLICY IF EXISTS "Users can view own companions" ON companions;
CREATE POLICY "Users can view own companions"
  ON companions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own companions" ON companions;
CREATE POLICY "Users can insert own companions"
  ON companions FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own companions" ON companions;
CREATE POLICY "Users can update own companions"
  ON companions FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own companions" ON companions;
CREATE POLICY "Users can delete own companions"
  ON companions FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- game_settings
DROP POLICY IF EXISTS "Users can view own settings" ON game_settings;
CREATE POLICY "Users can view own settings"
  ON game_settings FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own settings" ON game_settings;
CREATE POLICY "Users can update own settings"
  ON game_settings FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own settings" ON game_settings;
CREATE POLICY "Users can insert own settings"
  ON game_settings FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- world_map_state
DROP POLICY IF EXISTS "Users can view own map state" ON world_map_state;
CREATE POLICY "Users can view own map state"
  ON world_map_state FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own map state" ON world_map_state;
CREATE POLICY "Users can insert own map state"
  ON world_map_state FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own map state" ON world_map_state;
CREATE POLICY "Users can update own map state"
  ON world_map_state FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- character_mastery
DROP POLICY IF EXISTS "Users can view own mastery data" ON character_mastery;
CREATE POLICY "Users can view own mastery data"
  ON character_mastery FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own mastery data" ON character_mastery;
CREATE POLICY "Users can insert own mastery data"
  ON character_mastery FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own mastery data" ON character_mastery;
CREATE POLICY "Users can update own mastery data"
  ON character_mastery FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- question_attempts
DROP POLICY IF EXISTS "Users can view own question attempts" ON question_attempts;
CREATE POLICY "Users can view own question attempts"
  ON question_attempts FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own question attempts" ON question_attempts;
CREATE POLICY "Users can insert own question attempts"
  ON question_attempts FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own question attempts" ON question_attempts;
CREATE POLICY "Users can update own question attempts"
  ON question_attempts FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);