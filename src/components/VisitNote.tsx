import { useState } from 'react';
import { C, T, S } from '../App';
import {
  MOCK_CHILDREN,
  MOCK_NOTES,
  COHORT_WEEKS,
  LAST_WEEK,
  LIBRARY,
  WEEK_CONTENT,
  gameUrl,
  getWeekContent,
  getLetterByWeek,
  getNotesByChild,
  getChildStats,
  getChildById,
  getPendingCoachNotes,
} from '../mock/notes';
import type { Child, Note } from '../mock/notes';

// ─── 메인 컴포넌트 ─────────────────────────────

type Mode = 'login' | 'parent' | 'coach';

export default function VisitNote() {
  const [mode, setMode] = useState<Mode>('login');
  const [currentChildId, setCurrentChildId] = useState<string | null>(null);
  const [coachSelectedChildId, setCoachSelectedChildId] = useState<string | null>(null);
  // 모든 노트를 메모리에. parent·coach 둘 다 같은 pool 사용 (수정 즉시 반영)
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);

  // ─── 모드 전환 ───
  const loginAsParent = (childId: string) => {
    setMode('parent');
    setCurrentChildId(childId);
  };
  const loginAsCoach = () => {
    setMode('coach');
    setCoachSelectedChildId(null);
  };
  const logout = () => {
    setMode('login');
    setCurrentChildId(null);
    setCoachSelectedChildId(null);
  };

  // ─── 데이터 변경 핸들러 ───
  const saveParentRecord = (noteId: string, text: string, photoUrl?: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId
          ? { ...n, parentText: text, photoUrl: photoUrl || n.photoUrl }
          : n
      )
    );
  };

  const saveCoachComment = (noteId: string, comment: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId ? { ...n, coachComment: comment } : n
      )
    );
  };

  // ─── 화면 분기 ───
  if (mode === 'login') {
    return <LoginScreen onLoginParent={loginAsParent} onLoginCoach={loginAsCoach} />;
  }

  if (mode === 'coach') {
    return (
      <CoachMode
        selectedChildId={coachSelectedChildId}
        onSelectChild={setCoachSelectedChildId}
        notes={notes}
        onSaveCoachComment={saveCoachComment}
        onLogout={logout}
      />
    );
  }

  // parent mode
  const child = getChildById(currentChildId!);
  if (!child) {
    return <LoginScreen onLoginParent={loginAsParent} onLoginCoach={loginAsCoach} />;
  }

  return (
    <ParentMode
      child={child}
      notes={notes}
      onSaveRecord={saveParentRecord}
      onLogout={logout}
    />
  );
}

// ─── 로그인 화면 ──────────────────────────────

function LoginScreen({
  onLoginParent,
  onLoginCoach,
}: {
  onLoginParent: (id: string) => void;
  onLoginCoach: () => void;
}) {
  return (
    <div style={{ padding: `${S.xl} ${S.md}` }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ marginBottom: S.xl, textAlign: 'center' }}>
          <p style={{ fontSize: '48px', marginBottom: S.sm }}>👴</p>
          <h1 style={{
            fontSize: T.h1,
            fontWeight: 900,
            color: C.dark,
            lineHeight: 1.3,
            letterSpacing: '-0.02em',
            marginBottom: S.sm,
          }}>
            방문노트 시작하기
          </h1>
          <p style={{
            fontSize: T.bodySm,
            color: C.textSub,
            lineHeight: 1.7,
            letterSpacing: '-0.01em',
          }}>
            아이를 선택하면 그 아이의 노트만 보입니다.<br />
            엉클조와 우리 가족만의 1:1 공간이에요.
          </p>
        </div>

        {/* 부모 카드 3개 */}
        <p style={{
          fontSize: T.small,
          fontWeight: 800,
          color: C.textMuted,
          marginBottom: S.sm,
          letterSpacing: '0.06em',
        }}>
          부모 · 아이로 들어가기
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.md, marginBottom: S.xl }}>
          {MOCK_CHILDREN.map((child) => {
            const childNotes = getNotesByChild(child.id, MOCK_NOTES);
            const stats = getChildStats(childNotes);
            return (
              <button
                key={child.id}
                onClick={() => onLoginParent(child.id)}
                style={{
                  background: C.bg,
                  border: `1.5px solid ${C.border}`,
                  borderRadius: '20px',
                  padding: S.lg,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'border-color 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: S.md,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = C.primary;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: C.orange10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  flexShrink: 0,
                }}>
                  {child.avatarEmoji}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: T.h3,
                    fontWeight: 800,
                    color: C.dark,
                    letterSpacing: '-0.02em',
                    marginBottom: '4px',
                  }}>
                    {child.name} ({child.age}세)
                  </p>
                  <p style={{
                    fontSize: T.small,
                    color: C.textMuted,
                    marginBottom: '6px',
                    letterSpacing: '-0.01em',
                  }}>
                    {child.cohort} · 현재 {child.currentWeek === 0 ? 'OT' : child.currentWeek + '주차'}
                  </p>
                  <p style={{
                    fontSize: T.small,
                    color: C.primary,
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                  }}>
                    완료 {stats.completedMissions}/{stats.totalMissions} · 한마디 {stats.coachComments}건
                  </p>
                </div>
                <span style={{ fontSize: '20px', color: C.textMuted }}>→</span>
              </button>
            );
          })}
        </div>

        {/* 엉클조 코치 카드 */}
        <p style={{
          fontSize: T.small,
          fontWeight: 800,
          color: C.textMuted,
          marginBottom: S.sm,
          letterSpacing: '0.06em',
        }}>
          코치 (관리자)
        </p>
        <button
          onClick={onLoginCoach}
          style={{
            width: '100%',
            background: C.dark,
            border: 'none',
            borderRadius: '20px',
            padding: S.lg,
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: S.md,
            color: '#fff',
          }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: C.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            flexShrink: 0,
          }}>
            👴
          </div>
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: T.h3,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '4px',
            }}>
              엉클조 (코치)
            </p>
            <p style={{
              fontSize: T.small,
              opacity: 0.7,
              marginBottom: '6px',
              letterSpacing: '-0.01em',
            }}>
              모든 아이의 노트를 보고 한마디를 남깁니다
            </p>
            <p style={{
              fontSize: T.small,
              color: C.primary,
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}>
              한마디 대기 {getPendingCoachNotes(MOCK_NOTES).length}건
            </p>
          </div>
          <span style={{ fontSize: '20px', opacity: 0.7 }}>→</span>
        </button>

        <p style={{
          marginTop: S.xl,
          fontSize: T.small,
          color: C.textMuted,
          lineHeight: 1.7,
          letterSpacing: '-0.01em',
          textAlign: 'center',
        }}>
          ※ 프로토타입입니다. 가짜 로그인이며,<br />
          실제 인증·DB는 연결되어 있지 않아요.
        </p>
      </div>
    </div>
  );
}

// ─── 부모 모드 ────────────────────────────────

function ParentMode({
  child,
  notes,
  onSaveRecord,
  onLogout,
}: {
  child: Child;
  notes: Note[];
  onSaveRecord: (noteId: string, text: string, photoUrl?: string) => void;
  onLogout: () => void;
}) {
  const childNotes = getNotesByChild(child.id, notes);
  const stats = getChildStats(childNotes);

  // 미래 주차 (currentWeek+1 ~ 10) — 최신 위 정렬
  const upcomingWeeks: number[] = [];
  for (let w = child.currentWeek + 1; w <= LAST_WEEK; w++) {
    upcomingWeeks.push(w);
  }
  upcomingWeeks.reverse();

  const weekLabel = child.currentWeek === 0 ? 'OT 주차' : `${child.currentWeek}주차`;
  const scrollToNotes = () => {
    document.getElementById('parent-notes')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ padding: `${S.xl} ${S.md}` }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        {/* 1. 인사 헤더 */}
        <div style={{ marginBottom: S.lg }}>
          <h1 style={{
            fontSize: T.h1,
            fontWeight: 900,
            color: C.dark,
            lineHeight: 1.3,
            letterSpacing: '-0.02em',
            marginBottom: '6px',
          }}>
            {child.name} 엄마님,
          </h1>
          <p style={{
            fontSize: T.bodySm,
            color: C.textMuted,
            letterSpacing: '-0.01em',
          }}>
            {child.cohort} · <span style={{ color: C.primary, fontWeight: 700 }}>{weekLabel}</span>예요
          </p>
        </div>

        {/* 2. 이번 주 미션 (최상단) */}
        <ThisWeekMission child={child} onLeaveNote={scrollToNotes} />

        {/* 3. 이번 주 콘텐츠 */}
        <ThisWeekContent week={child.currentWeek} />

        {/* 4. 지식·동화 라이브러리 */}
        <LibraryStrip />

        {/* 5. 방문노트 (누적 요약 + 주차별 타임라인) */}
        <div id="parent-notes" style={{ marginTop: S.xl }}>
          <p style={{
            fontSize: T.h3,
            fontWeight: 800,
            color: C.dark,
            marginBottom: S.md,
            letterSpacing: '-0.02em',
          }}>
            {child.avatarEmoji} {child.name}의 방문노트
          </p>

          {/* 누적 요약 */}
          <StatsBox childName={child.name} stats={stats} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: S.md }}>
            {/* 예정 카드 (미래 주차) */}
            {upcomingWeeks.map((w) => (
              <UpcomingCard key={`upcoming-${w}`} week={w} />
            ))}

            {/* 도래한 노트 */}
            {childNotes.map((n) => (
              <NoteCard
                key={n.id}
                note={n}
                isCoach={false}
                onSaveParent={onSaveRecord}
              />
            ))}

            {childNotes.length === 0 && upcomingWeeks.length === 0 && (
              <div style={{
                padding: S.xl,
                background: C.bg,
                borderRadius: '16px',
                textAlign: 'center',
                color: C.textMuted,
                fontSize: T.bodySm,
              }}>
                아직 노트가 없어요.
              </div>
            )}
          </div>
        </div>

        {/* 하단 로그아웃 */}
        <div style={{ marginTop: S.xxl, textAlign: 'center' }}>
          <button
            onClick={onLogout}
            style={{
              background: 'transparent',
              color: C.textMuted,
              border: `1px solid ${C.border}`,
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: T.bodySm,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
            }}
          >
            다른 아이로 전환
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 코치 모드 ────────────────────────────────

function CoachMode({
  selectedChildId,
  onSelectChild,
  notes,
  onSaveCoachComment,
  onLogout,
}: {
  selectedChildId: string | null;
  onSelectChild: (id: string | null) => void;
  notes: Note[];
  onSaveCoachComment: (noteId: string, comment: string) => void;
  onLogout: () => void;
}) {
  // 아이 선택 안 했으면 = 코치 메인 (대기 큐 + 아이 리스트)
  if (!selectedChildId) {
    const pending = getPendingCoachNotes(notes);
    return (
      <div style={{ padding: `${S.xl} ${S.md}` }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          {/* 헤더 */}
          <div style={{
            background: C.dark,
            color: '#fff',
            borderRadius: '20px',
            padding: S.lg,
            marginBottom: S.lg,
            display: 'flex',
            alignItems: 'center',
            gap: S.md,
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: C.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}>👴</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: T.small, opacity: 0.7, marginBottom: '2px', letterSpacing: '0.04em' }}>
                COACH MODE
              </p>
              <p style={{ fontSize: T.h3, fontWeight: 800, letterSpacing: '-0.02em' }}>
                엉클조 코치 · {MOCK_CHILDREN[0]?.cohort ?? ''}
              </p>
            </div>
          </div>

          {/* 한마디 대기 큐 */}
          <div style={{
            background: C.orange10,
            borderRadius: '16px',
            padding: S.lg,
            marginBottom: S.lg,
          }}>
            <p style={{
              fontSize: T.small,
              fontWeight: 800,
              color: C.primary,
              marginBottom: '6px',
              letterSpacing: '0.08em',
            }}>
              💬 한마디 대기 큐
            </p>
            <p style={{
              fontSize: T.h3,
              fontWeight: 800,
              color: C.dark,
              marginBottom: S.md,
              letterSpacing: '-0.02em',
            }}>
              {pending.length}건 — 부모가 기다리고 있어요
            </p>
            {pending.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: S.xs }}>
                {pending.map((n) => {
                  const c = getChildById(n.childId);
                  return (
                    <button
                      key={n.id}
                      onClick={() => onSelectChild(n.childId)}
                      style={{
                        background: C.bg,
                        border: 'none',
                        borderRadius: '12px',
                        padding: S.sm,
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: S.sm,
                      }}
                    >
                      <span style={{ fontSize: '24px' }}>{c?.avatarEmoji}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontSize: T.bodySm,
                          fontWeight: 700,
                          color: C.dark,
                          letterSpacing: '-0.01em',
                        }}>
                          {c?.name} · {n.week === 0 ? 'OT' : n.week + '주차'}
                        </p>
                        <p style={{
                          fontSize: T.small,
                          color: C.textMuted,
                          letterSpacing: '-0.01em',
                          marginTop: '2px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {n.parentText}
                        </p>
                      </div>
                      <span style={{ color: C.textMuted, fontSize: '16px' }}>→</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p style={{ fontSize: T.bodySm, color: C.textMuted, letterSpacing: '-0.01em' }}>
                지금은 비어 있어요. 모든 한마디가 전달됐습니다.
              </p>
            )}
          </div>

          {/* 모든 아이 리스트 */}
          <p style={{
            fontSize: T.small,
            fontWeight: 800,
            color: C.textMuted,
            marginBottom: S.sm,
            letterSpacing: '0.06em',
          }}>
            모든 아이 ({MOCK_CHILDREN.length}명)
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
            {MOCK_CHILDREN.map((child) => {
              const cn = getNotesByChild(child.id, notes);
              const stats = getChildStats(cn);
              return (
                <button
                  key={child.id}
                  onClick={() => onSelectChild(child.id)}
                  style={{
                    background: C.bg,
                    border: `1.5px solid ${C.border}`,
                    borderRadius: '14px',
                    padding: S.md,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: S.sm,
                  }}
                >
                  <span style={{ fontSize: '28px' }}>{child.avatarEmoji}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: T.body,
                      fontWeight: 800,
                      color: C.dark,
                      letterSpacing: '-0.02em',
                    }}>
                      {child.name} ({child.age}세)
                    </p>
                    <p style={{
                      fontSize: T.small,
                      color: C.textMuted,
                      marginTop: '2px',
                      letterSpacing: '-0.01em',
                    }}>
                      현재 {child.currentWeek === 0 ? 'OT' : child.currentWeek + '주차'} · 완료 {stats.completedMissions}/{stats.totalMissions} · 한마디 {stats.coachComments}건
                    </p>
                  </div>
                  <span style={{ color: C.textMuted, fontSize: '16px' }}>→</span>
                </button>
              );
            })}
          </div>

          {/* 주차별 콘텐츠 관리 (보기 전용) */}
          <p style={{
            fontSize: T.small,
            fontWeight: 800,
            color: C.textMuted,
            margin: `${S.xl} 0 ${S.sm}`,
            letterSpacing: '0.06em',
          }}>
            주차별 콘텐츠 관리
          </p>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '14px', padding: S.md, display: 'flex', flexDirection: 'column', gap: S.xs }}>
            {Object.keys(WEEK_CONTENT).map((k) => {
              const w = Number(k);
              const c = WEEK_CONTENT[w];
              const letter = getLetterByWeek(w);
              const hasVideo = !!c.videoEmbed;
              const hasLetter = !!letter?.body;
              const chip = (ok: boolean, label: string) => (
                <span style={{
                  fontSize: T.caption,
                  fontWeight: 700,
                  color: ok ? C.primary : C.textMuted,
                  letterSpacing: '-0.01em',
                }}>
                  {ok ? '●' : '○'} {label}
                </span>
              );
              return (
                <div key={w} style={{
                  display: 'flex', alignItems: 'center', gap: S.sm,
                  paddingBottom: S.xs,
                  borderBottom: w < LAST_WEEK ? `1px solid ${C.surface}` : 'none',
                }}>
                  <span style={{ minWidth: '40px', fontSize: T.small, fontWeight: 800, color: C.dark }}>
                    {w === 0 ? 'OT' : `${w}주`}
                  </span>
                  <div style={{ display: 'flex', gap: S.md, flexWrap: 'wrap' }}>
                    {chip(hasVideo, '영상')}
                    {chip(true, '글')}
                    {chip(hasLetter, '편지')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 하단 로그아웃 */}
          <div style={{ marginTop: S.xxl, textAlign: 'center' }}>
            <button
              onClick={onLogout}
              style={{
                background: 'transparent',
                color: C.textMuted,
                border: `1px solid ${C.border}`,
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: T.bodySm,
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '-0.01em',
              }}
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 코치가 특정 아이 선택 → 그 아이의 타임라인 (코치 한마디 작성 가능)
  const child = getChildById(selectedChildId);
  if (!child) {
    onSelectChild(null);
    return null;
  }
  const childNotes = getNotesByChild(selectedChildId, notes);
  const stats = getChildStats(childNotes);

  return (
    <div style={{ padding: `${S.xl} ${S.md}` }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        {/* 헤더 — 코치 모드 표시 + 뒤로 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: S.sm,
          marginBottom: S.md,
        }}>
          <button
            onClick={() => onSelectChild(null)}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: T.body,
              color: C.textMuted,
              cursor: 'pointer',
              padding: '4px',
              letterSpacing: '-0.01em',
            }}
          >
            ← 코치 메인
          </button>
        </div>

        <div style={{
          background: C.dark,
          color: '#fff',
          borderRadius: '16px',
          padding: S.md,
          marginBottom: S.lg,
          fontSize: T.small,
          letterSpacing: '0.06em',
        }}>
          👴 COACH MODE — {child.name} ({child.cohort})
        </div>

        <h1 style={{
          fontSize: T.h2,
          fontWeight: 900,
          color: C.dark,
          lineHeight: 1.3,
          letterSpacing: '-0.02em',
          marginBottom: '6px',
        }}>
          {child.avatarEmoji} {child.name}의 노트
        </h1>
        <p style={{
          fontSize: T.bodySm,
          color: C.textMuted,
          letterSpacing: '-0.01em',
          marginBottom: S.lg,
        }}>
          완료 {stats.completedMissions}/{stats.totalMissions} · 한마디 {stats.coachComments}건
        </p>

        {/* 노트 카드 (코치 모드) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.md }}>
          {childNotes.map((n) => (
            <NoteCard
              key={n.id}
              note={n}
              isCoach={true}
              onSaveCoach={onSaveCoachComment}
            />
          ))}
          {childNotes.length === 0 && (
            <div style={{
              padding: S.xl,
              background: C.bg,
              borderRadius: '16px',
              textAlign: 'center',
              color: C.textMuted,
              fontSize: T.bodySm,
            }}>
              아직 노트가 없어요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 이번 주 미션 (부모 대시보드 최상단) ────────

function ThisWeekMission({ child, onLeaveNote }: { child: Child; onLeaveNote: () => void }) {
  const w = child.currentWeek;
  const info = COHORT_WEEKS[w];
  const weekLabel = w === 0 ? 'OT' : `${w}주차`;
  return (
    <div style={{ background: C.orange20, borderRadius: '20px', padding: S.lg, marginBottom: S.md }}>
      <p style={{ fontSize: T.small, fontWeight: 800, color: C.primary, letterSpacing: '0.06em', marginBottom: '6px' }}>
        🎯 이번 주 미션
      </p>
      <p style={{ fontSize: T.h3, fontWeight: 800, color: C.dark, letterSpacing: '-0.02em', lineHeight: 1.4, marginBottom: S.md }}>
        {weekLabel} · {info.title}
      </p>
      <div style={{ background: C.bg, borderRadius: '14px', padding: S.md, marginBottom: S.md }}>
        <p style={{ fontSize: T.bodySm, color: C.textSub, lineHeight: 1.7, letterSpacing: '-0.01em' }}>
          🎯 {info.mission}
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S.xs }}>
        <a
          href={gameUrl(w, child.id)}
          target="_blank"
          rel="noreferrer"
          style={{
            background: C.primary,
            color: '#fff',
            padding: '15px',
            borderRadius: '12px',
            fontSize: T.body,
            fontWeight: 800,
            textAlign: 'center',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
          }}
        >
          게임으로 미션 시작 →
        </a>
        <button
          onClick={onLeaveNote}
          style={{
            background: C.bg,
            color: C.dark,
            border: `1.5px solid ${C.border}`,
            padding: '13px',
            borderRadius: '12px',
            fontSize: T.bodySm,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '-0.01em',
          }}
        >
          한마디 남기기
        </button>
      </div>
    </div>
  );
}

// ─── 이번 주 콘텐츠 (영상·글·편지) ──────────────

function ThisWeekContent({ week }: { week: number }) {
  const c = getWeekContent(week);
  const letter = getLetterByWeek(week);
  return (
    <div style={{ marginBottom: S.md }}>
      <p style={{ fontSize: T.small, fontWeight: 800, color: C.textMuted, letterSpacing: '0.06em', marginBottom: S.sm }}>
        이번 주 콘텐츠
      </p>
      <div style={{ background: C.surface, borderRadius: '16px', padding: S.md, display: 'flex', flexDirection: 'column', gap: S.sm }}>
        {/* 영상 */}
        {c.videoEmbed ? (
          <div style={{
            position: 'relative', width: '100%', paddingBottom: '56.25%',
            borderRadius: '12px', overflow: 'hidden', background: C.dark,
          }}>
            <iframe
              src={c.videoEmbed}
              title={c.videoTitle}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
            />
          </div>
        ) : (
          <div style={{
            background: C.bg, borderRadius: '12px', padding: S.md,
            display: 'flex', alignItems: 'center', gap: S.sm,
          }}>
            <span style={{ fontSize: '20px' }}>▶</span>
            <span style={{ fontSize: T.bodySm, color: C.textMuted, letterSpacing: '-0.01em' }}>
              {c.videoTitle} · 준비 중
            </span>
          </div>
        )}
        {/* 읽을 글 */}
        <div style={{ background: C.bg, borderRadius: '12px', padding: S.md, display: 'flex', alignItems: 'center', gap: S.sm }}>
          <span style={{ fontSize: '20px' }}>📄</span>
          <span style={{ fontSize: T.bodySm, color: C.dark, fontWeight: 600, letterSpacing: '-0.01em' }}>
            이번 주 읽을 글 — {c.articleTitle}
          </span>
        </div>
        {/* 편지 */}
        {letter && (
          <div style={{ background: C.bg, borderRadius: '12px', padding: S.md, display: 'flex', alignItems: 'center', gap: S.sm }}>
            <span style={{ fontSize: '20px' }}>✉️</span>
            <span style={{ fontSize: T.bodySm, color: C.dark, fontWeight: 600, letterSpacing: '-0.01em' }}>
              엉클조의 편지 {letter.no}번 — “{letter.title}”
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 지식·동화 라이브러리 (상시) ────────────────

function LibraryStrip() {
  return (
    <div style={{ marginBottom: S.md }}>
      <p style={{ fontSize: T.small, fontWeight: 800, color: C.textMuted, letterSpacing: '0.06em', marginBottom: S.sm }}>
        지식·동화 라이브러리
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S.sm }}>
        {LIBRARY.map((item) => (
          <div key={item.id} style={{
            background: C.bg, borderRadius: '14px', padding: S.md,
            border: `1px solid ${C.border}`,
          }}>
            <p style={{ fontSize: '24px', marginBottom: '6px' }}>{item.emoji}</p>
            <p style={{ fontSize: T.bodySm, fontWeight: 700, color: C.dark, lineHeight: 1.4, letterSpacing: '-0.01em', marginBottom: '2px' }}>
              {item.title}
            </p>
            <p style={{ fontSize: T.small, color: C.textMuted, lineHeight: 1.5, letterSpacing: '-0.01em' }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 누적 요약 박스 ────────────────────────────

function StatsBox({
  childName,
  stats,
}: {
  childName: string;
  stats: { totalMissions: number; completedMissions: number; coachComments: number };
}) {
  return (
    <div style={{
      background: C.orange10,
      borderRadius: '20px',
      padding: S.lg,
    }}>
      <p style={{
        fontSize: T.bodySm,
        color: C.primary,
        fontWeight: 800,
        marginBottom: '6px',
        letterSpacing: '0.04em',
      }}>
        {childName}의 4주 소비 변화
      </p>
      <p style={{
        fontSize: T.h3,
        fontWeight: 800,
        color: C.dark,
        lineHeight: 1.4,
        letterSpacing: '-0.02em',
        marginBottom: S.md,
      }}>
        한 걸음씩 쌓아가고 있어요.
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: S.sm,
      }}>
        <StatCell icon="✅" label="완료 미션" value={`${stats.completedMissions}`} suffix={`/ ${stats.totalMissions}`} />
        <StatCell icon="💬" label="엉클조 한마디" value={`${stats.coachComments}`} suffix="건" />
      </div>
    </div>
  );
}

function StatCell({
  icon,
  label,
  value,
  suffix,
}: {
  icon: string;
  label: string;
  value: string;
  suffix: string;
}) {
  return (
    <div style={{ background: C.bg, borderRadius: '14px', padding: S.md }}>
      <p style={{ fontSize: '20px', marginBottom: '2px' }}>{icon}</p>
      <p style={{ fontSize: T.caption, color: C.textMuted, marginBottom: '4px', letterSpacing: '-0.01em' }}>
        {label}
      </p>
      <p style={{ fontSize: T.h3, fontWeight: 800, color: C.dark, letterSpacing: '-0.02em' }}>
        {value}
        <span style={{ fontSize: T.bodySm, color: C.textMuted, fontWeight: 600, marginLeft: '4px' }}>
          {suffix}
        </span>
      </p>
    </div>
  );
}

// ─── 예정 카드 (미래 주차) ────────────────────

function UpcomingCard({ week }: { week: number }) {
  const info = COHORT_WEEKS[week];
  if (!info) return null;
  return (
    <div style={{
      background: C.surface,
      borderRadius: '20px',
      padding: S.lg,
      border: `1.5px dashed ${C.border}`,
      opacity: 0.85,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: S.xs,
        marginBottom: '6px',
      }}>
        <span style={{
          fontSize: T.small,
          fontWeight: 800,
          color: C.textMuted,
          background: C.bg,
          padding: '3px 10px',
          borderRadius: '999px',
          letterSpacing: '-0.01em',
        }}>
          🔒 예정
        </span>
        <span style={{
          fontSize: T.small,
          color: C.textMuted,
          letterSpacing: '-0.01em',
        }}>
          {week === 0 ? 'OT' : week + '주차'} · {info.date}
        </span>
      </div>
      <p style={{
        fontSize: T.body,
        fontWeight: 700,
        color: C.textMuted,
        lineHeight: 1.5,
        letterSpacing: '-0.01em',
      }}>
        {info.mission}
      </p>
      <p style={{
        marginTop: S.sm,
        fontSize: T.small,
        color: C.textMuted,
        lineHeight: 1.6,
        letterSpacing: '-0.01em',
      }}>
        강의가 시작되면 기록을 남길 수 있어요.
      </p>
    </div>
  );
}

// ─── 노트 카드 ────────────────────────────────

function NoteCard({
  note,
  isCoach,
  onSaveParent,
  onSaveCoach,
}: {
  note: Note;
  isCoach: boolean;
  onSaveParent?: (noteId: string, text: string, photoUrl?: string) => void;
  onSaveCoach?: (noteId: string, comment: string) => void;
}) {
  const [parentEditing, setParentEditing] = useState(false);
  const [coachEditing, setCoachEditing] = useState(false);
  const hasParent = !!note.parentText;
  const hasCoach = !!note.coachComment;
  const weekLabel = note.week === 0 ? '0주차 · OT' : `${note.week}주차`;

  return (
    <div style={{
      background: C.bg,
      borderRadius: '20px',
      padding: S.lg,
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    }}>
      {/* 주차·날짜·미션 */}
      <div style={{
        marginBottom: S.md,
        paddingBottom: S.md,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: S.xs,
          marginBottom: '6px',
        }}>
          <span style={{
            fontSize: T.small,
            fontWeight: 800,
            color: C.primary,
            background: C.orange10,
            padding: '3px 10px',
            borderRadius: '999px',
            letterSpacing: '-0.01em',
          }}>
            {weekLabel}
          </span>
          <span style={{
            fontSize: T.small,
            color: C.textMuted,
            letterSpacing: '-0.01em',
          }}>
            {note.date}
          </span>
        </div>
        <p style={{
          fontSize: T.body,
          fontWeight: 700,
          color: C.dark,
          lineHeight: 1.5,
          letterSpacing: '-0.01em',
        }}>
          {note.missionTitle}
        </p>
      </div>

      {/* 부모·아이 기록 */}
      {!isCoach && hasParent && !parentEditing ? (
        <ParentRecordView note={note} onEdit={() => setParentEditing(true)} />
      ) : !isCoach ? (
        <ParentRecordForm
          note={note}
          onSave={(text, photoUrl) => {
            onSaveParent?.(note.id, text, photoUrl);
            setParentEditing(false);
          }}
          onCancel={hasParent ? () => setParentEditing(false) : undefined}
        />
      ) : (
        // 코치 모드 — 부모 기록은 읽기 전용
        <CoachReadParentRecord note={note} />
      )}

      {/* 엉클조의 한마디 */}
      <div style={{ marginTop: S.md }}>
        {isCoach ? (
          // 코치 모드 — 작성/수정 가능
          hasCoach && !coachEditing ? (
            <CoachCommentView
              note={note}
              onEdit={() => setCoachEditing(true)}
            />
          ) : hasParent ? (
            <CoachCommentForm
              note={note}
              onSave={(comment) => {
                onSaveCoach?.(note.id, comment);
                setCoachEditing(false);
              }}
              onCancel={hasCoach ? () => setCoachEditing(false) : undefined}
            />
          ) : (
            <div style={{
              padding: S.md,
              background: C.surface,
              borderRadius: '14px',
              borderLeft: `3px solid ${C.border}`,
            }}>
              <p style={{
                fontSize: T.small,
                color: C.textMuted,
                lineHeight: 1.6,
                letterSpacing: '-0.01em',
              }}>
                부모님이 아직 기록을 안 남겼어요. 기록 후 한마디 가능.
              </p>
            </div>
          )
        ) : (
          // 부모 모드 — 코치 한마디 읽기만
          <CoachCommentView note={note} />
        )}
      </div>
    </div>
  );
}

// ─── 부모 기록 (읽기) ─────────────────────────

function ParentRecordView({ note, onEdit }: { note: Note; onEdit: () => void }) {
  return (
    <div>
      {note.photoUrl && (
        <img
          src={note.photoUrl}
          alt="기록 사진"
          style={{
            width: '100%',
            borderRadius: '14px',
            marginBottom: S.sm,
            display: 'block',
          }}
        />
      )}
      <p style={{
        fontSize: T.bodySm,
        color: C.dark,
        lineHeight: 1.7,
        letterSpacing: '-0.01em',
        marginBottom: '6px',
      }}>
        {note.parentText}
      </p>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: T.small, color: C.textMuted, letterSpacing: '-0.01em' }}>
          — 부모님
        </span>
        <button
          onClick={onEdit}
          style={{
            background: 'transparent',
            color: C.textMuted,
            border: 'none',
            fontSize: T.small,
            cursor: 'pointer',
            padding: '4px 8px',
            letterSpacing: '-0.01em',
          }}
        >
          ✏️ 수정
        </button>
      </div>
    </div>
  );
}

// 코치 모드에서 부모 기록 읽기 (수정 불가)
function CoachReadParentRecord({ note }: { note: Note }) {
  if (!note.parentText) {
    return (
      <div style={{
        padding: S.md,
        background: C.surface,
        borderRadius: '14px',
        border: `1px dashed ${C.border}`,
      }}>
        <p style={{
          fontSize: T.small,
          color: C.textMuted,
          lineHeight: 1.6,
          letterSpacing: '-0.01em',
        }}>
          부모 기록 없음 — 이번 주는 아직 기록을 남기지 않았어요.
        </p>
      </div>
    );
  }
  return (
    <div style={{
      background: C.orange05,
      borderRadius: '14px',
      padding: S.md,
    }}>
      <p style={{
        fontSize: T.small,
        fontWeight: 700,
        color: C.textMuted,
        marginBottom: S.xs,
        letterSpacing: '0.04em',
      }}>
        🌱 부모님 기록
      </p>
      {note.photoUrl && (
        <img
          src={note.photoUrl}
          alt="부모 기록 사진"
          style={{
            width: '100%',
            borderRadius: '12px',
            marginBottom: S.sm,
            display: 'block',
          }}
        />
      )}
      <p style={{
        fontSize: T.bodySm,
        color: C.dark,
        lineHeight: 1.7,
        letterSpacing: '-0.01em',
      }}>
        {note.parentText}
      </p>
    </div>
  );
}

// ─── 부모 기록 (입력 폼) ──────────────────────

function ParentRecordForm({
  note,
  onSave,
  onCancel,
}: {
  note: Note;
  onSave: (text: string, photoUrl?: string) => void;
  onCancel?: () => void;
}) {
  const [text, setText] = useState(note.parentText || '');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(note.photoUrl);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
    }
  };

  return (
    <div style={{ background: C.orange05, borderRadius: '14px', padding: S.md }}>
      <p style={{
        fontSize: T.small,
        fontWeight: 700,
        color: C.dark,
        marginBottom: S.sm,
        letterSpacing: '-0.01em',
      }}>
        🌱 이번 주 기록을 남겨주세요
      </p>

      {photoUrl && (
        <img
          src={photoUrl}
          alt="첨부 사진"
          style={{
            width: '100%',
            borderRadius: '12px',
            marginBottom: S.sm,
            display: 'block',
          }}
        />
      )}

      <label style={{
        display: 'inline-block',
        padding: '8px 14px',
        background: C.bg,
        border: `1px solid ${C.border}`,
        borderRadius: '999px',
        fontSize: T.small,
        fontWeight: 700,
        color: C.textSub,
        cursor: 'pointer',
        marginBottom: S.sm,
        letterSpacing: '-0.01em',
      }}>
        📷 {photoUrl ? '사진 바꾸기' : '사진 추가'}
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          style={{ display: 'none' }}
        />
      </label>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="이번 주 우리 아이 이야기를 한 줄로..."
        rows={3}
        style={{
          width: '100%',
          padding: '12px 14px',
          border: `1.5px solid ${C.border}`,
          borderRadius: '12px',
          fontSize: T.bodySm,
          outline: 'none',
          letterSpacing: '-0.01em',
          color: C.text,
          resize: 'vertical',
          fontFamily: 'inherit',
          background: C.bg,
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
        onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
      />

      <div style={{ display: 'flex', gap: S.xs, marginTop: S.sm }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              background: 'transparent',
              color: C.textMuted,
              border: `1px solid ${C.border}`,
              padding: '12px',
              borderRadius: '12px',
              fontSize: T.bodySm,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
            }}
          >
            취소
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (text.trim()) onSave(text.trim(), photoUrl);
          }}
          disabled={!text.trim()}
          style={{
            flex: 2,
            background: text.trim() ? C.primary : C.surface,
            color: text.trim() ? '#fff' : C.textMuted,
            border: 'none',
            padding: '12px',
            borderRadius: '12px',
            fontSize: T.bodySm,
            fontWeight: 800,
            cursor: text.trim() ? 'pointer' : 'not-allowed',
            letterSpacing: '-0.01em',
          }}
        >
          저장하기
        </button>
      </div>

      <p style={{
        marginTop: S.sm,
        fontSize: T.caption,
        color: C.textMuted,
        lineHeight: 1.6,
        letterSpacing: '-0.01em',
      }}>
        ※ 프로토타입 — 메모리에만 저장됩니다 (새로고침 시 초기화).
      </p>
    </div>
  );
}

// ─── 코치 한마디 (읽기) ───────────────────────

function CoachCommentView({
  note,
  onEdit,
}: {
  note: Note;
  onEdit?: () => void;
}) {
  return (
    <div style={{
      padding: S.md,
      background: C.surface,
      borderRadius: '14px',
      borderLeft: `3px solid ${note.coachComment ? C.primary : C.border}`,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px',
      }}>
        <p style={{
          fontSize: T.small,
          fontWeight: 800,
          color: note.coachComment ? C.primary : C.textMuted,
          letterSpacing: '-0.01em',
        }}>
          👴 엉클조의 한마디
        </p>
        {onEdit && note.coachComment && (
          <button
            onClick={onEdit}
            style={{
              background: 'transparent',
              color: C.textMuted,
              border: 'none',
              fontSize: T.small,
              cursor: 'pointer',
              padding: '4px 8px',
              letterSpacing: '-0.01em',
            }}
          >
            ✏️ 수정
          </button>
        )}
      </div>
      {note.coachComment ? (
        <p style={{
          fontSize: T.bodySm,
          color: C.dark,
          lineHeight: 1.7,
          letterSpacing: '-0.01em',
        }}>
          {note.coachComment}
        </p>
      ) : (
        <p style={{
          fontSize: T.small,
          color: C.textMuted,
          lineHeight: 1.6,
          letterSpacing: '-0.01em',
        }}>
          {note.parentText
            ? '아직 한마디 전입니다. 곧 엉클조가 답해드릴게요.'
            : '엉클조의 한마디는 부모님 기록 후 들어와요.'}
        </p>
      )}
    </div>
  );
}

// ─── 코치 한마디 (입력 폼) ────────────────────

function CoachCommentForm({
  note,
  onSave,
  onCancel,
}: {
  note: Note;
  onSave: (comment: string) => void;
  onCancel?: () => void;
}) {
  const [comment, setComment] = useState(note.coachComment || '');

  return (
    <div style={{
      background: C.dark,
      color: '#fff',
      borderRadius: '14px',
      padding: S.md,
    }}>
      <p style={{
        fontSize: T.small,
        fontWeight: 800,
        color: C.primary,
        marginBottom: S.sm,
        letterSpacing: '0.04em',
      }}>
        👴 엉클조의 한마디 남기기
      </p>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="할아버지가 옆에서 한 마디 남기듯이..."
        rows={3}
        style={{
          width: '100%',
          padding: '12px 14px',
          border: `1.5px solid rgba(255,255,255,0.2)`,
          borderRadius: '12px',
          fontSize: T.bodySm,
          outline: 'none',
          letterSpacing: '-0.01em',
          color: '#fff',
          resize: 'vertical',
          fontFamily: 'inherit',
          background: 'rgba(255,255,255,0.06)',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
        onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
      />

      <div style={{ display: 'flex', gap: S.xs, marginTop: S.sm }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              background: 'transparent',
              color: 'rgba(255,255,255,0.6)',
              border: `1px solid rgba(255,255,255,0.2)`,
              padding: '12px',
              borderRadius: '12px',
              fontSize: T.bodySm,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
            }}
          >
            취소
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (comment.trim()) onSave(comment.trim());
          }}
          disabled={!comment.trim()}
          style={{
            flex: 2,
            background: comment.trim() ? C.primary : 'rgba(255,255,255,0.1)',
            color: comment.trim() ? '#fff' : 'rgba(255,255,255,0.4)',
            border: 'none',
            padding: '12px',
            borderRadius: '12px',
            fontSize: T.bodySm,
            fontWeight: 800,
            cursor: comment.trim() ? 'pointer' : 'not-allowed',
            letterSpacing: '-0.01em',
          }}
        >
          한마디 전하기
        </button>
      </div>
    </div>
  );
}
