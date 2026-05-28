// Benefits App frontend JavaScript
// Backend connection configured automatically

const BACKEND_URL = "https://benefits-backend-5c2z.onrender.com";

async function testBackendHealth() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    const data = await response.json();
    console.log("Backend health:", data);
    alert("Backend connected successfully!");
  } catch (error) {
    console.error(error);
    alert("Backend connection failed.");
  }
}

async function estimateCost() {
  const output = document.getElementById("estimateOutput");
  if(output) {
    output.innerHTML = "<p>Connecting to backend...</p>";
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/estimator/estimate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        allowedAmount: 1150,
        deductible: 2000,
        deductibleMet: 650,
        coinsurancePercent: 20,
        copay: 40,
        outOfPocketMax: 7000
      })
    });

    const data = await response.json();

    if(output) {
      output.innerHTML = `
        <h3>Estimated Patient Cost</h3>
        <div class="cost-big">$${Math.round(data.estimatedPatientCost)}</div>
        <p>Remaining deductible: $${data.remainingDeductible}</p>
      `;
    }
  } catch (error) {
    console.error(error);
    if(output) {
      output.innerHTML = "<p>Backend connection failed.</p>";
    }
  }
}

async function checkPriorAuth() {
  const authOutput = document.getElementById("authOutput");

  if(authOutput) {
    authOutput.innerHTML = "<p>Checking prior authorization...</p>";
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/priorauth/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        service: "MRI Knee",
        cpt: "73721",
        payer: "Blue Cross",
        urgency: "planned"
      })
    });

    const data = await response.json();

    if(authOutput) {
      authOutput.innerHTML = `
        <h3>${data.status}</h3>
        <p>${data.reason}</p>
      `;
    }
  } catch (error) {
    console.error(error);
    if(authOutput) {
      authOutput.innerHTML = "<p>Prior authorization backend failed.</p>";
    }
  }
}

async function checkInsuranceConnection() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/bluebutton/status`);
    const data = await response.json();
    console.log(data);
  } catch(error) {
    console.error(error);
  }
}

console.log("Benefits App connected to backend:", BACKEND_URL);
