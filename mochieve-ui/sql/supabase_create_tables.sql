-- Supabase (Postgres) table creation script for Mochieve
-- Based on README table definitions: work_group, work_post, user_info
-- Notes:
--  - Uses pgcrypto.gen_random_uuid() for uuid defaults (CREATE EXTENSION IF NOT EXISTS pgcrypto)
--  - timestamps use timestamptz and default to now()
--  - images stored as text[] (URL strings)
--  - Soft delete via delete_flag and delete_datetime

/* Enable extension for UUID generation */
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- user_info table
CREATE TABLE IF NOT EXISTS public.user_info (
  user_id         varchar(25) PRIMARY KEY,
  auth_id         uuid        --REFERENCES auth.users(id),
  name            varchar(100),
  icon_image      text,
  info            text,
  create_datetime timestamptz NOT NULL DEFAULT now(),
  update_datetime timestamptz NOT NULL DEFAULT now(),
  delete_flag     boolean NOT NULL DEFAULT false,
  delete_datetime timestamptz
);

-- work_group table
CREATE TABLE IF NOT EXISTS public.work_group (
  group_id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         varchar(25) NOT NULL REFERENCES public.user_info(user_id) ON DELETE CASCADE,
  title           varchar(50) NOT NULL,
  content         varchar(2000),
  images          text[]  NOT NULL DEFAULT '[]',
  close_flag      boolean NOT NULL DEFAULT false,
  create_datetime timestamptz NOT NULL DEFAULT now(),
  update_datetime timestamptz NOT NULL DEFAULT now(),
  delete_flag     boolean NOT NULL DEFAULT false,
  delete_datetime timestamptz
);

-- work_post table
CREATE TABLE IF NOT EXISTS public.work_post (
  post_id         uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id        uuid         NOT NULL    REFERENCES public.work_group(group_id) ON DELETE CASCADE,
  user_id         varchar(25)  NOT NULL    REFERENCES public.user_info(user_id) ON DELETE CASCADE,
  image           text         NOT NULL,
  content         varchar(300) NOT NULL,
  create_datetime timestamptz  NOT NULL DEFAULT now(),
  update_datetime timestamptz  NOT NULL DEFAULT now(),
  delete_flag     boolean      NOT NULL DEFAULT false,
  delete_datetime timestamptz
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_work_group_user_id         ON public.work_group(user_id);
CREATE INDEX IF NOT EXISTS idx_work_group_update_datetime ON public.work_group(update_datetime);
CREATE INDEX IF NOT EXISTS idx_work_post_group_id         ON public.work_post(group_id);
CREATE INDEX IF NOT EXISTS idx_user_info_auth_id          ON public.user_info(auth_id);

-- Partial indexes to speed up "active" (not deleted) queries
CREATE INDEX IF NOT EXISTS idx_work_group_active ON public.work_group(user_id, update_datetime) WHERE delete_flag = false;
CREATE INDEX IF NOT EXISTS idx_work_post_active  ON public.work_post(group_id, create_datetime) WHERE delete_flag = false;

-- Optional: set default empty array for images if desired
-- ALTER TABLE public.work_group ALTER COLUMN images SET DEFAULT ARRAY[]::text[];

-- Helpful view: recent active work groups (example)
CREATE OR REPLACE VIEW public.v_recent_active_work_groups AS
SELECT
  wg.*, ui.user_name, ui.icon_image
FROM public.work_group wg
LEFT JOIN public.user_info ui ON ui.user_id = wg.user_id
WHERE wg.delete_flag = false
ORDER BY wg.update_datetime DESC;

-- End of script

-- -----------------------------------------------------------------------------
-- Row Level Security (RLS) policies
-- Owner checks use auth.uid() and the mapping stored in public.user_info.auth_id
-- Supabase service_role bypasses RLS so administrative tasks are unaffected.
-- -----------------------------------------------------------------------------

-- Enable RLS on tables
ALTER TABLE public.user_info  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_group ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_post  ENABLE ROW LEVEL SECURITY;

-- ------------------------- user_info policies -------------------------------
-- Allow users to access and manage only their own user_info row (auth_id matches)
CREATE POLICY user_info_select_own ON public.user_info
  FOR SELECT USING (auth.uid() = auth_id::text);

CREATE POLICY user_info_insert_own ON public.user_info
  FOR INSERT WITH CHECK (auth.uid() = auth_id::text);

CREATE POLICY user_info_update_own ON public.user_info
  FOR UPDATE USING (auth.uid() = auth_id::text) WITH CHECK (auth.uid() = auth_id::text);

CREATE POLICY user_info_delete_own ON public.user_info
  FOR DELETE USING (auth.uid() = auth_id::text);

-- ------------------------- work_group policies ------------------------------
-- Public can read active (not deleted) groups. Owners can insert/update/delete their groups.
CREATE POLICY work_group_select_active ON public.work_group
  FOR SELECT USING (delete_flag = false);

CREATE POLICY work_group_insert_own ON public.work_group
  FOR INSERT WITH CHECK (
    user_id = (SELECT user_id FROM public.user_info WHERE auth_id::text = auth.uid())
  );

CREATE POLICY work_group_update_own ON public.work_group
  FOR UPDATE USING (
    user_id = (SELECT user_id FROM public.user_info WHERE auth_id::text = auth.uid())
  ) WITH CHECK (
    user_id = (SELECT user_id FROM public.user_info WHERE auth_id::text = auth.uid())
  );

CREATE POLICY work_group_delete_own ON public.work_group
  FOR DELETE USING (
    user_id = (SELECT user_id FROM public.user_info WHERE auth_id::text = auth.uid())
  );

-- ------------------------- work_post policies -------------------------------
-- Posts are readable when both the post and its parent group are not deleted.
CREATE POLICY work_post_select_active ON public.work_post
  FOR SELECT USING (
    delete_flag = false
    AND (SELECT delete_flag FROM public.work_group WHERE group_id = public.work_post.group_id) = false
  );

-- Insert: only authenticated user whose user_id matches may insert posts, and group must be active
CREATE POLICY work_post_insert_own ON public.work_post
  FOR INSERT WITH CHECK (
    user_id = (SELECT user_id FROM public.user_info WHERE auth_id::text = auth.uid())
    AND group_id IN (SELECT group_id FROM public.work_group WHERE delete_flag = false)
  );

-- Update/Delete: only the post owner can modify/delete their post
CREATE POLICY work_post_update_own ON public.work_post
  FOR UPDATE USING (
    user_id = (SELECT user_id FROM public.user_info WHERE auth_id::text = auth.uid())
  ) WITH CHECK (
    user_id = (SELECT user_id FROM public.user_info WHERE auth_id::text = auth.uid())
  );

CREATE POLICY work_post_delete_own ON public.work_post
  FOR DELETE USING (
    user_id = (SELECT user_id FROM public.user_info WHERE auth_id::text = auth.uid())
  );

-- Notes:
-- - These policies assume that `public.user_info.auth_id` stores the UUID from `auth.users.id`.
-- - Comparisons use `auth_id::text` to compare with auth.uid() which returns text.
-- - Service role (supabase service_role) bypasses RLS for admin operations.

