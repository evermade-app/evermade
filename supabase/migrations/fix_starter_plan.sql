-- Fix accounts incorrectly assigned 'starter' plan on signup.
-- 'starter' was the old default; all such users should be on 'free'.
-- Run this once in the Supabase SQL editor.
update profiles
set plan = 'free', credits_used = 0
where plan = 'starter';
