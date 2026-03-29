// -----------------
// 1. 가상 데이터 생성
// -----------------
const locations = ["낙동강", "한강", "금강"];
const chartDays = 15; // 최근 15일
const chartData = [];
const chartLabels = [];

function generateFakeData() {
  const today = new Date();
  for (let i = chartDays - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    chartLabels.push(date.toLocaleDateString());

    // 랜덤 위험 점수 (0~100)
    const risk = Math.floor(Math.random() * 100);
    chartData.push(risk);
  }
}
generateFakeData();

// -----------------
// 2. 차트 생성
// -----------------
const ctx = document.getElementById('riskChart').getContext('2d');

const riskChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: chartLabels,
    datasets: [{
      label: 'Risk Score',
      data: chartData,
      borderColor: 'rgba(75, 192, 192, 1)',
      tension: 0.2,
      fill: true,
      backgroundColor: chartData.map(v => {
        if (v > 60) return 'rgba(255,0,0,0.2)';       // DANGER
        if (v > 30) return 'rgba(255,165,0,0.2)';     // WARNING
        return 'rgba(0,255,0,0.1)';                   // SAFE
      })
    }]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: '최근 15일 녹조 위험 점수'
      }
    },
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: 100,
        title: {
          display: true,
          text: 'Risk Score'
        }
      }
    }
  }
});

// -----------------
// 3. 실시간처럼 동적 업데이트 (브라우저 켜져 있는 동안만)
// -----------------
setInterval(() => {
  const newDate = new Date();
  const risk = Math.floor(Math.random() * 100);

  // 차트 라벨/데이터 추가
  chartLabels.push(newDate.toLocaleDateString());
  chartData.push(risk);

  // 최근 15일만 유지
  if (chartLabels.length > chartDays) {
    chartLabels.shift();
    chartData.shift();
  }

  // 배경 색상 업데이트
  riskChart.data.datasets[0].backgroundColor = chartData.map(v => {
    if (v > 60) return 'rgba(255,0,0,0.2)';       // DANGER
    if (v > 30) return 'rgba(255,165,0,0.2)';     // WARNING
    return 'rgba(0,255,0,0.1)';                   // SAFE
  });

  riskChart.update();
}, 5000); // 5초마다 새 데이터 반영
