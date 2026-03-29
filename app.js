let riskChart;
const RISK_THRESHOLD = 60; // 녹조 위험 기준

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
    const filtered = chartData.filter(d => d.location === location);
    
    // 최근 30일만
    const last30 = filtered.slice(-30);

    const latest = last30.slice(-1)[0];
    if (!latest) { alert('해당 위치 데이터가 없습니다.'); return; }

    const risk = latest.risk;
    const status = getStatus(risk);

    document.getElementById('riskScore').textContent = risk.toFixed(2);
    document.getElementById('status').textContent = status;

    updateChart(last30);
}

function getStatus(risk) {
    if (risk > 60) return 'Danger';
    if (risk > 30) return 'Warning';
    return 'Safe';
}

function updateChart(chartData) {
    const labels = chartData.map(d => d.timestamp.toLocaleDateString());
    const data = chartData.map(d => d.risk);

    // 빨간선: 위험 기준
    const thresholdLine = Array(chartData.length).fill(RISK_THRESHOLD);

    if (riskChart) riskChart.destroy();

    const ctx = document.getElementById('riskChart').getContext('2d');
    riskChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Risk Score',
                    data,
                    borderColor: 'rgba(75,192,192,1)',
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'Risk Threshold',
                    data: thresholdLine,
                    borderColor: 'red',
                    borderDash: [5,5],
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            scales: { y: { beginAtZero: true } }
        }
    });
}

// 브라우저 열려 있는 동안만 주기적으로 최신 차트 갱신 (예: 5초)
async function autoRefresh() {
    await calculateRisk();
    setTimeout(autoRefresh, 5000); // 5초마다 갱신
}

// 초기 실행
autoRefresh();
