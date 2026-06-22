-- ════════════════════════════════════════════════════════════
-- 엉클조 클럽 — Supabase 초기 마이그레이션
-- 스키마 + 인증 함수(current_app_user) + RLS + 접근 RPC
--
-- 인증: 링크 토큰 방식 (비밀번호 없음)
--   · users.access_token(UUID) 이 현재의 로그인 키.
--   · 입장 URL: /p/{access_token}(부모), /coach/{access_token}(코치)
--   ⚠️ 프로토타입 경량 인증 — access_token = 비밀번호. 링크가 유출되면 접근됩니다.
--      운영 전환 시 반드시 Supabase Auth(이메일/카카오/구글)로 교체할 것.
--
-- ★ 향후 Auth 전환 = "데이터는 그대로, 입구만 교체" ★
--   1) users 행에 auth_user_id 채우기 (로그인 사용자 ↔ 기존 user 연결)
--   2) current_app_user() 본문을 auth.uid() 매핑으로 교체 (이 함수 한 곳만!)
--   3) 토큰 기반 RPC(login_with_token 등) 제거, 정책은 그대로 동작
--   4) /p/{token} 라우팅 → 로그인 화면으로 교체
-- ════════════════════════════════════════════════════════════

-- gen_random_uuid() 보장 (Supabase 기본 제공, 안전하게 명시)
create extension if not exists pgcrypto;

-- ───────────────────────── 테이블 ─────────────────────────

create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  role          text not null check (role in ('parent','coach')),
  name          text not null,
  access_token  uuid not null unique default gen_random_uuid(),
  auth_user_id  uuid,        -- 향후 Supabase Auth 연결용 (지금 null·미사용)
  email         text,        -- 향후 이메일/소셜 로그인 키 (지금 null·미사용)
  created_at    timestamptz not null default now()
);

create table if not exists public.cohorts (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  start_date    date,
  current_week  int not null default 0
);

create table if not exists public.children (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid not null references public.users(id) on delete cascade,
  name        text not null,
  age         int,
  created_at  timestamptz not null default now()
);

create table if not exists public.enrollments (
  id            uuid primary key default gen_random_uuid(),
  child_id      uuid not null references public.children(id) on delete cascade,
  cohort_id     uuid not null references public.cohorts(id) on delete cascade,
  current_week  int not null default 0
);

create table if not exists public.missions (   -- 10주 미션 마스터
  id           uuid primary key default gen_random_uuid(),
  week         int not null unique,
  title        text not null,
  description  text
);

create table if not exists public.mission_progress (  -- 아이별 수행
  id            uuid primary key default gen_random_uuid(),
  child_id      uuid not null references public.children(id) on delete cascade,
  week          int not null,
  status        text not null default 'todo' check (status in ('todo','done')),
  completed_at  timestamptz,
  unique (child_id, week)
);

create table if not exists public.letters (   -- 편지 10편
  id         uuid primary key default gen_random_uuid(),
  week       int not null unique,
  title      text not null,
  body       text,
  video_url  text
);

create table if not exists public.coach_notes (   -- 엉클조 한마디
  id          uuid primary key default gen_random_uuid(),
  child_id    uuid not null references public.children(id) on delete cascade,
  week        int not null,
  body        text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.articles (   -- 콘텐츠 탭 아티클
  id            uuid primary key default gen_random_uuid(),
  series        text not null,                 -- 'why' | 'note'
  title         text not null,
  body          text,
  thumbnail     text,
  published_at  date,
  locked        boolean not null default false
);

create table if not exists public.contents (   -- 동화/신문
  id         uuid primary key default gen_random_uuid(),
  type       text not null check (type in ('fairytale','news')),
  title      text not null,
  body       text,
  thumbnail  text,
  seq        int not null default 0   -- 콘텐츠 탭 노출 순서
);

-- ─────────── 인증 해석 함수 (★ 전환 시 여기만 교체 ★) ───────────

-- 현재 사용자 id.
-- [현재] 링크 토큰 로그인: 앱이 보낸 JWT의 'app_user_id' 클레임을 사용.
--        (토큰→user 식별은 login_with_token RPC가 담당, 접근 RPC도 토큰을 직접 검증)
-- [향후] Supabase Auth 전환 시 본문을 아래로 교체하면 끝:
--        select id from public.users where auth_user_id = auth.uid()
create or replace function public.current_app_user()
returns uuid
language sql stable
as $$
  select nullif(
    current_setting('request.jwt.claims', true)::json ->> 'app_user_id', ''
  )::uuid;
$$;

-- 현재 사용자가 코치인가
create or replace function public.current_app_is_coach()
returns boolean
language sql stable
as $$
  select exists (
    select 1 from public.users
    where id = public.current_app_user() and role = 'coach'
  );
$$;

-- 현재 사용자가 해당 아이의 보호자인가
create or replace function public.owns_child(p_child uuid)
returns boolean
language sql stable
as $$
  select exists (
    select 1 from public.children c
    where c.id = p_child and c.parent_id = public.current_app_user()
  );
$$;

-- 현재 사용자가 '참여자'(enrollment 있는 부모)인가 — 편지/잠금글 접근용
create or replace function public.is_enrolled_parent()
returns boolean
language sql stable
as $$
  select exists (
    select 1
    from public.children c
    join public.enrollments e on e.child_id = c.id
    where c.parent_id = public.current_app_user()
  );
$$;

-- ───────────────────── RLS 활성화 ─────────────────────

alter table public.users            enable row level security;
alter table public.cohorts          enable row level security;
alter table public.children         enable row level security;
alter table public.enrollments      enable row level security;
alter table public.missions         enable row level security;
alter table public.mission_progress enable row level security;
alter table public.letters          enable row level security;
alter table public.coach_notes      enable row level security;
alter table public.articles         enable row level security;
alter table public.contents         enable row level security;

-- ───────────────────── RLS 정책 ─────────────────────
-- 모든 정책은 current_app_user() / current_app_is_coach() 등
-- 인증 함수를 참조 → Auth 전환 시 함수만 바꾸면 정책은 그대로.

-- users: 본인 또는 코치만 조회
create policy users_select on public.users
  for select using (id = public.current_app_user() or public.current_app_is_coach());

-- cohorts: 공개 읽기 (민감하지 않음)
create policy cohorts_select on public.cohorts
  for select using (true);

-- children: 내 아이 또는 코치
create policy children_select on public.children
  for select using (parent_id = public.current_app_user() or public.current_app_is_coach());
create policy children_coach_write on public.children
  for all using (public.current_app_is_coach()) with check (public.current_app_is_coach());

-- enrollments: 내 아이의 것 또는 코치
create policy enrollments_select on public.enrollments
  for select using (public.current_app_is_coach() or public.owns_child(child_id));

-- missions: 공개 읽기 (마스터)
create policy missions_select on public.missions
  for select using (true);

-- mission_progress: 내 아이 또는 코치 (읽기·쓰기 = 부모 또는 코치)
create policy mp_select on public.mission_progress
  for select using (public.current_app_is_coach() or public.owns_child(child_id));
create policy mp_write on public.mission_progress
  for all
  using (public.current_app_is_coach() or public.owns_child(child_id))
  with check (public.current_app_is_coach() or public.owns_child(child_id));

-- letters: 1편은 누구나, 2~10편은 참여자(또는 코치)만
create policy letters_select on public.letters
  for select using (week = 1 or public.is_enrolled_parent() or public.current_app_is_coach());

-- coach_notes: 내 아이 또는 코치 읽기 / 작성·수정은 코치만
create policy cn_select on public.coach_notes
  for select using (public.current_app_is_coach() or public.owns_child(child_id));
create policy cn_insert on public.coach_notes
  for insert with check (public.current_app_is_coach());
create policy cn_update on public.coach_notes
  for update using (public.current_app_is_coach()) with check (public.current_app_is_coach());

-- articles: 누구나, 단 locked=true 는 참여자(또는 코치)만
create policy articles_select on public.articles
  for select using (locked = false or public.is_enrolled_parent() or public.current_app_is_coach());

-- contents: 누구나 읽기
create policy contents_select on public.contents
  for select using (true);

-- ───────────────── 접근 RPC (토큰 기반, 현재 단계) ─────────────────
-- 현재는 JWT 클레임을 발급하지 않으므로, 앱은 토큰을 직접 받는 SECURITY DEFINER
-- RPC로 데이터에 접근한다. RPC 내부에서 권한을 검증하므로 안전하다.
-- 위 RLS 정책은 (Auth/JWT 전환 후) 직접 테이블 접근으로 옮겨갈 때의 목표 상태다.

-- 링크 토큰으로 사용자 식별 (앱 진입 시 호출)
create or replace function public.login_with_token(p_token uuid)
returns table (user_id uuid, role text, name text)
language sql stable security definer set search_path = public as $$
  select id, role, name from public.users where access_token = p_token;
$$;

-- 부모: 내 아이 목록 + 현재 주차 + 완료 수
create or replace function public.parent_children(p_token uuid)
returns table (child_id uuid, name text, age int, current_week int, done_count int)
language sql stable security definer set search_path = public as $$
  select c.id, c.name, c.age,
         coalesce(e.current_week, 0),
         (select count(*)::int from public.mission_progress mp
            where mp.child_id = c.id and mp.status = 'done')
  from public.users u
  join public.children c on c.parent_id = u.id
  left join public.enrollments e on e.child_id = c.id
  where u.access_token = p_token and u.role = 'parent'
  order by c.created_at;
$$;

-- 코치: 전체 아이 + 완료/대기(한마디 미작성) 수
create or replace function public.coach_children(p_token uuid)
returns table (child_id uuid, name text, age int, current_week int, done_count int, pending_count int)
language sql stable security definer set search_path = public as $$
  select c.id, c.name, c.age, coalesce(e.current_week, 0),
    (select count(*)::int from public.mission_progress mp
       where mp.child_id = c.id and mp.status = 'done'),
    (select count(*)::int from public.mission_progress mp
       where mp.child_id = c.id and mp.status = 'done'
         and not exists (select 1 from public.coach_notes cn
                         where cn.child_id = c.id and cn.week = mp.week))
  from public.users u
  cross join public.children c
  left join public.enrollments e on e.child_id = c.id
  where u.access_token = p_token and u.role = 'coach'
  order by c.created_at;
$$;

-- 아이 타임라인 (주차별 미션·수행·코치 한마디) — 부모(본인 아이) 또는 코치만
create or replace function public.child_timeline(p_token uuid, p_child uuid)
returns table (week int, mission_title text, status text, completed_at timestamptz, coach_note text)
language sql stable security definer set search_path = public as $$
  select m.week, m.title, coalesce(mp.status, 'todo'), mp.completed_at, cn.body
  from public.missions m
  left join public.mission_progress mp on mp.child_id = p_child and mp.week = m.week
  left join public.coach_notes cn on cn.child_id = p_child and cn.week = m.week
  where exists (
    select 1 from public.users u
    where u.access_token = p_token
      and (u.role = 'coach'
           or exists (select 1 from public.children c
                      where c.id = p_child and c.parent_id = u.id))
  )
  order by m.week;
$$;

-- 미션 완료 체크 — 해당 아이의 부모 또는 코치만
create or replace function public.complete_mission(p_token uuid, p_child uuid, p_week int)
returns void
language plpgsql security definer set search_path = public as $$
declare v_user uuid; v_role text;
begin
  select id, role into v_user, v_role from public.users where access_token = p_token;
  if v_user is null then raise exception 'invalid token'; end if;
  if v_role <> 'coach'
     and not exists (select 1 from public.children where id = p_child and parent_id = v_user) then
    raise exception 'not authorized';
  end if;
  insert into public.mission_progress (child_id, week, status, completed_at)
  values (p_child, p_week, 'done', now())
  on conflict (child_id, week) do update set status = 'done', completed_at = now();
end;
$$;

-- 코치 한마디 작성 — 코치만
create or replace function public.upsert_coach_note(p_token uuid, p_child uuid, p_week int, p_body text)
returns void
language plpgsql security definer set search_path = public as $$
declare v_role text;
begin
  select role into v_role from public.users where access_token = p_token;
  if v_role is distinct from 'coach' then raise exception 'coach only'; end if;
  insert into public.coach_notes (child_id, week, body) values (p_child, p_week, p_body);
end;
$$;

-- ───────────────────── 권한 부여 ─────────────────────
-- RLS가 행을 거르므로 anon/authenticated 에 select 허용. 쓰기는 RPC로만.
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;

revoke all on function public.login_with_token(uuid)              from public;
revoke all on function public.parent_children(uuid)              from public;
revoke all on function public.coach_children(uuid)               from public;
revoke all on function public.child_timeline(uuid, uuid)         from public;
revoke all on function public.complete_mission(uuid, uuid, int)  from public;
revoke all on function public.upsert_coach_note(uuid, uuid, int, text) from public;

grant execute on function public.login_with_token(uuid)              to anon, authenticated;
grant execute on function public.parent_children(uuid)              to anon, authenticated;
grant execute on function public.coach_children(uuid)               to anon, authenticated;
grant execute on function public.child_timeline(uuid, uuid)         to anon, authenticated;
grant execute on function public.complete_mission(uuid, uuid, int)  to anon, authenticated;
grant execute on function public.upsert_coach_note(uuid, uuid, int, text) to anon, authenticated;
