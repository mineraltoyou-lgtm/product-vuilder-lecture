require('dotenv').config();
const axios = require('axios');
const fs = require('fs'); // 파일 시스템 모듈 추가

async function main() {
  const prompt = process.argv.slice(2).join(" ");
  if (!prompt) {
    console.log("❯ 사용법: node step.js \"기획 또는 엔지니어링 질문\"");
    return;
  }

  try {
    const res = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "stepfun/step-3.5-flash",
      messages: [
        { 
          role: "system", 
          content: `너는 JSON 데이터 생성기다. 사용자의 요청에 따라 200개 플랫폼 데이터를 반드시 [ { "id": "p001", ... } ] 형식의 순수한 JSON 배열로만 응답해야 한다. 텍스트 설명은 배제하라.` 
        },
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
    
    // 1. 화면에 지능 출력
    console.log("\n🔱 [Step-3.5-Flash | gstack Conductor]:");
    console.log("--------------------------------------------------");
    console.log(content);
    console.log("--------------------------------------------------\n");

    // 2. JSON 추출 및 파일 저장 (gstack: Data Persistence)
    try {
      const jsonStart = content.indexOf('[');
      const jsonEnd = content.lastIndexOf(']') + 1;
      const cleanJson = content.slice(jsonStart, jsonEnd);
      
      if (cleanJson) {
        fs.writeFileSync('data.json', cleanJson, 'utf8');
        console.log("✅ [Success] data.json 파일이 성공적으로 생성되었습니다.");
      }
    } catch (parseErr) {
      console.log("⚠️ [Warning] 답변에서 JSON 형식을 추출하지 못했습니다. 응답을 확인하세요.");
    }

  } catch (err) {
    console.error("❌ 엔진 가동 실패:", err.response?.data || err.message);
  }
}

main();