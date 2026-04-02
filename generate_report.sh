#!/bin/bash
# A script to generate a daily project summary report.

# Create the reports directory if it doesn't exist.
mkdir -p ./reports

# Define the report filename with the current date.
FILENAME="./reports/report-$(date +%Y-%m-%d).md"

# The content of the report.
# In the future, this part could be replaced with commands
# that dynamically gather information, like `git log`.
REPORT_CONTENT="### **프로젝트 작업 요약 보고서 (어제까지의 진행 상황)**

**1. 개요**

본 프로젝트는 어제 하루 동안 보안 강화, 기능 모듈화, 그리고 버전 관리에 이르는 중요한 초기 개발 단계를 성공적으로 완료했습니다. 핵심 목표는 하드코딩된 API 키를 안전하게 분리하고, AI 모델과의 연동 및 결과 처리를 자동화하는 견고한 기반을 마련하는 것이었습니다.

---

**2. 주요 작업 내용**

**가. API 키 분리 및 보안 강화**

*   **문제점 식별**: 기존 \`index.html\` 파일에 API 키가 직접 노출되어 있어 심각한 보안 취약점이 존재했습니다.
*   **해결 조치**:
    *   \`.env\` 파일을 생성하여 API 키를 환경 변수로 이동시켰습니다.
    *   \`.gitignore\` 파일을 생성하고 \`.env\`를 추가하여, 민감한 정보가 Git 저장소에 올라가지 않도록 원천적으로 차단했습니다.
    *   \`index.html\`에서 하드코딩된 API 키를 완전히 제거했습니다.

**나. 핵심 로직 분리 및 모듈화**

기존에 \`index.html\`에 혼재되어 있던 기능들을 역할에 따라 별도의 파일로 분리하여 코드의 가독성과 유지보수성을 크게 향상시켰습니다.

*   **\`step.js\` (AI 연동 및 응답 처리)**
    *   AI 모델(\`Step-3.5-Flash\`)에 실제 요청을 보내고 응답을 받는 핵심적인 역할을 담당합니다.
    *   응답을 받으면 터미널에 \`🔱 [Step-3.5-Flash | gstack Conductor]:\` 라는 헤더와 함께 결과를 출력합니다.
    *   AI가 생성한 텍스트에서 명령어 목록(JSON 배열)을 추출하고, 이를 \`data.json\` 파일로 저장하는 데이터 영속성(Data Persistence) 기능을 구현했습니다.

*   **\`control.js\` (작업 자동화 및 제어)**
    *   \`step.js\`가 생성한 \`data.json\` 파일을 읽어들여, 그 안에 포함된 명령어들을 실제로 순차 실행하는 '지휘자(Conductor)' 역할을 합니다.
    *   각 명령어를 실행할 때마다 터미널에 \`🚀 실행 중: [명령어]\` 형식으로 진행 상황을 명확하게 표시합니다.

**다. 버전 관리 (Git & GitHub)**

*   **변경 사항 스테이징**: \`git add\` 명령어를 통해 신규 생성된 파일(\`.env\`, \`.gitignore\`, \`step.js\`, \`control.js\`)과 수정된 \`index.html\`을 모두 스테이징했습니다.
*   **커밋**: \\\"API 키 분리 및 보안 강화\\\" 라는 명확한 메시지로 모든 변경 사항을 커밋했습니다.
*   **원격 저장소 푸시**: \`git push\` 명령 실행 시 'upstream 브랜치 부재' 오류가 발생했으나, \`git push --set-upstream origin main\` 명령으로 성공적으로 해결하고 모든 코드를 GitHub 원격 저장소에 안전하게 반영했습니다.

---

**3. 결론**

어제의 작업을 통해 우리 프로젝트는 더 이상 보안 위협에 노출되지 않으며, 기능별로 잘 분리된 구조를 갖추게 되었습니다. 또한, 모든 변경 이력이 GitHub에 체계적으로 기록되어 안정적인 협업 및 추적의 기반이 마련되었습니다.

현재는 이 기반 위에서 \`claude-code-router\` 설치를 통해 Step 3.5 Flash 등 다양한 AI 모델을 유연하게 사용할 수 있는 환경을 구축하는 작업을 진행하고 있습니다."

# Write the content to the file.
echo "$REPORT_CONTENT" > "$FILENAME"

echo "✅ Report generated: $FILENAME"

# After creating a report, list all report files and save to a JSON file.
find ./reports -name "report-*.md" -print0 | xargs -0 jq -R . | jq -s . > reports-list.json
echo "✅ Report list updated: reports-list.json"