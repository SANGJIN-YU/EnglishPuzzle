# 하루워드 (EnglishPuzzle)

매일 자정(한국 시간) 모두에게 같은 **주제 하나 + 영어 단어 10개**가 숨은 12×12 글자 판이 열리는 데일리 단어 찾기 퍼즐.

- 글자를 끌어서(또는 첫 글자·끝 글자를 차례로 눌러) 단어를 고름. 가로·세로·대각선, 거꾸로도 가능
- 찾으면 단어의 **한국어 뜻**이 열림 (영단어 공부 겸용)
- 힌트: 첫 글자 위치 표시. 결과 카드에 노란 칸으로 남음
- 연속 기록·최고 기록은 브라우저 localStorage에 저장 (로그인 없음)
- 결과 공유: 정답 없이 시간·힌트·칸 이모지 (모바일은 공유 시트, PC는 클립보드 복사)
- **연습**: 12×12(지난 주제), 18·24·30×30(여러 주제 섞어서, 확대·스크롤). 연속 기록에는 안 들어감

## 개발

```bash
npm install
npm run dev            # http://localhost:5173  (개발 모드에서 ?n=3 으로 다른 날 미리보기)
npm test               # 판 생성·선택·스트릭·공유 문구 테스트
npm run check:puzzles  # 문제 데이터 검사 (단어 형식, 중복, 단어 속 단어, 60일치 판 배치)
npm run build          # 검사 + 타입체크 + dist/ 생성
```

## 문제 추가

`src/puzzles.ts` 배열 끝에 하루치(주제, 영문 주제, 단어 10개와 뜻)를 추가합니다. 0번이 #1(출시일 `src/lib/day.ts`의 `LAUNCH_DATE` = 2026-11-24).
단어는 영문 대문자 3~10글자, 전체 기간에서 중복 없이. 판은 날짜로 시드를 정해 만들어서 모두 같은 판을 봅니다.
현재 60일치(#60 = 2027-01-22). 문제가 떨어지면 #1부터 다시 돌아가므로, 그 전에 채워 두세요.

## 배포 (Cloudflare Workers Builds)

저장소를 Workers에 연결하면 `wrangler.jsonc`가 `dist/`를 정적 자산으로 올립니다.
빌드 명령 `npm run build`, 배포 명령 `npx wrangler deploy`(기본값). 분석은 `src/lib/track.ts`에 연결합니다.

## 구글 플레이(TWA)

`public/`에 manifest, 서비스 워커(`sw.js`, 운영 빌드에서만 등록), 아이콘, `privacy.html`, `.well-known/assetlinks.json`이 있습니다.
패키지 이름 `kr.englishpuzzle.app`. 출시 전에 `privacy.html`의 `CONTACT_EMAIL`과 `assetlinks.json`의 SHA-256 지문을 채워야 합니다.
