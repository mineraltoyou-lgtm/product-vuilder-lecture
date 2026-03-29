let riskChart;

async function calculateRisk() {
    const location = document.getElementById('location').value;
    if (!location) return alert('위치를 선택하세요.');

    const response = await fetch('data.csv');
    const csvText = await response.text();
    const rows = csvText.split('\n').slice(1).map(r => r.split(','));
    
    // 최근 15일 데이터 필터
    const today = new Date();
    const past15 = new Date(today.getTime() - 14*24*60*60*1000);
    const dataFiltered = rows.filter(r => {
        const date = new Date(r[0]);
        return date >= past15 && r[1] === location;
    });

    const labels = dataFiltered.map(r => r[0]);
    const risks = dataFiltered.map(r => {
        const temp = parseFloat(r[2]);
        const chl = parseFloat(r[3]);
        const oxy = parseFloat(r[4]);
        return temp*0.4 + chl*0.4 - oxy*0.2;
    });

    const latestRisk = risks[risks.length-1];
    document.getElementById('riskScore').textContent = latestRisk.toFixed(2);
    document.getElementById('status').textContent = getStatus(latestRisk);

    // 차트 생성
    if (riskChart) riskChart.destroy();
    const ctx = document.getElementById('riskChart').getContext('2d');
    riskChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Risk Score (최근 15일)',
                data: risks,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: risks.map(r => r>60 ? 'rgba(255,0,0,0.3)' : 'rgba(75,192,192,0.2)'),
                pointRadius: risks.map(r => r>60 ? 8 : 4)
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                annotation: {
                    annotations: {
                        dangerLine: {
                            type: 'line',
                            yMin: 60,
                            yMax: 60,
                            borderColor: 'red',
                            borderWidth: 2,
                            label: { content: '위험 기준', enabled: true, position: 'end' }
                        }
                    }
                }
            }
        }
    });
}

function getStatus(risk) {
    if (risk>60) return 'Danger';
    if (risk>30) return 'Warning';
    return 'Safe';
}

// 브라우저 켜진 동안 실시간 갱신
setInterval(calculateRisk, 5000);
