import { useState } from 'react';
import type { FormEvent } from 'react';

const FORMSPREE_ID = 'meelbwyv';

// ─── 컬러 (LAND-002 유지·웜톤 그라데이션 강화) ───
const C = {
  primary:      '#FF6F0F',
  primaryDk:    '#E05A00',
  bg:           '#FFFFFF',
  pageBg:       '#FAF7F2',  // 페이지 전체 베이지 톤
  surface:      '#F4F4F4',
  dark:         '#212124',
  text:         '#212124',
  textSub:      '#3D3D3D',
  textMuted:    '#6B6B6B',
  border:       '#EBEBEB',
  orange05:     '#FFF9F3',
  orange10:     '#FFF1E8',
  orange20:     '#FFD9B3',
  orange30:     '#FFC080',
  // 폴인 차용 — 세퍼레이터·강조
  accent:       '#FF6F0F',
};

const T = {
  display: 'clamp(32px, 7vw, 48px)' as const,
  hero:    'clamp(36px, 8vw, 56px)' as const,
  h1:      'clamp(28px, 5vw, 36px)' as const,
  h2:      '24px',
  h3:      '20px',
  body:    '16px',
  bodySm:  '15px',
  small:   '13px',
  caption: '12px',
};

const S = {
  xs:  '8px',
  sm:  '16px',
  md:  '24px',
  lg:  '32px',
  xl:  '48px',
  xxl: '64px',
  section: '80px',
};

// ─── 데이터 ─────────────────────────────────────

const PAINS = [
  {
    head: '"엄마 돈 있잖아"',
    body: '마트에서, 문구점에서, 다이소에서. 사달라고 조르고, 안 사주면 떼를 써요.',
    sting: '"이번에만 사주자"가 매번 돼요.',
  },
  {
    head: '첫 한 달은 정말 열심히 했는데...',
    body: '용돈도 정해서 주고, 용돈기입장도 같이 쓰고, 홈 아르바이트도 시켜봤어요. 결국 흐지부지 됐어요.',
    sting: '"이게 맞나?" 싶은 순간이 자꾸 와요.',
  },
  {
    head: '우리 애는 완전 소비요정이에요',
    body: '문방구·다이소만 가면 눈이 반짝반짝. 가격은 안 보고 일단 사고 싶어해요.',
    sting: '그렇다고 무조건 안 사주는 것도 답이 아닌 것 같고요.',
  },
  {
    head: '사실 저도 경제관념이 부족해요',
    body: '학교 다닐 때 경제·금융은 거의 안 배웠어요. 부모님도 "물고기를 잡아주는 분"이셨고요.',
    sting: '잘못 가르치면 어떡하나, 그게 더 무서워요.',
  },
];

const INFO = [
  { label: '일시',     value: '추후 안내 (분기 1번 운영)' },
  { label: '진행방식', value: '평택 오프닝·중간 모임 + 줌수업 (혼합)' },
  { label: '모집인원', value: '유아반 5명 / 초저반 5명 (소수 정예)' },
  { label: '신청마감', value: '모집 시작 후 안내' },
];

const TARGETS = [
  '5~10세 자녀 경제교육, 어디서 시작할지 모르는 분',
  '정답 듣기보다 같이 고민하고 싶은 분',
  '혼자 하기 막막해서 비슷한 고민하는 부모 만나고 싶은 분',
  '평택·경기남부에서 오프닝·중간 모임 참여 가능한 분',
];

const GOALS = [
  {
    n: '①',
    title: '아이에게 꺼낼 첫 마디',
    arrow: '→ 막막함 풀어내기',
    body: '"경제" 대신 아이에게 어떻게 말을 꺼낼지, 첫 마디부터 같이 정리합니다. 30년 회고에서 검증된 표현으로.',
  },
  {
    n: '②',
    title: '우리 집만의 4영역 원칙',
    arrow: '→ 시스템 만들기',
    body: '소비·저축·투자·기부 4영역으로 나누는 우리 집 용돈 원칙. 가족 회의에서 직접 만들고 평생 갑니다.',
  },
  {
    n: '③',
    title: '30년 회고에서 정리한 10가지 도구',
    arrow: '→ 실천 환경 구축',
    body: '주간 용돈·기입장·매칭 적금·홈 아르바이트·재래시장 등 10가지 실천 도구로 가정 환경을 바꿉니다.',
  },
  {
    n: '④',
    title: '부모 동반·평생 가는 습관',
    arrow: '→ 지속하는 부모 모임',
    body: '4주 끝나면 평생 가는 단톡방·다신보(다 함께 신문 보는 날). 혼자 하지 않아도 되는 동료가 생깁니다.',
  },
];

const CURRICULUM = [
  {
    week: '1주차',
    time: '주말 오후 (예정)',
    title: '돈의 출발 — 노동의 대가',
    bullets: [
      '돈이 어떻게 생기는지 첫 경험',
      '홈 아르바이트 1가지 시작',
      '첫 주간 용돈 + 기입장 작성',
      '🎯 미션: 1주일 홈 아르바이트 + 기입장 3쪽',
    ],
  },
  {
    week: '2주차',
    time: '주말 오후 (예정)',
    title: '필요 vs 욕구 · 기회비용',
    bullets: [
      '"사고 싶은 것" vs "사야 하는 것" 구분',
      '마트·문방구·다이소에서 매번 흐트러지는 이유',
      '가격 비교·반반 부담 실습',
      '🎯 미션: 1주일 산 것 → 필요/욕구 표 작성',
    ],
  },
  {
    week: '3주차',
    time: '주말 오후 (예정)',
    title: '4영역 분리 — 소비·저축·투자·기부',
    bullets: [
      '용돈을 한 통이 아닌 4개로 나누기',
      '저금통 3/4통 만들기',
      '100% 매칭 적금 시작',
      '🎯 미션: 4영역 저금통 + 첫 매칭 적금',
    ],
  },
  {
    week: '4주차',
    time: '주말 오후 (평택 오프)',
    title: '우리 집만의 용돈 원칙',
    bullets: [
      '용돈기입장·용돈계약서 작성',
      '4주 동안 시도한 것을 우리 집 원칙으로',
      '가족 회의 + 발표회',
      '🎯 미션: 가족 회의에서 용돈계약서 확정',
    ],
  },
];

const HOWS = [
  { icon: '🚪', text: '오프닝 — 평택 카페에서 첫 만남' },
  { icon: '💻', text: '주차별 수업 — 줌 (40분+ · 녹화본 제공)' },
  { icon: '🤝', text: '중간 모임 — 평택 오프 (중간 점검)' },
  { icon: '👨‍👩‍👧', text: '자녀+부모 동반 가능' },
  { icon: '📵', text: '강의 아닙니다 — 같이 이야기합니다' },
];

const TESTIMONIALS = [
  '예전엔 "엄마 돈 있잖아" 매번 떼썼는데, 이제는 필요와 욕구를 구분하고 한 개만 골라요.',
  '첫 한 달 열심히 하다 흐지부지 됐었는데, 4주 동안 꾸준해지는 습관이 생겼어요.',
  '용돈을 한 통에 다 모았는데, 이제는 4영역(소비·저축·투자·기부)으로 분류해요.',
  '"카드는 돈이 나오는 줄" 알았는데, 카드에 돈이 들어있다는 걸 이해하기 시작했어요.',
  '엄마가 끌고가는 용돈이었는데, 이제는 아이가 자기 것으로 챙기더라고요.',
];

const READ_ME = [
  '5~10세 자녀를 둔 부모님 누구나 참여 가능합니다.',
  '본 과정은 평택 오프닝·중간 모임 + 줌수업 혼합으로 진행됩니다.',
  '강의+같이 이야기 구성으로 회차 1시간 30분 진행됩니다.',
  '워크북·부모 안내서가 매주 제공됩니다.',
  '실습을 위해 용돈기입장·저금통 등 준비물이 안내됩니다.',
  '8주 본과정은 4주 입문 끝난 분들께 별도 안내됩니다.',
];

// ─── 공통 컴포넌트 ──────────────────────────────

function Separator() {
  return (
    <div style={{
      maxWidth: '640px',
      margin: '0 auto',
      height: '1px',
      background: C.primary,
      opacity: 0.3,
    }} />
  );
}

// ─── App ────────────────────────────────────────

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
    <div style={{
      fontFamily: "'Pretendard Variable','Pretendard','Apple SD Gothic Neo','Noto Sans KR',sans-serif",
      background: C.pageBg,
      minHeight: '100vh',
      color: C.text,
      wordBreak: 'keep-all',
      overflowWrap: 'break-word',
    }}>
      {/* @import Pretendard */}
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css');
        body { font-family: 'Pretendard Variable', sans-serif; }
      `}</style>

      {/* ══════════════════════════════════════════
          ① HERO — 메인 비주얼 카드 + 뱃지 스티커
          ══════════════════════════════════════════ */}
      <section style={{ padding: `${S.xl} ${S.md} ${S.md}`, background: C.pageBg }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          {/* 메인 헤드라인 카드 */}
          <div style={{
            background: C.orange10,
            borderRadius: '28px',
            padding: '72px 48px 80px',
            marginBottom: S.xl,
          }}>
            <h1 style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(34px, 6.2vw, 56px)',
              lineHeight: 1.18,
              letterSpacing: '-0.02em',
              color: C.dark,
              display: 'flex',
              flexDirection: 'column',
            }}>
              <span>30년 금융을 가르치고,</span>
              <span>30년 아이를 키우며</span>
              <span>알게 된 것</span>
              <span style={{
                color: C.primary,
                marginTop: '1em',
                fontSize: '0.82em',
              }}>
                돈의 기술보다, 태도였습니다
              </span>
            </h1>
          </div>

          {/* 서브 영역 */}
          <div style={{ padding: `0 ${S.xs}` }}>
            <p style={{
              margin: 0,
              fontWeight: 700,
              fontSize: 'clamp(20px, 3.4vw, 28px)',
              lineHeight: 1.5,
              letterSpacing: '-0.01em',
              color: C.dark,
            }}>
              내 손주라면 꼭 알려주고 싶은,<br />
              경제 습관과 삶의 자세
            </p>

            {/* 상품 */}
            <div style={{
              marginTop: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: 700,
                color: C.primary,
                border: `1.5px solid ${C.primary}`,
                borderRadius: '999px',
                padding: '5px 13px',
                whiteSpace: 'nowrap',
              }}>
                4주 입문
              </span>
              <span style={{
                fontSize: 'clamp(19px, 3vw, 24px)',
                fontWeight: 800,
                letterSpacing: '-0.01em',
                color: C.dark,
              }}>
                엉클조 자녀경제 클럽
              </span>
            </div>

            {/* 엉클조 큰 프로필 + 자기소개 */}
            <div style={{
              marginTop: '40px',
              display: 'flex',
              gap: S.lg,
              alignItems: 'flex-start',
            }}>
              <img
                src="/uncle-jo.png"
                alt="엉클조"
                style={{
                  width: '120px', height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: T.h3,
                  fontWeight: 800,
                  color: C.dark,
                  marginBottom: '4px',
                  letterSpacing: '-0.02em',
                }}>
                  엉클조 (조경만)
                </p>
                <p style={{
                  fontSize: T.bodySm,
                  color: C.primary,
                  fontWeight: 600,
                  marginBottom: S.md,
                  letterSpacing: '-0.01em',
                }}>
                  엉클조아카데미 대표 · 금융교육 강사
                </p>
              </div>
            </div>

            <div style={{ fontSize: T.bodySm, color: C.textSub, lineHeight: 1.8, letterSpacing: '-0.01em', marginTop: S.lg }}>
              <p style={{ marginBottom: S.md }}>
                연세대 경제학과를 졸업했어요.<br />
                증권사·금융권에서 10년을 일했고요.
              </p>
              <p style={{ marginBottom: S.md }}>
                그 다음 20년은 자녀경제교육 강사로 보냈습니다.<br />
                수많은 부모님들의 돈 고민을 들었어요.
              </p>
              <p style={{ marginBottom: S.md }}>
                방송도 20년 넘게 했어요.<br />
                <strong style={{ color: C.dark }}>라디오 패널로, 케이블 방송에 출연</strong>하면서<br />
                대중과 만났습니다.
              </p>
              <p style={{ marginBottom: S.md }}>
                직접 가르치고 30년을 지켜봐 보니,<br />
                <strong style={{ color: C.dark }}>어릴 때 만든 돈 습관이 평생 가더라고요.</strong><br />
                그때 시도하길 잘했다는 생각이 들어요.
              </p>
              <p>
                손주 볼 나이가 된 지금 —<br />
                30년 전 가르쳤던 그대로,<br />
                30년 키워보고 보이는 것까지,<br />
                수많은 부모님 상담에서 모은 것을,<br />
                <strong style={{ color: C.primary }}>손주들에게 다시 전하려고 합니다.</strong>
              </p>
            </div>

            {/* 메타 */}
            <div style={{
              marginTop: '28px',
              paddingTop: '22px',
              borderTop: `1px solid rgba(0,0,0,0.08)`,
              fontSize: '14px',
              color: C.textMuted,
              fontWeight: 600,
            }}>
              평택 · 소규모 모임
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ② 부모 공감 (Pain 4 — 3단 구조 유지)
          ══════════════════════════════════════════ */}
      <section style={{ padding: `${S.section} ${S.md}`, background: C.pageBg }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: T.h1,
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: S.xl,
            letterSpacing: '-0.03em',
            color: C.dark,
          }}>
            이런 장면,<br />익숙하지 않으세요?
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.md }}>
            {PAINS.map((p, i) => (
              <div key={i} style={{
                background: C.bg,
                borderRadius: '20px',
                padding: S.md,
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', gap: S.xs, marginBottom: S.sm }}>
                  <span style={{ fontSize: '20px' }}>😅</span>
                  <p style={{
                    fontSize: T.body,
                    fontWeight: 700,
                    color: C.dark,
                    letterSpacing: '-0.02em',
                  }}>
                    {p.head}
                  </p>
                </div>
                <p style={{
                  fontSize: T.bodySm,
                  color: C.textSub,
                  lineHeight: 1.7,
                  marginBottom: S.sm,
                  letterSpacing: '-0.01em',
                }}>
                  {p.body}
                </p>
                <div style={{
                  borderLeft: `3px solid ${C.primary}`,
                  paddingLeft: S.sm,
                  fontSize: T.bodySm,
                  fontWeight: 600,
                  color: C.dark,
                  letterSpacing: '-0.01em',
                }}>
                  👉 {p.sting}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ⑦ 헤드 메시지 박스 (오렌지 배경)
          ══════════════════════════════════════════ */}
      <section style={{ padding: `${S.section} ${S.md}` }}>
        <div style={{
          maxWidth: '720px',
          margin: '0 auto',
          background: C.orange10,
          borderRadius: '24px',
          padding: `${S.xl} ${S.lg}`,
          textAlign: 'center',
        }}>
          <h2 style={{
            fontSize: T.h1,
            fontWeight: 900,
            lineHeight: 1.4,
            color: C.dark,
            letterSpacing: '-0.03em',
            marginBottom: S.lg,
          }}>
            4주의 깊이 있는 코칭으로<br />
            우리 아이의 첫 용돈 체계를<br />
            만듭니다.
          </h2>
          <p style={{
            fontSize: T.body,
            color: C.textSub,
            lineHeight: 1.9,
            letterSpacing: '-0.01em',
            textAlign: 'left',
            maxWidth: '560px',
            margin: '0 auto',
          }}>
            <strong style={{ color: C.dark }}>30년 전 제 아이들에게 가르쳤던 그대로,</strong><br />
            30년 자녀를 키워보고 보이는 것까지,<br />
            수많은 부모님들의 돈 고민에서 모은 것을<br />
            <strong style={{ color: C.dark }}>4주 입문</strong>으로 풀어갑니다.
            <br /><br />
            정답을 드리러 가는 게 아닙니다.<br />
            <strong style={{ color: C.primary }}>같이 풀어갑니다.</strong>
            <br /><br />
            손주 볼 나이가 된 엉클조가,<br />
            평택 부모들과 이 과정을 여는 이유입니다.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ⑧ 4가지 Goal — 오렌지 배경 + 흰 카드 2×2
          ══════════════════════════════════════════ */}
      <section style={{ padding: `${S.section} ${S.md}` }}>
        <div style={{
          maxWidth: '720px',
          margin: '0 auto',
          background: C.orange20,
          borderRadius: '24px',
          padding: `${S.xl} ${S.lg}`,
        }}>
          <h2 style={{
            fontSize: T.h1,
            fontWeight: 900,
            textAlign: 'center',
            color: C.dark,
            letterSpacing: '-0.03em',
            marginBottom: S.xl,
          }}>
            엉클조 자녀경제 클럽의<br />4가지 Goal
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: S.md,
          }}>
            {GOALS.map((g, i) => (
              <div key={i} style={{
                background: C.bg,
                borderRadius: '20px',
                padding: S.xl,
                display: 'flex',
                flexDirection: 'column',
              }}>
                <div style={{
                  width: '48px', height: '48px',
                  borderRadius: '50%',
                  background: C.dark,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '26px',
                  fontWeight: 800,
                  marginBottom: S.md,
                }}>{g.n}</div>
                <p style={{
                  fontSize: T.h3,
                  fontWeight: 800,
                  color: C.dark,
                  letterSpacing: '-0.02em',
                  marginBottom: '6px',
                  lineHeight: 1.4,
                }}>
                  {g.title}
                </p>
                <p style={{
                  fontSize: T.body,
                  fontWeight: 600,
                  color: C.primary,
                  letterSpacing: '-0.01em',
                  marginBottom: S.md,
                  paddingBottom: S.md,
                  borderBottom: `1px solid ${C.border}`,
                }}>
                  {g.arrow}
                </p>
                <p style={{
                  fontSize: T.bodySm,
                  color: C.textSub,
                  lineHeight: 1.75,
                  letterSpacing: '-0.01em',
                }}>
                  {g.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ⑨ 일정 및 커리큘럼 — 오렌지 배경 + 회차별 카드
          ══════════════════════════════════════════ */}
      <section style={{ padding: `${S.section} ${S.md}` }}>
        <div style={{
          maxWidth: '720px',
          margin: '0 auto',
          background: C.orange20,
          borderRadius: '24px',
          padding: `${S.xl} ${S.lg}`,
        }}>
          <h2 style={{
            fontSize: T.h1,
            fontWeight: 900,
            textAlign: 'center',
            color: C.dark,
            letterSpacing: '-0.03em',
            marginBottom: S.xl,
          }}>
            일정 및 커리큘럼
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: S.md }}>
            {CURRICULUM.map((c, i) => (
              <div key={i} style={{
                background: C.bg,
                borderRadius: '16px',
                padding: S.lg,
                display: 'flex',
                flexDirection: 'column',
              }}>
                <div style={{
                  width: '36px', height: '36px',
                  borderRadius: '50%',
                  background: C.dark,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 800,
                  marginBottom: S.sm,
                }}>
                  {['①', '②', '③', '④'][i]}
                </div>
                <p style={{
                  fontSize: T.h3,
                  fontWeight: 800,
                  color: C.dark,
                  letterSpacing: '-0.02em',
                  marginBottom: '6px',
                  lineHeight: 1.4,
                }}>
                  {c.title}
                </p>
                <p style={{
                  fontSize: T.body,
                  fontWeight: 600,
                  color: C.primary,
                  letterSpacing: '-0.01em',
                  marginBottom: S.md,
                  paddingBottom: S.md,
                  borderBottom: `1px solid ${C.border}`,
                }}>
                  → {c.week} · {c.time}
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: S.xs }}>
                  {c.bullets.map((b, j) => (
                    <li key={j} style={{
                      display: 'flex',
                      gap: S.xs,
                      fontSize: T.small,
                      color: C.textSub,
                      lineHeight: 1.65,
                      letterSpacing: '-0.01em',
                    }}>
                      <span style={{ color: C.primary, fontWeight: 700 }}>•</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ⑩ Before → After (말풍선 후기 형식)
          ══════════════════════════════════════════ */}
      <section style={{ padding: `${S.section} ${S.md}` }}>
        <div style={{
          maxWidth: '720px',
          margin: '0 auto',
          background: C.orange20,
          borderRadius: '24px',
          padding: `${S.xl} ${S.lg}`,
        }}>
          {/* 상단 제목 박스 */}
          <div style={{
            background: C.bg,
            borderRadius: '14px',
            padding: `${S.md} ${S.lg}`,
            textAlign: 'center',
            marginBottom: S.xl,
          }}>
            <p style={{
              color: C.primary,
              fontSize: T.bodySm,
              fontWeight: 600,
              letterSpacing: '0.06em',
              marginBottom: '6px',
            }}>
              4주 끝나면 어떻게 달라질까요?
            </p>
            <h2 style={{
              fontSize: T.h2,
              fontWeight: 900,
              color: C.dark,
              letterSpacing: '-0.03em',
              lineHeight: 1.35,
            }}>
              30년 동안 봐온<br />자녀의 변화 패턴
            </h2>
          </div>

          {/* 말풍선 (좌우 교차) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.md }}>
            {TESTIMONIALS.map((t, i) => {
              const isRight = i % 2 === 0;
              const avatar = (
                <div style={{
                  width: '44px', height: '44px',
                  borderRadius: '50%',
                  background: C.dark,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  flexShrink: 0,
                }}>👤</div>
              );
              return (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: isRight ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end',
                  gap: S.xs,
                }}>
                  {!isRight && avatar}
                  <div style={{
                    maxWidth: '78%',
                    background: isRight ? C.bg : C.orange10,
                    borderRadius: '18px',
                    padding: `${S.sm} ${S.md}`,
                    fontSize: T.bodySm,
                    color: C.dark,
                    lineHeight: 1.7,
                    letterSpacing: '-0.01em',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  }}>
                    {t}
                  </div>
                  {isRight && avatar}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          ⑪ 진행 방식 + 장소 안내
          ══════════════════════════════════════════ */}
      <section style={{ padding: `${S.section} ${S.md}` }}>
        <div style={{
          maxWidth: '720px',
          margin: '0 auto',
          background: C.orange10,
          borderRadius: '24px',
          padding: `${S.xl} ${S.lg}`,
        }}>
          <h2 style={{
            fontSize: T.h1,
            fontWeight: 900,
            textAlign: 'center',
            color: C.dark,
            letterSpacing: '-0.03em',
            marginBottom: S.xl,
          }}>
            장소·진행 안내
          </h2>

          <div style={{
            background: C.bg,
            borderRadius: '16px',
            padding: S.lg,
          }}>
            <h3 style={{
              fontSize: T.h3,
              fontWeight: 800,
              color: C.dark,
              marginBottom: S.md,
              letterSpacing: '-0.02em',
            }}>4주는 이렇게 진행됩니다</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: S.sm, marginBottom: S.lg }}>
              {HOWS.map((h, i) => (
                <li key={i} style={{
                  display: 'flex',
                  gap: S.sm,
                  fontSize: T.body,
                  color: h.text.startsWith('강의 아닙니다') ? C.primary : C.textSub,
                  fontWeight: h.text.startsWith('강의 아닙니다') ? 700 : 400,
                  lineHeight: 1.6,
                  letterSpacing: '-0.01em',
                }}>
                  <span style={{ fontSize: '20px' }}>{h.icon}</span>
                  {h.text}
                </li>
              ))}
            </ul>

            <div style={{
              borderTop: `1px solid ${C.border}`,
              paddingTop: S.lg,
            }}>
              <h3 style={{
                fontSize: T.h3,
                fontWeight: 800,
                color: C.dark,
                marginBottom: S.md,
                letterSpacing: '-0.02em',
              }}>장소</h3>
              <p style={{
                fontSize: T.body,
                color: C.textSub,
                lineHeight: 1.7,
                letterSpacing: '-0.01em',
              }}>
                <strong style={{ color: C.dark }}>평택 카페</strong> (오프닝·중간 모임)<br />
                정확한 장소는 신청 후 안내드립니다.
              </p>
              <p style={{
                fontSize: T.bodySm,
                color: C.textMuted,
                marginTop: S.sm,
                lineHeight: 1.7,
                letterSpacing: '-0.01em',
              }}>
                평택·경기남부 거주 부모 우선. 줌수업은 어디서나 참여 가능.
              </p>
            </div>

            {/* 분반 카드 */}
            <div style={{
              marginTop: S.lg,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: S.sm,
            }}>
              <div style={{ padding: S.md, background: C.orange10, borderRadius: '14px' }}>
                <p style={{ fontSize: '28px', marginBottom: '4px' }}>👶</p>
                <p style={{ fontSize: T.body, fontWeight: 800, color: C.dark, letterSpacing: '-0.01em' }}>유아반</p>
                <p style={{ fontSize: T.small, color: C.textSub, letterSpacing: '-0.01em' }}>~7세 (취학 전후)</p>
              </div>
              <div style={{ padding: S.md, background: C.orange10, borderRadius: '14px' }}>
                <p style={{ fontSize: '28px', marginBottom: '4px' }}>🎒</p>
                <p style={{ fontSize: T.body, fontWeight: 800, color: C.dark, letterSpacing: '-0.01em' }}>초저반</p>
                <p style={{ fontSize: T.small, color: C.textSub, letterSpacing: '-0.01em' }}>7세+ (초등 저학년)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* ══════════════════════════════════════════
          ⑪ 표 정보 (일시·진행·모집·마감)
          ══════════════════════════════════════════ */}
      <section style={{ padding: `${S.xl} ${S.md}`, background: C.pageBg }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {INFO.map((item, i) => (
                <tr key={i}>
                  <td style={{
                    width: '110px',
                    padding: `${S.sm} 0`,
                    fontSize: T.body,
                    fontWeight: 700,
                    color: C.dark,
                    verticalAlign: 'top',
                    letterSpacing: '-0.01em',
                  }}>
                    {item.label}
                  </td>
                  <td style={{
                    padding: `${S.sm} 0`,
                    fontSize: T.body,
                    color: C.textSub,
                    lineHeight: 1.6,
                    letterSpacing: '-0.01em',
                  }}>
                    {item.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Separator />

      {/* ══════════════════════════════════════════
          ⑫ 이런 분들께 추천해요
          ══════════════════════════════════════════ */}
      <section style={{ padding: `${S.xl} ${S.md}`, background: C.pageBg }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: T.h1,
            fontWeight: 800,
            color: C.dark,
            marginBottom: S.lg,
            letterSpacing: '-0.03em',
            lineHeight: 1.35,
          }}>
            이런 분들께 추천해요
          </h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: S.sm }}>
            {TARGETS.map((t, i) => (
              <li key={i} style={{
                display: 'flex',
                gap: S.sm,
                fontSize: T.body,
                color: C.textSub,
                lineHeight: 1.6,
                letterSpacing: '-0.01em',
              }}>
                <span style={{ color: C.primary, fontWeight: 700 }}>•</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Separator />

      {/* ══════════════════════════════════════════
          ⑬ 꼭 읽어주세요
          ══════════════════════════════════════════ */}
      <section style={{ padding: `${S.section} ${S.md}`, background: C.pageBg }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{
            background: C.surface,
            borderRadius: '16px',
            padding: S.lg,
          }}>
            <p style={{
              fontSize: T.h3,
              fontWeight: 800,
              color: C.dark,
              marginBottom: S.md,
              letterSpacing: '-0.02em',
            }}>
              🚩 꼭! 읽어주세요.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: S.sm }}>
              {READ_ME.map((r, i) => (
                <li key={i} style={{
                  display: 'flex',
                  gap: S.sm,
                  fontSize: T.bodySm,
                  color: C.textSub,
                  lineHeight: 1.6,
                  letterSpacing: '-0.01em',
                }}>
                  <span style={{ color: C.primary, fontWeight: 700 }}>·</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ⑫ CTA 폼
          ══════════════════════════════════════════ */}
      <section id="apply" style={{ padding: `${S.section} ${S.md} ${S.xxl}`, background: C.pageBg }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{
            background: C.orange10,
            borderRadius: '24px',
            padding: `${S.xl} ${S.lg}`,
          }}>
            <h2 style={{
              fontSize: T.h1,
              fontWeight: 900,
              textAlign: 'center',
              color: C.dark,
              letterSpacing: '-0.03em',
              marginBottom: S.xs,
              lineHeight: 1.35,
            }}>
              4주 입문<br />손주에게 전하는 첫 걸음
            </h2>
            <p style={{
              textAlign: 'center',
              fontSize: T.bodySm,
              color: C.textMuted,
              marginBottom: S.xl,
              letterSpacing: '-0.01em',
            }}>
              분기 1번 · 소수 정예 · 평택 + 줌 혼합
            </p>

            {submitted ? (
              <div style={{
                textAlign: 'center',
                padding: `${S.xl} ${S.md}`,
                background: C.bg,
                borderRadius: '20px',
              }}>
                <div style={{ fontSize: '52px', marginBottom: S.sm }}>☺️</div>
                <p style={{
                  fontSize: T.h3,
                  fontWeight: 700,
                  marginBottom: S.xs,
                  color: C.dark,
                  letterSpacing: '-0.02em',
                }}>신청해주셨습니다!</p>
                <p style={{
                  color: C.textSub,
                  fontSize: T.bodySm,
                  lineHeight: 1.7,
                  letterSpacing: '-0.01em',
                  marginBottom: S.lg,
                }}>
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
              <form onSubmit={handleSubmit} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: S.sm,
                background: C.bg,
                borderRadius: '20px',
                padding: S.lg,
              }}>
                {[
                  { label: '이름', name: 'name', type: 'text', placeholder: '홍길동' },
                  { label: '연락처', name: 'phone', type: 'tel', placeholder: '010-0000-0000' },
                  { label: '아이 나이', name: 'child_age', type: 'text', placeholder: '예) 7살, 초등 3학년' },
                ].map((field) => (
                  <div key={field.name}>
                    <label htmlFor={field.name} style={{
                      display: 'block',
                      fontSize: T.bodySm,
                      fontWeight: 700,
                      marginBottom: S.xs,
                      color: C.dark,
                      letterSpacing: '-0.01em',
                    }}>
                      {field.label}
                    </label>
                    <input
                      id={field.name} name={field.name} type={field.type} required placeholder={field.placeholder}
                      style={{
                        width: '100%', padding: '14px 16px',
                        border: `1.5px solid ${C.border}`, borderRadius: '12px',
                        fontSize: '16px', outline: 'none', transition: 'border-color 0.15s',
                        letterSpacing: '-0.01em', color: C.text,
                        fontFamily: 'inherit',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
                      onBlur={(e)  => (e.currentTarget.style.borderColor = C.border)}
                    />
                  </div>
                ))}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: T.bodySm,
                    fontWeight: 700,
                    marginBottom: S.xs,
                    color: C.dark,
                    letterSpacing: '-0.01em',
                  }}>
                    신청 반
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S.xs }}>
                    <label style={{
                      display: 'flex', alignItems: 'center', gap: S.xs,
                      padding: '14px 16px', border: `1.5px solid ${C.border}`, borderRadius: '12px',
                      fontSize: T.bodySm, color: C.textSub, cursor: 'pointer', letterSpacing: '-0.01em',
                    }}>
                      <input type="radio" name="class_type" value="유아반" required style={{ accentColor: C.primary }} />
                      👶 유아반 (~7세)
                    </label>
                    <label style={{
                      display: 'flex', alignItems: 'center', gap: S.xs,
                      padding: '14px 16px', border: `1.5px solid ${C.border}`, borderRadius: '12px',
                      fontSize: T.bodySm, color: C.textSub, cursor: 'pointer', letterSpacing: '-0.01em',
                    }}>
                      <input type="radio" name="class_type" value="초저반" required style={{ accentColor: C.primary }} />
                      🎒 초저반 (7세+)
                    </label>
                  </div>
                </div>
                <div>
                  <label htmlFor="memo" style={{
                    display: 'block',
                    fontSize: T.bodySm,
                    fontWeight: 700,
                    marginBottom: S.xs,
                    color: C.dark,
                    letterSpacing: '-0.01em',
                  }}>
                    메모 (선택)
                  </label>
                  <textarea
                    id="memo" name="memo" rows={3} placeholder="궁금한 점 · 자녀 상황 등"
                    style={{
                      width: '100%', padding: '14px 16px',
                      border: `1.5px solid ${C.border}`, borderRadius: '12px',
                      fontSize: '15px', outline: 'none', transition: 'border-color 0.15s',
                      letterSpacing: '-0.01em', color: C.text, resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = C.border)}
                  />
                </div>
                <button type="submit" disabled={submitting} style={{
                  background: submitting ? '#ccc' : C.primary, color: '#fff', border: 'none',
                  padding: '18px', borderRadius: '14px',
                  fontSize: T.h3, fontWeight: 800,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  marginTop: S.xs, letterSpacing: '-0.01em',
                  boxShadow: submitting ? 'none' : `0 6px 20px rgba(255,111,15,0.35)`,
                }}>
                  {submitting ? '신청 중...' : '4주 입문 함께하기'}
                </button>
                <p style={{
                  textAlign: 'center',
                  fontSize: T.small,
                  color: C.textMuted,
                  marginTop: S.xs,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.7,
                }}>
                  카톡으로 먼저 연락드립니다. 부담 없이 신청해주세요.<br />
                  본과정 8주는 4주 입문 끝난 후 안내드립니다.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
