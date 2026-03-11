import { useState } from 'react';
import type { FormEvent } from 'react';

const FORMSPREE_ID = 'meelbwyv';

// 당근 Seed 색상 시스템 + 다크 섹션 변수 추가
const C = {
  primary:      '#FF6F0F',
  primaryDk:    '#E05A00',
  bg:           '#FFFFFF',
  surface:      '#F4F4F4',
  dark:         '#212124',
  text:         '#212124',
  textSub:      '#3D3D3D',
  textMuted:    '#868686',
  border:       '#EBEBEB',
  orange10:     '#FFF1E8',
  orange20:     '#FFD9B3',
  // 다크 섹션 전용
  darkSurface:  '#2C2C2C',
  darkBorder:   '#333333',
  darkTextSub:  '#AAAAAA',
  darkTextMuted:'#888888',
};

// 타이포그래피 스케일 (5단계)
const T = {
  display: 'clamp(30px, 7vw, 42px)' as const,
  h2:      '22px',
  body:    '15px',
  small:   '13px',
  caption: '12px',
};

// 간격 시스템 (8pt grid)
const S = {
  xs:  '8px',
  sm:  '16px',
  md:  '24px',
  lg:  '32px',
  xl:  '40px',
  section: '72px',
};

const PROBLEMS = [
  '용돈을 줘야 할 것 같은데, 얼마를 어떻게 줘야 할지',
  '경제 책 사줬는데 아이가 안 읽어요',
  '마트에서 사달라고 조를 때마다 어떻게 말해야 할지',
];

const WHO = [
  '아이 경제교육에 관심은 있는데 어디서 시작할지 모르는 분',
  '정답 듣기보다 같이 고민할 분',
  '평택·경기남부 근처에 사시는 분',
];

const HOW = ['2~3명, 카페에서 1시간 반', '엉클조가 먼저 경험 나눕니다', '나머지는 같이 이야기합니다', '강의 아닙니다'];

export default function App() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST', body: data, headers: { Accept: 'application/json' },
      });
      if (res.ok) setSubmitted(true);
    } finally { setSubmitting(false); }
  };

  const handleKakaoShare = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://sharer.kakao.com/talk/friends/picker/link?url=${url}`, '_blank');
  };

  return (
    <div style={{ fontFamily: "'Apple SD Gothic Neo','Noto Sans KR','맑은 고딕',sans-serif", background: C.bg, minHeight: '100vh', color: C.text }}>

      {/* ══ 히어로 ══ */}
      <section style={{ background: `linear-gradient(160deg, ${C.orange20} 0%, ${C.orange10} 55%, ${C.bg} 100%)`, padding: `${S.section} ${S.md} 64px` }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          {/* 엉클조 프로필 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: S.xs, marginBottom: S.md }}>
            <img
              src="/uncle-jo.png"
              alt="엉클조 조경만"
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${C.primary}` }}
            />
            <p style={{ color: C.primary, fontWeight: 700, fontSize: T.caption, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              엉클조 × 자녀경제교육 소모임 · 평택
            </p>
          </div>
          <h1 style={{ fontSize: T.display, fontWeight: 900, lineHeight: 1.25, marginBottom: S.md, letterSpacing: '-0.03em', color: C.dark }}>
            아이한테 돈 이야기,<br />어떻게 꺼내세요?
          </h1>
          <p style={{ fontSize: T.body, lineHeight: 1.8, color: C.textSub, marginBottom: S.xl, letterSpacing: '-0.01em' }}>
            어렵게 안 해도 돼요.<br />
            같은 고민 하는 동네 엄마들이랑<br />
            커피 한 잔 하며 얘기해봐요.
          </p>
          <a href="#apply" style={{
            display: 'inline-block', background: C.primary, color: '#fff',
            padding: '17px 40px', borderRadius: '52px', fontWeight: 700, fontSize: T.body,
            textDecoration: 'none', letterSpacing: '-0.01em',
            boxShadow: `0 6px 20px rgba(255,111,15,0.35)`,
          }}>
            평택 첫 모임 신청하기
            <span style={{ display: 'block', fontSize: T.caption, fontWeight: 400, opacity: 0.85, marginTop: '3px' }}>2~3명 소규모</span>
          </a>
        </div>
      </section>

      {/* ══ 문제 공감 ══ */}
      <section style={{ padding: `${S.section} ${S.md}`, background: C.surface }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: T.h2, fontWeight: 700, textAlign: 'center', marginBottom: S.lg, letterSpacing: '-0.02em' }}>
            이런 고민 하고 있지 않으세요?
          </h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: S.xs }}>
            {PROBLEMS.map((item, i) => (
              <li key={i} style={{
                display: 'flex', gap: S.sm, alignItems: 'flex-start',
                padding: `${S.sm} ${S.md}`, background: C.bg,
                borderRadius: '16px', border: `1px solid ${C.border}`,
                fontSize: T.body, lineHeight: 1.65,
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}>
                <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>😅</span>
                <span style={{ color: C.textSub }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ 엉클조 자격 — 다크 ══ */}
      <section style={{ padding: `${S.section} ${S.md}`, background: C.dark, color: '#fff' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <img
            src="/uncle-jo.png"
            alt="엉클조 조경만"
            style={{
              width: '100px', height: '100px', borderRadius: '50%',
              objectFit: 'cover', marginBottom: S.sm,
              border: `3px solid ${C.primary}`,
            }}
          />
          <p style={{ color: C.primary, fontWeight: 700, fontSize: T.small, letterSpacing: '0.06em', marginBottom: S.lg }}>
            엉클조 (조경만)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: S.sm, marginBottom: S.xl }}>
            {[
              { num: '연세대', label: '경제학과 졸업' },
              { num: '10년', label: '증권사·금융기관' },
              { num: '20년', label: '금융교육 강사' },
            ].map((s, i) => (
              <div key={i} style={{ background: C.darkSurface, borderRadius: '16px', padding: `${S.md} ${S.sm}` }}>
                <p style={{ fontSize: T.h2, fontWeight: 800, color: C.primary, marginBottom: S.xs, letterSpacing: '-0.02em' }}>{s.num}</p>
                <p style={{ fontSize: T.caption, color: C.darkTextSub, lineHeight: 1.5 }}>{s.label}</p>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${C.darkBorder}`, paddingTop: S.lg }}>
            <div style={{
              background: C.orange10, borderRadius: '14px', padding: `${S.sm} ${S.md}`, marginBottom: S.md,
              color: '#7A3A00',
            }}>
              <p style={{ fontSize: T.body, lineHeight: 1.8, letterSpacing: '-0.01em' }}>
                살아가면서 어떤 공부보다<br />
                <strong>돈을 다루는 습관이 더 필요하더라고요.</strong>
              </p>
            </div>
            <p style={{ fontSize: T.body, lineHeight: 1.85, color: '#ddd', marginBottom: S.xs, letterSpacing: '-0.02em' }}>
              두 아이와 직접 해봤습니다.<br />
              <strong style={{ color: C.primary }}>아이들이 다 크고 나서야 알았습니다.</strong>
            </p>
            <p style={{ color: C.darkTextMuted, fontSize: T.small, lineHeight: 1.75, letterSpacing: '-0.01em' }}>
              어릴 때 만들어준 돈 관리 습관이<br />성인이 된 지금까지 영향을 주고 있더라고요.
            </p>
          </div>
        </div>
      </section>

      {/* ══ 자녀 이야기 ══ */}
      <section style={{ padding: `${S.section} ${S.md}`, background: C.bg }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{
            borderLeft: `4px solid ${C.primary}`, paddingLeft: S.md, marginBottom: S.lg,
          }}>
            <p style={{ fontSize: T.h2, fontWeight: 700, lineHeight: 1.7, letterSpacing: '-0.02em', marginBottom: S.sm }}>
              두 아이가 다 컸습니다.
            </p>
            <p style={{ fontSize: T.body, color: C.textSub, lineHeight: 1.85, letterSpacing: '-0.01em' }}>
              어릴 때 만든 돈 관련 습관이 아이들에게 남긴 건<br />
              '돈을 잘 버는 법'이 아니었습니다.<br />
              <br />
              스스로 선택하고, 그 선택에 책임지는 연습.<br />
              그게 쌓여서 지금의 아이들이 됐더라고요.
            </p>
          </div>
          <div style={{
            background: C.surface, borderRadius: '20px', padding: `${S.lg} ${S.md}`,
          }}>
            <p style={{ fontSize: T.h2, fontWeight: 700, lineHeight: 1.75, letterSpacing: '-0.02em', marginBottom: S.xs }}>
              우리 아이도 주체적으로 사고하고,<br />정서적으로 건강한 어른이 되길<br />원하지 않으세요?
            </p>
            <p style={{ fontSize: T.body, color: C.textSub, lineHeight: 1.85, letterSpacing: '-0.01em' }}>
              저는 그게 경제교육이 줄 수 있는<br />
              가장 큰 선물이라고 생각합니다.
            </p>
          </div>
        </div>
      </section>

      {/* ══ 핵심 인사이트 ══ */}
      <section style={{ padding: `${S.section} ${S.md}`, background: C.bg }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ borderLeft: `4px solid ${C.primary}`, paddingLeft: S.md, marginBottom: S.xl }}>
            <p style={{ fontSize: T.h2, fontWeight: 700, lineHeight: 1.7, marginBottom: S.sm, letterSpacing: '-0.02em' }}>
              그때는 주변에<br />이런 걸 가르쳐 주는 사람이 없었습니다.
            </p>
            <p style={{ fontSize: T.body, color: C.textSub, lineHeight: 1.8, letterSpacing: '-0.01em' }}>
              나도 혼자 해봤어요.<br />
              잘 된 것도 있고, 지금 와서 아쉬운 것도 있습니다.
            </p>
          </div>
          <div>
            <p style={{ fontSize: T.body, fontWeight: 700, marginBottom: S.sm, lineHeight: 1.65, letterSpacing: '-0.02em' }}>
              요즘 엄마들은 더 지혜롭습니다.
            </p>
            <p style={{ fontSize: T.body, color: C.textSub, lineHeight: 1.85, letterSpacing: '-0.01em' }}>
              서로 힘을 합치면 더 좋은 방법이 나올 거라 생각합니다.<br />
              우리 아이들에게 좋은 경험과 가치, 습관을 줄 수 있지 않을까요?
            </p>
            <p style={{ fontSize: T.small, color: C.textMuted, marginTop: S.sm, letterSpacing: '-0.01em' }}>
              — 손주 볼 나이가 된 엉클조가 이 모임을 여는 이유입니다.
            </p>
          </div>
        </div>
      </section>

      {/* ══ 중간 CTA — 오렌지 풀 섹션 ══ */}
      <section style={{ padding: `56px ${S.md}`, background: C.primary, textAlign: 'center' }}>
        <p style={{ fontSize: T.h2, fontWeight: 800, color: '#fff', marginBottom: S.xs, letterSpacing: '-0.03em', lineHeight: 1.4 }}>
          이야기 나눠보고 싶어졌다면
        </p>
        <p style={{ fontSize: T.body, color: 'rgba(255,255,255,0.8)', marginBottom: S.lg, letterSpacing: '-0.01em' }}>
          2~3명이어도 엽니다.
        </p>
        <a href="#apply" style={{
          display: 'inline-block', background: '#fff', color: C.primary,
          padding: '15px 36px', borderRadius: '52px',
          fontWeight: 700, fontSize: T.body, textDecoration: 'none', letterSpacing: '-0.01em',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        }}>
          신청하러 가기 →
        </a>
      </section>

      {/* ══ 모임 안내 ══ */}
      <section style={{ padding: `${S.section} ${S.md}`, background: C.surface }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: S.sm }}>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '20px', padding: `${S.lg} ${S.md}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: T.h2, fontWeight: 700, marginBottom: S.md, letterSpacing: '-0.02em' }}>
              이런 분들이랑 이야기하고 싶어요
            </h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: S.sm }}>
              {WHO.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: S.xs, fontSize: T.body, lineHeight: 1.65, letterSpacing: '-0.01em' }}>
                  <span style={{ color: C.primary, fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span style={{ color: C.textSub }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: C.dark, borderRadius: '20px', padding: `${S.lg} ${S.md}` }}>
            <h2 style={{ fontSize: T.h2, fontWeight: 700, marginBottom: S.md, color: '#fff', letterSpacing: '-0.02em' }}>
              첫 모임은 이렇게 합니다
            </h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: S.sm, marginBottom: S.md }}>
              {HOW.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: S.sm, fontSize: T.body, lineHeight: 1.65, letterSpacing: '-0.01em', color: item === '강의 아닙니다' ? C.primary : '#ccc' }}>
                  <span style={{ color: C.primary, flexShrink: 0 }}>·</span>
                  <span style={{ fontWeight: item === '강의 아닙니다' ? 700 : 400 }}>{item}</span>
                </li>
              ))}
            </ul>
            <div style={{ borderTop: `1px solid ${C.darkBorder}`, paddingTop: S.md, display: 'flex', gap: S.sm, alignItems: 'flex-start' }}>
              <span style={{ fontSize: '22px', flexShrink: 0 }}>🎁</span>
              <div>
                <p style={{ fontSize: T.small, color: C.primary, fontWeight: 700, marginBottom: '4px', letterSpacing: '-0.01em' }}>참여하시는 분께 드립니다</p>
                <p style={{ fontSize: T.small, color: '#ddd', lineHeight: 1.7, letterSpacing: '-0.01em' }}>
                  《효진 선생님의 초등 돈 공부》<br />
                  <span style={{ fontSize: T.caption, color: C.darkTextMuted }}>용돈 관리부터 주식 투자까지, 집에서 시작하는 우리 아이 첫 경제 교육</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 신청 폼 ══ */}
      <section id="apply" style={{ padding: `${S.section} ${S.md}`, background: C.bg }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: T.h2, fontWeight: 700, textAlign: 'center', marginBottom: S.xs, letterSpacing: '-0.03em' }}>부담 없이 신청해주세요.</h2>
          <p style={{ color: C.textMuted, textAlign: 'center', fontSize: T.body, marginBottom: S.xl, letterSpacing: '-0.01em' }}>2~3명이어도 엽니다.</p>
          {submitted ? (
            <div style={{
              textAlign: 'center', padding: `56px ${S.md}`,
              background: C.orange10, borderRadius: '24px', border: `1px solid ${C.orange20}`,
            }}>
              <div style={{ fontSize: '52px', marginBottom: S.sm }}>☺️</div>
              <p style={{ fontSize: T.h2, fontWeight: 700, marginBottom: S.xs, letterSpacing: '-0.02em' }}>신청해주셨습니다!</p>
              <p style={{ color: C.textSub, fontSize: T.body, lineHeight: 1.7, letterSpacing: '-0.01em', marginBottom: S.lg }}>
                연락처로 모임 일정 안내 드릴게요.<br />커피 한 잔 하며 편하게 얘기해요.
              </p>
              <button
                onClick={handleKakaoShare}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: S.xs,
                  background: '#FEE500', color: '#3A1D1D', border: 'none',
                  padding: '13px 28px', borderRadius: '52px',
                  fontWeight: 700, fontSize: T.small, cursor: 'pointer', letterSpacing: '-0.01em',
                }}
              >
                💬 카카오톡으로 친구한테 알리기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
              {[
                { label: '이름', name: 'name', type: 'text', placeholder: '홍길동' },
                { label: '연락처', name: 'phone', type: 'tel', placeholder: '010-0000-0000' },
                { label: '아이 나이', name: 'child_age', type: 'text', placeholder: '예) 7살, 초등 3학년' },
              ].map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} style={{ display: 'block', fontSize: T.small, fontWeight: 600, marginBottom: S.xs, color: C.text, letterSpacing: '-0.01em' }}>
                    {field.label}
                  </label>
                  <input
                    id={field.name} name={field.name} type={field.type} required placeholder={field.placeholder}
                    style={{ width: '100%', padding: '14px 16px', border: `1.5px solid ${C.border}`, borderRadius: '12px', fontSize: '16px', outline: 'none', transition: 'border-color 0.15s', letterSpacing: '-0.01em', color: C.text }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = C.border)}
                  />
                </div>
              ))}
              <button type="submit" disabled={submitting} style={{
                background: submitting ? '#ccc' : C.primary, color: '#fff', border: 'none',
                padding: '18px', borderRadius: '14px', fontSize: T.h2, fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer', marginTop: S.xs,
                letterSpacing: '-0.01em',
                boxShadow: submitting ? 'none' : `0 6px 20px rgba(255,111,15,0.35)`,
              }}>
                {submitting ? '신청 중...' : '함께하기'}
              </button>
            </form>
          )}
        </div>
      </section>


    </div>
  );
}
