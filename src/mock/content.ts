// ─────────────────────────────────────────────
// 콘텐츠 탭 더미 데이터 (프로토타입)
// 방문자 유입 채널 — 토스피드형 시리즈→아티클 구조
// 실제 CMS/DB 연동 없음. 구조만 재사용 가능하게.
// ─────────────────────────────────────────────

// 콘텐츠 탭 상단 시리즈 슬로건 (placeholder)
// 후보: "물려줄 건 돈이 아니라, 돈을 대하는 태도니까"
export const CONTENT_SLOGAN = '물려줄 건 돈이 아니라, 돈을 대하는 태도니까';

export type Article = {
  id: string;
  series: 'why' | 'note';   // 왜 이렇게 가르칠까 / 엉클조의 자녀경제 노트
  title: string;
  date: string;             // YYYY-MM-DD
  thumbnail: string;        // 썸네일 자리 (지금은 이모지 placeholder)
  body: string;             // 짧은 친근 버전
  more?: string;            // "더 자세히" — 발달 근거 (why 시리즈)
  locked: boolean;
};

// ─── 시리즈 1: 왜 이렇게 가르칠까 (근거·철학 / 신뢰 구축) ───

export const WHY_ARTICLES: Article[] = [
  {
    id: 'why-7se',
    series: 'why',
    title: '왜 하필 7세일까요?',
    date: '2026-06-01',
    thumbnail: '🌱',
    locked: false,
    body: '(더미) 일곱 살 무렵이면 아이가 “내 것”과 “남의 것”을 구분하기 시작해요. 숫자도 제법 익숙해지고요. 이때 작은 용돈을 직접 다뤄보면, 돈을 “내가 정하는 것”으로 받아들이게 됩니다.',
    more: '(더미) 더 자세히 — 발달 근거: 구체적 조작기(7세 전후) 진입, 수·보존 개념 형성, 자기조절력의 토대가 만들어지는 시기 … 여기에 상세 근거가 들어갈 자리입니다.',
  },
  {
    id: 'why-spend-first',
    series: 'why',
    title: "왜 저축이 아니라 '쓰기'부터일까요?",
    date: '2026-06-01',
    thumbnail: '💸',
    locked: false,
    body: '(더미) 써본 적 없는 아이에게 “아껴라”는 막연한 말이에요. 한 번 다 써보고, 부족함을 겪어본 아이가 비로소 “남겨둘 이유”를 스스로 찾습니다.',
    more: '(더미) 더 자세히 — 경험학습·자기결정 이론에 기반한 “쓰기 우선” 설계의 근거가 들어갈 자리입니다.',
  },
  {
    id: 'why-real-money',
    series: 'why',
    title: '왜 진짜 돈이어야 할까요?',
    date: '2026-06-01',
    thumbnail: '💵',
    locked: false,
    body: '(더미) 가짜 돈으로는 “잃는 느낌”이 안 들어요. 진짜 내 돈이 줄어드는 걸 봐야, 선택의 무게가 생깁니다.',
    more: '(더미) 더 자세히 — 손실 회피·체화된 학습 관점에서 실물 화폐의 효과가 들어갈 자리입니다.',
  },
  {
    id: 'why-not-save',
    series: 'why',
    title: '왜 아끼라고 가르치지 않을까요?',
    date: '2026-06-01',
    thumbnail: '🤲',
    locked: false,
    body: '(더미) “아껴라”는 참으라는 말이 되기 쉬워요. 우리가 기르려는 건 절약이 아니라, 잘 고르는 힘입니다. 아끼는 건 그 다음에 따라옵니다.',
    more: '(더미) 더 자세히 — 절제(억압)와 선택(자율)의 차이, 내적 동기에 관한 근거가 들어갈 자리입니다.',
  },
];

// ─── 시리즈 2: 엉클조의 자녀경제 노트 (상시 아티클 / 유입 핵심) ───
// 경제교육 주축(70%) + 자녀교육 양념(30%)

export const NOTE_ARTICLES: Article[] = [
  {
    id: 'note-mom-money',
    series: 'note',
    title: "애가 자꾸 '엄마 돈 있잖아' 할 때",
    date: '2026-06-10',
    thumbnail: '🛒',
    locked: false,
    body: '(더미) 마트에서 “엄마 돈 있잖아” 하는 그 순간, 사실은 좋은 기회예요. 돈이 “무한히 나오는 것”이 아니라는 걸 처음 알려줄 수 있는 장면이거든요. …',
  },
  {
    id: 'note-howmuch',
    series: 'note',
    title: '용돈, 언제부터 얼마가 적당할까',
    date: '2026-06-03',
    thumbnail: '💰',
    locked: false,
    body: '(더미) 정답은 없지만 기준은 있어요. 나이·주기·우리 집 형편 세 가지로 가늠해 봅니다. …',
  },
  {
    id: 'note-newyear',
    series: 'note',
    title: '세뱃돈, 뺏지 말고 이렇게',
    date: '2026-05-27',
    thumbnail: '🧧',
    locked: false,
    body: '(더미) “엄마가 보관해줄게”가 아이에겐 “뺏겼다”로 남아요. 함께 정하는 방법으로 바꿔봅니다. …',
  },
  {
    id: 'note-fail',
    series: 'note',
    title: '실패를 혼내지 않는 법',
    date: '2026-05-20',
    thumbnail: '🌧️',
    locked: false,
    body: '(더미) 잘못 산 것을 혼내면, 아이는 “선택” 자체를 무서워해요. 후회를 안전하게 겪게 하는 한마디를 소개합니다. …',
  },
  {
    id: 'note-ai',
    series: 'note',
    title: 'AI 시대 아이에게 필요한 태도',
    date: '2026-05-13',
    thumbnail: '🤖',
    locked: false,
    body: '(더미) 정답을 AI가 대신 내주는 시대일수록, 스스로 묻고 고르고 기다리는 힘이 중요해집니다. 돈을 대하는 법도 같아요. …',
  },
];

export function getArticleById(id: string): Article | undefined {
  return [...WHY_ARTICLES, ...NOTE_ARTICLES].find((a) => a.id === id);
}
