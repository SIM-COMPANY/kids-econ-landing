// ════════════════════════════════════════════════════════════
// Supabase 클라이언트 + 링크 토큰 로그인 헬퍼
//
// 인증: 링크 토큰 방식 (비밀번호 없음 · 프로토타입)
//   · URL /p/{token}(부모), /coach/{token}(코치) 에서 토큰을 꺼내
//     login_with_token RPC 로 사용자를 식별한다.
//   ⚠️ 토큰 = 비밀번호. 링크가 유출되면 접근됨. 운영 전 Auth 전환 필수.
//
// 향후 Auth(이메일/카카오/구글) 전환 시:
//   · supabase.auth.signInWith* 로 로그인 → 세션 JWT 사용
//   · tokenFromPath / loginWithToken 제거, getCurrentUser 를 auth 세션 기반으로 교체
//   · DB의 current_app_user() 를 auth.uid() 매핑으로 바꾸면 RLS 그대로 동작
// ════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

// 키는 .env (VITE_ 접두사 필수 — Vite 노출 규칙). 절대 하드코딩 금지.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase =
  url && anonKey ? createClient(url, anonKey) : null;

export type AppRole = 'parent' | 'coach';
export type AppUser = { user_id: string; role: AppRole; name: string };

// URL 경로에서 접근 토큰 추출: /p/{uuid} 또는 /coach/{uuid}
export function tokenFromPath(): { token: string; role: AppRole } | null {
  const m = window.location.pathname.match(
    /\/(p|coach)\/([0-9a-fA-F-]{36})/
  );
  if (!m) return null;
  return { token: m[2], role: m[1] === 'coach' ? 'coach' : 'parent' };
}

// 토큰으로 사용자 식별 (앱 진입 시 1회 호출)
export async function loginWithToken(token: string): Promise<AppUser | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc('login_with_token', { p_token: token });
  if (error || !data || (data as AppUser[]).length === 0) return null;
  return (data as AppUser[])[0];
}

// ── 데이터 접근 (토큰 기반 RPC) ─────────────────────────────
// 현재 단계에서는 RLS 대신 SECURITY DEFINER RPC 로 접근(내부에서 권한 검증).
// Auth 전환 후에는 supabase.from('...').select() 직접 접근으로 옮길 수 있음.

export async function parentChildren(token: string) {
  if (!supabase) return [];
  const { data } = await supabase.rpc('parent_children', { p_token: token });
  return data ?? [];
}

export async function coachChildren(token: string) {
  if (!supabase) return [];
  const { data } = await supabase.rpc('coach_children', { p_token: token });
  return data ?? [];
}

export async function childTimeline(token: string, childId: string) {
  if (!supabase) return [];
  const { data } = await supabase.rpc('child_timeline', { p_token: token, p_child: childId });
  return data ?? [];
}

export async function completeMission(token: string, childId: string, week: number) {
  if (!supabase) return;
  await supabase.rpc('complete_mission', { p_token: token, p_child: childId, p_week: week });
}

// 부모 주간 기록(텍스트) 저장
export async function saveParentRecord(token: string, childId: string, week: number, text: string) {
  if (!supabase) return;
  await supabase.rpc('save_parent_record', { p_token: token, p_child: childId, p_week: week, p_text: text });
}

// child_timeline 한 행
export type TimelineRow = {
  week: number;
  mission_title: string;
  status: 'todo' | 'done';
  completed_at: string | null;
  parent_text: string | null;
  coach_note: string | null;
};
export type ParentChild = {
  child_id: string;
  name: string;
  age: number;
  current_week: number;
  done_count: number;
};

export async function upsertCoachNote(token: string, childId: string, week: number, body: string) {
  if (!supabase) return;
  await supabase.rpc('upsert_coach_note', { p_token: token, p_child: childId, p_week: week, p_body: body });
}

// TODO(프론트 연결): VisitNote / ContentTab 의 mock 데이터를 위 헬퍼 호출로 교체.
//   - mock/notes.ts, mock/content.ts → 위 RPC 결과로 대체
//   - 진입 시 tokenFromPath() → loginWithToken() 으로 세션 잡기
//   - .env 에 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 채우면 동작
