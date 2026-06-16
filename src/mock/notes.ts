// ─────────────────────────────────────────────
// 엉클조 클럽 더미 데이터 (프로토타입)
// 프로그램: 엉클조와 함께하는 10주 용돈 연습 (OT + 1~10주)
// 실제 Supabase 전환 시 이 파일만 교체하면 됨
// ─────────────────────────────────────────────

export type Child = {
  id: string;
  name: string;
  age: number;
  cohort: string;
  avatarEmoji?: string;
  currentWeek: number; // 0=OT, 1~10=주차
};

export type Note = {
  id: string;
  childId: string;
  week: number;          // 0=OT, 1~10=주차
  date: string;          // YYYY-MM-DD
  missionTitle: string;
  parentText?: string;
  photoUrl?: string;
  coachComment?: string | null;
};

// ─── 코호트 주차 정의 (커리큘럼 SSOT · 10주 용돈 연습) ───

export const COHORT_WEEKS: Record<number, { date: string; title: string; mission: string }> = {
  0:  { date: '2026-06-01', title: '부모 OT · 용돈 규칙 세우기',          mission: '우리 집 돈 풍경 한 가지 털어놓기' },
  1:  { date: '2026-06-08', title: "용돈 계약서 작성 · '내 용돈'이 생긴다",  mission: '용돈 계약서 쓰고 첫 용돈 한 주 써보기' },
  2:  { date: '2026-06-15', title: '주사위(윷) 놀이 — 잔고 지키기',         mission: '놀이에서 잔고를 지킨 순간 기억해 오기' },
  3:  { date: '2026-06-22', title: '이솝우화 ① 충동소비',                  mission: '충동적으로 샀다가 아쉬웠던 것 하나 떠올려 오기' },
  4:  { date: '2026-06-29', title: '경매 놀이 — 같은 돈, 무엇을 고를까',     mission: '경매에서 끝까지 갖고 싶었던 것 하나 골라 오기' },
  5:  { date: '2026-07-06', title: '쇼핑 리스트 작성',                     mission: '나만의 쇼핑 리스트(당장·1개월·1년·10년) 만들어 오기' },
  6:  { date: '2026-07-13', title: '통장 만들기 · 체크카드',               mission: '용돈에서 조금 떼어 통장(저금통)에 넣어 오기' },
  7:  { date: '2026-07-20', title: '이솝우화 ② 과시소비',                  mission: '남 보여주려고 사고 싶었던 것 있었는지 이야기해 오기' },
  8:  { date: '2026-07-27', title: '함께 장 보기',                        mission: '같은 물건 두 가게 가격 비교해 오기' },
  9:  { date: '2026-08-03', title: '이솝우화 ③ 모방소비',                  mission: '친구 따라 사고 싶었던 것 있었는지 떠올려 오기' },
  10: { date: '2026-08-10', title: '가족의 소비 · 수료',                  mission: "'우리 집 소비 원칙' 한 줄 + 가족 여행 예산" },
};

export const LAST_WEEK = 10;               // 마지막 주차
export const TOTAL_MISSIONS = 10;          // 미션 카운트(1~10주, OT 제외) — "완료 N/10"

// ─── 게임 (별도 웹 · placeholder) ───

export const GAME_BASE_URL = 'https://game.example.com';
export function gameUrl(week: number, childId: string): string {
  return `${GAME_BASE_URL}/week/${week}?child=${childId}`;
}

// ─── 엉클조의 편지 (샘플 1~3 실제 · 이후 placeholder) ───

export type Letter = {
  no: number;        // 편지 번호 = 주차
  title: string;
  teaser: string;    // 앞부분 미리보기 (홈 맛보기용)
  body?: string;     // 전문 (없으면 준비 중)
};

export const LETTERS: Letter[] = [
  {
    no: 1,
    title: '간섭하고 싶은 마음, 한 주만 내려놓아 주세요',
    teaser: '아이에게 처음 용돈을 쥐여주던 날, 저도 손이 떨렸습니다. 잘못 쓰면 어쩌나, 다 써버리면 어쩌나.',
    body: '아이에게 처음 용돈을 쥐여주던 날, 저도 손이 떨렸습니다. 잘못 쓰면 어쩌나, 다 써버리면 어쩌나. 그런데 30년을 지켜보니, 다 써본 아이가 결국 아낄 줄도 알게 되더군요. 첫 주는 가르치려 하지 마세요. 그냥 쥐여주고, 곁에서 지켜봐 주세요. 망설이는 그 표정 하나만 기억해 오시면 됩니다.',
  },
  {
    no: 2,
    title: '잘 모으면 좋은 일이 생긴다는 걸 보여주세요',
    teaser: '이번 주에 아이가 용돈을 다 써버렸다고요? 잘됐습니다. 그게 바로 이번 주가 가르쳐줄 수업이에요.',
    body: '이번 주에 아이가 용돈을 다 써버렸다고요? 잘됐습니다. 그게 바로 이번 주가 가르쳐줄 수업이에요. 부족함을 한 번 겪어본 아이가, 다음 주엔 스스로 세어 봅니다. 혼내지 마시고, "이번 주 어땠어?" 한마디만 건네주세요.',
  },
  {
    no: 3,
    title: '후회는 혼나는 게 아니라 배우는 겁니다',
    teaser: '아이가 산 걸 후회한다고 했나요? 그 후회가 가장 값진 수업입니다. 어른도 후회하면서 배우니까요.',
    body: '아이가 산 걸 후회한다고 했나요? 그 후회가 가장 값진 수업입니다. 어른도 후회하면서 배우니까요. 이번 주는 "사길 잘했다 / 아쉽다"를 같이 표시해 보세요. 평가가 아니라, 다음 선택을 위한 기록입니다. 후회를 부끄러워하지 않는 아이가, 다음엔 더 신중해집니다.',
  },
  // 4~10주 — 함께하면 매주 도착 (준비 중)
  { no: 4,  title: '고르는 건 어른도 어렵습니다',          teaser: '준비 중입니다.' },
  { no: 5,  title: '비싼 게 좋은 거라고 가르치지 마세요',    teaser: '준비 중입니다.' },
  { no: 6,  title: '안 보이는 곳에 모으는 즐거움',          teaser: '준비 중입니다.' },
  { no: 7,  title: '가격표에 없는 가치를 함께 보세요',       teaser: '준비 중입니다.' },
  { no: 8,  title: '기다림은 참기가 아니라 고르기입니다',    teaser: '준비 중입니다.' },
  { no: 9,  title: '당장과 나중 사이, 아이의 속도로',        teaser: '준비 중입니다.' },
  { no: 10, title: '10주를 함께 걸어주셔서 — 이제 시작입니다', teaser: '준비 중입니다.' },
];

export function getLetterByWeek(week: number): Letter | undefined {
  return LETTERS.find((l) => l.no === week);
}

// ─── 주차별 콘텐츠 (영상·읽을 글) ───
// videoEmbed 없으면 "준비 중" 처리. 샘플은 3주차에만 실제 임베드.

export type WeekContent = {
  week: number;
  videoTitle: string;
  videoEmbed?: string;   // youtube embed url
  articleTitle: string;
};

export const WEEK_CONTENT: Record<number, WeekContent> = {
  0:  { week: 0,  videoTitle: '부모 OT 안내 영상',              articleTitle: '시작 전, 부모가 알아둘 3가지' },
  1:  { week: 1,  videoTitle: '1주차 · 용돈 계약서',           articleTitle: '용돈 계약서, 이렇게 씁니다' },
  2:  { week: 2,  videoTitle: '2주차 · 주사위 놀이',           articleTitle: '놀이로 배우는 잔고 지키기' },
  3:  { week: 3,  videoTitle: '3주차 · 충동소비(이솝우화)',    videoEmbed: 'https://www.youtube.com/embed/5Y9eRKMtzQg', articleTitle: '충동소비 — 기회비용을 아이 눈높이로' },
  4:  { week: 4,  videoTitle: '4주차 · 경매 놀이',             articleTitle: '경매로 배우는 선택과 포기' },
  5:  { week: 5,  videoTitle: '5주차 · 쇼핑 리스트',           articleTitle: '쇼핑 리스트 쓰는 법' },
  6:  { week: 6,  videoTitle: '6주차 · 통장·체크카드',         articleTitle: '통장과 체크카드, 처음이라면' },
  7:  { week: 7,  videoTitle: '7주차 · 과시소비(이솝우화)',    articleTitle: '과시소비 — 벌거숭이 임금님' },
  8:  { week: 8,  videoTitle: '8주차 · 함께 장 보기',          articleTitle: '가격을 비교한다는 것' },
  9:  { week: 9,  videoTitle: '9주차 · 모방소비(이솝우화)',    articleTitle: '모방소비 — 황소와 개구리' },
  10: { week: 10, videoTitle: '10주차 · 가족의 소비·수료',     articleTitle: '가족 여행으로 배우는 예산' },
};

export function getWeekContent(week: number): WeekContent {
  return WEEK_CONTENT[week] ?? WEEK_CONTENT[0];
}

// ─── 지식·동화 라이브러리 (상시 · 주차 무관) ───

export type LibraryItem = {
  id: string;
  kind: 'news' | 'story';
  emoji: string;
  title: string;
  desc: string;
};

export const LIBRARY: LibraryItem[] = [
  { id: 'news-1',  kind: 'news',  emoji: '📰', title: '용돈으로 보는 물가 이야기',   desc: '슬라임이 작년보다 비싸진 이유' },
  { id: 'news-2',  kind: 'news',  emoji: '📰', title: '내 통장에 이자가 붙었어요',   desc: '모으면 늘어나는 신기한 돈' },
  { id: 'news-3',  kind: 'news',  emoji: '📰', title: '세뱃돈은 왜 받을까',          desc: '명절에 오가는 돈의 의미' },
  { id: 'story-1', kind: 'story', emoji: '📖', title: '황금알을 낳는 거위',          desc: '한꺼번에 다 가지려다…' },
  { id: 'story-2', kind: 'story', emoji: '📖', title: '여우와 포도',                desc: '못 가진 것을 대하는 마음' },
  { id: 'story-3', kind: 'story', emoji: '📖', title: '고깃덩어리를 문 개',          desc: '욕심내다 둘 다 놓친 이야기' },
];

// ─── 더미 아이 3명 (10주 기준 재배치) ───

export const MOCK_CHILDREN: Child[] = [
  { id: 'child-1', name: '지우', age: 8, cohort: '1기 (2026 봄)', avatarEmoji: '👧', currentWeek: 3 },
  { id: 'child-2', name: '서윤', age: 7, cohort: '1기 (2026 봄)', avatarEmoji: '👧', currentWeek: 1 },
  { id: 'child-3', name: '도현', age: 9, cohort: '1기 (2026 봄)', avatarEmoji: '👦', currentWeek: 7 },
];

const photo = (seed: string) => `https://picsum.photos/seed/${seed}/600/400`;
const mk = (
  childId: string,
  week: number,
  parentText: string | undefined,
  coachComment: string | null,
  seed?: string,
): Note => ({
  id: `note-${childId}-${week}`,
  childId,
  week,
  date: COHORT_WEEKS[week].date,
  missionTitle: COHORT_WEEKS[week].mission,
  parentText,
  photoUrl: parentText && seed ? photo(seed) : undefined,
  coachComment,
});

// ─── 더미 노트 (도래한 주차만 — 미래 주차는 UI에서 자동 생성) ───
// 한마디 대기 = parentText 있고 coachComment 없는 것 (지우 2주·서윤 1주·도현 7주 = 3건)

export const MOCK_NOTES: Note[] = [
  // 지우 (currentWeek=3)
  mk('child-1', 0, '아이 앞에서 카드 긁는 모습을 자주 보였다는 걸 처음 인지했어요.', '엄마가 그걸 알아챈 게 첫 걸음이에요. 그 자각이 10주를 끌고 갑니다.', 'jiwoo-0'),
  mk('child-1', 1, '지우가 다이소에서 슬라임 살까 말까 5분 고민하고 결국 안 샀어요. 본인이 더 놀랐어요.', '5분 고민이 30년 가는 첫 출발이에요. 잘했다고 꼭 말해주세요, 지우야.', 'jiwoo-1'),
  mk('child-1', 2, '매일 저녁 남은 용돈을 세어 봤어요. "오늘은 안 썼다"며 뿌듯해하더라구요.', null, 'jiwoo-2'),
  mk('child-1', 3, undefined, null),

  // 서윤 (currentWeek=1)
  mk('child-2', 0, '저희 집은 용돈을 한 번도 정기적으로 준 적이 없어요. 그게 첫 풍경이에요.', '괜찮아요. 7살부터 시작해도 늦지 않아요. 같이 만들어 봅시다.', 'seoyoon-0'),
  mk('child-2', 1, '서윤이는 사기 전에 "이거 진짜 필요해?"라고 자기한테 물어봐요. 신기해요.', null, 'seoyoon-1'),

  // 도현 (currentWeek=7) — 빠른 아이
  mk('child-3', 0, '도현이가 게임 아이템 사는 데 망설임이 없어서 시작했어요.', '게임 아이템은 9살의 솔직한 욕구예요. 그걸 인정하고 시작해도 늦지 않아요.', 'dohyun-0'),
  mk('child-3', 1, '편의점에서 음료 두 개 사려다가 한 개만 골랐어요.', '한 개로 줄인 그 선택이 진짜 어려운 거예요. 잘했어요 도현이.', 'dohyun-1'),
  mk('child-3', 2, '매일 남은 돈을 세더니 "생각보다 빨리 줄어든다"고 하더라고요.', '그 깨달음이 핵심이에요. 숫자를 본 거예요.', 'dohyun-2'),
  mk('child-3', 3, '게임 아이템 산 걸 "아쉬움"으로 표시했어요. 스스로요.', '아쉬움을 인정하는 9살 — 다음 선택이 달라집니다.', 'dohyun-3'),
  mk('child-3', 4, '경매 놀이에서 끝까지 고민하다 한 개만 골랐어요.', '겨뤄보고 하나를 고른 경험, 평생 갑니다.', 'dohyun-4'),
  mk('child-3', 5, '같은 과자를 마트와 편의점에서 비교해 왔어요.', '가격을 직접 비교한 9살 — 이제 가격표가 보이기 시작한 거예요.', 'dohyun-5'),
  mk('child-3', 6, '용돈에서 1,000원을 떼어 저금통에 넣었어요.', '안 보이는 곳에 모으는 첫 연습, 훌륭합니다.', 'dohyun-6'),
  mk('child-3', 7, '"우리 집에서 싼데 소중한 것"으로 할머니가 주신 컵을 찾았어요.', null, 'dohyun-7'),
];

// ─── Helper ───

export function getNotesByChild(childId: string, allNotes: Note[]): Note[] {
  return allNotes
    .filter((n) => n.childId === childId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getChildStats(notes: Note[]) {
  const totalMissions = TOTAL_MISSIONS;
  const completedMissions = notes.filter((n) => n.parentText && n.week >= 1).length;
  const coachComments = notes.filter((n) => n.coachComment).length;
  return { totalMissions, completedMissions, coachComments };
}

export function getChildById(childId: string): Child | undefined {
  return MOCK_CHILDREN.find((c) => c.id === childId);
}

// 코치 모드 — 한마디 대기 큐 (부모 기록 있고 코치 미작성)
export function getPendingCoachNotes(allNotes: Note[]): Note[] {
  return allNotes
    .filter((n) => n.parentText && !n.coachComment)
    .sort((a, b) => b.date.localeCompare(a.date));
}
