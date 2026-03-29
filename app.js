
// 1. Firebase Configuration (replace with your actual config)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// 2. Initialize Firebase (Add the script to your HTML)
// Make sure to include this script in your HTML before app.js
// <script src="https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js"></script>
// <script>
//   firebase.initializeApp(firebaseConfig);
//   const db = firebase.firestore();
// </script>


// --- app.js ---

let riskChart; // To hold the chart instance

async function calculateRisk() {
    const location = document.getElementById('location').value;
    if (!location) {
        alert('Please enter a location.');
        return;
    }

    // Simulate fetching real-time data
    const temp = Math.random() * 35; // Simulated temperature
    const chlorophyll = Math.random() * 100; // Simulated chlorophyll
    const oxygen = Math.random() * 15; // Simulated oxygen

    // Calculate risk
    const risk = (temp * 0.4) + (chlorophyll * 0.4) - (oxygen * 0.2);
    const status = getStatus(risk);

    // Display results
    document.getElementById('riskScore').textContent = risk.toFixed(2);
    document.getElementById('status').textContent = status;

    // Show alert if risk is high
    if (risk > 60) {
        alert('DANGER: High risk of algae bloom!');
    }

    // Store data in Firestore
    try {
        await db.collection('waterQuality').add({
            location: location,
            risk: risk,
            timestamp: new Date()
        });
        console.log("Data stored successfully");
        updateChart();
    } catch (error) {
        console.error("Error storing data: ", error);
        alert("Could not save data to Firebase. Make sure your Firebase config is correct and Firestore is enabled.");
    }
}

function getStatus(risk) {
    if (risk > 60) return 'Danger';
    if (risk > 30) return 'Warning';
    return 'Safe';
}

async function updateChart() {
    const chartData = await getLatestData();
    const labels = chartData.map(d => new Date(d.timestamp).toLocaleTimeString());
    const data = chartData.map(d => d.risk);

    if (riskChart) {
        riskChart.destroy();
    }
    const ctx = document.getElementById('riskChart').getContext('2d');
    riskChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Risk Score History (Last 5)',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        }
    });
}


async function getLatestData() {
    const snapshot = await db.collection('waterQuality').orderBy('timestamp', 'desc').limit(5).get();
    const data = [];
    snapshot.forEach(doc => {
        data.push(doc.data());
    });
    return data.reverse(); // To show oldest to newest
}

// Initial chart load
updateChart();

