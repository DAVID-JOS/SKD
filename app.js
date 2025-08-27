// ----------- Multi-User Mine App Frontend Logic -----------

// Check if username exists in localStorage
let username = localStorage.getItem("username");
if (!username) {
    // Prompt new users to enter a unique username
    username = prompt("Enter your username:");
    localStorage.setItem("username", username);
}

let totalDC = 0;
let sessionDC = 0;
const miningRate = 10; // DavCoins per click
const davCoinValueUSD = 10000; // $10,000 per DavCoin
const usdToNGN = 460; // USD to NGN conversion rate

// Replace with your Render backend URL
const backendURL = "https://personal-api-dkta.onrender.com";

// Update dashboard with dynamic data
function updateDashboard() {
    document.getElementById('total-dc')?.innerText = totalDC;
    document.getElementById('mining-rate')?.innerText = miningRate;
    document.getElementById('session-dc')?.innerText = sessionDC;
    document.getElementById('balance-dc')?.innerText = totalDC;
    document.getElementById('balance-usd')?.innerText = (totalDC * davCoinValueUSD).toLocaleString();
    document.getElementById('balance-ngn')?.innerText = (totalDC * davCoinValueUSD * usdToNGN).toLocaleString();
}

// Fetch user's saved totalDC from backend on page load
async function loadUserData() {
    try {
        const res = await fetch(`${backendURL}/user-data?username=${username}`);
        const data = await res.json();
        if (data.totalDC) totalDC = data.totalDC;
        updateDashboard();
    } catch (err) {
        console.error("Error fetching user data:", err);
    }
}

// Mining
document.getElementById('mine-btn')?.addEventListener('click', async () => {
    totalDC += miningRate;
    sessionDC += miningRate;
    updateDashboard();

    try {
        await fetch(`${backendURL}/mine`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, amount: miningRate })
        });
    } catch (err) {
        console.error("Mining request failed:", err);
    }
});

// Convert (handled by backend)
document.getElementById('convert-btn')?.addEventListener('click', () => {
    alert('Conversion handled via Moniepoint backend');
});

// Withdraw to Moniepoint
document.getElementById('withdraw-btn')?.addEventListener('click', async () => {
    const recipient = document.getElementById('recipient-account').value;
    const amountUSD = totalDC * davCoinValueUSD;
    const amountNGN = amountUSD * usdToNGN;

    try {
        const res = await fetch(`${backendURL}/withdraw`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                amountNGN,
                recipientAccount: recipient
            })
        });
        const data = await res.json();
        alert(JSON.stringify(data));

        // If withdrawal successful, reset totalDC for user
        if (data.message === "Withdrawal successful") {
            totalDC = 0;
            sessionDC = 0;
            updateDashboard();
        }
    } catch (err) {
        console.error("Withdrawal failed:", err);
    }
});

// Auto-update dashboard every second
setInterval(updateDashboard, 1000);

// Load user data when page opens
loadUserData();
