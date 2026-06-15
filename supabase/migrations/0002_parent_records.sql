-- ════════════════════════════════════════════════════════════
-- 0002 — 부모 주간 기록(텍스트) 추가
-- 결정: 텍스트만 먼저. 사진(Storage)은 추후.
--   · mission_progress.parent_text : 부모가 그 주에 남기는 한 줄 기록
--   · child_timeline 에 parent_text 포함하도록 교체
--   · save_parent_record RPC 추가 (해당 아이의 부모 또는 코치만)
-- 주의: '게임 완료(status=done)' 와 '부모 기록(parent_text)' 은 별개.
--   - 게임 미션 완료 → complete_mission (status='done')
--   - 부모 한마디 기록 → save_parent_record (parent_text), status 는 건드리지 않음
-- ════════════════════════════════════════════════════════════

alter table public.mission_progress
  add column if not exists parent_text text;

-- child_timeline: 반환 컬럼이 바뀌므로 drop 후 재생성
drop function if exists public.child_timeline(uuid, uuid);

create function public.child_timeline(p_token uuid, p_child uuid)
returns table (
  week int,
  mission_title text,
  status text,
  completed_at timestamptz,
  parent_text text,
  coach_note text
)
language sql stable security definer set search_path = public as $$
  select m.week, m.title, coalesce(mp.status, 'todo'),
         mp.completed_at, mp.parent_text, cn.body
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

-- 부모 주간 기록 저장 — 해당 아이의 부모 또는 코치만. status 는 변경하지 않음.
create or replace function public.save_parent_record(p_token uuid, p_child uuid, p_week int, p_text text)
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
  insert into public.mission_progress (child_id, week, parent_text)
  values (p_child, p_week, p_text)
  on conflict (child_id, week) do update set parent_text = excluded.parent_text;
end;
$$;

-- 권한 재부여 (child_true 재생성·신규 함수)
revoke all on function public.child_timeline(uuid, uuid)               from public;
revoke all on function public.save_parent_record(uuid, uuid, int, text) from public;
grant execute on function public.child_timeline(uuid, uuid)               to anon, authenticated;
grant execute on function public.save_parent_record(uuid, uuid, int, text) to anon, authenticated;
