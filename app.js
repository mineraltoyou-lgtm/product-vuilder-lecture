// -----------------
// 1. 설정
// -----------------
const locations = ["낙동강", "한강", "금강"];
const chartDays = 15; // 최근 15일
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
// 2. 가상 데이터 생성 (최근 15일)
// -----------------
function generateInitialData() {
  const today = new Date();
  for (let i = chartDays - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    chartLabels.push(date.toLocaleDateString());

    datasets.forEach(ds => {
      const risk = Math.floor(Math.random() * 100);
      ds.data.push(risk);
      ds.backgroundColor.push(getRiskColor(risk));
    });
  }
}

// 위험 점수별 색상
function getRiskColor(risk) {
  if (risk > 60) return 'rgba(255,0,0,0.2)';      // DANGER
  if (risk > 30) return 'rgba(255,165,0,0.2)';    // WARNING
  return 'rgba(0,255,0,0.1)';                     // SAFE
}

generateInitialData();

// -----------------
// 3. 차트 생성
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
      }
    }
  }
});

// -----------------
// 4. 실시간 업데이트 (브라우저 켜져 있는 동안)
// -----------------
setInterval(() => {
  const newDate = new Date();
  chartLabels.push(newDate.toLocaleDateString());

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
}, 5000); // 5초마다 새 데이터
