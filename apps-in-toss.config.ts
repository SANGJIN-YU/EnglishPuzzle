import { defineConfig } from '@apps-in-toss/web-framework/config'

// 토스 미니앱(앱인토스) 설정. appName은 앱인토스 콘솔에 등록한 앱 이름과 같아야 해요.
export default defineConfig({
  appName: 'haruword',
  // 결과 공유가 막힐 때 클립보드 복사로 대신해요.
  permissions: [{ name: 'clipboard', access: 'write' }],
  navigationBar: {
    withBackButton: true,
    withHomeButton: true,
  },
  webView: {
    // 단어를 끌어서 고르는 판이라 당겨서 새로고침·튕김은 꺼요.
    bounces: false,
    pullToRefreshEnabled: false,
    overScrollMode: 'never',
  },
  webBundleDir: 'dist',
})
