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

// ── Pain 4 (3단 구조) — 후기 인용 풀세트 ─────────────────────
type Pain = { head: string; body: string; sting: string };
const PAINS: Pain[] = [
  {
    head: '"엄마 돈 있잖아"',
    body: '마트에서, 문구점에서, 다이소에서. 사달라고 조르고, 안 사주면 떼를 씁니다. "장난감 언제 살 수 있어?" "어른들 용돈 받으면 뭐 사고 싶어" 매번 어떻게 말해야 할지 몰라서, 화내고 끝나거나, 사주고 후회하거나.',
    sting: '"이번에만 사주자"가 매번 됩니다.',
  },
  {
    head: '첫 한 달은 정말 열심히 했는데...',
    body: '용돈도 정해서 주고, 용돈기입장도 같이 쓰고, 홈 아르바이트도 시켜봤어요. 첫 한 달은 정말 좋았어요. 그런데 결국 흐지부지 됐어요. 홈 아르바이트도 어느새 제가 시키는 게 일이 됐고요.',
    sting: '"이게 맞나?" 싶은 순간이 자꾸 와요.',
  },
  {
    head: '우리 애는 완전 소비요정이에요',
    body: '문방구·다이소만 가면 눈이 반짝반짝. 가격은 안 보고 일단 사고 싶어합니다. "이거 살래" "저거 살래" 끝이 없어요. 아직 돈도 못 버는데 소비 습관만 굳어질까 봐 걱정이에요.',
    sting: '그렇다고 무조건 안 사주는 것도 답이 아닌 것 같고요.',
  },
  {
    head: '사실 저도 경제관념이 부족해요',
    body: '학교 다닐 때 경제·금융은 거의 안 배웠어요. 고등학교 1학년까지 경제는 0이었어요. 부모님도 "물고기를 잡아주는 분"이셨고요. 그래서 제 아이한테 뭘, 언제, 어떻게 가르쳐야 할지 막막해요.',
    sting: '잘못 가르치면 어떡하나, 그게 더 무서워요.',
  },
];

const WHO = [
  '5~10세 자녀 경제교육, 어디서 시작할지 모르는 분',
  '정답 듣기보다 같이 고민하고 싶은 분',
  '혼자 하기 막막해서 비슷한 고민하는 부모 만나고 싶은 분',
  '평택·경기남부에서 오프닝·중간 모임 참여 가능한 분',
];

// 혼합 진행 방식 (오프닝·중간 = 오프 / 나머지 = 줌)
const HOW = [
  { icon: '🚪', text: '오프닝 — 평택 카페에서 첫 만남' },
  { icon: '💻', text: '주차별 수업 — 줌 (40분+ · 녹화본 제공)' },
  { icon: '🤝', text: '중간 모임 — 평택 오프 (중간 점검)' },
  { icon: '👨‍👩‍👧', text: '자녀+부모 동반 가능' },
  { icon: '📵', text: '강의 아닙니다 — 같이 이야기합니다' },
];

// 4주 입문 커리큘럼 (개념 + 활동 + 미션)
const CURRICULUM = [
  {
    week: '1주',
    title: '돈의 출발',
    sub: '노동의 대가 · 홈 아르바이트',
    detail: '돈이 어떻게 생기는지 첫 경험. 부모가 무조건 주는 게 아니라, 노동의 결과로 받는다는 감각을 기릅니다.',
    mission: '🎯 미션: 홈 아르바이트 1가지 시작 + 첫 용돈 기입',
  },
  {
    week: '2주',
    title: '필요 vs 욕구 / 기회비용',
    sub: '"사고 싶은 것" vs "사야 하는 것"',
    detail: '마트·문방구·다이소에서 매번 흐트러지는 이유. 필요와 욕구를 구분하는 첫 질문 만들기.',
    mission: '🎯 미션: 이번 주 산 것 → 필요/욕구 표 작성',
  },
  {
    week: '3주',
    title: '4영역 분리',
    sub: '소비 · 저축 · 투자 · 기부',
    detail: '용돈을 한 통에 모으는 게 아니라 4개로 나누는 첫 체계. 저금통 3/4개 + 매칭 적금 시작.',
    mission: '🎯 미션: 4영역 저금통 만들기 + 첫 매칭 적금',
  },
  {
    week: '4주',
    title: '우리 집만의 용돈 원칙',
    sub: '용돈기입장 · 용돈계약서',
    detail: '4주 동안 시도한 것을 우리 집만의 원칙으로 정리. 일회성이 아닌 평생 갈 체계.',
    mission: '🎯 미션: 가족 회의에서 용돈계약서 확정',
  },
];

// 4주 끝나고 변화 약속 (Before → After) — 30년 회고에서 봐온 자녀 패턴
const BEFORE_AFTER = [
  { before: '"엄마 돈 있잖아" 매번 떼쓰기', after: '필요와 욕구를 구분하고 한 개만 골라요' },
  { before: '첫 한 달 열심·결국 흐지부지', after: '4주 동안 꾸준해지는 습관' },
  { before: '용돈 = 한 통에 다 모으기', after: '4영역 (소비·저축·투자·기부) 분류' },
  { before: '카드는 돈이 나오는 줄', after: '카드에 돈이 들어있다는 이해' },
  { before: '엄마가 끌고가는 용돈', after: '아이가 자기 것으로 챙기는 용돈' },
];

// 과정이 끝나고 손에 쥐는 것 (정정)
const AFTER = [
  { icon: '💬', text: '아이에게 "경제" 대신 꺼낼 첫 마디' },
  { icon: '📝', text: '우리 집만의 4영역 용돈 원칙 (소비·저축·투자·기부)' },
  { icon: '📘', text: '30년 회고에서 정리한 4주 워크북' },
];

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

      {/* ══ ① 히어로 — 헤드 H + 서브 F + 부제 J ══ */}
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
              엉클조 × 자녀경제교육 · 평택
            </p>
          </div>
          {/* 헤드 H */}
          <h1 style={{ fontSize: T.display, fontWeight: 900, lineHeight: 1.3, marginBottom: S.md, letterSpacing: '-0.03em', color: C.dark }}>
            30년 가르치고,<br />30년 키워보고,<br />알게 된 것
          </h1>
          {/* 서브 F */}
          <p style={{ fontSize: T.body, lineHeight: 1.9, color: C.textSub, marginBottom: S.xs, letterSpacing: '-0.01em' }}>
            30년 전 가르쳤던 자녀경제교육,<br />
            손주에게 다시 전합니다.
          </p>
          {/* 부제 J */}
          <p style={{ fontSize: T.small, color: C.textMuted, marginBottom: S.xl, letterSpacing: '-0.01em', fontStyle: 'italic' }}>
            — 할아버지가 손주에게 전하고 싶은 경제 지혜
          </p>
          <a href="#apply" style={{
            display: 'inline-block', background: C.primary, color: '#fff',
            padding: '17px 40px', borderRadius: '52px', fontWeight: 700, fontSize: T.body,
            textDecoration: 'none', letterSpacing: '-0.01em',
            boxShadow: `0 6px 20px rgba(255,111,15,0.35)`,
          }}>
            4주 입문 신청하기
            <span style={{ display: 'block', fontSize: T.caption, fontWeight: 400, opacity: 0.85, marginTop: '3px' }}>
              평택 오프닝 + 줌수업 · 분기 1번 · 소수 정예
            </span>
          </a>
          <p style={{ fontSize: T.caption, color: C.textMuted, marginTop: S.sm, letterSpacing: '-0.01em' }}>
            유아반 (~7세) / 초저반 (7세+) 분반 운영
          </p>
        </div>
      </section>

      {/* ══ ② 이 과정은 어떤 과정인가요? ══ */}
      <section style={{ padding: `${S.section} ${S.md}`, background: C.surface }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <p style={{ color: C.primary, fontWeight: 700, fontSize: T.small, letterSpacing: '0.06em', marginBottom: S.sm }}>
            이 과정은 어떤 과정인가요?
          </p>
          <h2 style={{ fontSize: T.h2, fontWeight: 800, lineHeight: 1.6, marginBottom: S.md, letterSpacing: '-0.02em' }}>
            30년 전 가르쳤던 그대로,<br />손주에게 다시 풀어갑니다.
          </h2>
          <p style={{ fontSize: T.body, color: C.textSub, lineHeight: 1.9, marginBottom: S.lg, letterSpacing: '-0.01em' }}>
            30년 전 제 아이들에게 가르쳤던 그대로,<br />
            30년 자녀를 키워보고 보이는 것까지,<br />
            수많은 부모님들의 돈 고민에서 모은 것을<br />
            4주 입문으로 풀어갑니다.
          </p>
          <div style={{
            background: C.bg, border: `1.5px solid ${C.primary}`, borderRadius: '16px',
            padding: `${S.sm} ${S.md}`, display: 'flex', alignItems: 'center', gap: S.sm,
          }}>
            <span style={{ fontSize: '22px', flexShrink: 0 }}>💡</span>
            <p style={{ fontSize: T.body, color: C.dark, lineHeight: 1.7, letterSpacing: '-0.01em' }}>
              <strong>정답을 드리러 가는 게 아닙니다.</strong><br />
              같이 풀어갑니다.
            </p>
          </div>
        </div>
      </section>

      {/* ══ ③ 부모 공감 — Pain 4 (3단 구조) ══ */}
      <section style={{ padding: `${S.section} ${S.md}`, background: C.bg }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: T.h2, fontWeight: 700, textAlign: 'center', marginBottom: S.lg, letterSpacing: '-0.02em' }}>
            이런 장면, 익숙하지 않으세요?
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.md }}>
            {PAINS.map((p, i) => (
              <div key={i} style={{
                padding: S.md, background: C.surface,
                borderRadius: '20px', border: `1px solid ${C.border}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', gap: S.xs, alignItems: 'flex-start', marginBottom: S.sm }}>
                  <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '1px' }}>😅</span>
                  <p style={{ fontSize: T.body, fontWeight: 700, color: C.dark, lineHeight: 1.5, letterSpacing: '-0.02em' }}>
                    {p.head}
                  </p>
                </div>
                <p style={{ fontSize: T.body, color: C.textSub, lineHeight: 1.8, letterSpacing: '-0.01em', marginBottom: S.sm }}>
                  {p.body}
                </p>
                <div style={{
                  borderLeft: `3px solid ${C.primary}`, paddingLeft: S.sm,
                  fontSize: T.small, color: C.dark, fontWeight: 600,
                  lineHeight: 1.6, letterSpacing: '-0.01em',
                }}>
                  👉 {p.sting}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ④ 엉클조 자격 — 다크 (인용 4문장) ══ */}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: S.sm, marginBottom: S.lg }}>
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
          <p style={{ fontSize: T.small, color: C.primary, fontWeight: 600, marginBottom: S.xl, letterSpacing: '-0.01em' }}>
            · 30년 동안 수많은 부모님들과 자녀 돈 고민 상담<br />
            · 자녀에게 직접 가르치고 30년간 지켜본 경험
          </p>
          <div style={{ borderTop: `1px solid ${C.darkBorder}`, paddingTop: S.lg, display: 'flex', flexDirection: 'column', gap: S.md }}>
            <div style={{
              background: C.orange10, borderRadius: '14px', padding: `${S.sm} ${S.md}`,
              color: '#7A3A00',
            }}>
              <p style={{ fontSize: T.body, lineHeight: 1.8, letterSpacing: '-0.01em' }}>
                살아가면서 어떤 공부보다<br />
                <strong>돈을 다루는 습관이 더 필요하더라고요.</strong>
              </p>
            </div>
            <p style={{ fontSize: T.body, lineHeight: 1.85, color: '#ddd', letterSpacing: '-0.02em' }}>
              저도 직접 가르쳐 봤습니다.<br />
              <strong style={{ color: C.primary }}>가르친 결과에 스스로 만족합니다.</strong>
            </p>
            <p style={{ color: C.darkTextSub, fontSize: T.small, lineHeight: 1.75, letterSpacing: '-0.01em' }}>
              어릴 때 만들어준 돈 관리 습관이<br />평생 영향을 주는 걸 봤어요.
            </p>
            <p style={{ color: C.darkTextSub, fontSize: T.small, lineHeight: 1.75, letterSpacing: '-0.01em' }}>
              30년 동안 수많은 부모님들의 돈 고민을 들으면서,<br />
              <strong style={{ color: C.primary }}>가장 후회되는 게 자녀 경제교육</strong>이라는 걸 알게 됐어요.
            </p>
          </div>
        </div>
      </section>

      {/* ══ ⑤ 핵심 인사이트 — 30년×30년×상담 → 손주에게 ══ */}
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
            <p style={{ fontSize: T.body, color: C.textSub, lineHeight: 1.85, letterSpacing: '-0.01em', marginBottom: S.sm }}>
              30년 전 가르쳤던 그대로,<br />
              30년 자녀 키워보고 보이는 것까지,<br />
              수많은 부모님들의 돈 고민에서 모은 것을<br />
              <strong style={{ color: C.dark }}>손주들에게 전하려고 합니다.</strong>
            </p>
            <p style={{ fontSize: T.small, color: C.textMuted, marginTop: S.sm, letterSpacing: '-0.01em' }}>
              — 손주 볼 나이가 된 엉클조가 이 과정을 여는 이유입니다.
            </p>
          </div>
        </div>
      </section>

      {/* ══ ⑦ 4주 입문 커리큘럼 (신규) ══ */}
      <section style={{ padding: `${S.section} ${S.md}`, background: C.surface }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <p style={{ color: C.primary, fontWeight: 700, fontSize: T.small, letterSpacing: '0.06em', marginBottom: S.sm }}>
            4주 입문 — 어떤 걸 배우나요?
          </p>
          <h2 style={{ fontSize: T.h2, fontWeight: 800, lineHeight: 1.5, marginBottom: S.md, letterSpacing: '-0.02em' }}>
            30년 회고에서 정리한<br />10가지 개념과 10가지 실천 도구
          </h2>
          <p style={{ fontSize: T.body, color: C.textSub, lineHeight: 1.85, marginBottom: S.lg, letterSpacing: '-0.01em' }}>
            유아반 / 초저반 — 같은 4주 골격, 풀어가는 방식 다릅니다.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm, marginBottom: S.lg }}>
            {CURRICULUM.map((c, i) => (
              <div key={i} style={{
                display: 'flex', gap: S.md, alignItems: 'flex-start',
                padding: S.md, background: C.bg,
                borderRadius: '16px', border: `1px solid ${C.border}`,
              }}>
                <div style={{
                  flexShrink: 0, width: '52px', height: '52px',
                  borderRadius: '50%', background: C.orange10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: C.primary, fontWeight: 800, fontSize: T.body,
                }}>
                  {c.week}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: T.body, fontWeight: 700, color: C.dark, marginBottom: '4px', letterSpacing: '-0.02em' }}>
                    {c.title}
                  </p>
                  <p style={{ fontSize: T.small, color: C.primary, fontWeight: 600, marginBottom: S.xs, letterSpacing: '-0.01em' }}>
                    {c.sub}
                  </p>
                  <p style={{ fontSize: T.small, color: C.textSub, lineHeight: 1.65, letterSpacing: '-0.01em', marginBottom: S.xs }}>
                    {c.detail}
                  </p>
                  <p style={{ fontSize: T.caption, color: C.textMuted, fontWeight: 500, letterSpacing: '-0.01em' }}>
                    {c.mission}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div style={{
            background: C.bg, border: `1px solid ${C.border}`, borderRadius: '14px',
            padding: `${S.sm} ${S.md}`, fontSize: T.small, color: C.textSub, lineHeight: 1.7,
          }}>
            <p style={{ marginBottom: S.xs }}>
              <strong style={{ color: C.dark }}>📘 매주 워크북 + 부모 안내서 제공</strong>
            </p>
            <p>💻 줌수업 (40분+, 녹화본 제공)</p>
            <p>🚪 오프닝·중간 모임은 평택 카페</p>
          </div>
          <p style={{ fontSize: T.small, color: C.textMuted, marginTop: S.md, letterSpacing: '-0.01em', lineHeight: 1.7 }}>
            ※ 8주 본과정 — 4주 입문 끝난 분들께 안내드립니다.<br />
            주식 첫 경험 · 복리와 시간 · 자기조절 · 기업가정신 · 부모 모델링까지 확장.
          </p>
        </div>
      </section>

      {/* ══ ⑦ 변화 약속 (Before → After) — 신규 ══ */}
      <section style={{ padding: `${S.section} ${S.md}`, background: C.bg }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <p style={{ color: C.primary, fontWeight: 700, fontSize: T.small, letterSpacing: '0.06em', marginBottom: S.sm }}>
            4주 끝나면 어떻게 달라질까요?
          </p>
          <h2 style={{ fontSize: T.h2, fontWeight: 800, lineHeight: 1.5, marginBottom: S.md, letterSpacing: '-0.02em' }}>
            30년 동안 봐온<br />자녀의 변화 패턴입니다
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm, marginBottom: S.md }}>
            {BEFORE_AFTER.map((b, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                gap: S.xs,
                alignItems: 'center',
                padding: `${S.sm} ${S.md}`,
                background: C.surface,
                borderRadius: '14px',
                border: `1px solid ${C.border}`,
              }}>
                <div style={{
                  fontSize: T.small,
                  color: C.textMuted,
                  lineHeight: 1.45,
                  letterSpacing: '-0.01em',
                }}>
                  <span style={{ display: 'block', fontSize: T.caption, fontWeight: 600, color: C.textMuted, marginBottom: '2px' }}>BEFORE</span>
                  {b.before}
                </div>
                <div style={{ color: C.primary, fontSize: '20px', fontWeight: 700, flexShrink: 0 }}>→</div>
                <div style={{
                  fontSize: T.small,
                  color: C.dark,
                  fontWeight: 600,
                  lineHeight: 1.45,
                  letterSpacing: '-0.01em',
                }}>
                  <span style={{ display: 'block', fontSize: T.caption, fontWeight: 700, color: C.primary, marginBottom: '2px' }}>AFTER</span>
                  {b.after}
                </div>
              </div>
            ))}
          </div>
          <div style={{
            background: C.orange10, borderRadius: '14px',
            padding: `${S.sm} ${S.md}`, borderLeft: `4px solid ${C.primary}`,
          }}>
            <p style={{ fontSize: T.small, color: '#7A3A00', lineHeight: 1.7, letterSpacing: '-0.01em' }}>
              <strong>부모도 같이 달라집니다.</strong><br />
              막막함 → 30년 회고에서 정리한 체계.<br />
              혼자 시행착오 → 같이 고민할 동료.
            </p>
          </div>
        </div>
      </section>

      {/* ══ ⑧ 과정이 끝나면 (정정) ══ */}
      <section style={{ padding: `${S.section} ${S.md}`, background: C.bg }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: T.h2, fontWeight: 800, marginBottom: S.xs, letterSpacing: '-0.02em' }}>
            과정이 끝나고, 손에 쥐는 것
          </h2>
          <p style={{ fontSize: T.body, color: C.textMuted, marginBottom: S.lg, letterSpacing: '-0.01em' }}>
            4주 입문이 끝났을 때 이것만큼은 손에 쥐고 가게 됩니다.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
            {AFTER.map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: S.md, alignItems: 'flex-start',
                padding: S.md, background: C.surface,
                borderRadius: '16px', border: `1px solid ${C.border}`,
              }}>
                <span style={{ fontSize: '28px', flexShrink: 0 }}>{item.icon}</span>
                <p style={{ fontSize: T.body, color: C.textSub, lineHeight: 1.7, letterSpacing: '-0.01em', marginTop: '4px' }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ⑨ 중간 CTA ══ */}
      <section style={{ padding: `56px ${S.md}`, background: C.primary, textAlign: 'center' }}>
        <p style={{ fontSize: T.h2, fontWeight: 800, color: '#fff', marginBottom: S.lg, letterSpacing: '-0.03em', lineHeight: 1.4 }}>
          손주에게 전하는 4주,<br />같이 시작해봐요
        </p>
        <a href="#apply" style={{
          display: 'inline-block', background: '#fff', color: C.primary,
          padding: '15px 36px', borderRadius: '52px',
          fontWeight: 700, fontSize: T.body, textDecoration: 'none', letterSpacing: '-0.01em',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        }}>
          4주 입문 신청하기 →
        </a>
      </section>

      {/* ══ ⑩ 대상 + 분반 + 혼합 진행 ══ */}
      <section style={{ padding: `${S.section} ${S.md}`, background: C.surface }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: S.sm }}>
          {/* 대상 */}
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '20px', padding: `${S.lg} ${S.md}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: T.h2, fontWeight: 700, marginBottom: S.md, letterSpacing: '-0.02em' }}>
              이런 분들이랑 같이하고 싶어요
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

          {/* 분반 */}
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '20px', padding: `${S.lg} ${S.md}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: T.h2, fontWeight: 700, marginBottom: S.md, letterSpacing: '-0.02em' }}>
              7세 전후, 분반 운영합니다
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S.sm }}>
              <div style={{ padding: S.md, background: C.orange10, borderRadius: '14px' }}>
                <p style={{ fontSize: '28px', marginBottom: S.xs }}>👶</p>
                <p style={{ fontSize: T.body, fontWeight: 700, color: C.dark, marginBottom: '2px', letterSpacing: '-0.01em' }}>유아반</p>
                <p style={{ fontSize: T.small, color: C.textSub, letterSpacing: '-0.01em' }}>~7세 (취학 전후)</p>
              </div>
              <div style={{ padding: S.md, background: C.orange10, borderRadius: '14px' }}>
                <p style={{ fontSize: '28px', marginBottom: S.xs }}>🎒</p>
                <p style={{ fontSize: T.body, fontWeight: 700, color: C.dark, marginBottom: '2px', letterSpacing: '-0.01em' }}>초저반</p>
                <p style={{ fontSize: T.small, color: C.textSub, letterSpacing: '-0.01em' }}>7세+ (초등 저학년)</p>
              </div>
            </div>
          </div>

          {/* 진행 방식 (혼합) */}
          <div style={{ background: C.dark, borderRadius: '20px', padding: `${S.lg} ${S.md}` }}>
            <h2 style={{ fontSize: T.h2, fontWeight: 700, marginBottom: S.md, color: '#fff', letterSpacing: '-0.02em' }}>
              4주 입문은 이렇게 합니다
            </h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: S.sm }}>
              {HOW.map((item, i) => (
                <li key={i} style={{
                  display: 'flex', gap: S.sm, fontSize: T.body, lineHeight: 1.65, letterSpacing: '-0.01em',
                  color: item.text.startsWith('강의 아닙니다') ? C.primary : '#ccc',
                }}>
                  <span style={{ flexShrink: 0, fontSize: '18px' }}>{item.icon}</span>
                  <span style={{ fontWeight: item.text.startsWith('강의 아닙니다') ? 700 : 400 }}>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══ ⑪ 신청 폼 ══ */}
      <section id="apply" style={{ padding: `${S.section} ${S.md}`, background: C.bg }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: T.h2, fontWeight: 700, textAlign: 'center', marginBottom: S.xs, letterSpacing: '-0.03em' }}>
            4주 입문, 손주에게 전하는 첫 걸음
          </h2>
          <p style={{ color: C.textMuted, textAlign: 'center', fontSize: T.body, marginBottom: S.xl, letterSpacing: '-0.01em' }}>
            분기 1번 · 소수 정예
          </p>
          {submitted ? (
            <div style={{
              textAlign: 'center', padding: `56px ${S.md}`,
              background: C.orange10, borderRadius: '24px', border: `1px solid ${C.orange20}`,
            }}>
              <div style={{ fontSize: '52px', marginBottom: S.sm }}>☺️</div>
              <p style={{ fontSize: T.h2, fontWeight: 700, marginBottom: S.xs, letterSpacing: '-0.02em' }}>신청해주셨습니다!</p>
              <p style={{ color: C.textSub, fontSize: T.body, lineHeight: 1.7, letterSpacing: '-0.01em', marginBottom: S.lg }}>
                카톡으로 먼저 연락드릴게요.<br />4주 입문 일정 안내 드립니다.
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
              {/* 분반 라디오 (신규) */}
              <div>
                <label style={{ display: 'block', fontSize: T.small, fontWeight: 600, marginBottom: S.xs, color: C.text, letterSpacing: '-0.01em' }}>
                  신청 반
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S.xs }}>
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: S.xs,
                    padding: '14px 16px', border: `1.5px solid ${C.border}`, borderRadius: '12px',
                    fontSize: T.small, color: C.textSub, cursor: 'pointer', letterSpacing: '-0.01em',
                  }}>
                    <input type="radio" name="class_type" value="유아반" required style={{ accentColor: C.primary }} />
                    👶 유아반 (~7세)
                  </label>
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: S.xs,
                    padding: '14px 16px', border: `1.5px solid ${C.border}`, borderRadius: '12px',
                    fontSize: T.small, color: C.textSub, cursor: 'pointer', letterSpacing: '-0.01em',
                  }}>
                    <input type="radio" name="class_type" value="초저반" required style={{ accentColor: C.primary }} />
                    🎒 초저반 (7세+)
                  </label>
                </div>
              </div>
              {/* 메모 (선택) */}
              <div>
                <label htmlFor="memo" style={{ display: 'block', fontSize: T.small, fontWeight: 600, marginBottom: S.xs, color: C.text, letterSpacing: '-0.01em' }}>
                  메모 (선택)
                </label>
                <textarea
                  id="memo" name="memo" rows={3} placeholder="궁금한 점 · 자녀 상황 등"
                  style={{ width: '100%', padding: '14px 16px', border: `1.5px solid ${C.border}`, borderRadius: '12px', fontSize: '15px', outline: 'none', transition: 'border-color 0.15s', letterSpacing: '-0.01em', color: C.text, resize: 'vertical', fontFamily: 'inherit' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = C.border)}
                />
              </div>
              <button type="submit" disabled={submitting} style={{
                background: submitting ? '#ccc' : C.primary, color: '#fff', border: 'none',
                padding: '18px', borderRadius: '14px', fontSize: T.h2, fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer', marginTop: S.xs,
                letterSpacing: '-0.01em',
                boxShadow: submitting ? 'none' : `0 6px 20px rgba(255,111,15,0.35)`,
              }}>
                {submitting ? '신청 중...' : '4주 입문 함께하기'}
              </button>
              <p style={{ textAlign: 'center', fontSize: T.caption, color: C.textMuted, marginTop: S.xs, letterSpacing: '-0.01em', lineHeight: 1.6 }}>
                카톡으로 먼저 연락드립니다. 부담 없이 신청해주세요.<br />
                본과정 8주는 4주 입문 끝난 후 안내드립니다.
              </p>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
