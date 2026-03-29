// -----------------
// 1. 설정
// -----------------
const locations = ["낙동강", "한강", "금강"];
const chartDays = 15; // 최근 15일 유지
const chartLabels = [];
const datasets = locations.map((loc, i) => ({
  label: loc,
  data: [],
  borderColor: ['rgba(75,192,192,1)','rgba(255,165,0,1)','rgba(255,0,0,1)'][i],
  tension: 0.2,
  fill: true,
  backgroundColor: []
}));

// -----------------
// 2. 날짜 포맷 함수
// -----------------
function formatDate(date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const h = date.getHours();
  const min = date.getMinutes();
  return `${y}-${m.toString().padStart(2,'0')}-${d.toString().padStart(2,'0')} ${h.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}`;
}

// -----------------
// 3. 가상 데이터 생성 (최근 15일)
// -----------------
function generateInitialData() {
  const today = new Date();
  for (let i = chartDays - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const label = formatDate(date);
    chartLabels.push(label);

    datasets.forEach(ds => {
      const risk = Math.floor(Math.random() * 100);
      ds.data.push(risk);
      ds.backgroundColor.push(getRiskColor(risk));
    });
  }
}

function getRiskColor(risk) {
  if (risk > 60) return 'rgba(255,0,0,0.2)';      // DANGER
  if (risk > 30) return 'rgba(255,165,0,0.2)';    // WARNING
  return 'rgba(0,255,0,0.1)';                     // SAFE
}

generateInitialData();

// -----------------
// 4. 차트 생성
// -----------------
const ctx = document.getElementById('riskChart').getContext('2d');
const riskChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: chartLabels,
    datasets: datasets
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: '최근 15일 녹조 위험 점수'
      },
      legend: { position: 'bottom' }
    },
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: 100,
        title: { display: true, text: 'Risk Score' }
      },
      x: {
        ticks: {
          maxTicksLimit: 10,
          autoSkip: true
        }
      }
    }
  }
});

// -----------------
// 5. 실시간 업데이트 (브라우저 켜져 있는 동안)
// -----------------
setInterval(() => {
  const newDate = new Date();
  const newLabel = formatDate(newDate);

  // 중복 체크
  if (chartLabels[chartLabels.length - 1] !== newLabel) {
    chartLabels.push(newLabel);

    datasets.forEach(ds => {
      const risk = Math.floor(Math.random() * 100);
      ds.data.push(risk);
      ds.backgroundColor.push(getRiskColor(risk));

      if (ds.data.length > chartDays) {
        ds.data.shift();
        ds.backgroundColor.shift();
      }
    });

    if (chartLabels.length > chartDays) chartLabels.shift();
    riskChart.update();
  }
}, 5000); // 5초마다 새 데이터
