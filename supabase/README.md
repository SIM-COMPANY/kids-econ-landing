# 엉클조 클럽 — Supabase 백엔드

링크 토큰 기반 경량 인증(프로토타입). 향후 이메일/소셜(카카오·구글) 로그인 전환 대비 설계.

## 구성
- `migrations/0001_init.sql` — 테이블 + 인증 함수(`current_app_user`) + RLS + 접근 RPC
- `seed.sql` — 더미 데이터 (코호트·부모3·코치1·아이3·미션10·진행·편지·아티클·동화/신문)
- `../src/lib/supabase.ts` — 클라이언트 초기화 + 토큰 로그인/접근 헬퍼
- `../.env.example` — `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 자리

## 적용
```bash
# Supabase 프로젝트 연결 후
supabase db reset          # migrations + seed 실행 (로컬)
# 또는 SQL 에디터에 0001_init.sql → seed.sql 순서로 붙여넣기

# 시드된 접근 링크 확인 (토큰은 자동 생성됨)
#   select role, name, access_token from public.users;
#   부모 → /p/{access_token},  코치 → /coach/{access_token}
```
`.env` 에 프로젝트 URL·anon key 를 채우면 프런트에서 동작. (`.env` 는 커밋 금지)

## 인증 동작 (현재)
- `users.access_token`(UUID) 이 로그인 키. URL 토큰으로 사용자를 식별.
- 데이터 접근은 토큰을 받는 **SECURITY DEFINER RPC**(`parent_children`, `coach_children`,
  `child_timeline`, `complete_mission`, `upsert_coach_note`)가 내부에서 권한 검증.
- 테이블 **RLS 정책은 `current_app_user()` 기준**으로 미리 작성 — Auth 전환 후의 목표 상태.

> ⚠️ **경량 인증**: `access_token` = 비밀번호. 링크가 유출되면 접근됩니다. 운영 전 Auth 전환 필수.

## 권한 요약 (RLS)
- 부모: 자기 `children`과 그 아이의 `enrollments`/`mission_progress`/`coach_notes`만 읽기.
- 코치: 전체 읽기·쓰기. `coach_notes` 작성은 코치만.
- `letters`: 1편 누구나 / 2~10편 참여자·코치만.
- `articles`·`contents`: 누구나. 단 `articles.locked=true`는 참여자·코치만.
- 쓰기(미션 완료): 해당 아이의 부모 또는 코치만.

## ★ 향후 이메일/소셜 로그인 전환 절차 (데이터는 그대로, 입구만 교체)
1. **Auth 켜기** — Supabase Auth 에서 이메일 또는 카카오/구글 provider 활성화.
2. **계정 연결** — 로그인한 사용자의 `auth.uid()` 를 기존 `users.auth_user_id` 에 채움
   (최초 로그인 시 `email` 매칭 등으로 1회 연결). 기존 아이·진행·편지가 그대로 승계됨.
3. **함수 한 곳 교체** — `current_app_user()` 본문을
   `select id from public.users where auth_user_id = auth.uid()` 로 변경. (RLS 정책은 그대로)
4. **토큰 입구 제거** — `login_with_token` 등 토큰 RPC 와 `/p/{token}` 라우팅을 로그인 화면으로 교체.
5. **직접 접근 전환(선택)** — 접근 RPC 대신 `supabase.from('...').select()` 직접 호출로 옮김
   (이제 RLS 가 `auth.uid()` 기준으로 행을 거름).
