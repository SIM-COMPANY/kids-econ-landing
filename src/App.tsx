import { useState } from 'react';
import type { FormEvent } from 'react';

const FORMSPREE_ID = 'meelbwyv';

const METHODS = [
  {
    icon: '💰',
    title: '주간 용돈 (간섭 없이)',
    desc: '뭐에 쓰든 안 물어봤습니다. 간섭 안 하는 게 핵심이었습니다.',
    age: '초등 저학년~',
  },
  {
    icon: '📒',
    title: '용돈 기입장',
    desc: '잘 쓰면 상금 줬습니다. 몇 달 지나면 스스로 "이거 왜 샀지?"가 나옵니다.',
    age: '초등 저학년~',
  },
  {
    icon: '🏦',
    title: '100% 매칭 적금',
    desc: '아이가 넣으면 아빠도 똑같이. 목표가 생기면 아끼는 이유가 생깁니다.',
    age: '초등 중학년~',
  },
  {
    icon: '📈',
    title: '주식 첫 경험',
    desc: '아는 회사로 시작합니다. 뉴스가 달라 보이기 시작합니다.',
    age: '초등 고학년~',
  },
  {
    icon: '⚖️',
    title: '기회비용 교육',
    desc: '선택하면 나머지는 포기. 그게 기회비용이더라고요.',
    age: '전 연령',
  },
  {
    icon: '🛒',
    title: '시장 경험',
    desc: '마트 말고 재래시장. 살아있는 경제가 거기 있더라고요.',
    age: '초등 전~',
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

      {/* ── 히어로 ── */}
      <section style={{ background: '#FFF5EC', padding: '72px 24px 60px' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#FF6B35', fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', marginBottom: '18px' }}>
            엉클조 × 자녀경제교육 소모임
          </p>
          <h1 style={{ fontSize: 'clamp(26px, 6vw, 36px)', fontWeight: 800, lineHeight: 1.35, marginBottom: '20px' }}>
            아이한테 돈 이야기,<br />어떻게 꺼내세요?
          </h1>
          <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#555', marginBottom: '36px' }}>
            어렵게 안 해도 돼요.<br />
            같은 고민 하는 동네 엄마들이랑<br />
            커피 한 잔 하며 얘기해봐요.
          </p>
          <a
            href="#apply"
            style={{
              display: 'inline-block',
              background: '#FF6B35',
              color: '#fff',
              padding: '16px 36px',
              borderRadius: '14px',
              fontWeight: 700,
              fontSize: '16px',
              textDecoration: 'none',
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

      {/* ── 문제 공감 ── */}
      <section style={{ padding: '64px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, textAlign: 'center', marginBottom: '28px' }}>
            이런 고민 하고 있지 않으세요?
          </h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {PROBLEMS.map((item, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  padding: '16px 18px',
                  background: '#FFF5EC',
                  borderRadius: '12px',
                  fontSize: '15px',
                  lineHeight: 1.65,
                }}
              >
                <span style={{ fontSize: '17px', flexShrink: 0, marginTop: '1px' }}>😅</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 엉클조 스토리 ── */}
      <section style={{ padding: '64px 24px', background: '#FFFCF8' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <div
            style={{
              borderLeft: '4px solid #FF6B35',
              paddingLeft: '24px',
              paddingTop: '4px',
            }}
          >
            <p style={{ fontSize: '17px', lineHeight: 1.85, color: '#2C2C2C', fontWeight: 600, marginBottom: '6px' }}>
              "20년 전, 저는 아이한테 저금통만 줬습니다."
            </p>
            <p style={{ fontSize: '17px', lineHeight: 1.85, color: '#2C2C2C', fontWeight: 600, marginBottom: '6px' }}>
              "목표 없이 모으라고만 했어요. 왜 모으는지는 안 가르쳤습니다."
            </p>
            <p style={{ fontSize: '17px', lineHeight: 1.85, color: '#2C2C2C', fontWeight: 600, marginBottom: '20px' }}>
              "지금 생각하면 아쉬운 게 있어요."
            </p>
            <p style={{ color: '#999', fontSize: '14px' }}>— 엉클조 (조경만)</p>
          </div>
        </div>
      </section>

      {/* ── 경제공부 방법 ── */}
      <section style={{ padding: '64px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, textAlign: 'center', marginBottom: '6px' }}>
            가정에서 해볼 수 있는 방법들
          </h2>
          <p style={{ color: '#999', textAlign: 'center', fontSize: '14px', marginBottom: '32px' }}>
            제가 해봤거나, 해봤으면 좋았을 것들입니다
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '16px',
            }}
          >
            {METHODS.map((m, i) => (
              <div
                key={i}
                style={{
                  background: '#FFFCF8',
                  border: '1.5px solid #FFE4CC',
                  borderRadius: '16px',
                  padding: '22px 20px',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>{m.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '8px' }}>{m.title}</h3>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#555', marginBottom: '14px' }}>{m.desc}</p>
                <span
                  style={{
                    display: 'inline-block',
                    background: '#FFE4CC',
                    color: '#C0440A',
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '4px 12px',
                    borderRadius: '20px',
                  }}
                >
                  {m.age}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 모임 안내 ── */}
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

      {/* ── 신청 폼 ── */}
      <section id="apply" style={{ padding: '64px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, textAlign: 'center', marginBottom: '6px' }}>
            부담 없이 신청해주세요.
          </h2>
          <p style={{ color: '#999', textAlign: 'center', fontSize: '15px', marginBottom: '36px' }}>
            2~3명이어도 엽니다.
          </p>

          {submitted ? (
            <div
              style={{
                textAlign: 'center',
                padding: '52px 24px',
                background: '#FFF5EC',
                borderRadius: '20px',
                border: '1.5px solid #FFE4CC',
              }}
            >
              <div style={{ fontSize: '52px', marginBottom: '16px' }}>☺️</div>
              <p style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>신청해주셨습니다!</p>
              <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.7 }}>
                연락처로 모임 일정 안내 드릴게요.<br />
                커피 한 잔 하며 편하게 얘기해요.
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
                  <label
                    htmlFor={field.name}
                    style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '7px', color: '#444' }}
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    required
                    placeholder={field.placeholder}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      border: '1.5px solid #E5E5E5',
                      borderRadius: '10px',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#FF6B35')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E5E5')}
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: submitting ? '#ccc' : '#FF6B35',
                  color: '#fff',
                  border: 'none',
                  padding: '17px',
                  borderRadius: '12px',
                  fontSize: '17px',
                  fontWeight: 700,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  marginTop: '8px',
                  boxShadow: submitting ? 'none' : '0 4px 16px rgba(255,107,53,0.3)',
                  transition: 'background 0.2s',
                }}
              >
                {submitting ? '신청 중...' : '함께하기'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── 엉클조 소개 (하단) ── */}
      <footer style={{ padding: '52px 24px', background: '#1C1C1C', color: '#bbb' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <p style={{ lineHeight: 1.85, fontSize: '15px', marginBottom: '20px' }}>
            경제학 공부를 했고, 금융기관에서 10년 일했습니다.<br />
            그다음 20년은 아이들한테 금융 교육을 해왔어요.<br />
            <br />
            그래도 제 아이한테는 저금통만 줬습니다.<br />
            지식이 있다고 다 잘 가르치는 건 아니더라고요.
          </p>
          <p style={{ color: '#666', fontSize: '14px' }}>— 엉클조 (조경만)</p>
        </div>
      </footer>

    </div>
  );
}
