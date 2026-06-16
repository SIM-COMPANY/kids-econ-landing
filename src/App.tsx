import { useState } from 'react';
import type { FormEvent } from 'react';
import VisitNote from './components/VisitNote';
import ContentTab from './components/ContentTab';
import ParentLive from './components/ParentLive';
import { tokenFromPath } from './lib/supabase';
import { LETTERS } from './mock/notes';

const FORMSPREE_ID = 'meelbwyv';

// ─── 컬러 (LAND-002 유지·웜톤 그라데이션 강화) ───
export const C = {
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

export const T = {
  display: 'clamp(32px, 7cqw, 48px)' as const,
  hero:    'clamp(36px, 8cqw, 56px)' as const,
  h1:      'clamp(28px, 5cqw, 36px)' as const,
  h2:      '24px',
  h3:      '20px',
  body:    '16px',
  bodySm:  '15px',
  small:   '13px',
  caption: '12px',
};

export const S = {
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
    body: '용돈도 정해서 주고, 용돈기입장도 같이 써봤어요. 결국 흐지부지 됐어요.',
    sting: '"이게 맞나?" 싶은 순간이 자꾸 와요.',
  },
  {
    head: '우리 애는 완전 소비요정이에요',
    body: '문방구·다이소만 가면 눈이 반짝반짝. 가격은 안 보고 일단 사고 싶어해요.',
    sting: '그렇다고 무조건 안 사주는 것도 답이 아닌 것 같고요.',
  },
  {
    head: '사실 저도 경제관념이 부족해요',
    body: '학교 다닐 때 경제·금융은 거의 안 배웠어요. 부모님도 그러셨고요.',
    sting: '잘못 가르치면 어떡하나, 그게 더 무서워요.',
  },
];

const INFO = [
  { label: '일시',     value: '추후 안내 (분기 1회 운영)' },
  { label: '진행방식', value: '부모 OT + 평택 오프(1·4·10주) + 줌 회고(2·3·5~9주)' },
  { label: '모집인원', value: '초등 저학년 7~9세 / 3~4가정 집중' },
  { label: '신청마감', value: '모집 시작 후 안내' },
];

const TARGETS = [
  '7~9세 자녀의 소비·용돈 습관, 어디서 시작할지 막막한 분',
  '정답을 듣기보다 같이 고민하고 싶은 분',
  '혼자 하면 흐지부지돼서, 같은 고민의 부모와 함께하고 싶은 분',
  '평택·경기남부에서 첫 만남·수료 모임에 올 수 있는 분',
];

const PROMISES = [
  {
    n: '①',
    title: '경제, 부모가 몰라도 됩니다',
    arrow: '→ 믿을 수 있는 어른이 곁에',
    body: '잘못 가르칠까 두려워 미뤄오셨죠? 그 두려움부터 내려놓으세요. 30년 가르치고 키워본 엉클조가, 부모 OT부터 수료까지 아이 곁에 있습니다.',
  },
  {
    n: '②',
    title: "'안 사주는 죄책감'이 '우리 집 약속'이 됩니다",
    arrow: '→ 사기 전에, 멈추는 순간 만들기',
    body: '마트·다이소에서 "이번에만"이 매번 되던 게, 아이가 사기 전 한 번 멈추고 스스로 하나를 고르는 장면으로 바뀝니다.',
  },
  {
    n: '③',
    title: '이번엔 흐지부지되지 않습니다',
    arrow: '→ 혼자가 아니라 함께 굴리기',
    body: '혼자 시작했다 한 달 만에 무너지던 용돈이, 같은 고민의 3~4가정과 매주 회고하며 10주를 끝까지 갑니다.',
  },
  {
    n: '④',
    title: '정답을 듣는 게 아니라, 함께 이야기합니다',
    arrow: '→ 강의가 아니라 회고 모임',
    body: '일방적인 강의가 아닙니다. 각자의 경험과 다른 집 이야기를 나누는 자리. 10주 뒤에도 계속 묻고 기댈 어른과 동료가 남습니다.',
  },
];

const CURRICULUM = [
  {
    badge: 'OT',
    week: '0주차 · 부모 OT',
    time: '부모만 · 줌 저녁 또는 평택',
    title: '부모 OT · 용돈 규칙 세우기',
    bullets: [
      '왜 지금 소비 습관인가 (엉클조의 30년 이야기)',
      '용돈 규칙 정하기 — 주간 지급 · 잔고 보너스 · 용돈기입장',
      "학원과 다른 점 · 집에서는 '덜 해도 된다'",
      '🎯 회고 씨앗: 우리 집 돈 풍경 한 가지 털어놓기',
    ],
  },
  {
    badge: '①',
    week: '1주차',
    time: '평택 오프',
    title: "용돈 계약서 작성 · '내 용돈'이 생긴다",
    bullets: [
      '얼굴 트기 · 엉클조·부모·아이 첫 신뢰',
      "용돈의 이해 — '부자란?' 소비·저축·기부로 방향 그리기",
      '용돈 계약서 쓰기 · 돼지 저금통 준비',
      '🎯 미션: 용돈 계약서 쓰고 첫 용돈 한 주 써보기',
    ],
  },
  {
    badge: '②',
    week: '2주차',
    time: '줌 회고',
    title: '주사위(윷) 놀이 — 잔고 지키기',
    bullets: [
      '해온 경험 나누기',
      '용돈 계약서 내용으로 주사위(윷) 놀이 (약 50칸 판)',
      '잔고 지키면 앞으로·보너스, 다 쓰면 뒤로',
      '🎯 미션: 놀이에서 잔고를 지킨 순간 기억해 오기',
    ],
  },
  {
    badge: '③',
    week: '3주차',
    time: '줌 회고',
    title: '이솝우화 ① 충동소비',
    bullets: [
      '동화로 보는 충동소비 (피노키오 · 개미와 베짱이 · 고깃덩어리 문 개 · 여우와 포도)',
      '6컷 만화로 이야기 나누기',
      '기회비용 — 하나를 고르면 하나를 포기',
      '🎯 미션: 충동적으로 샀다가 아쉬웠던 것 하나 떠올려 오기',
    ],
  },
  {
    badge: '④',
    week: '4주차',
    time: '평택 오프 · 여러 가정 함께',
    title: '경매 놀이 — 같은 돈, 무엇을 고를까',
    bullets: [
      '여러 가정 함께 — 정해진 돈으로 갖고 싶은 것 경매',
      '사고 싶은 물건 카드 쓰기 (간식 · 장난감 · 면제권 등)',
      '가위바위보로 순서 정해 1개씩 경매',
      '🎯 미션: 경매에서 끝까지 갖고 싶었던 것 하나 골라 오기',
    ],
  },
  {
    badge: '⑤',
    week: '5주차',
    time: '줌 회고',
    title: '쇼핑 리스트 작성',
    bullets: [
      '엄마의 소비 vs 자녀의 소비',
      '쇼핑 계획 세우기 — 쇼핑 리스트',
      '당장 · 1개월 후 · 1년 후 · 10년 후로 나눠 보기',
      '🎯 미션: 나만의 쇼핑 리스트 한 장 만들어 오기',
    ],
  },
  {
    badge: '⑥',
    week: '6주차',
    time: '줌 회고',
    title: '통장 만들기 · 체크카드',
    bullets: [
      '가까운 은행에서 통장 만들기 · 체크카드 발급',
      '용돈 일부는 통장에, 일부는 현금으로',
      '손에 쥔 돈과 모아둔 돈의 차이',
      '🎯 미션: 용돈에서 조금 떼어 통장(저금통)에 넣어 오기',
    ],
  },
  {
    badge: '⑦',
    week: '7주차',
    time: '줌 회고',
    title: '이솝우화 ② 과시소비',
    bullets: [
      '동화로 보는 과시소비 (벌거숭이 임금님 · 깃털 꽂은 까마귀)',
      '6컷 만화로 이야기 나누기',
      '남에게 보여주려는 소비를 알아채기',
      '🎯 미션: 남 보여주려고 사고 싶었던 것 있었는지 이야기해 오기',
    ],
  },
  {
    badge: '⑧',
    week: '8주차',
    time: '줌 회고',
    title: '함께 장 보기',
    bullets: [
      '물건 구입 — 가격의 이해',
      '아이가 좋아하는 것 vs 엄마가 필요한 것, 가격 조사·비교',
      '좋은 선택과 후회하는 선택',
      '🎯 미션: 같은 물건 두 가게 가격 비교해 오기',
    ],
  },
  {
    badge: '⑨',
    week: '9주차',
    time: '줌 회고',
    title: '이솝우화 ③ 모방소비',
    bullets: [
      '동화로 보는 모방소비 (황소와 개구리 · 황새 따라 간 뱁새)',
      '6컷 만화로 이야기 나누기',
      '분수에 맞게 — 남을 따라 하는 소비 경계하기',
      '🎯 미션: 친구 따라 사고 싶었던 것 있었는지 떠올려 오기',
    ],
  },
  {
    badge: '⑩',
    week: '10주차',
    time: '평택 오프 · 자녀 동반',
    title: '가족의 소비 · 수료',
    bullets: [
      '가족의 소비 — 당일/1박2일 여행 예산 세우기',
      '여행 후 예산 vs 실제 지출 분석',
      '더 좋은 여행을 위한 다른 선택',
      '우리 집 소비 원칙 선언 · 엉클조의 한마디',
      "🎯 수료 미션: '우리 집 소비 원칙' 한 줄 + 가족 여행 예산",
    ],
  },
];

const HOWS = [
  { icon: '🚪', text: '부모 OT — 시작 전, 부모만 (줌 저녁 또는 평택)' },
  { icon: '🤝', text: '첫 만남·경매·수료 — 평택 오프 (1·4·10주, 자녀 동반)' },
  { icon: '💻', text: '중간 회고 — 줌 모임 (2·3·5~9주, 녹화본 제공)' },
  { icon: '🗣️', text: '강의가 아닙니다 — 미션 → 회고 → 새 미션' },
];

const TESTIMONIALS = [
  '"마트에서 \'이번에만\' 하며 사주던 게, 이제 아이가 먼저 \'이건 다음에 살래\' 하더라고요."',
  '"혼자 시킬 땐 한 달 만에 흐지부지됐는데, 같이 회고하니 10주를 끝까지 갔어요."',
  '"\'엄마 돈 있잖아\' 떼쓰던 아이가, 자기 용돈 안에서 하나를 고르기 시작했어요."',
  '"제가 경제를 잘 몰라 미뤘는데, 제가 가르치지 않아도 된다는 걸 알고 마음이 놓였어요."',
  '"비슷한 고민을 하는 부모들과 이야기하니, 우리 집만 그런 게 아니구나 싶어 든든했어요."',
];

const READ_ME = [
  '초등 저학년(7~9세) 자녀를 둔 부모님이면 누구나 참여 가능합니다.',
  "시작 전 '부모 OT'가 있습니다 (부모만 참석).",
  '1·4·10주는 평택 오프, 나머지는 줌 회고로 진행됩니다.',
  "강의가 아니라, 미션을 해오고 함께 돌아보는 '회고 모임'입니다.",
  '워크북·부모 안내서가 제공됩니다.',
  "10주 용돈 연습은 '버는 것·불리는 것'이 아니라 '잘 쓰는 것(소비)'에 집중합니다.",
  '소비 다음은 저축 연습, 그다음은 투자 연습으로 이어집니다 (소비 → 저축 → 투자). 각 단계도 같은 10주 리듬으로, 앞 단계 습관 위에 쌓입니다.',
  '다음 단계는 용돈 연습 수료 후 별도로 안내됩니다.',
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

// ─── 하단 탭바 ──────────────────────────────────

const TABS = [
  { id: 'home',    icon: '🏠', label: '홈' },
  { id: 'program', icon: '🎯', label: '프로그램' },
  { id: 'content', icon: '📚', label: '콘텐츠' },
  { id: 'about',   icon: '🏛️', label: '소개' },
  { id: 'mypage',  icon: '👤', label: '마이' },
];

// 소개 탭 안 서브 내비 (아카데미 / 엉클조)
function IntroNav({ current, onNav }: { current: string; onNav: (p: string) => void }) {
  const items = [
    { id: 'about', label: '아카데미' },
    { id: 'unclejo', label: '엉클조' },
  ];
  return (
    <div style={{ display: 'flex', gap: S.xs, marginBottom: S.lg }}>
      {items.map((it) => {
        const on = current === it.id;
        return (
          <button
            key={it.id}
            onClick={() => onNav(it.id)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '999px',
              border: on ? 'none' : `1.5px solid ${C.border}`,
              background: on ? C.primary : C.bg,
              color: on ? '#fff' : C.textSub,
              fontSize: T.bodySm,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
            }}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── App ────────────────────────────────────────

export default function App() {
  const [currentPage, setCurrentPage] = useState('program');
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

  // ── 토큰 진입 라우팅 (/p/{token} = 부모 실연결 대시보드) ──
  // /coach/{token} 은 추후. 토큰 없으면 기존 앱(아래) 그대로.
  const entry = tokenFromPath();
  if (entry?.role === 'parent') {
    return (
      <div style={{
        fontFamily: "'Pretendard Variable','Pretendard','Apple SD Gothic Neo','Noto Sans KR',sans-serif",
        background: '#E8E4DD', minHeight: '100vh', color: C.text,
        wordBreak: 'keep-all', overflowWrap: 'break-word',
      }}>
        <style>{`
          @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css');
          body { font-family: 'Pretendard Variable', sans-serif; }
        `}</style>
        <div style={{
          maxWidth: '480px', margin: '0 auto', minHeight: '100vh',
          background: C.pageBg, containerType: 'inline-size',
          boxShadow: '0 0 48px rgba(0,0,0,0.07)',
        }}>
          <ParentLive token={entry.token} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Pretendard Variable','Pretendard','Apple SD Gothic Neo','Noto Sans KR',sans-serif",
      background: '#E8E4DD',
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

      {/* ─── 모바일 폭 프레임 (본문 한 칼럼, 가운데 정렬) ─── */}
      <div style={{
        maxWidth: '480px',
        margin: '0 auto',
        minHeight: '100vh',
        background: C.pageBg,
        paddingBottom: '76px',
        position: 'relative',
        containerType: 'inline-size',
        boxShadow: '0 0 48px rgba(0,0,0,0.07)',
      }}>

      {/* ════════════════════ 홈 ════════════════════ */}
      {currentPage === 'home' && (
        <div style={{ padding: `${S.xxl} ${S.md}` }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div style={{
              background: C.orange10,
              borderRadius: '28px',
              padding: `${S.xl} ${S.lg}`,
              marginBottom: S.xl,
              textAlign: 'center',
            }}>
              <p style={{ fontSize: T.bodySm, color: C.primary, fontWeight: 700, marginBottom: S.sm, letterSpacing: '0.04em' }}>
                엉클조아카데미
              </p>
              <h1 style={{
                fontSize: 'clamp(28px, 6cqw, 44px)',
                fontWeight: 900,
                color: C.dark,
                lineHeight: 1.3,
                letterSpacing: '-0.02em',
                marginBottom: S.lg,
              }}>
                30년 금융강사가<br />
                <span style={{ color: C.primary }}>손주들에게</span> 전하는<br />
                경제 습관과 삶의 자세
              </h1>
              <p style={{ fontSize: T.bodySm, color: C.textSub, lineHeight: 1.8, letterSpacing: '-0.01em' }}>
                평택에서 작은 모임으로 시작합니다.<br />
                돈의 기술보다, 태도였습니다.
              </p>
            </div>

            <button
              onClick={() => setCurrentPage('program')}
              style={{
                width: '100%',
                background: C.primary,
                color: '#fff',
                border: 'none',
                padding: '18px',
                borderRadius: '14px',
                fontSize: T.h3,
                fontWeight: 800,
                cursor: 'pointer',
                letterSpacing: '-0.01em',
                boxShadow: '0 6px 20px rgba(255,111,15,0.35)',
                marginBottom: S.md,
              }}
            >
              10주 용돈 연습 보러가기 →
            </button>

            <div style={{ display: 'flex', gap: S.sm, marginTop: S.lg }}>
              <button
                onClick={() => setCurrentPage('about')}
                style={{
                  flex: 1,
                  background: C.bg,
                  color: C.dark,
                  border: `1.5px solid ${C.border}`,
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: T.bodySm,
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '-0.01em',
                }}
              >
                🏛️ 아카데미 소개
              </button>
              <button
                onClick={() => setCurrentPage('unclejo')}
                style={{
                  flex: 1,
                  background: C.bg,
                  color: C.dark,
                  border: `1.5px solid ${C.border}`,
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: T.bodySm,
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '-0.01em',
                }}
              >
                👴 엉클조 이야기
              </button>
            </div>

            {/* 4. 공감 한 줄 */}
            <div style={{ marginTop: S.xxl, textAlign: 'center' }}>
              <p style={{ fontSize: T.body, color: C.textSub, lineHeight: 1.8, letterSpacing: '-0.01em' }}>
                마트에서 <strong style={{ color: C.dark }}>"이번에만"</strong>이 매번 되시죠?<br />
                아이도, 부모도 그게 답답합니다.
              </p>
            </div>

            {/* 5. 이 프로그램은 — 카드 3개 */}
            <div style={{ marginTop: S.xl, display: 'flex', flexDirection: 'column', gap: S.sm }}>
              {[
                { emoji: '✋', title: '멈춤', body: '사기 전에 한 번 멈추는 순간을 만듭니다' },
                { emoji: '🤝', title: '함께', body: '혼자가 아니라, 같은 고민의 3~4가정과 끝까지' },
                { emoji: '🧭', title: '태도', body: '정답이 아니라 방향을, 기술이 아니라 태도를' },
              ].map((item, i) => (
                <div key={i} style={{
                  background: C.bg,
                  borderRadius: '16px',
                  padding: S.md,
                  border: `1px solid ${C.border}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: S.sm,
                }}>
                  <span style={{ fontSize: '24px', lineHeight: 1.3 }}>{item.emoji}</span>
                  <div>
                    <p style={{ fontSize: T.body, fontWeight: 800, color: C.primary, letterSpacing: '-0.01em', marginBottom: '2px' }}>
                      {item.title}
                    </p>
                    <p style={{ fontSize: T.bodySm, color: C.textSub, lineHeight: 1.6, letterSpacing: '-0.01em' }}>
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 6. 엉클조의 편지 맛보기 */}
            <div style={{
              marginTop: S.xl,
              background: C.orange10,
              borderRadius: '20px',
              padding: S.lg,
            }}>
              <p style={{ fontSize: T.small, fontWeight: 800, color: C.primary, letterSpacing: '0.06em', marginBottom: S.xs }}>
                ✉️ 엉클조의 편지
              </p>
              <p style={{ fontSize: T.h3, fontWeight: 800, color: C.dark, letterSpacing: '-0.02em', marginBottom: S.sm }}>
                “{LETTERS[0].title}”
              </p>
              <p style={{ fontSize: T.bodySm, color: C.textSub, lineHeight: 1.8, letterSpacing: '-0.01em', marginBottom: S.md }}>
                {LETTERS[0].teaser}
              </p>
              <p style={{ fontSize: T.small, color: C.textMuted, letterSpacing: '-0.01em' }}>
                …편지 전문은 함께하면 매주 도착합니다.
              </p>
            </div>

            {/* 7. 신청 CTA 반복 */}
            <button
              onClick={() => setCurrentPage('program')}
              style={{
                width: '100%',
                marginTop: S.xl,
                background: C.primary,
                color: '#fff',
                border: 'none',
                padding: '18px',
                borderRadius: '14px',
                fontSize: T.h3,
                fontWeight: 800,
                cursor: 'pointer',
                letterSpacing: '-0.01em',
                boxShadow: '0 6px 20px rgba(255,111,15,0.35)',
              }}
            >
              10주 용돈 연습 신청하기 →
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════ 아카데미소개 ════════════════════ */}
      {currentPage === 'about' && (
        <div style={{ padding: `${S.xxl} ${S.md}` }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            {/* 소개 서브 내비 */}
            <IntroNav current="about" onNav={setCurrentPage} />
            {/* 상단 라벨 */}
            <p style={{ fontSize: T.bodySm, color: C.primary, fontWeight: 700, marginBottom: S.sm, letterSpacing: '0.04em' }}>
              ABOUT
            </p>

            {/* 메인 헤드라인 */}
            <h1 style={{
              fontSize: T.h1,
              fontWeight: 900,
              color: C.dark,
              lineHeight: 1.35,
              letterSpacing: '-0.02em',
              marginBottom: S.xl,
            }}>
              돈을 불리는 기술을 넘어,<br />
              <span style={{ color: C.primary }}>삶을 경영하는 태도</span>를 나눕니다.
            </h1>

            {/* 본문 */}
            <div style={{ fontSize: T.bodySm, color: C.textSub, lineHeight: 1.9, marginBottom: S.xl, letterSpacing: '-0.01em' }}>
              <p style={{ marginBottom: S.lg }}>
                우리는 종종 <strong style={{ color: C.dark }}>'경제 교육'</strong>을 <strong style={{ color: C.dark }}>'금융 지식'</strong>이나 <strong style={{ color: C.dark }}>'재테크'</strong>와 같은 의미로 오해합니다. 하지만 증권사와 금융권에서 10년, 현장에서 사람들의 돈 고민을 듣고 가르치며 20년. <strong style={{ color: C.dark }}>총 30년의 시간 동안 지켜보며 내린 결론은 다릅니다.</strong>
              </p>

              {/* 핵심 인용 박스 */}
              <div style={{
                padding: `${S.lg} 0`,
                borderTop: `1px solid ${C.border}`,
                borderBottom: `1px solid ${C.border}`,
                marginBottom: S.lg,
              }}>
                <p style={{
                  fontSize: T.h3,
                  fontWeight: 800,
                  color: C.dark,
                  lineHeight: 1.55,
                  letterSpacing: '-0.02em',
                }}>
                  돈은 목적이 아니라,<br />
                  내 삶을 지탱하고 원하는 방향으로<br />
                  이끌어가는 <span style={{ color: C.primary }}>'가장 현실적인 도구'</span>입니다.
                </p>
              </div>

              <p style={{ marginBottom: S.lg }}>
                엉클조 아카데미는 단순한 금융 지식을 가르치는 곳이 아닙니다. 아이가 첫 용돈 앞에서, 갖고 싶은 마음과 가진 돈 사이에 잠깐 멈춰 서는 것 — 그 작은 망설임에서 아이는 처음으로 <strong style={{ color: C.primary }}>'스스로 고르는 사람'</strong>이 됩니다. 그렇게 시작된 태도가, 중장년이 은퇴 이후의 두 번째 커리어를 준비하는 <strong style={{ color: C.primary }}>하프타임</strong>에 이르기까지, <strong style={{ color: C.dark }}>인생의 각 단계(Life-cycle)</strong>마다 반드시 마주하게 되는 돈과 삶의 문제를 함께 고민합니다.
              </p>

              {/* 블록 A — 왜 만들게 되었나 */}
              <p style={{ fontWeight: 700, color: C.dark, marginBottom: S.xs }}>
                사실, 저는 오래전부터 이런 교육을 하고 싶었습니다.
              </p>
              <p style={{ marginBottom: S.lg }}>
                30년간 현장에 서면서 늘 아쉬웠습니다. 아이에게 <strong style={{ color: C.dark }}>'돈의 기술'</strong>을 가르치는 곳은 많아도, <strong style={{ color: C.primary }}>'돈을 대하는 태도'</strong>를 길러주는 곳은 어디에도 없었기 때문입니다. 시중에 없으니, 언젠가 직접 만들어야겠다고 마음에 품어왔습니다.
              </p>

              {/* 블록 B — 20년 전 같은 이야기 + 영상 */}
              <p style={{ fontWeight: 700, color: C.dark, marginBottom: S.sm }}>
                20년 전, 저는 이미 같은 이야기를 하고 있었습니다.
              </p>
              <div style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '56.25%',
                borderRadius: '14px',
                overflow: 'hidden',
                background: C.surface,
                marginBottom: S.xs,
              }}>
                <iframe
                  src="https://www.youtube.com/embed/5Y9eRKMtzQg"
                  title="우리 아이 부자로 키우기 1편"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 0,
                  }}
                />
              </div>
              <p style={{ fontSize: T.small, color: C.textMuted, marginBottom: S.lg, letterSpacing: '-0.01em' }}>
                삼척MBC 「우리 아이 부자로 키우기」 · 2007년경
              </p>
              <p style={{ marginBottom: S.lg }}>
                그때의 말이 지금도 똑같습니다. 다만 이제는, 말하는 데서 그치지 않고 직접 아이들 곁에 섭니다.
              </p>

              <p style={{
                fontSize: T.body,
                fontWeight: 700,
                color: C.dark,
                lineHeight: 1.7,
                marginTop: S.xl,
                letterSpacing: '-0.01em',
              }}>
                숫자를 계산하기 전에 삶의 태도를 먼저 묻습니다.<br />
                엉클조 아카데미는 나와 내 가족의 단단한 <span style={{ color: C.primary }}>생애설계</span>를 위한 첫걸음입니다.
              </p>
            </div>

            {/* Mission / Core Value 박스 */}
            <div style={{
              background: C.orange10,
              borderRadius: '20px',
              padding: S.lg,
              marginBottom: S.xl,
            }}>
              <div style={{
                marginBottom: S.lg,
                paddingBottom: S.lg,
                borderBottom: `1px solid ${C.orange20}`,
              }}>
                <p style={{
                  fontSize: T.small,
                  color: C.primary,
                  fontWeight: 800,
                  marginBottom: S.sm,
                  letterSpacing: '0.12em',
                }}>
                  MISSION
                </p>
                <p style={{
                  fontSize: T.body,
                  fontWeight: 700,
                  color: C.dark,
                  lineHeight: 1.7,
                  letterSpacing: '-0.01em',
                }}>
                  금융(Finance)을 넘어,<br />
                  <span style={{ color: C.primary }}>삶(Life)을 기획하는</span><br />
                  생애설계의 관점을 제시합니다.
                </p>
              </div>
              <div>
                <p style={{
                  fontSize: T.small,
                  color: C.primary,
                  fontWeight: 800,
                  marginBottom: S.sm,
                  letterSpacing: '0.12em',
                }}>
                  CORE VALUE
                </p>
                <p style={{
                  fontSize: T.body,
                  fontWeight: 700,
                  color: C.dark,
                  lineHeight: 1.7,
                  letterSpacing: '-0.01em',
                }}>
                  기술(Skill)이 아닌 <span style={{ color: C.primary }}>태도(Attitude)</span>를,<br />
                  정답(Answer)이 아닌 <span style={{ color: C.primary }}>방향(Direction)</span>을<br />
                  나눕니다.
                </p>
              </div>
            </div>

            {/* 권위 라인 */}
            <div style={{
              fontSize: T.small,
              color: C.textMuted,
              lineHeight: 1.8,
              letterSpacing: '-0.01em',
              marginBottom: S.xl,
              paddingTop: S.lg,
              borderTop: `1px solid ${C.border}`,
            }}>
              더스쿠프 「엉클조의 좌충우돌」 칼럼 연재<br />
              KBS·SBS 외 라디오·케이블 방송 20년<br />
              평택 거점 30년
            </div>

            {/* CTA */}
            <button
              onClick={() => setCurrentPage('program')}
              style={{
                width: '100%',
                background: C.primary,
                color: '#fff',
                border: 'none',
                padding: '16px',
                borderRadius: '14px',
                fontSize: T.body,
                fontWeight: 800,
                cursor: 'pointer',
                letterSpacing: '-0.01em',
                boxShadow: '0 6px 20px rgba(255,111,15,0.25)',
              }}
            >
              자녀경제 클럽 프로그램 보기 →
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════ 엉클조 (강사 본인) ════════════════════ */}
      {currentPage === 'unclejo' && (
        <div style={{ padding: `${S.xxl} ${S.md}` }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            {/* 소개 서브 내비 */}
            <IntroNav current="unclejo" onNav={setCurrentPage} />
            <div style={{ textAlign: 'center', marginBottom: S.xl }}>
              <img
                src="/uncle-jo.png"
                alt="엉클조"
                style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: S.md,
                }}
              />
              <h1 style={{
                fontSize: T.h1,
                fontWeight: 900,
                color: C.dark,
                letterSpacing: '-0.02em',
                marginBottom: '6px',
              }}>
                엉클조 (조경만)
              </h1>
              <p style={{ fontSize: T.bodySm, color: C.primary, fontWeight: 600, letterSpacing: '-0.01em' }}>
                엉클조아카데미 대표 · 금융교육 강사
              </p>
            </div>

            <div style={{ fontSize: T.bodySm, color: C.textSub, lineHeight: 1.9, letterSpacing: '-0.01em' }}>
              <p style={{ marginBottom: S.md }}>
                연세대학교 경제학과를 나와, 증권과 보험 현장에서 사람들의 돈을 다루는 일을 10년 했습니다. 대한투자신탁과 이트레이드증권을 거쳤고, 푸르덴셜생명과 ING생명에서도 일했어요.
              </p>
              <p style={{ marginBottom: S.md }}>
                그런데 정작 마음에 남은 건 따로 있었습니다. 큰돈을 굴리는 사람보다, <strong style={{ color: C.dark }}>작은 돈 앞에서 막막해하는 보통 사람들</strong>이 훨씬 많았다는 것. 그들에게 돈을 제대로 대하는 법을 알려주는 곳이 어디에도 없다는 것.
              </p>
              <p style={{ marginBottom: S.md }}>
                그래서 2000년, 아직 누구도 일반인에게 금융을 가르치지 않던 때에 — <strong style={{ color: C.dark }}>국내에서 누구보다 먼저</strong> 엉클조아카데미를 열었습니다. 보통 사람의 돈 공부, 그 시작이었습니다.
              </p>
              <p style={{ marginBottom: S.md }}>
                그 뒤로 20년 넘게 라디오와 케이블 방송 패널로, 「더스쿠프」 칼럼니스트로 대중과 만났습니다. 가르치고 지켜본 30년 동안 분명해진 게 하나 있어요. <strong style={{ color: C.dark }}>어릴 때 만든 돈 습관이 평생을 따라간다는 것.</strong> 그중에서도 '잘 쓰는 법'이 가장 먼저라는 것.
              </p>

              {/* 소개 영상 — 16:9 반응형 임베드 (ABOUT과 동일 패턴) */}
              <div style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '56.25%',
                borderRadius: '14px',
                overflow: 'hidden',
                background: C.surface,
                marginBottom: S.xs,
              }}>
                <iframe
                  src="https://www.youtube.com/embed/GAccPoXcXVo"
                  title="엉클조 소개 영상"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 0,
                  }}
                />
              </div>
              <p style={{ fontSize: T.small, color: C.textMuted, marginBottom: S.lg, letterSpacing: '-0.01em' }}>
                엉클조 소개 영상
              </p>

              <p style={{ marginBottom: S.md }}>
                말만 한 건 아닙니다. 예순에 전기기능사와 공조냉동 자격을 따 다시 현장에 취업했고, 얼마 전 <strong style={{ color: C.dark }}>예순다섯</strong>엔 집수리 업체에 신입으로 들어가 지금도 새로 배우고 있습니다. 낯선 일 앞에서 다시 막내가 되는 일 — 그 호기심과 도전이 사람을 계속 살아 있게 한다는 걸, 매일 몸으로 느낍니다.
              </p>
              <p style={{ marginBottom: S.md }}>
                그리고 이건, <strong style={{ color: C.primary }}>앞으로 우리 아이들에게 더 중요해질 태도</strong>입니다. AI가 정답을 대신 내주는 시대일수록, 스스로 묻고(호기심) 부딪치고(도전) 다시 배우는(열정) 사람만이 자기 삶을 끌고 갑니다. 돈을 대하는 법도 결국 같아요. <strong style={{ color: C.primary }}>무엇을 외우느냐가 아니라, 어떤 태도로 마주하느냐.</strong>
              </p>
              <p style={{ marginBottom: S.lg }}>
                2004년 평택에 자리 잡아 스무 해 넘게 살고 있습니다. 손주 볼 나이가 된 지금 — 30년 전 가르쳤던 그대로, 30년 키워보고 보이는 것까지, 그리고 예순다섯에도 새로 배우며 깨달은 것까지, 이제 손주 세대에게 전하려 합니다.
              </p>
            </div>

            <div style={{ background: C.surface, borderRadius: '16px', padding: S.lg, marginTop: S.xl }}>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: S.sm }}>
                {[
                  { label: '학력', value: <>연세대 경제학과 졸업</> },
                  { label: '경력', value: <>대한투자신탁 · 이트레이드증권 · 푸르덴셜생명 · ING생명 (증권·보험 <strong style={{ color: C.primary }}>10년</strong>)</> },
                  { label: '시작', value: <><strong style={{ color: C.primary }}>2000년</strong>, 누구보다 먼저 시작한 일반인 금융 교육 — 엉클조아카데미</> },
                  { label: '실증', value: <><strong style={{ color: C.primary }}>60세</strong> 전기기능사·공조냉동 취득 → 재취업 · <strong style={{ color: C.primary }}>65세</strong> 집수리 업체 신입 입사 (현재진행)</> },
                  { label: '연재', value: <>더스쿠프 「엉클조의 좌충우돌」 칼럼 <strong style={{ color: C.primary }}>14편</strong></> },
                  { label: '방송', value: <>KBS·SBS 외 라디오·케이블 <strong style={{ color: C.primary }}>20년</strong></> },
                  { label: '채널', value: <>YouTube 하프타임클럽 운영</> },
                ].map((row, i) => (
                  <li key={i} style={{
                    display: 'flex',
                    gap: S.sm,
                    fontSize: T.small,
                    color: C.textSub,
                    lineHeight: 1.7,
                    letterSpacing: '-0.01em',
                  }}>
                    <span style={{
                      flexShrink: 0,
                      minWidth: '34px',
                      color: C.dark,
                      fontWeight: 800,
                    }}>{row.label}</span>
                    <span>{row.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════ 마이페이지 (방문노트) ════════════════════ */}
      {currentPage === 'mypage' && <VisitNote />}

      {/* ════════════════════ 콘텐츠 ════════════════════ */}
      {currentPage === 'content' && <ContentTab onApply={() => setCurrentPage('program')} />}

      {/* ════════════════════ 프로그램 (기존 콘텐츠) ════════════════════ */}
      {currentPage === 'program' && (
        <>

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
              fontSize: 'clamp(34px, 6.2cqw, 56px)',
              lineHeight: 1.18,
              letterSpacing: '-0.02em',
              color: C.dark,
              display: 'flex',
              flexDirection: 'column',
            }}>
              <span style={{
                fontSize: 'clamp(15px, 2.6cqw, 18px)',
                fontWeight: 700,
                color: C.primary,
                marginBottom: '0.7em',
                letterSpacing: '0.02em',
              }}>
                엉클조 자녀경제 클럽 · 소비편
              </span>
              <span>사기 전에,</span>
              <span style={{
                color: C.primary,
                marginTop: '0.15em',
              }}>
                한 번 더 생각하는 아이로
              </span>
            </h1>
          </div>

          {/* 서브 영역 */}
          <div style={{ padding: `0 ${S.xs}` }}>
            <p style={{
              margin: 0,
              fontWeight: 700,
              fontSize: 'clamp(20px, 3.4cqw, 28px)',
              lineHeight: 1.55,
              letterSpacing: '-0.01em',
              color: C.dark,
            }}>
              30년 전 제 아이들에게 가르쳤던 그대로,<br />
              30년 자녀를 키워보고 보이는 것까지 —<br />
              '잘 쓰는 법' 하나에 10주를 온전히 씁니다
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
                10주 · 소비편
              </span>
              <span style={{
                fontSize: 'clamp(19px, 3cqw, 24px)',
                fontWeight: 800,
                letterSpacing: '-0.01em',
                color: C.dark,
              }}>
                엉클조와 함께하는 10주 용돈 연습
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
                그 다음 20년은 금융교육 강사로 보냈습니다.<br />
                수많은 사람들의 돈 고민을 들었어요.
              </p>
              <p style={{ marginBottom: S.md }}>
                방송도 20년 넘게 했어요.<br />
                <strong style={{ color: C.dark }}>라디오 패널로, 케이블 방송에 출연</strong>하면서<br />
                대중과 만났습니다.
              </p>
              <p style={{ marginBottom: S.md }}>
                직접 가르치고 30년을 지켜봐 보니,<br />
                <strong style={{ color: C.dark }}>어릴 때 만든 돈 습관이 평생 가더라고요.</strong><br />
                그중에서도 <strong style={{ color: C.dark }}>'잘 쓰는 법'</strong>이 가장 먼저였습니다.
              </p>
              <p>
                손주 볼 나이가 된 지금 —<br />
                30년 전 가르쳤던 그대로,<br />
                30년 키워보고 보이는 것까지,<br />
                수많은 사람들의 상담에서 모은 것을,<br />
                <strong style={{ color: C.primary }}>이제 평택의 손주들에게 전하려고 합니다.</strong>
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
              평택 · 3~4가정 집중 모임
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
            fontWeight: 900,
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
          ③ 헤드 메시지 박스 (오렌지 배경)
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
            10주의 작은 모임으로<br />
            아이가 '소비를 보는 눈'을<br />
            갖춥니다.
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
            수많은 사람들의 돈 고민에서 모은 것을<br />
            <strong style={{ color: C.dark }}>'잘 쓰는 법'</strong> 하나에 10주를 온전히 씁니다.
            <br /><br />
            정답을 드리러 가는 게 아닙니다.<br />
            <strong style={{ color: C.primary }}>미션을 해오고, 같이 돌아보며 풀어갑니다.</strong>
            <br /><br />
            엄마·아빠도 돈에는 초보일 수 있어요.<br />
            그래서 손주 볼 나이가 된 엉클조가,<br />
            아이 곁에서 그 첫 걸음을 같이 떼려고 합니다.
          </p>

          {/* 왜 10주인가 — 흰 카드 콜아웃 (card-in-card) */}
          <div style={{
            marginTop: S.xl,
            background: C.bg,
            borderRadius: '16px',
            padding: `${S.lg} ${S.md}`,
            textAlign: 'left',
            maxWidth: '560px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            <p style={{
              fontSize: T.bodySm,
              fontWeight: 800,
              color: C.primary,
              letterSpacing: '-0.01em',
              marginBottom: S.xs,
            }}>
              왜 10주인가?
            </p>
            <p style={{
              fontSize: T.bodySm,
              color: C.textSub,
              lineHeight: 1.8,
              letterSpacing: '-0.01em',
            }}>
              한 달로는 습관이 잡히지 않습니다. 30년간 지켜보니,
              아이가 <strong style={{ color: C.dark }}>'사기 전에 멈추는 것'</strong>이 몸에 배려면 반복할 시간이 필요했습니다.
              그래서 맛보기가 아니라, <strong style={{ color: C.dark }}>끝까지 함께 가는 10주</strong>로 잡았습니다.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ④ 4가지 약속 — 오렌지 배경 + 흰 카드
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
            엉클조 자녀경제 클럽의<br />4가지 약속
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: S.md,
          }}>
            {PROMISES.map((g, i) => (
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
          ⑤ 일정 및 커리큘럼 — 오렌지 배경 + 회차별 카드
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
                  minWidth: '36px',
                  height: '36px',
                  paddingLeft: c.badge === 'OT' ? '6px' : '0',
                  paddingRight: c.badge === 'OT' ? '6px' : '0',
                  borderRadius: c.badge === 'OT' ? '18px' : '50%',
                  width: c.badge === 'OT' ? 'auto' : '36px',
                  background: c.badge === 'OT' ? C.primary : C.dark,
                  color: '#fff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: c.badge === 'OT' ? '14px' : '20px',
                  fontWeight: 800,
                  marginBottom: S.sm,
                  alignSelf: 'flex-start',
                  letterSpacing: c.badge === 'OT' ? '0.02em' : 0,
                }}>
                  {c.badge}
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

          <p style={{
            marginTop: S.xl,
            padding: `${S.md} ${S.lg}`,
            background: C.orange10,
            borderRadius: '14px',
            fontSize: T.small,
            color: C.textSub,
            lineHeight: 1.7,
            letterSpacing: '-0.01em',
            textAlign: 'center',
          }}>
            미션은 검사가 아니라 '함께 이야기할 거리(회고의 씨앗)'입니다.<br />
            용돈기입장은 여러 도구 중 하나로, 아이에게 무리하게 강요하지 않습니다.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ⑥ Before → After (말풍선 후기 형식)
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
              10주 끝나면 어떻게 달라질까요?
            </p>
            <h2 style={{
              fontSize: T.h1,
              fontWeight: 900,
              color: C.dark,
              letterSpacing: '-0.03em',
              lineHeight: 1.35,
            }}>
              엉클조가 30년간 지켜본,<br />아이와 부모의 변화
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
          ⑦ 진행 방식 + 장소 + 대상 안내
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
            }}>10주는 이렇게 진행됩니다</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: S.sm, marginBottom: S.lg }}>
              {HOWS.map((h, i) => (
                <li key={i} style={{
                  display: 'flex',
                  gap: S.sm,
                  fontSize: T.body,
                  color: h.text.startsWith('강의가 아닙니다') ? C.primary : C.textSub,
                  fontWeight: h.text.startsWith('강의가 아닙니다') ? 700 : 400,
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
                <strong style={{ color: C.dark }}>평택 카페</strong> (첫 만남·경매·수료)<br />
                정확한 장소는 신청 후 안내드립니다.
              </p>
              <p style={{
                fontSize: T.bodySm,
                color: C.textMuted,
                marginTop: S.sm,
                lineHeight: 1.7,
                letterSpacing: '-0.01em',
              }}>
                평택·경기남부 거주 부모 우선. 줌 회고는 어디서나 참여 가능.
              </p>
            </div>

            {/* 대상 */}
            <div style={{
              marginTop: S.lg,
              padding: S.md,
              background: C.orange10,
              borderRadius: '14px',
            }}>
              <p style={{ fontSize: '28px', marginBottom: '4px' }}>🎒</p>
              <p style={{ fontSize: T.body, fontWeight: 800, color: C.dark, letterSpacing: '-0.01em' }}>
                초등 저학년 7~9세 <span style={{ fontWeight: 600, color: C.textSub }}>(취학 전후 포함)</span>
              </p>
              <p style={{ fontSize: T.small, color: C.textMuted, marginTop: '4px', letterSpacing: '-0.01em' }}>
                ※ 유아반은 추후 별도 안내드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* ══════════════════════════════════════════
          ⑧ 표 정보 (일시·진행·모집·마감)
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
          ⑨ 이런 분들께 추천해요
          ══════════════════════════════════════════ */}
      <section style={{ padding: `${S.xl} ${S.md}`, background: C.pageBg }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: T.h1,
            fontWeight: 900,
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
          ⑩ 꼭 읽어주세요
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
          ⑪ CTA 폼
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
              10주 용돈 연습<br />손주에게 전하듯, 첫 걸음
            </h2>
            <p style={{
              textAlign: 'center',
              fontSize: T.bodySm,
              color: C.textMuted,
              marginBottom: S.xl,
              letterSpacing: '-0.01em',
            }}>
              분기 1회 · 3~4명 집중 · 평택 + 줌 혼합
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
                  카톡으로 먼저 '부모 OT' 일정부터<br />안내드릴게요.
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
                  💬 카카오톡으로 친구에게 알리기
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
                  { label: '아이 나이', name: 'child_age', type: 'text', placeholder: '예) 8살, 초등 2학년 (7~9세)' },
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
                  {submitting ? '신청 중...' : '10주 용돈 연습 함께하기'}
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
                  다음 단계(저축·투자)는 용돈 연습을 끝낸 후 안내드립니다.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

        </>
      )}

      </div>{/* ─── /모바일 폭 프레임 ─── */}

      {/* ════════════════════ 하단 탭바 ════════════════════ */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        background: C.bg,
        borderTop: `1px solid ${C.border}`,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '6px 0 max(6px, env(safe-area-inset-bottom))',
        zIndex: 100,
        boxShadow: '0 -2px 14px rgba(0,0,0,0.06)',
      }}>
        {TABS.map((tab) => {
          // 소개 탭은 아카데미·엉클조 하위 페이지에서도 활성
          const active = currentPage === tab.id || (tab.id === 'about' && currentPage === 'unclejo');
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentPage(tab.id)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                cursor: 'pointer',
                padding: '6px 4px',
                transition: 'opacity 0.15s',
              }}
            >
              <span style={{
                fontSize: '22px',
                opacity: active ? 1 : 0.45,
                filter: active ? 'none' : 'grayscale(0.6)',
              }}>
                {tab.icon}
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: active ? 700 : 500,
                color: active ? C.dark : C.textMuted,
                letterSpacing: '-0.02em',
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
