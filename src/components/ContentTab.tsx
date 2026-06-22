import { useState, useEffect } from 'react';
import { C, T, S } from '../App';
import {
  CONTENT_SLOGAN,
  WHY_ARTICLES,
  NOTE_ARTICLES,
} from '../mock/content';
import type { Article } from '../mock/content';
import { LIBRARY, LETTERS } from '../mock/notes';
import { fetchContents, type ContentRow } from '../lib/supabase';

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

// ─── 아티클 상세 ───────────────────────────────

function ArticleDetail({ article, onBack }: { article: Article; onBack: () => void }) {
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
        <h1 style={{ fontSize: T.h2, fontWeight: 900, color: C.dark, lineHeight: 1.35, letterSpacing: '-0.02em', marginBottom: '6px' }}>
          {article.title}
        </h1>
        <p style={{ fontSize: T.small, color: C.textMuted, marginBottom: S.lg, letterSpacing: '-0.01em' }}>
          {article.date}
        </p>
        <p style={{ fontSize: T.bodySm, color: C.textSub, lineHeight: 1.9, letterSpacing: '-0.01em' }}>
          {article.body}
        </p>
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
        <div style={{ fontSize: '52px', marginBottom: S.sm, textAlign: 'center' }}>{story.thumbnail}</div>
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
  const [openArticle, setOpenArticle] = useState<Article | null>(null);
  const [expandedWhy, setExpandedWhy] = useState<string | null>(null);
  const [fairytales, setFairytales] = useState<ContentRow[]>([]);
  const [openStory, setOpenStory] = useState<ContentRow | null>(null);

  useEffect(() => {
    fetchContents('fairytale').then(setFairytales);
  }, []);

  if (openArticle) {
    return <ArticleDetail article={openArticle} onBack={() => setOpenArticle(null)} />;
  }
  if (openStory) {
    return <StoryDetail story={openStory} onBack={() => setOpenStory(null)} />;
  }

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

        {/* 시리즈 1 — 왜 이렇게 가르칠까 */}
        <SectionTitle kicker="SERIES" title="왜 이렇게 가르칠까" />
        <p style={{ fontSize: T.bodySm, color: C.textMuted, lineHeight: 1.6, marginBottom: S.md, letterSpacing: '-0.01em' }}>
          엉클조가 이렇게 가르치는 이유, 짧게 그리고 깊게.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm, marginBottom: S.xxl }}>
          {WHY_ARTICLES.map((a) => {
            const open = expandedWhy === a.id;
            return (
              <div key={a.id} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '16px', padding: S.md }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: S.sm }}>
                  <span style={{ fontSize: '24px', lineHeight: 1.2 }}>{a.thumbnail}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: T.body, fontWeight: 800, color: C.dark, letterSpacing: '-0.01em', marginBottom: '4px', lineHeight: 1.4 }}>
                      {a.title}
                    </p>
                    <p style={{ fontSize: T.bodySm, color: C.textSub, lineHeight: 1.7, letterSpacing: '-0.01em' }}>
                      {a.body}
                    </p>
                  </div>
                </div>
                {a.more && (
                  <>
                    {open && (
                      <div style={{ marginTop: S.sm, background: C.surface, borderRadius: '12px', padding: S.md }}>
                        <p style={{ fontSize: T.bodySm, color: C.textSub, lineHeight: 1.8, letterSpacing: '-0.01em' }}>
                          {a.more}
                        </p>
                      </div>
                    )}
                    <button
                      onClick={() => setExpandedWhy(open ? null : a.id)}
                      style={{
                        marginTop: S.sm, background: 'transparent', border: 'none',
                        color: C.primary, fontSize: T.small, fontWeight: 700, cursor: 'pointer',
                        padding: '2px 0', letterSpacing: '-0.01em',
                      }}
                    >
                      {open ? '접기 ▴' : '더 자세히 ▾'}
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* 시리즈 2 — 엉클조의 자녀경제 노트 */}
        <SectionTitle kicker="SERIES" title="엉클조의 자녀경제 노트" />
        <p style={{ fontSize: T.bodySm, color: C.textMuted, lineHeight: 1.6, marginBottom: S.md, letterSpacing: '-0.01em' }}>
          매주 쌓이는, 돈과 아이에 관한 짧은 글.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm, marginBottom: S.xxl }}>
          {NOTE_ARTICLES.map((a) => (
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
                  {a.date}
                </p>
              </div>
              <span style={{ color: C.textMuted, fontSize: '16px' }}>→</span>
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
                <p style={{ fontSize: '28px', marginBottom: '6px' }}>{item.thumbnail}</p>
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
