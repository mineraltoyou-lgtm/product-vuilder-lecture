
require('dotenv').config();
const fs = require('fs');
const { execSync } = require('child_process');
const { step } = require('./step.js');

async function upgradeReport() {
    const oldReportPath = 'reports/report-2026-04-02.md';
    if (!fs.existsSync(oldReportPath)) {
        console.log("업그레이드할 기존 보고서 파일이 없습니다. Part 2로 바로 진행합니다.");
        return;
    }

    // 1. 기존 보고서 내용 읽기
    const oldReportContent = fs.readFileSync(oldReportPath, 'utf8');

    // 2. 보고서 업그레이드를 위한 프롬프트 정의
    const prompt = `
        너는 대한민국 국가 AI 전략 및 글로벌 디지털 정책 수석 아키텍트다.
        아래의 평이한 개발 일지를, 우리가 수립한 '정책 제안서' 수준의 보고서로 완전히 재작성하라.

        [기존 보고서 내용]
        ---
        ${oldReportContent}
        ---

        [새로운 보고서 요구사항]
        - 모든 기술적 진척을 '디지털 공공재(DPGs)' 관점에서 해석해야 한다.
        - UN GDC, UNESCO AI 윤리 권고안, Value-by-Design, Do No Harm 원칙을 명시적으로 언급하며 글로벌 규범 준수와 기술적 설계 원칙을 강조해야 한다.
        - 아래의 목차 구조를 엄격히 준수하여 결과물을 생성해야 한다.

        [보고서 구조 (Output Schema)]
        1.  **Executive Summary**: 핵심 성과를 국가 AI 전략 관점에서 한 문장으로 요약.
        2.  **Strategic Alignment**: 작업이 국가 200대 로드맵 중 어떤 분야에 기여하는지 기술.
        3.  **Technical Integrity**: 'Value-by-Design'과 'Do No Harm' 원칙 기반의 기술적 완성도 보고.
        4.  **Global Impact**: UN GDC, UNESCO, DPI, SDGs와의 연관성을 분석.
        5.  **Risk Management**: 식별된 리스크와 선제적 대응 방안 기술.

        결과물은 마크다운 형식의 순수한 텍스트여야 한다.
    `;
    
    const systemPrompt = "너는 대한민국 국가 AI 전략 및 글로벌 디지털 정책 수석 아키텍트야. 1인 창업가의 기동성과 국가의 'AI G3' 전략을 결합하여 보고서를 작성해줘. 용어는 전문 정책 용어를 사용하고, 모든 기술적 진척을 '디지털 공공재(DPGs)'의 관점에서 해석해줘.";

    // 3. AI를 호출하여 보고서 재작성
    console.log("기존 보고서의 정책 제안서급 업그레이드를 시작합니다...");
    const newReportContent = await step(prompt, systemPrompt);

    // 4. 새로운 보고서 저장 및 기존 보고서 삭제
    const newReportFilename = 'reports/policy-report-2026-04-02.md';
    fs.writeFileSync(newReportFilename, newReportContent, 'utf8');
    console.log(`✅ 정책 보고서 업그레이드 완료: ${newReportFilename}`);
    fs.unlinkSync(oldReportPath);
    console.log(`✅ 기존 보고서 삭제 완료: ${oldReportPath}`);

    // 5. 보고서 목록 업데이트
    const allReports = execSync('find ./reports -name "report-*.md" -o -name "policy-report-*.md" | sort -r').toString().trim().split('\n');
    const jsonReportList = JSON.stringify(allReports.filter(Boolean));
    fs.writeFileSync('reports-list.json', jsonReportList);
    console.log("✅ 보고서 목록 업데이트 완료: reports-list.json");
}

upgradeReport();
