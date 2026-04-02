# [P001] WHO 글로벌 원격 의료 플랫폼: Living Design Document - v2 (Cloudflare Migration Proposal)

**문서 목적:** 이 문서는 기존의 Firebase Hosting 기반 배포 전략을 GitHub와 연동된 **Cloudflare Pages**의 자동화된 CI/CD 파이프라인으로 변경하는 것을 제안하고, 그 기술적 타당성과 아키텍처 변경점을 기록하기 위해 작성되었습니다.

---

## 제 1조: 제안 배경 (Eng Manager Persona)

현재 우리는 `plan.md`에 명시된 대로 Firebase Hosting을 통해 성공적으로 MVP를 배포했습니다. 이는 빠른 배포와 안정성을 증명했지만, 개발 워크플로우 관점에서 개선의 여지가 있습니다.

**"GitHub에 푸시할 때마다 실시간으로 반영되면 좋겠다"** 는 요구사항은, 개발 경험을 극대화하고 배포 과정을 완전히 자동화하려는 명확한 목표를 제시합니다.

이를 위해, 기존 Firebase 수동 배포 방식에서 Cloudflare Pages가 제공하는 **Git-옵스(Git-Ops) 기반의 자동화된 CI/CD 파이프라인**으로 전환하는 것을 제안합니다.

---

## 제 2조: 변경될 아키텍처 (Eng Manager Persona)

> "최고의 아키텍처는 보이지 않게 작동하며, 개발자가 가장 중요한 일(코드 작성)에만 집중할 수 있도록 돕습니다."

### 1. 변경된 시스템 아키텍처 다이어그램

**AS-IS (현재):**
`[Developer] -> git push -> [GitHub] -> (manual deploy) -> [Firebase Hosting]`

**TO-BE (변경 제안):**
`[Developer] -> git push -> [GitHub] --(trigger)--> [Cloudflare CI/CD] --(build & deploy)--> [Cloudflare Pages CDN]`

-   **핵심 변경점:** 개발자가 GitHub에 코드를 푸시하는 것만으로, Cloudflare가 이를 감지하여 자동으로 빌드 및 배포 과정을 수행합니다. `firebase deploy`와 같은 수동 배포 명령이 더 이상 필요하지 않습니다.

### 2. 기술 스택 변경 제안

-   **Hosting:** Firebase Hosting -> **Cloudflare Pages**
-   **CI/CD:** Manual (Firebase CLI) -> **Automated (Cloudflare via GitHub)**

*나머지 스택(Frontend, Backend, Database 등)은 MVP 단계에서는 변경되지 않습니다. 이는 호스팅 및 배포 인프라의 점진적인 개선에 초점을 맞춘 제안입니다.*

### 3. 새로운 워크플로우

1.  개발자가 `main` 브랜치에 코드를 `git push` 합니다.
2.  GitHub이 Cloudflare Pages에 변경 사항을 알립니다 (Webhook).
3.  Cloudflare Pages는 연결된 GitHub 저장소에서 최신 코드를 가져옵니다.
4.  Cloudflare 인프라 내에서 프로젝트 빌드를 수행합니다. (현재 우리 프로젝트는 정적 파일이므로 빌드 과정은 거의 없습니다)
5.  빌드 결과물을 Cloudflare의 글로벌 CDN 네트워크에 원자적(atomic)으로 배포합니다.
6.  배포가 완료되면, 개발자는 즉시 새로운 버전의 웹사이트를 확인할 수 있습니다.

### 4. 에지 케이스 및 리스크 관리

-   **Risk 1: 두 개의 배포 채널 존재**
    -   **Description:** 마이그레이션 기간 동안 Firebase와 Cloudflare라는 두 개의 배포 환경이 존재하여 혼란을 야기할 수 있습니다.
    -   **Mitigation:** Cloudflare 배포가 안정화되면, `plan.md`를 공식적으로 v2로 업데이트하고 Firebase Hosting 배포는 중단(deprecated)하는 것을 원칙으로 합니다. 모든 공식 URL은 Cloudflare Pages의 URL로 통일합니다.
-   **Risk 2: 빌드 설정의 복잡성**
    -   **Description:** 향후 프로젝트가 복잡해지면(e.g., React, Vue 도입), Cloudflare 내의 빌드 설정이 복잡해질 수 있습니다.
    -   **Mitigation:** 초기 설정 시, 빌드 명령어(`npm run build` 등)와 최종 결과물 디렉토리(`dist`, `build` 등)를 명확하게 문서화하고 관리합니다. 현재 우리 프로젝트는 정적 HTML이므로 이 리스크는 매우 낮습니다.

---

## 제 3조: 검토 요청 (CEO, Design)

-   **To CEO:** 이 변경은 개발 속도를 높이고, 배포 실수를 원천적으로 방지하여 장기적으로 팀의 생산성을 극대화합니다. 이는 '10-star product'를 향한 반복개선(iteration) 속도를 가속화할 것입니다.
-   **To Senior Designer:** 배포 방식의 변경은 최종 사용자 경험에 영향을 주지 않습니다. 오히려 Cloudflare의 글로벌 CDN을 통해 전 세계 어디에서든 더 빠른 로딩 속도를 제공할 수 있는 잠재력이 있습니다.

**EM 최종 의견:**
"이 아키텍처 변경은 단순한 도구 교체가 아닌, **'코드가 곧 배포'** 가 되는 현대적인 개발 문화로의 전환입니다. 기술 부채를 줄이고, 개발자 경험을 향상시키는 이 제안을 승인해주시기 바랍니다. 승인 즉시, Cloudflare와 GitHub 연동 작업을 시작하겠습니다."
