
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

/**
 * AI 모델에 프롬프트를 보내고 그 결과를 받아오는 핵심 함수.
 * 응답에서 JSON 객체/배열 또는 순수 텍스트를 지능적으로 추출하여 반환합니다.
 * @param {string} prompt - AI 모델에 전달할 프롬프트
 * @param {string} systemPrompt - (선택적) 시스템 메시지. 페르소나를 주입할 때 사용됩니다.
 * @returns {Promise<string>} AI가 생성한 콘텐츠 (JSON 문자열 또는 일반 텍스트)
 */
async function step(prompt, systemPrompt = 'You are a helpful assistant.') {
  try {
    console.log(`
🚀 [AI Invocator] AI 모델(${process.env.AI_MODEL || 'default'}) 호출 중...`);

    const res = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: process.env.AI_MODEL || "stepfun/step-3.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.3
    }, {
      headers: { 
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const content = res.data.choices[0].message.content;

    console.log("✅ [AI Invocator] AI로부터 응답을 수신했습니다.");

    // 응답에서 JSON 코드 블록(객체 또는 배열)을 먼저 찾습니다.
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      console.log("ℹ️ [Content Extractor] JSON 코드 블록을 추출했습니다.");
      return jsonMatch[1].trim();
    }

    // JSON 코드 블록이 없으면, 일반적인 JSON 배열/객체를 찾습니다.
    const genericJsonMatch = content.match(/(\[[\s\S]*\]|\{[\s\S]*\})/s);
    if (genericJsonMatch && genericJsonMatch[0]) {
        try {
            // 추출된 문자열이 유효한 JSON인지 파싱 시도
            JSON.parse(genericJsonMatch[0]);
            console.log("ℹ️ [Content Extractor] 일반 JSON 데이터를 추출했습니다.");
            return genericJsonMatch[0].trim();
        } catch (e) {
            // 파싱 실패 시, 일반 텍스트로 간주
        }
    }
    
    // 어떤 JSON 형식도 찾지 못하면 순수 텍스트로 간주하고 전체를 반환합니다.
    console.log("ℹ️ [Content Extractor] 순수 텍스트 콘텐츠를 반환합니다.");
    return content;

  } catch (err) {
    console.error("❌ [AI Invocator] AI 모델 호출 중 오류 발생:", err.response?.data || err.message);
    throw err; // 오류를 상위로 전파
  }
}

/**
 * 커맨드라인에서 직접 `node step.js`를 실행할 때 동작하는 메인 로직.
 * 기존의 명령어 생성 및 data.json 저장 기능을 담당합니다.
 */
async function main() {
  const prompt = process.argv.slice(2).join(" ");
  if (!prompt) {
    console.log("❯ 사용법: node step.js \"기획 또는 엔지니어링 질문\"");
    return;
  }

  try {
    const systemPrompt = `너는 JSON 데이터 생성기다. 사용자의 요청에 따라 200개 플랫폼 데이터를 반드시 [ { "id": "p001", ... } ] 형식의 순수한 JSON 배열로만 응답해야 한다. 텍스트 설명은 배제하라.`;
    const result = await step(prompt, systemPrompt);

    // 화면에 결과 출력
    console.log("\n🔱 [Step-3.5-Flash | gstack Conductor]:");
    console.log("--------------------------------------------------");
    console.log(result);
    console.log("--------------------------------------------------\n");

    // 결과가 JSON 형식이면 파일에 저장
    try {
        JSON.parse(result);
        fs.writeFileSync('data.json', result, 'utf8');
        console.log("✅ [Success] data.json 파일이 성공적으로 생성되었습니다.");
    } catch (e) {
        console.log("⚠️ [Warning] 결과가 유효한 JSON이 아니므로 파일에 저장하지 않습니다.");
    }

  } catch (err) {
    // 에러는 step 함수 내부에서 이미 로깅되었으므로 추가 처리는 하지 않음.
  }
}

// 이 파일이 직접 실행되었을 때만 main()을 호출합니다.
// require('./step.js')로 포함될 때는 실행되지 않습니다.
if (require.main === module) {
  main();
}

// 다른 스크립트에서 step 함수를 가져다 쓸 수 있도록 export 합니다.
module.exports = { step };

