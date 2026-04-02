require('dotenv').config();
const { execSync } = require('child_process');
const axios = require('axios');

async function handleIntent() {
  const intent = process.argv.slice(2).join(" ");
  if (!intent) return console.log("❯ 의도를 입력하세요 (예: node control.js '전체 배포해')");

  console.log(`🤖 의도 분석 중: "${intent}"`);

  // Step-3.5-Flash에게 의도를 명령어로 번역 요청
  const res = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
    model: "stepfun/step-3.5-flash",
    messages: [{
      role: "system",
      content: "너는 터미널 명령어 번역기다. 사용자의 의도를 분석해 [build, deploy, commit] 중 필요한 실행 명령 세트를 반환하라. 오직 실행할 명령어만 줄바꿈으로 구분해 출력하라."
    }, { role: "user", content: intent }]
  }, { headers: { "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}` } });

  const commands = res.data.choices[0].message.content.split('\n');

  // 명령어 순차 실행 (창업자는 구경만 하세요)
  commands.forEach(cmd => {
    if (cmd.trim()) {
      console.log(`🚀 실행 중: ${cmd}`);
      try {
        const output = execSync(cmd, { encoding: 'utf-8' });
        console.log(output);
      } catch (e) {
        console.error(`❌ 실패: ${cmd}`);
      }
    }
  });
}

handleIntent();