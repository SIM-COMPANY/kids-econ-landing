import { useState, useEffect } from 'react';
import { C, T, S } from '../App';
import { CONTENT_SLOGAN } from '../mock/content';
import { LIBRARY, LETTERS } from '../mock/notes';
import { fetchContents, fetchArticles, type ContentRow, type ArticleRow } from '../lib/supabase';

// ─── 경제동화방 일러스트 (public/stories, seq 매핑) ───
const STORY_IMG: Record<number, string> = {
  1: '/stories/1-dog.svg',
  2: '/stories/2-ant.svg',
  3: '/stories/3-goose.svg',
  4: '/stories/4-fox.svg',
  5: '/stories/5-king.svg',
  6: '/stories/6-frog.svg',
};

// ─── 섹션 제목 ─────────────────────────────────

function SectionTitle({ kicker, title }: { kicker?: string; title: string }) {
  return (
    <div style={{ marginBottom: S.md }}>
      {kicker && (
        <p style={{ fontSize: T.small, fontWeight: 800, color: C.primary, letterSpacing: '0.06em', marginBottom: '4px' }}>
          {kicker}
        </p>
      )}
      <h2 style={{ fontSize: T.h3, fontWeight: 900, color: C.dark, letterSpacing: '-0.02em' }}>
        {title}
      </h2>
    </div>
  );
}

// ─── 기둥 설정 ────────────────────────────────
const PILLARS = [
  { key: 'all',         label: '전체' },
  { key: 'philosophy',  label: '🅓 철학' },
  { key: 'parent',      label: '🅐 부모' },
  { key: 'emotion',     label: '🅑 정서' },
  { key: 'practice',    label: '🅒 실무' },
];

// ─── 아티클 상세 (DB ArticleRow) ──────────────

function ArticleDetail({ article, onBack }: { article: ArticleRow; onBack: () => void }) {
  const pillar = PILLARS.find(p => p.key === article.pillar);
  return (
    <div style={{ padding: `${S.xl} ${S.md}` }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{
            background: 'transparent', border: 'none', color: C.textMuted,
            fontSize: T.body, cursor: 'pointer', padding: '4px 0', marginBottom: S.md, letterSpacing: '-0.01em',
          }}
        >
          ← 목록
        </button>
        <div style={{ fontSize: '40px', marginBottom: S.sm }}>{article.thumbnail}</div>
        {pillar && pillar.key !== 'all' && (
          <span style={{
            display: 'inline-block', fontSize: T.small, fontWeight: 700,
            color: C.primary, background: C.orange10, borderRadius: '20px',
            padding: '3px 10px', marginBottom: S.sm, letterSpacing: '-0.01em',
          }}>
            {pillar.label}
          </span>
        )}
        <h1 style={{ fontSize: T.h2, fontWeight: 900, color: C.dark, lineHeight: 1.35, letterSpacing: '-0.02em', marginBottom: '6px', display: 'block' }}>
          {article.title}
        </h1>
        <p style={{ fontSize: T.small, color: C.textMuted, marginBottom: S.lg, letterSpacing: '-0.01em' }}>
          {article.published_at}
        </p>
        <p style={{ fontSize: T.bodySm, color: C.textSub, lineHeight: 1.95, letterSpacing: '-0.01em', whiteSpace: 'pre-line' }}>
          {article.body}
        </p>
        {article.video_id && (
          <div style={{ marginTop: S.lg, borderRadius: '14px', overflow: 'hidden', position: 'relative', paddingTop: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${article.video_id}`}
              title="관련 영상"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
              allowFullScreen
            />
          </div>
        )}
        {article.more && (
          <div style={{ marginTop: S.lg, background: C.surface, borderRadius: '14px', padding: S.md }}>
            <p style={{ fontSize: T.bodySm, color: C.textSub, lineHeight: 1.8, letterSpacing: '-0.01em' }}>
              {article.more}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 경제 동화 상세 (DB contents) ───────────────

function StoryDetail({ story, onBack }: { story: ContentRow; onBack: () => void }) {
  return (
    <div style={{ padding: `${S.xl} ${S.md}` }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{
            background: 'transparent', border: 'none', color: C.textMuted,
            fontSize: T.body, cursor: 'pointer', padding: '4px 0', marginBottom: S.md, letterSpacing: '-0.01em',
          }}
        >
          ← 동화 목록
        </button>
        {STORY_IMG[story.seq] ? (
          <img src={STORY_IMG[story.seq]} alt={story.title} style={{ width: '200px', maxWidth: '60%', display: 'block', margin: `0 auto ${S.sm}` }} />
        ) : (
          <div style={{ fontSize: '52px', marginBottom: S.sm, textAlign: 'center' }}>{story.thumbnail}</div>
        )}
        <h1 style={{ fontSize: T.h2, fontWeight: 900, color: C.dark, lineHeight: 1.35, letterSpacing: '-0.02em', marginBottom: S.lg, textAlign: 'center' }}>
          {story.title}
        </h1>
        <p style={{ fontSize: T.body, color: C.textSub, lineHeight: 2.0, letterSpacing: '-0.01em', whiteSpace: 'pre-line' }}>
          {story.body}
        </p>
      </div>
    </div>
  );
}

// ─── 콘텐츠 탭 ─────────────────────────────────

export default function ContentTab({ onApply }: { onApply: () => void }) {
  const [openArticle, setOpenArticle] = useState<ArticleRow | null>(null);
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [fairytales, setFairytales] = useState<ContentRow[]>([]);
  const [openStory, setOpenStory] = useState<ContentRow | null>(null);

  useEffect(() => {
    fetchContents('fairytale').then(setFairytales);
    fetchArticles().then(setArticles);
  }, []);

  if (openArticle) {
    return <ArticleDetail article={openArticle} onBack={() => setOpenArticle(null)} />;
  }
  if (openStory) {
    return <StoryDetail story={openStory} onBack={() => setOpenStory(null)} />;
  }

  const filteredArticles = selectedPillar === 'all'
    ? articles
    : articles.filter(a => a.pillar === selectedPillar);

  const news = LIBRARY.filter((l) => l.kind === 'news');

  return (
    <div style={{ padding: `${S.xl} ${S.md}` }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>

        {/* 상단 시리즈 슬로건 (placeholder) */}
        <div style={{
          background: C.orange10,
          borderRadius: '20px',
          padding: `${S.lg} ${S.md}`,
          textAlign: 'center',
          marginBottom: S.xxl,
        }}>
          <p style={{ fontSize: T.small, fontWeight: 800, color: C.primary, letterSpacing: '0.06em', marginBottom: S.xs }}>
            엉클조 클럽 콘텐츠
          </p>
          <p style={{ fontSize: T.h3, fontWeight: 900, color: C.dark, lineHeight: 1.5, letterSpacing: '-0.02em' }}>
            {CONTENT_SLOGAN}
          </p>
        </div>

        {/* 엉클조의 자녀경제 노트 — 통합 시리즈 */}
        <SectionTitle kicker="SERIES" title="엉클조의 자녀경제 노트" />
        <p style={{ fontSize: T.bodySm, color: C.textMuted, lineHeight: 1.6, marginBottom: S.md, letterSpacing: '-0.01em' }}>
          돈과 아이에 관한 짧은 글. 검색·공유로 만나는 부모들과 나눠요.
        </p>

        {/* 기둥 필터 탭 */}
        <div style={{
          display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px',
          marginBottom: S.md, scrollbarWidth: 'none',
        }}>
          {PILLARS.map(p => (
            <button
              key={p.key}
              onClick={() => setSelectedPillar(p.key)}
              style={{
                flexShrink: 0, padding: '6px 14px', borderRadius: '20px', border: 'none',
                fontSize: T.small, fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.01em',
                background: selectedPillar === p.key ? C.primary : C.surface,
                color: selectedPillar === p.key ? '#fff' : C.textMuted,
                transition: 'background 0.15s',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm, marginBottom: S.xxl }}>
          {filteredArticles.length === 0 && (
            <p style={{ fontSize: T.bodySm, color: C.textMuted, padding: S.md, textAlign: 'center' }}>
              불러오는 중…
            </p>
          )}
          {filteredArticles.map((a) => (
            <button
              key={a.id}
              onClick={() => setOpenArticle(a)}
              style={{
                background: C.bg, border: `1px solid ${C.border}`, borderRadius: '16px',
                padding: S.sm, cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: S.sm,
              }}
            >
              <span style={{
                width: '52px', height: '52px', borderRadius: '12px', background: C.surface,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0,
              }}>
                {a.thumbnail}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: T.bodySm, fontWeight: 700, color: C.dark, letterSpacing: '-0.01em', lineHeight: 1.4, marginBottom: '2px' }}>
                  {a.title}
                </p>
                <p style={{ fontSize: T.small, color: C.textMuted, letterSpacing: '-0.01em' }}>
                  {PILLARS.find(p => p.key === a.pillar)?.label ?? ''} · {a.published_at}
                </p>
              </div>
              <span style={{ color: C.textMuted, fontSize: '16px', flexShrink: 0 }}>→</span>
            </button>
          ))}
        </div>

        {/* 엉클조의 경제동화방 (DB contents) */}
        <SectionTitle kicker="SERIES" title="📖 엉클조의 경제동화방" />
        <p style={{ fontSize: T.bodySm, color: C.textMuted, lineHeight: 1.6, marginBottom: S.md, letterSpacing: '-0.01em' }}>
          익숙한 옛이야기 속에 숨은 '돈 마음'을 들여다보는 시간.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S.sm, marginBottom: S.xxl }}>
          {fairytales.map((item) => {
            const teaser = (item.body ?? '').split('\n')[0].slice(0, 30);
            return (
              <button
                key={item.id}
                onClick={() => setOpenStory(item)}
                style={{
                  background: C.bg, border: `1px solid ${C.border}`, borderRadius: '14px', padding: S.md,
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                {STORY_IMG[item.seq] ? (
                  <img src={STORY_IMG[item.seq]} alt={item.title} style={{ width: '100%', display: 'block', borderRadius: '10px', marginBottom: '8px' }} />
                ) : (
                  <p style={{ fontSize: '28px', marginBottom: '6px' }}>{item.thumbnail}</p>
                )}
                <p style={{ fontSize: T.bodySm, fontWeight: 700, color: C.dark, lineHeight: 1.4, letterSpacing: '-0.01em', marginBottom: '4px' }}>
                  {item.title}
                </p>
                <p style={{ fontSize: T.small, color: C.textMuted, lineHeight: 1.5, letterSpacing: '-0.01em' }}>
                  {teaser}…
                </p>
                <p style={{ fontSize: T.small, color: C.primary, fontWeight: 700, marginTop: '6px', letterSpacing: '-0.01em' }}>
                  읽어보기 →
                </p>
              </button>
            );
          })}
        </div>

        {/* 어린이 경제신문 */}
        <SectionTitle title="📰 어린이 경제신문" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S.sm, marginBottom: S.xxl }}>
          {news.map((item) => (
            <div key={item.id} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '14px', padding: S.md }}>
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

        {/* 엉클조의 편지 — 1편 맛보기 + 나머지 잠금 */}
        <SectionTitle title="✉️ 엉클조의 편지" />
        <p style={{ fontSize: T.bodySm, color: C.textMuted, lineHeight: 1.6, marginBottom: S.md, letterSpacing: '-0.01em' }}>
          10주 동안 매주 한 통씩 부모님께 도착하는 편지. 1편만 미리 읽어보실 수 있어요.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
          {LETTERS.map((l) => {
            const open = l.no === 1; // 1편만 공개
            if (open) {
              return (
                <div key={l.no} style={{ background: C.orange10, borderRadius: '16px', padding: S.lg }}>
                  <p style={{ fontSize: T.small, fontWeight: 800, color: C.primary, letterSpacing: '0.06em', marginBottom: '4px' }}>
                    1편 · 맛보기
                  </p>
                  <p style={{ fontSize: T.h3, fontWeight: 800, color: C.dark, letterSpacing: '-0.02em', marginBottom: S.sm, lineHeight: 1.4 }}>
                    {l.title}
                  </p>
                  <p style={{ fontSize: T.bodySm, color: C.textSub, lineHeight: 1.85, letterSpacing: '-0.01em', whiteSpace: 'pre-line' }}>
                    {l.body ?? l.teaser}
                  </p>
                </div>
              );
            }
            return (
              <div key={l.no} style={{
                background: C.bg, border: `1px solid ${C.border}`, borderRadius: '14px', padding: S.md,
                display: 'flex', alignItems: 'center', gap: S.sm, opacity: 0.7,
              }}>
                <span style={{ fontSize: '18px' }}>🔒</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: T.bodySm, fontWeight: 700, color: C.textMuted, letterSpacing: '-0.01em', lineHeight: 1.4 }}>
                    {l.no}편 · {l.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 편지 잠금 → 신청 CTA */}
        <div style={{ marginTop: S.md, background: C.surface, borderRadius: '16px', padding: S.lg, textAlign: 'center' }}>
          <p style={{ fontSize: T.bodySm, color: C.textSub, lineHeight: 1.7, marginBottom: S.md, letterSpacing: '-0.01em' }}>
            2편부터는 함께하면 매주 도착합니다.
          </p>
          <button
            onClick={onApply}
            style={{
              width: '100%', background: C.primary, color: '#fff', border: 'none',
              padding: '16px', borderRadius: '14px', fontSize: T.body, fontWeight: 800,
              cursor: 'pointer', letterSpacing: '-0.01em',
              boxShadow: '0 6px 20px rgba(255,111,15,0.35)',
            }}
          >
            10주 용돈 연습 신청하기 →
          </button>
        </div>

      </div>
    </div>
  );
}
