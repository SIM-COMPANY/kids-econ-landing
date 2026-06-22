// ════════════════════════════════════════════════════════════
// 코치 대시보드 — Supabase 실연결 버전
// 진입: /coach/{access_token}  → App 에서 이 컴포넌트로 라우팅
// 데이터: RPC 경유 (loginWithToken / coachChildren / childTimeline /
//         upsertCoachNote)
//
// 화면 구조:
//   ① 명단 뷰  — 코치가 맡은 아이들 목록 (한마디 대기 건수 뱃지)
//   ② 상세 뷰  — 아이 선택 시 방문노트 타임라인 + 완료 주차에 한마디 작성
//
// ParentLive 패턴을 복제 — 검증된 토큰/RPC 흐름 그대로.
// ════════════════════════════════════════════════════════════

import { useEffect, useState, useCallback } from 'react';
import { C, T, S } from '../App';
import {
  supabase,
  loginWithToken,
  coachChildren,
  childTimeline,
  upsertCoachNote,
  type AppUser,
  type CoachChild,
  type TimelineRow,
} from '../lib/supabase';

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: `${S.xxl} ${S.md}`, textAlign: 'center', color: C.textMuted }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', fontSize: T.bodySm, lineHeight: 1.7 }}>
        {children}
      </div>
    </div>
  );
}

export default function CoachLive({ token }: { token: string }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [children, setChildren] = useState<CoachChild[]>([]);
  const [selected, setSelected] = useState<CoachChild | null>(null);
  const [timeline, setTimeline] = useState<TimelineRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [savingWeek, setSavingWeek] = useState<number | null>(null);

  // 명단 로드
  const loadRoster = useCallback(async () => {
    setChildren((await coachChildren(token)) as CoachChild[]);
  }, [token]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const u = await loginWithToken(token);
    if (!u) { setError('유효하지 않은 링크예요. 받으신 링크를 다시 확인해 주세요.'); setLoading(false); return; }
    if (u.role !== 'coach') { setError('코치 전용 화면이에요.'); setLoading(false); return; }
    setUser(u);
    await loadRoster();
    setLoading(false);
  }, [token, loadRoster]);

  useEffect(() => { load(); }, [load]);

  const openChild = async (c: CoachChild) => {
    setSelected(c);
    setDetailLoading(true);
    setDrafts({});
    setTimeline((await childTimeline(token, c.child_id)) as TimelineRow[]);
    setDetailLoading(false);
  };

  const backToRoster = async () => {
    setSelected(null);
    setTimeline([]);
    await loadRoster(); // 대기 건수 갱신
  };

  const onSaveNote = async (week: number) => {
    const body = (drafts[week] ?? '').trim();
    if (!body || !selected) return;
    setSavingWeek(week);
    await upsertCoachNote(token, selected.child_id, week, body);
    setTimeline((await childTimeline(token, selected.child_id)) as TimelineRow[]);
    setDrafts((d) => ({ ...d, [week]: '' }));
    setSavingWeek(null);
  };

  // env 미설정 → 안내
  if (!supabase) {
    return (
      <Centered>
        Supabase 연결이 설정되지 않았어요.<br />
        <code>.env</code> 에 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 를 채워주세요.
      </Centered>
    );
  }
  if (loading) return <Centered>불러오는 중…</Centered>;
  if (error) return <Centered>{error}</Centered>;

  // ── ② 상세 뷰 ──────────────────────────────────────────────
  if (selected) {
    const weekLabel = selected.current_week === 0 ? 'OT 주차' : `${selected.current_week}주차`;
    return (
      <div style={{ padding: `${S.xl} ${S.md}` }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <button
            onClick={backToRoster}
            style={{
              background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer',
              fontSize: T.bodySm, padding: 0, marginBottom: S.md, letterSpacing: '-0.01em',
            }}
          >
            ← 명단으로
          </button>

          {/* 아이 헤더 */}
          <div style={{ marginBottom: S.lg }}>
            <h1 style={{ fontSize: T.h1, fontWeight: 900, color: C.dark, lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: '6px' }}>
              {selected.name} <span style={{ fontSize: T.h3, fontWeight: 700, color: C.textMuted }}>({selected.age}세)</span>
            </h1>
            <p style={{ fontSize: T.bodySm, color: C.textMuted, letterSpacing: '-0.01em' }}>
              1기 · <span style={{ color: C.primary, fontWeight: 700 }}>{weekLabel}</span> · 완료 {selected.done_count}/10
            </p>
          </div>

          {detailLoading ? (
            <Centered>불러오는 중…</Centered>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
              {[...timeline].reverse().map((r) => {
                const done = r.status === 'done';
                return (
                  <div key={r.week} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '14px', padding: S.md }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: S.sm, marginBottom: '6px' }}>
                      <span style={{ fontSize: T.small, fontWeight: 800, color: C.dark }}>
                        {r.week === 0 ? 'OT' : `${r.week}주`}
                      </span>
                      <span style={{
                        fontSize: T.caption, fontWeight: 700, padding: '2px 8px', borderRadius: '999px',
                        color: done ? C.primary : C.textMuted,
                        background: done ? C.orange10 : C.surface,
                      }}>
                        {done ? '완료' : '예정'}
                      </span>
                      <span style={{ fontSize: T.bodySm, fontWeight: 700, color: C.dark, letterSpacing: '-0.01em' }}>
                        {r.mission_title}
                      </span>
                    </div>

                    {r.parent_text && (
                      <p style={{ fontSize: T.bodySm, color: C.textSub, lineHeight: 1.6, letterSpacing: '-0.01em', marginTop: '4px' }}>
                        📝 {r.parent_text}
                      </p>
                    )}

                    {/* 완료 주차에만 코치 한마디 영역 */}
                    {done && (
                      <div style={{ marginTop: S.sm }}>
                        {r.coach_note && (
                          <p style={{ fontSize: T.bodySm, color: C.dark, lineHeight: 1.6, letterSpacing: '-0.01em', marginBottom: S.xs, paddingLeft: S.sm, borderLeft: `3px solid ${C.primary}` }}>
                            👴 {r.coach_note}
                          </p>
                        )}
                        <textarea
                          value={drafts[r.week] ?? ''}
                          onChange={(e) => setDrafts((d) => ({ ...d, [r.week]: e.target.value }))}
                          placeholder={r.coach_note ? '한마디 수정하기…' : '엉클조 한마디를 남겨주세요…'}
                          rows={2}
                          style={{
                            width: '100%', padding: '10px 12px', borderRadius: '10px',
                            border: `1.5px solid ${C.border}`, fontSize: '15px', fontFamily: 'inherit',
                            color: C.text, outline: 'none', resize: 'vertical', letterSpacing: '-0.01em',
                          }}
                        />
                        <button
                          onClick={() => onSaveNote(r.week)}
                          disabled={savingWeek === r.week || !(drafts[r.week] ?? '').trim()}
                          style={{
                            width: '100%', marginTop: S.xs, padding: '11px', borderRadius: '10px',
                            background: (drafts[r.week] ?? '').trim() ? C.primary : C.surface,
                            color: (drafts[r.week] ?? '').trim() ? '#fff' : C.textMuted,
                            border: 'none', fontSize: T.bodySm, fontWeight: 700,
                            cursor: (drafts[r.week] ?? '').trim() ? 'pointer' : 'default', letterSpacing: '-0.01em',
                          }}
                        >
                          {savingWeek === r.week ? '저장 중…' : r.coach_note ? '한마디 수정' : '한마디 남기기'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── ① 명단 뷰 ──────────────────────────────────────────────
  return (
    <div style={{ padding: `${S.xl} ${S.md}` }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ marginBottom: S.lg }}>
          <h1 style={{ fontSize: T.h1, fontWeight: 900, color: C.dark, lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: '6px' }}>
            {user?.name} 선생님,
          </h1>
          <p style={{ fontSize: T.bodySm, color: C.textMuted, letterSpacing: '-0.01em' }}>
            맡으신 아이 {children.length}명 · 한마디 대기{' '}
            <span style={{ color: C.primary, fontWeight: 700 }}>
              {children.reduce((s, c) => s + c.pending_count, 0)}건
            </span>
          </p>
        </div>

        {children.length === 0 ? (
          <Centered>아직 배정된 아이가 없어요.</Centered>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
            {children.map((c) => (
              <button
                key={c.child_id}
                onClick={() => openChild(c)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', textAlign: 'left', cursor: 'pointer',
                  background: C.bg, border: `1px solid ${C.border}`, borderRadius: '14px', padding: S.md,
                }}
              >
                <div>
                  <p style={{ fontSize: T.body, fontWeight: 800, color: C.dark, letterSpacing: '-0.01em', marginBottom: '2px' }}>
                    {c.name} <span style={{ fontSize: T.bodySm, fontWeight: 600, color: C.textMuted }}>{c.age}세</span>
                  </p>
                  <p style={{ fontSize: T.small, color: C.textMuted, letterSpacing: '-0.01em' }}>
                    {c.current_week === 0 ? 'OT 주차' : `${c.current_week}주차`} · 완료 {c.done_count}/10
                  </p>
                </div>
                {c.pending_count > 0 ? (
                  <span style={{
                    fontSize: T.caption, fontWeight: 800, padding: '5px 10px', borderRadius: '999px',
                    color: '#fff', background: C.primary, whiteSpace: 'nowrap',
                  }}>
                    한마디 {c.pending_count}
                  </span>
                ) : (
                  <span style={{ fontSize: T.caption, fontWeight: 700, color: C.textMuted, whiteSpace: 'nowrap' }}>
                    완료 ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
