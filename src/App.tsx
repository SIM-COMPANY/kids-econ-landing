import { useState } from 'react';
import type { FormEvent } from 'react';

const FORMSPREE_ID = 'meelbwyv';

const METHODS = [
  { icon: '💰', title: '주간 용돈 (간섭 없이)',   desc: '뭐에 쓰든 안 물어봤습니다. 간섭 안 하는 게 핵심이었습니다.', age: '초등 저학년~', did: true  },
  { icon: '📒', title: '용돈 기입장',             desc: '잘 쓰면 상금 줬습니다. 몇 달 지나면 스스로 "이거 왜 샀지?"가 나옵니다.', age: '초등 저학년~', did: true  },
  { icon: '🏦', title: '100% 매칭 적금',          desc: '아이가 넣으면 아빠도 똑같이. 목표가 생기면 아끼는 이유가 생깁니다.', age: '초등 중학년~', did: true  },
  { icon: '📈', title: '주식 첫 경험',            desc: '아이가 아는 회사로 시작합니다. 뉴스가 달라 보이기 시작합니다.',   age: '초등 고학년~', did: true  },
  { icon: '⚖️', title: '기회비용 교육',           desc: '선택하면 나머지는 포기. 그게 기회비용이더라고요.',               age: '전 연령',    did: false },
  { icon: '🛒', title: '시장 경험',               desc: '마트 말고 재래시장. 살아있는 경제가 거기 있더라고요.',            age: '초등 전~',   did: false },
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

  return (
    <div style={{ fontFamily: 'inherit', background: '#FFFCF8', minHeight: '100vh', color: '#1C1C1C' }}>

      {/* ══ 히어로 ══ */}
      <section style={{ background: 'linear-gradient(160deg, #FFD9B3 0%, #FFF5EC 60%)', padding: '72px 24px 60px' }}>
        <div style={{ maxWidth: '540px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#C0440A', fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', marginBottom: '18px' }}>
            엉클조 × 자녀경제교육 소모임 · 평택
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 6vw, 38px)', fontWeight: 900, lineHeight: 1.3, marginBottom: '24px', color: '#1C1C1C' }}>
            아이한테 돈 이야기,<br />어떻게 꺼내세요?
          </h1>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#4A3020', marginBottom: '36px' }}>
            어렵게 안 해도 돼요.<br />
            같은 고민 하는 동네 엄마들이랑<br />
            커피 한 잔 하며 얘기해봐요.
          </p>
          <a href="#apply" style={{
            display: 'inline-block', background: '#FF6B35', color: '#fff',
            padding: '16px 36px', borderRadius: '14px', fontWeight: 700, fontSize: '16px',
            textDecoration: 'none', boxShadow: '0 4px 16px rgba(255,107,53,0.3)',
          }}>
            평택 첫 모임 신청하기
            <span style={{ display: 'block', fontSize: '12px', fontWeight: 400, opacity: 0.85, marginTop: '3px' }}>2~3명 소규모</span>
          </a>
        </div>
      </section>

      {/* ══ 문제 공감 ══ */}
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

      {/* ══ 엉클조 자격 — 어두운 배경 ══ */}
      <section style={{ padding: '64px 24px', background: '#1C1C1C', color: '#fff' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
          <img
            src="/uncle-jo.png"
            alt="엉클조 조경만"
            style={{
              width: '96px', height: '96px', borderRadius: '50%',
              objectFit: 'cover', marginBottom: '16px',
              border: '3px solid #FF8C5A',
            }}
          />
          <p style={{ color: '#FF8C5A', fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', marginBottom: '28px' }}>
            엉클조 (조경만)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '36px' }}>
            {[
              { num: '연세대', label: '경제학과 졸업' },
              { num: '10년', label: '증권사·금융기관 근무' },
              { num: '20년', label: '금융교육 강사' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#2C2C2C', borderRadius: '14px', padding: '20px 12px' }}>
                <p style={{ fontSize: 'clamp(16px, 4vw, 22px)', fontWeight: 800, color: '#FF8C5A', marginBottom: '6px' }}>{s.num}</p>
                <p style={{ fontSize: '12px', color: '#aaa', lineHeight: 1.5 }}>{s.label}</p>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #333', paddingTop: '28px' }}>
            <p style={{
              fontSize: '15px', lineHeight: 1.8, color: '#7A4A2A',
              background: '#FFE8D6', borderRadius: '12px', padding: '14px 20px', marginBottom: '20px',
            }}>
              살아가면서 어떤 공부보다<br />
              <strong>돈을 다루는 습관이 더 필요하더라고요.</strong>
            </p>
            <p style={{ fontSize: '17px', lineHeight: 1.85, color: '#ddd', marginBottom: '12px' }}>
              두 아이와 직접 해봤습니다.<br />
              <strong style={{ color: '#FF8C5A' }}>아이들이 다 크고 나서야 알았습니다.</strong>
            </p>
            <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.75 }}>
              어릴 때 만들어준 돈 관리 습관이<br />성인이 된 지금까지 영향을 주고 있더라고요.
            </p>
          </div>
        </div>
      </section>

      {/* ══ 자녀 결과 — 겸손하게 ══ */}
      <section style={{ padding: '64px 24px', background: '#FFFCF8' }}>
        <div style={{ maxWidth: '580px', margin: '0 auto' }}>
          <p style={{ color: '#999', fontSize: '13px', textAlign: 'center', marginBottom: '6px' }}>
            자랑하려는 게 아닙니다.
          </p>
          <h2 style={{ fontSize: '20px', fontWeight: 700, textAlign: 'center', marginBottom: '8px' }}>
            그냥 이렇게 됐더라고요.
          </h2>
          <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', marginBottom: '32px', lineHeight: 1.7 }}>
            어릴 때 만든 습관 하나가<br />평생을 따라다니더라고요.
          </p>

          {/* 형찬이 */}
          <div style={{
            background: '#fff', border: '1.5px solid #FFE4CC', borderRadius: '16px',
            padding: '24px', marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
              <span style={{ fontSize: '28px', flexShrink: 0 }}>👦</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>아들 형찬이</p>
                <p style={{ fontSize: '13px', color: '#999' }}>초등학교 때 현대자동차 주식을 샀습니다</p>
              </div>
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#444', marginBottom: '16px' }}>
              "아는 회사 말해봐" 했더니 현대자동차를 골랐습니다.<br />
              주주가 되니 뉴스를 찾아보고, 회사를 공부했습니다.<br />
              그 아이가 지금 <strong>현대자동차에서 일하고 있습니다.</strong>
            </p>
            <div style={{
              background: '#FFF5EC', border: '1px solid #FFD4B0', borderRadius: '10px',
              padding: '12px 16px', fontSize: '13px', color: '#666', lineHeight: 1.7,
            }}>
              "좋아하는 회사 주주가 되니까 저절로 공부하게 됐어요."
            </div>
          </div>

          {/* 은세미 */}
          <div style={{
            background: '#fff', border: '1.5px solid #FFE4CC', borderRadius: '16px', padding: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
              <span style={{ fontSize: '28px', flexShrink: 0 }}>👧</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>딸 은세미</p>
                <p style={{ fontSize: '13px', color: '#999' }}>초등학교 때부터 용돈 기입장·적금을 했습니다</p>
              </div>
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#444', marginBottom: '16px' }}>
              용돈을 스스로 관리하면서 자립심이 생겼습니다.<br />
              크고 나서 스스로 중국 유학을 결정했고,<br />
              <strong>칭화대에 진학했습니다.</strong>
            </p>
            <div style={{
              background: '#FFF5EC', border: '1px solid #FFD4B0', borderRadius: '10px',
              padding: '12px 16px', fontSize: '13px', color: '#666', lineHeight: 1.7,
            }}>
              어릴 때 자기 돈을 스스로 다뤄본 경험이<br />나중에 큰 결정을 스스로 하는 힘이 됐습니다.
            </div>
          </div>
        </div>
      </section>

      {/* ══ 핵심 인사이트 — 혼자였다 ══ */}
      <section style={{ padding: '64px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          {/* 구분선 강조 */}
          <div style={{
            borderLeft: '4px solid #FF6B35', paddingLeft: '24px', marginBottom: '36px',
          }}>
            <p style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.8, marginBottom: '12px' }}>
              그때는 주변에<br />이런 걸 가르쳐 주는 사람이 없었습니다.
            </p>
            <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.8 }}>
              나도 혼자 해봤어요.<br />
              잘 된 것도 있고, 지금 와서 아쉬운 것도 있습니다.
            </p>
          </div>

          {/* 모임의 이유 */}
          <div style={{
            background: '#FFF5EC', borderRadius: '16px', padding: '28px 24px',
          }}>
            <p style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', lineHeight: 1.7 }}>
              요즘 엄마들은 더 지혜롭습니다.
            </p>
            <p style={{ fontSize: '15px', color: '#444', lineHeight: 1.85 }}>
              서로 힘을 합치면 더 좋은 방법이 나올 거라 생각합니다.<br />
              우리 아이들에게 좋은 경험과 가치, 습관을 줄 수 있지 않을까요?
            </p>
            <p style={{ fontSize: '14px', color: '#888', marginTop: '16px' }}>
              — 손주 볼 나이가 된 엉클조가 이 모임을 여는 이유입니다.
            </p>
          </div>
        </div>
      </section>

      {/* ══ 중간 CTA ══ */}
      <section style={{ padding: '40px 24px', background: '#fff', textAlign: 'center' }}>
        <p style={{ fontSize: '15px', color: '#888', marginBottom: '14px' }}>
          이야기 나눠보고 싶어졌다면
        </p>
        <a href="#apply" style={{
          display: 'inline-block', background: '#fff', color: '#FF6B35',
          border: '2px solid #FF6B35', padding: '13px 32px',
          borderRadius: '12px', fontWeight: 700, fontSize: '15px', textDecoration: 'none',
        }}>
          신청하러 가기 →
        </a>
      </section>

      {/* ══ 경제공부 방법 ══ */}
      <section style={{ padding: '64px 24px', background: '#FFFCF8' }}>
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
                background: '#fff', border: '1.5px solid #FFE4CC', borderRadius: '16px',
                padding: '22px 20px', position: 'relative',
              }}>
                {m.did && (
                  <span style={{
                    position: 'absolute', top: '14px', right: '14px',
                    background: '#FF6B35', color: '#fff',
                    fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px',
                  }}>직접 했습니다</span>
                )}
                <div style={{ fontSize: '26px', marginBottom: '10px' }}>{m.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '8px', paddingRight: m.did ? '64px' : '0' }}>{m.title}</h3>
                <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#555', marginBottom: '14px' }}>{m.desc}</p>
                <span style={{
                  display: 'inline-block', background: '#FFE4CC', color: '#C0440A',
                  fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '20px',
                }}>{m.age}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 모임 안내 ══ */}
      <section style={{ padding: '64px 24px', background: '#FFFCF8' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* 대상 카드 */}
          <div style={{ background: '#fff', border: '1.5px solid #FFE4CC', borderRadius: '16px', padding: '28px 24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: '#1C1C1C' }}>
              이런 분들이랑 이야기하고 싶어요
            </h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {WHO.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '15px', lineHeight: 1.65 }}>
                  <span style={{ color: '#FF6B35', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 방식 카드 */}
          <div style={{ background: '#1C1C1C', borderRadius: '16px', padding: '28px 24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: '#fff' }}>
              첫 모임은 이렇게 합니다
            </h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {HOW.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '12px', fontSize: '15px', lineHeight: 1.65, color: item === '강의 아닙니다' ? '#FF8C5A' : '#ccc' }}>
                  <span style={{ color: '#FF6B35', flexShrink: 0 }}>·</span>
                  <span style={{ fontWeight: item === '강의 아닙니다' ? 700 : 400 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* ══ 신청 폼 ══ */}
      <section id="apply" style={{ padding: '64px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, textAlign: 'center', marginBottom: '6px' }}>부담 없이 신청해주세요.</h2>
          <p style={{ color: '#999', textAlign: 'center', fontSize: '15px', marginBottom: '36px' }}>2~3명이어도 엽니다.</p>

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
                    onBlur={(e)  => (e.currentTarget.style.borderColor = '#E5E5E5')}
                  />
                </div>
              ))}
              <button type="submit" disabled={submitting} style={{
                background: submitting ? '#ccc' : '#FF6B35', color: '#fff', border: 'none',
                padding: '17px', borderRadius: '12px', fontSize: '17px', fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer', marginTop: '8px',
                boxShadow: submitting ? 'none' : '0 4px 16px rgba(255,107,53,0.3)',
              }}>
                {submitting ? '신청 중...' : '함께하기'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ══ 푸터 ══ */}
      <footer style={{ padding: '52px 24px', background: '#1C1C1C', color: '#bbb' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <p style={{ lineHeight: 1.85, fontSize: '15px', marginBottom: '20px' }}>
            20년 동안 수많은 분들께<br />
            돈과 생애설계, 행복을 주제로 이야기했습니다.<br />
            <br />
            그 경험을 나눠드리고 싶어 이 모임을 엽니다.
          </p>
          <p style={{ color: '#666', fontSize: '14px' }}>— 엉클조 (조경만)</p>
        </div>
      </footer>

    </div>
  );
}
