import { useState } from 'react';
import type { FormEvent } from 'react';

const FORMSPREE_ID = 'meelbwyv';

const METHODS = [
  {
    icon: '💰',
    title: '주간 용돈 (간섭 없이)',
    desc: '뭐에 쓰든 안 물어봤습니다. 간섭 안 하는 게 핵심이었습니다.',
    age: '초등 저학년~',
    did: true,
  },
  {
    icon: '📒',
    title: '용돈 기입장',
    desc: '잘 쓰면 상금 줬습니다. 몇 달 지나면 스스로 "이거 왜 샀지?"가 나옵니다.',
    age: '초등 저학년~',
    did: true,
  },
  {
    icon: '🏦',
    title: '100% 매칭 적금',
    desc: '아이가 넣으면 아빠도 똑같이. 목표가 생기면 아끼는 이유가 생깁니다.',
    age: '초등 중학년~',
    did: true,
  },
  {
    icon: '📈',
    title: '주식 첫 경험',
    desc: '아이가 아는 회사로 시작합니다. 뉴스가 달라 보이기 시작합니다.',
    age: '초등 고학년~',
    did: true,
  },
  {
    icon: '⚖️',
    title: '기회비용 교육',
    desc: '선택하면 나머지는 포기. 그게 기회비용이더라고요.',
    age: '전 연령',
    did: false,
  },
  {
    icon: '🛒',
    title: '시장 경험',
    desc: '마트 말고 재래시장. 살아있는 경제가 거기 있더라고요.',
    age: '초등 전~',
    did: false,
  },
];

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

const HOW = [
  '2~3명, 카페에서 1시간 반',
  '엉클조가 먼저 경험 나눕니다',
  '나머지는 같이 이야기합니다',
  '강의 아닙니다',
];

/* ─── 공통 스타일 ─── */
const card: React.CSSProperties = {
  background: '#fff',
  border: '1.5px solid #FFE4CC',
  borderRadius: '16px',
  padding: '24px',
};

export default function App() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ fontFamily: 'inherit', background: '#FFFCF8', minHeight: '100vh', color: '#1C1C1C' }}>

      {/* ══════════════════════════════
          히어로
      ══════════════════════════════ */}
      <section style={{ background: '#FFF5EC', padding: '72px 24px 60px' }}>
        <div style={{ maxWidth: '540px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#FF6B35', fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', marginBottom: '18px' }}>
            엉클조 × 자녀경제교육 소모임 · 평택
          </p>
          <h1 style={{ fontSize: 'clamp(26px, 6vw, 36px)', fontWeight: 800, lineHeight: 1.35, marginBottom: '16px' }}>
            아이한테 돈 이야기,<br />어떻게 꺼내세요?
          </h1>
          {/* 경험자 훅 */}
          <p style={{
            fontSize: '15px', lineHeight: 1.8, color: '#7A4A2A',
            background: '#FFE8D6', borderRadius: '12px',
            padding: '14px 20px', marginBottom: '28px',
          }}>
            20년 전 두 아이와 직접 해봤습니다.<br />
            지금 돌아보니 <strong>전하고 싶은 것들이 생겼어요.</strong>
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#555', marginBottom: '36px' }}>
            어렵게 안 해도 돼요.<br />
            같은 고민 하는 동네 엄마들이랑<br />
            커피 한 잔 하며 얘기해봐요.
          </p>
          <a
            href="#apply"
            style={{
              display: 'inline-block', background: '#FF6B35', color: '#fff',
              padding: '16px 36px', borderRadius: '14px', fontWeight: 700,
              fontSize: '16px', textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(255,107,53,0.3)',
            }}
          >
            평택 첫 모임 신청하기
            <span style={{ display: 'block', fontSize: '12px', fontWeight: 400, opacity: 0.85, marginTop: '3px' }}>
              2~3명 소규모
            </span>
          </a>
        </div>
      </section>

      {/* ══════════════════════════════
          문제 공감
      ══════════════════════════════ */}
      <section style={{ padding: '64px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, textAlign: 'center', marginBottom: '28px' }}>
            이런 고민 하고 있지 않으세요?
          </h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {PROBLEMS.map((item, i) => (
              <li key={i} style={{
                display: 'flex', gap: '12px', alignItems: 'flex-start',
                padding: '16px 18px', background: '#FFF5EC', borderRadius: '12px',
                fontSize: '15px', lineHeight: 1.65,
              }}>
                <span style={{ fontSize: '17px', flexShrink: 0, marginTop: '1px' }}>😅</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══════════════════════════════
          엉클조 정체성 — 아이러니 3줄
      ══════════════════════════════ */}
      <section style={{ padding: '64px 24px', background: '#1C1C1C', color: '#fff' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#FF8C5A', fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', marginBottom: '28px' }}>
            엉클조 (조경만)
          </p>
          {/* 3개 스탯 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '36px' }}>
            {[
              { num: '연세대', label: '경제학과 졸업' },
              { num: '10년', label: '증권사·금융기관 근무' },
              { num: '20년', label: '금융교육 강사' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#2C2C2C', borderRadius: '14px', padding: '20px 12px' }}>
                <p style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 800, color: '#FF8C5A', marginBottom: '6px' }}>{s.num}</p>
                <p style={{ fontSize: '12px', color: '#aaa', lineHeight: 1.5 }}>{s.label}</p>
              </div>
            ))}
          </div>
          {/* 경험 한 줄 + 전하고 싶은 것 */}
          <div style={{ borderTop: '1px solid #333', paddingTop: '28px' }}>
            <p style={{ fontSize: '18px', lineHeight: 1.8, color: '#ddd', marginBottom: '12px' }}>
              두 아이와 <strong style={{ color: '#fff' }}>직접 해봤습니다.</strong><br />
              잘 된 것도 있고, 지금 와서<br />
              <strong style={{ color: '#FF8C5A' }}>더 잘해줄 수 있었던 것들도 보입니다.</strong>
            </p>
            <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.7 }}>
              20년이 지나고 나서야 보이는 것들.<br />
              그걸 지금의 엄마들께 전하고 싶습니다.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          실제 경험 — 은세미·형찬이
      ══════════════════════════════ */}
      <section style={{ padding: '64px 24px', background: '#FFFCF8' }}>
        <div style={{ maxWidth: '580px', margin: '0 auto' }}>
          <p style={{ color: '#FF6B35', fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', textAlign: 'center', marginBottom: '8px' }}>
            엉클조가 직접 해봤습니다
          </p>
          <h2 style={{ fontSize: '20px', fontWeight: 700, textAlign: 'center', marginBottom: '32px' }}>
            두 아이와 실제로 한 것들
          </h2>

          {/* 은세미 카드 */}
          <div style={{ ...card, marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px' }}>👧</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: '16px' }}>딸 은세미 (초등 3학년 때 시작)</p>
                <p style={{ fontSize: '13px', color: '#999' }}>용돈기입장 → 적금 → 주식</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { step: '1단계', text: '주 1,500원 용돈 + 용돈기입장. 몇 달 후 확인해보니 1만원 중 9,000원이 군것질이었습니다. 아무 말 안 했습니다. 스스로 보게만 했어요.' },
                { step: '2단계', text: '100% 매칭 적금 제안. 은세미가 5,000원씩 넣겠다고 했습니다. 1년 후 명절 용돈까지 더해 9만원이 넘었습니다.' },
                { step: '3단계', text: '"아는 회사 말해봐." 하나로통신, 기업은행. 주주총회 소집장이 오자 신이 났습니다.' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{
                    background: '#FFE4CC', color: '#C0440A', fontSize: '11px',
                    fontWeight: 700, padding: '3px 8px', borderRadius: '20px',
                    flexShrink: 0, marginTop: '2px',
                  }}>{s.step}</span>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#444' }}>{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 형찬이 카드 */}
          <div style={{ ...card }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px' }}>👦</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: '16px' }}>아들 형찬이 (누나보다 3살 아래)</p>
                <p style={{ fontSize: '13px', color: '#999' }}>13만원 → 주식 → 5년 후 400%</p>
              </div>
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#444', marginBottom: '16px' }}>
              누나보다 더 적극적으로 모아 13만원 목돈을 만들었습니다.<br />
              현대자동차, SK 주식을 샀습니다. 아는 회사라 직접 골랐습니다.
            </p>
            {/* 결과 강조 */}
            <div style={{
              background: '#FFF5EC', border: '1.5px solid #FFD4B0',
              borderRadius: '12px', padding: '16px', textAlign: 'center',
            }}>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>5년 후 결과</p>
              <p style={{ fontSize: '28px', fontWeight: 800, color: '#FF6B35' }}>+400%</p>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                "겨울 지나면 기름 덜 팔리고, 여름엔 음료수가 많이 팔릴 것 같아요."<br />
                <span style={{ color: '#999' }}>— 형찬이의 투자 논리</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          경제공부 방법
      ══════════════════════════════ */}
      <section style={{ padding: '64px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, textAlign: 'center', marginBottom: '6px' }}>
            가정에서 해볼 수 있는 방법들
          </h2>
          <p style={{ color: '#999', textAlign: 'center', fontSize: '14px', marginBottom: '32px' }}>
            제가 해봤거나, 해봤으면 좋았을 것들입니다
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {METHODS.map((m, i) => (
              <div key={i} style={{
                background: '#FFFCF8', border: '1.5px solid #FFE4CC',
                borderRadius: '16px', padding: '22px 20px', position: 'relative',
              }}>
                {m.did && (
                  <span style={{
                    position: 'absolute', top: '14px', right: '14px',
                    background: '#FF6B35', color: '#fff',
                    fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px',
                  }}>직접 했습니다</span>
                )}
                <div style={{ fontSize: '26px', marginBottom: '10px' }}>{m.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '8px', paddingRight: m.did ? '60px' : '0' }}>{m.title}</h3>
                <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#555', marginBottom: '14px' }}>{m.desc}</p>
                <span style={{
                  display: 'inline-block', background: '#FFE4CC', color: '#C0440A',
                  fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '20px',
                }}>
                  {m.age}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          모임 안내
      ══════════════════════════════ */}
      <section style={{ padding: '64px 24px', background: '#FFF5EC' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>
            이런 분들이랑 이야기하고 싶어요
          </h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '44px' }}>
            {WHO.map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '15px', lineHeight: 1.65 }}>
                <span style={{ color: '#FF6B35', fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
            첫 모임은 이렇게 합니다
          </h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {HOW.map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '15px', lineHeight: 1.65, color: '#444' }}>
                <span style={{ color: '#FF6B35', flexShrink: 0 }}>·</span>
                <span style={{ fontWeight: item === '강의 아닙니다' ? 700 : 400 }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══════════════════════════════
          신청 폼
      ══════════════════════════════ */}
      <section id="apply" style={{ padding: '64px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, textAlign: 'center', marginBottom: '6px' }}>
            부담 없이 신청해주세요.
          </h2>
          <p style={{ color: '#999', textAlign: 'center', fontSize: '15px', marginBottom: '36px' }}>
            2~3명이어도 엽니다.
          </p>

          {submitted ? (
            <div style={{
              textAlign: 'center', padding: '52px 24px',
              background: '#FFF5EC', borderRadius: '20px', border: '1.5px solid #FFE4CC',
            }}>
              <div style={{ fontSize: '52px', marginBottom: '16px' }}>☺️</div>
              <p style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>신청해주셨습니다!</p>
              <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.7 }}>
                연락처로 모임 일정 안내 드릴게요.<br />커피 한 잔 하며 편하게 얘기해요.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: '이름', name: 'name', type: 'text', placeholder: '홍길동' },
                { label: '연락처', name: 'phone', type: 'tel', placeholder: '010-0000-0000' },
                { label: '아이 나이', name: 'child_age', type: 'text', placeholder: '예) 7살, 초등 3학년' },
              ].map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '7px', color: '#444' }}>
                    {field.label}
                  </label>
                  <input
                    id={field.name} name={field.name} type={field.type} required placeholder={field.placeholder}
                    style={{ width: '100%', padding: '13px 16px', border: '1.5px solid #E5E5E5', borderRadius: '10px', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#FF6B35')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E5E5')}
                  />
                </div>
              ))}
              <button
                type="submit" disabled={submitting}
                style={{
                  background: submitting ? '#ccc' : '#FF6B35', color: '#fff', border: 'none',
                  padding: '17px', borderRadius: '12px', fontSize: '17px', fontWeight: 700,
                  cursor: submitting ? 'not-allowed' : 'pointer', marginTop: '8px',
                  boxShadow: submitting ? 'none' : '0 4px 16px rgba(255,107,53,0.3)',
                }}
              >
                {submitting ? '신청 중...' : '함께하기'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ══════════════════════════════
          푸터 — 엉클조 소개
      ══════════════════════════════ */}
      <footer style={{ padding: '52px 24px', background: '#1C1C1C', color: '#bbb' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <p style={{ lineHeight: 1.85, fontSize: '15px', marginBottom: '20px' }}>
            경제학 공부를 했고, 금융기관에서 10년 일했습니다.<br />
            그다음 20년은 아이들한테 금융 교육을 해왔어요.<br />
            <br />
            두 아이와 직접 해봤습니다.<br />
            20년이 지나고 보니, 그때 더 잘해줄 수 있었던 것들이 보이더라고요.<br />
            그걸 지금의 엄마들께 나눠드리고 싶습니다.
          </p>
          <p style={{ color: '#666', fontSize: '14px' }}>— 엉클조 (조경만)</p>
        </div>
      </footer>

    </div>
  );
}
