# Hanzi Realm - 8-Phase Implementation Tracker

## Status Key
- [ ] Not started
- [~] In progress
- [x] Complete

---

## Phase 1: Core Game Engine Fixes and Wiring -- COMPLETE

- [x] 1.1 Wire up spaced repetition in GameContainer (generateLevelWithSpacedRepetition when authenticated)
- [x] 1.2 Fix NarratorAvatar fire mode "?" placeholder -> proper flame SVG elements
- [x] 1.3 Fix BattleView selectedOption null safety (fallback text)
- [x] 1.4 Mount orphaned UserProfile component into NavBar (replaces plain user icon)
- [x] 1.5 Fix ReportCard "All Time" tab - added icons for visual consistency
- [x] 1.6 Fix BattleView streak indicator "?" -> Zap icon for non-fire streaks >= 3

## Phase 2: Content Expansion (Grades 5 & 6) -- COMPLETE

- [x] 2.1 Create grade5Extra.ts (15 levels: g5-006 through g5-020)
- [x] 2.2 Create grade6Extra.ts (15 levels: g6-006 through g6-020)
- [x] 2.3 Register in beijingCurriculum.ts (grades 5&6 now have 20 levels each)

## Phase 3: Cloud Sync Completeness -- COMPLETE

- [x] 3.1 Create daily_rewards table in Supabase (migration applied)
- [x] 3.2 Add cloud sync functions for daily rewards (syncDailyRewardsToCloud, loadDailyRewardsFromCloud)
- [x] 3.3 Add streak_shield_active/streak_shield_used columns to game_progress
- [x] 3.4 Add seen_question_ids column to game_progress + sync in loadCloudData/syncProgress
- [x] 3.5 Add SyncIndicator component (shows syncing/saved/error states)
- [x] 3.6 Add retry logic with exponential backoff (withRetry util, wraps syncProgressToCloud)
- [x] 3.7 Wire claimDailyRewardWithSync to GameContainer (replaces plain claimDailyReward)
- [x] 3.8 Wire syncDailyRewardState into loadCloudData (cloud<->local merge on login)

## Phase 4: Boss System Progression (FUTURE)

- [ ] 4.1 Scale boss HP by world number
- [ ] 4.2 Differentiate boss rewards by tier
- [ ] 4.3 Scale boss timer by difficulty
- [ ] 4.4 Boss-specific loot tables
- [ ] 4.5 New Game Plus after world 8

## Phase 5: Onboarding/Tutorial (FUTURE)

- [ ] 5.1 Welcome/intro screen
- [ ] 5.2 Guided first mission
- [ ] 5.3 Contextual tooltips
- [ ] 5.4 Grade selection screen
- [ ] 5.5 New player checklist

## Phase 6: Leaderboard & Social (FUTURE)

- [ ] 6.1 Leaderboards table
- [ ] 6.2 Leaderboard UI
- [ ] 6.3 Weekly/all-time categories
- [ ] 6.4 Share progress feature

## Phase 7: Parent/Teacher Dashboard (FUTURE)

- [ ] 7.1 Role-based auth
- [ ] 7.2 Progress monitoring dashboard
- [ ] 7.3 Per-character mastery heatmap
- [ ] 7.4 Weekly trend charts

## Phase 8: Polish & Production Hardening (FUTURE)

- [ ] 8.1 Global error boundary
- [ ] 8.2 Network connection detector
- [ ] 8.3 Centralized game config
- [ ] 8.4 Loading skeleton states
- [ ] 8.5 User-facing error messages
- [ ] 8.6 Optimize GameContainer re-renders
- [ ] 8.7 Cache NarratorAvatar API calls
- [ ] 8.8 BGM audio integration
- [ ] 8.9 Separate SFX volume control

---

## Change Log

### Session 1 - Phase 1-3 Implementation (2026-02-18)

**Files Modified:**
- `src/components/GameContainer.tsx` - Wired spaced repetition, daily reward cloud sync, sync indicator, streak/seen ID cloud persistence
- `src/components/NarratorAvatar.tsx` - Replaced "?" placeholders with animated SVG flame elements
- `src/components/BattleView.tsx` - Added null safety fallback for selectedOption, replaced "?" with Zap icon
- `src/components/NavBar.tsx` - Replaced plain user icon with UserProfile component
- `src/components/ReportCard.tsx` - Added stat icons to All Time tab
- `src/data/beijingCurriculum.ts` - Registered grade5Extra and grade6Extra
- `src/utils/cloudStorage.ts` - Added daily reward sync, streak shield + seen question ID fields, retry logic
- `src/utils/dailyRewards.ts` - Added claimDailyRewardWithSync and syncDailyRewardState

**Files Created:**
- `src/data/grade5Extra.ts` - 15 new Grade 5 levels (idioms, poetry, history, science)
- `src/data/grade6Extra.ts` - 15 new Grade 6 levels (philosophy, literature, history, science)
- `src/utils/syncRetry.ts` - Exponential backoff retry utility with status broadcasting
- `src/components/SyncIndicator.tsx` - Cloud sync status indicator UI

**Database Migration:**
- `add_daily_rewards_and_extended_progress` - Created daily_rewards table, added streak_shield_active, streak_shield_used, seen_question_ids columns to game_progress

**Build Status:** PASSING (no errors)
