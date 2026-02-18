/*
  # Drop unused indexes

  1. Changes
    - Remove 6 indexes that have never been used according to database statistics
    - These indexes were redundant because the primary key and unique constraints
      already cover the query patterns being used

  2. Tables affected
    - game_progress: drop idx_game_progress_user_id (user_id is already the PK/unique constraint target)
    - companions: drop idx_companions_user_id (queries filter by user_id via RLS)
    - world_map_state: drop idx_world_map_state_user_id (unique constraint on user_id,world_id covers this)
    - character_mastery: drop idx_character_mastery_user_id, idx_character_mastery_next_review
    - question_attempts: drop idx_question_attempts_user_eligible

  3. Important Notes
    - These indexes consume storage and slow down writes without providing read benefits
    - If usage patterns change in the future, indexes can be re-added
*/

DROP INDEX IF EXISTS idx_game_progress_user_id;
DROP INDEX IF EXISTS idx_companions_user_id;
DROP INDEX IF EXISTS idx_world_map_state_user_id;
DROP INDEX IF EXISTS idx_character_mastery_user_id;
DROP INDEX IF EXISTS idx_character_mastery_next_review;
DROP INDEX IF EXISTS idx_question_attempts_user_eligible;