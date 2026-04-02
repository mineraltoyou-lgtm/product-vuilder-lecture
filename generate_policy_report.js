
const { execSync } = require('child_process');
const fs = require('fs');
const { step } = require('./step.js'); // step.js의 함수를 재활용

async function generateReport() {
    // 1. 어제의 Git 커밋 로그를 가져옵니다.
    const since = new Date();
    since.setDate(since.getDate() - 1);
    const gitLog = execSync(`git log --since="${since.toISOString()}" --pretty=format:"- %s" --name-status`).toString().trim();

    if (!gitLog) {
        console.log("새로운 커밋이 없어 보고서를 생성하지 않습니다.");
        return;
    }

    // 2. 보고서 생성을 위한 고도화된 프롬프트 정의
    const prompt = `
        너는 대한민국 국가 AI 전략 및 글로벌 디지털 정책 수석 아키텍트야. 1인 창업가의 기동성과 국가의 'AI G3' 전략을 결합하여 보고서를 작성해줘. 용어는 전문 정책 용어를 사용하고, 모든 기술적 진척을 '디지털 공공재(DPGs)'의 관점에서 해석해줘.

        아래는 어제 하루 동안의 Git 커밋 로그와 변경된 파일 목록이야.
        ---
        [어제 작업 내역]
        ${gitLog}
        ---

        이 작업 내역을 바탕으로, 다음 목차 구조와 3대 관점에 따라 '정책 제안서' 수준의 일일 보고서를 생성해줘.

        [보고서 구조 (Output Schema)]
        1.  **Executive Summary**: 당일 작업의 핵심 성과를 한 문장으로 요약 (국가 AI 전략과의 정합성 강조).
        2.  **Strategic Alignment**: 해당 작업이 200대 로드맵 중 어떤 카테고리에 기여하는지 기술.
        3.  **Technical Integrity**: 'Value-by-Design'과 'Do No Harm' 원칙에 기반하여 기술적 완성도(보안, 모듈화, 확장성 등)를 보고.
        4.  **Global Impact**: 이 작업이 UN GDC(글로벌 디지털 컴팩트), UNESCO AI 윤리 권고안 등 글로벌 표준화나 국제기구 협력에 미칠 영향력을 분석하고, 어떻게 디지털 공공 인프라(DPI) 및 지속가능발전목표(SDGs)에 기여하는지 명시.
        5.  **Risk Management**: 현재 식별된 리스크(예: AI Hallucination, 데이터 저작권)와 이에 대한 선제적 대응 방안을 기술.

        각 항목은 매우 구체적이고 전문적인 정책 용어를 사용하여 작성해야 하며, 단순한 기능 나열이 아닌 심도 있는 분석을 담아야 해.
    `;

    // 3. step.js의 AI 호출 기능을 사용하여 보고서 생성
    console.log("정책 제안서급 보고서 생성을 시작합니다...");
    const reportContent = await step(prompt); // step.js의 AI 호출 함수 사용

    // AI가 생성한 결과에서 실제 보고서 내용만 추출 (명령어 부분이 있다면 제거)
    const cleanReport = reportContent.substring(reportContent.indexOf("###"));


    // 4. 생성된 보고서를 파일로 저장
    const reportDate = new Date().toISOString().split('T')[0];
    const reportFilename = `./reports/policy-report-${reportDate}.md`;
    fs.writeFileSync(reportFilename, cleanReport);
    console.log(`✅ 고품질 보고서 생성 완료: ${reportFilename}`);

    // 5. 보고서 목록(reports-list.json) 업데이트
    const allReports = execSync('find ./reports -name "report-*.md" -o -name "policy-report-*.md"').toString().trim().split('\n');
    const jsonReportList = JSON.stringify(allReports.filter(Boolean));
    fs.writeFileSync('reports-list.json', jsonReportList);
    console.log("✅ 보고서 목록 업데이트 완료: reports-list.json");
}

generateReport();
