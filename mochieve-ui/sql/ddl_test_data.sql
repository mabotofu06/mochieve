-- Test data generation for Mochieve
-- Inserts: 50 users, 500 work_groups, 4000 work_posts
-- Use with caution: intended for development/test environments only

-- 1) Users (50)
INSERT INTO public.user_info (user_id, auth_id, user_name, icon_image, note)
SELECT
  format('user_%02s', gs) as user_id,
  gen_random_uuid() as auth_id,
  format('Test User %02s', gs) as user_name,
  format('https://example.com/icons/%02s.png', gs) as icon_image,
  format('This is a test user number %s', gs) as note
FROM generate_series(1,50) as gs;

-- 2) Work Groups (500)
-- Assign a random owner from the inserted users
WITH owners AS (
  SELECT user_id FROM public.user_info ORDER BY random() LIMIT 500
)
INSERT INTO public.work_group (group_id, user_id, title, content, images, close_flag)
SELECT
  gen_random_uuid() as group_id,
  (SELECT user_id FROM public.user_info ORDER BY random() LIMIT 1) as user_id,
  format('Test Group %s', gs) as title,
  format('This is the description for test group %s', gs) as content,
  (
    SELECT array_agg(url) FROM (
      SELECT format('https://example.com/group_images/%s_%s.webp', gs, i) as url
      FROM generate_series(1, (floor(random()*4))::int) as i
    ) s
  )::text[] as images,
  (random() < 0.1) as close_flag
FROM generate_series(1,500) as gs;

-- 3) Work Posts (4000)
-- Distribute posts across groups; ensure post.user_id matches the group's user_id
WITH group_list AS (
  SELECT group_id, user_id FROM public.work_group
),
selected AS (
  SELECT
    g.group_id,
    g.user_id,
    generate_series(1, 4000) as seq
  FROM (SELECT group_id, user_id FROM public.work_group ORDER BY random() LIMIT 500) g
)
INSERT INTO public.work_post (post_id, group_id, user_id, image, content)
SELECT
  gen_random_uuid() as post_id,
  gl.group_id,
  gl.user_id,
  format('https://example.com/post_images/%s_%s.webp', gl.group_id, (random()*100000)::int) as image,
  format('Auto-generated post %s for group %s', s.seq, gl.group_id) as content
FROM (
  SELECT group_id, user_id FROM public.work_group
  ORDER BY random()
  LIMIT 500
) gl
CROSS JOIN LATERAL (
  SELECT generate_series(1, 8) as seq
) s;

-- The above CROSS JOIN LATERAL with 500 groups x 8 = 4000 posts

-- 4) Verification counts
SELECT 'user_info' as tbl, count(*) FROM public.user_info;
SELECT 'work_group' as tbl, count(*) FROM public.work_group;
SELECT 'work_post' as tbl, count(*) FROM public.work_post;

-- End of test data script
