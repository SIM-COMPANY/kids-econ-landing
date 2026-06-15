// ════════════════════════════════════════════════════════════
// 부모 대시보드 — Supabase 실연결 버전 (검증용 1화면)
// 진입: /p/{access_token}  → App 에서 이 컴포넌트로 라우팅
// 데이터: RPC 경유 (loginWithToken / parentChildren / childTimeline /
//         completeMission / saveParentRecord)
//
// ※ 기존 마이 탭의 mock VisitNote 는 그대로 둠(오프라인 데모용).
//   이 화면이 실연결 패턴을 검증하는 곳. 패턴 확정되면 나머지로 확장.
// ════════════════════════════════════════════════════════════

import { useEffect, useState, useCallback } from 'react';
import { C, T, S } from '../App';
import {
  supabase,
  loginWithToken,
  parentChildren,
  childTimeline,
  completeMission,
  saveParentRecord,
  type AppUser,
  type ParentChild,
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

export default function ParentLive({ token }: { token: string }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [child, setChild] = useState<ParentChild | null>(null);
  const [timeline, setTimeline] = useState<TimelineRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);

  const loadTimeline = useCallback(async (childId: string) => {
    setTimeline((await childTimeline(token, childId)) as TimelineRow[]);
  }, [token]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const u = await loginWithToken(token);
    if (!u) { setError('유효하지 않은 링크예요. 받으신 링크를 다시 확인해 주세요.'); setLoading(false); return; }
    if (u.role !== 'parent') { setError('부모 전용 화면이에요.'); setLoading(false); return; }
    setUser(u);
    const kids = (await parentChildren(token)) as ParentChild[];
    const first = kids[0] ?? null;
    setChild(first);
    if (first) await loadTimeline(first.child_id);
    setLoading(false);
  }, [token, loadTimeline]);

  useEffect(() => { load(); }, [load]);

  // env 미설정 → 안내 (supabase 클라이언트가 null)
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
  if (!child) return <Centered>{user?.name}님, 아직 등록된 아이가 없어요.</Centered>;

  const weekLabel = child.current_week === 0 ? 'OT 주차' : `${child.current_week}주차`;
  const current = timeline.find((r) => r.week === child.current_week);

  const onComplete = async () => {
    await completeMission(token, child.child_id, child.current_week);
    await loadTimeline(child.child_id);
  };
  const onSaveRecord = async () => {
    if (!draft.trim()) return;
    setSaving(true);
    await saveParentRecord(token, child.child_id, child.current_week, draft.trim());
    setDraft('');
    await loadTimeline(child.child_id);
    setSaving(false);
  };

  return (
    <div style={{ padding: `${S.xl} ${S.md}` }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        {/* 인사 헤더 */}
        <div style={{ marginBottom: S.lg }}>
          <h1 style={{ fontSize: T.h1, fontWeight: 900, color: C.dark, lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: '6px' }}>
            {child.name} 엄마님,
          </h1>
          <p style={{ fontSize: T.bodySm, color: C.textMuted, letterSpacing: '-0.01em' }}>
            1기 · <span style={{ color: C.primary, fontWeight: 700 }}>{weekLabel}</span> · 완료 {child.done_count}/10
          </p>
        </div>

        {/* 이번 주 미션 */}
        <div style={{ background: C.orange20, borderRadius: '20px', padding: S.lg, marginBottom: S.md }}>
          <p style={{ fontSize: T.small, fontWeight: 800, color: C.primary, letterSpacing: '0.06em', marginBottom: '6px' }}>
            🎯 이번 주 미션
          </p>
          <p style={{ fontSize: T.h3, fontWeight: 800, color: C.dark, letterSpacing: '-0.02em', lineHeight: 1.4, marginBottom: S.md }}>
            {weekLabel}{current ? ` · ${current.mission_title}` : ''}
          </p>

          <button
            onClick={onComplete}
            disabled={current?.status === 'done'}
            style={{
              width: '100%', padding: '15px', borderRadius: '12px', border: 'none',
              background: current?.status === 'done' ? C.surface : C.primary,
              color: current?.status === 'done' ? C.textMuted : '#fff',
              fontSize: T.body, fontWeight: 800, letterSpacing: '-0.01em',
              cursor: current?.status === 'done' ? 'default' : 'pointer', marginBottom: S.sm,
            }}
          >
            {current?.status === 'done' ? '✓ 이번 주 미션 완료' : '미션 완료 표시'}
          </button>

          {/* 한마디 남기기 (부모 기록) */}
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={current?.parent_text ? `남긴 기록: ${current.parent_text}` : '이번 주 우리 아이 이야기를 한 줄로…'}
            rows={2}
            style={{
              width: '100%', padding: '12px 14px', borderRadius: '12px',
              border: `1.5px solid ${C.border}`, fontSize: '15px', fontFamily: 'inherit',
              color: C.text, outline: 'none', resize: 'vertical', letterSpacing: '-0.01em',
            }}
          />
          <button
            onClick={onSaveRecord}
            disabled={saving || !draft.trim()}
            style={{
              width: '100%', marginTop: S.xs, padding: '13px', borderRadius: '12px',
              background: C.bg, color: C.dark, border: `1.5px solid ${C.border}`,
              fontSize: T.bodySm, fontWeight: 700, cursor: saving ? 'default' : 'pointer', letterSpacing: '-0.01em',
            }}
          >
            {saving ? '저장 중…' : '한마디 남기기'}
          </button>
        </div>

        {/* 방문노트 타임라인 */}
        <p style={{ fontSize: T.h3, fontWeight: 800, color: C.dark, letterSpacing: '-0.02em', margin: `${S.xl} 0 ${S.md}` }}>
          {child.name}의 방문노트
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
          {[...timeline].reverse().map((r) => (
            <div key={r.week} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '14px', padding: S.md }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: S.sm, marginBottom: '6px' }}>
                <span style={{ fontSize: T.small, fontWeight: 800, color: C.dark }}>
                  {r.week === 0 ? 'OT' : `${r.week}주`}
                </span>
                <span style={{
                  fontSize: T.caption, fontWeight: 700, padding: '2px 8px', borderRadius: '999px',
                  color: r.status === 'done' ? C.primary : C.textMuted,
                  background: r.status === 'done' ? C.orange10 : C.surface,
                }}>
                  {r.status === 'done' ? '완료' : '예정'}
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
              {r.coach_note && (
                <p style={{ fontSize: T.bodySm, color: C.dark, lineHeight: 1.6, letterSpacing: '-0.01em', marginTop: '6px', paddingLeft: S.sm, borderLeft: `3px solid ${C.primary}` }}>
                  👴 {r.coach_note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
