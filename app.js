let riskChart;
const RISK_THRESHOLD = 60;
const DISPLAY_DAYS = 15;
const HIGHLIGHT_COLOR = 'rgba(255, 0, 0, 0.3)'; // 위험 배경
const NORMAL_COLOR = 'rgba(75, 192, 192, 1)';    // 안전 선

async function getLatestData() {
    const res = await fetch('data.csv');
    const text = await res.text();
    const lines = text.trim().split('\n').slice(1); 
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
    const last15 = filtered.slice(-DISPLAY_DAYS);

    const latest = last15.slice(-1)[0];
    if (!latest) { alert('해당 위치 데이터가 없습니다.'); return; }

    const risk = latest.risk;
    const status = getStatus(risk);

    document.getElementById('riskScore').textContent = risk.toFixed(2);
    document.getElementById('status').textContent = status;

    updateChart(last15);
}

function getStatus(risk) {
    if (risk > 60) return 'Danger';
    if (risk > 30) return 'Warning';
    return 'Safe';
}

function updateChart(chartData) {
    const labels = chartData.map(d => d.timestamp.toLocaleDateString());
    const data = chartData.map(d => d.risk);

    const thresholdLine = Array(chartData.length).fill(RISK_THRESHOLD);

    // 배경 색상 설정 (위험 구간)
    const bgColors = chartData.map(d => d.risk >= RISK_THRESHOLD ? HIGHLIGHT_COLOR : 'rgba(0,0,0,0)');

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
                    borderColor: NORMAL_COLOR,
                    backgroundColor: bgColors,
                    tension: 0.1,
                    fill: true,
                    pointRadius: chartData.map(d => d.risk >= RISK_THRESHOLD ? 6 : 3), // 위험 점 강조
                    pointBackgroundColor: chartData.map(d => d.risk >= RISK_THRESHOLD ? 'red' : NORMAL_COLOR)
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
            scales: { y: { beginAtZero: true } },
            plugins: {
                legend: { display: true }
            }
        }
    });
}

// 브라우저 켜 있는 동안 5초마다 갱신
async function autoRefresh() {
    await calculateRisk();
    setTimeout(autoRefresh, 5000);
}

// 초기 실행
autoRefresh();
