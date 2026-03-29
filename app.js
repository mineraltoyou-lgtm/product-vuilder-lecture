let riskChart;

async function getLatestData() {
    const res = await fetch('data.csv');
    const text = await res.text();
    const lines = text.trim().split('\n').slice(1); // 헤더 제외
    const data = lines.map(line => {
        const [date, location, water_temp, chlorophyll, oxygen, pH] = line.split(',');
        return {
            timestamp: new Date(date),
            location,
            water_temp: Number(water_temp),
            chlorophyll: Number(chlorophyll),
            oxygen: Number(oxygen),
            pH: Number(pH),
            risk: Number(water_temp)*0.4 + Number(chlorophyll)*0.4 - Number(oxygen)*0.2
        };
    });
    return data;
}

async function calculateRisk() {
    const location = document.getElementById('location').value;
    if (!location) { alert('위치를 선택해주세요.'); return; }

    const chartData = await getLatestData();
    const latest = chartData.filter(d => d.location === location).slice(-1)[0];
    if (!latest) { alert('해당 위치 데이터가 없습니다.'); return; }

    const risk = latest.risk;
    const status = getStatus(risk);

    document.getElementById('riskScore').textContent = risk.toFixed(2);
    document.getElementById('status').textContent = status;

    if (risk > 60) alert('⚠️ DANGER: High risk of algae bloom!');

    updateChart(chartData.filter(d => d.location === location));
}

function getStatus(risk) {
    if (risk > 60) return 'Danger';
    if (risk > 30) return 'Warning';
    return 'Safe';
}

function updateChart(chartData) {
    const labels = chartData.map(d => d.timestamp.toLocaleDateString());
    const data = chartData.map(d => d.risk);

    if (riskChart) riskChart.destroy();

    const ctx = document.getElementById('riskChart').getContext('2d');
    riskChart = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [{ label: 'Risk Score History', data, borderColor: 'rgba(75,192,192,1)', tension: 0.1 }] },
        options: { scales: { y: { beginAtZero: true } } }
    });
}

// 초기 차트 로드
getLatestData().then(data => updateChart(data));
