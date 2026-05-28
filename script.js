// Benefits App frontend JavaScript
// IMPORTANT:
// Replace this with your actual Render backend URL.
// Example: const BACKEND_URL = "https://benefits-backend.onrender.com";
const BACKEND_URL = "https://YOUR-RENDER-URL.onrender.com";

const pages = document.querySelectorAll(".page");
const navBtns = document.querySelectorAll(".nav-btn");

function showPage(id) {
  pages.forEach((p) => p.classList.remove("active"));
  const page = document.getElementById(id);
  if (page) page.classList.add("active");

  navBtns.forEach((b) => {
    b.classList.toggle("active", b.dataset.page === id);
  });

  window.scrollTo(0, 0);
}

navBtns.forEach((btn) => {
  btn.addEventListener("click", () => showPage(btn.dataset.page));
});

// -------------------------
// BenefitSmart lessons
// -------------------------

const modules = [
  ["💳 Premium", "Monthly cost for having insurance."],
  ["⛰ Deductible", "What you pay before insurance shares more cost."],
  ["☕ Copay", "Fixed cost for certain services."],
  ["🥧 Coinsurance", "A percentage split after deductible."],
  ["🏦 HSA/FSA", "Tax-advantaged money for healthcare."],
  ["🗺 Network", "In-network usually costs less."],
  ["🚦 Prior Auth", "Approval before selected care."],
  ["☂️ OOP Max", "Most you should pay for covered care in a year."]
];

const moduleGrid = document.getElementById("moduleGrid");

if (moduleGrid) {
  modules.forEach(([title, body], i) => {
    const div = document.createElement("div");
    div.className = "module";
    div.innerHTML = `
      <strong>${title}</strong>
      <p>${body}</p>
      <div class="progress"><span style="width:${40 + i * 6}%"></span></div>
    `;
    moduleGrid.appendChild(div);
  });
}

const styleButtons = document.querySelectorAll(".style-btn");
const styleOutput = document.getElementById("styleOutput");

const styleText = {
  visual: [
    "Visual Mode",
    "Insurance terms become diagrams, progress bars, color maps, and storyboards."
  ],
  audio: [
    "Audio Mode",
    "Lessons become short podcast-style explanations and spoken scenarios."
  ],
  reading: [
    "Reading Mode",
    "Lessons become definitions, flashcards, notes, summaries, and examples."
  ],
  hands: [
    "Hands-on Mode",
    "You learn by comparing plans, dragging choices, and running simulations."
  ],
  game: [
    "Gamified Mode",
    "Earn XP, badges, streaks, and mastery levels as you complete challenges."
  ]
};

styleButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    styleButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    if (!styleOutput) return;

    const [h, p] = styleText[btn.dataset.style];
    styleOutput.querySelector("h3").textContent = h;
    styleOutput.querySelector("p").textContent = p;
  });
});

// -------------------------
// Benefits Translator estimator
// This now calls your Render backend.
// -------------------------

async function estimateCost() {
  const procedure = document.getElementById("procedure")?.value || "mri";
  const deductible = Number(document.getElementById("deductible")?.value || 2000);
  const deductibleMet = Number(document.getElementById("met")?.value || 0);
  const coinsurancePercent = Number(document.getElementById("coinsurance")?.value || 20);
  const copay = Number(document.getElementById("copay")?.value || 0);
  const outOfPocketMax = Number(document.getElementById("oop")?.value || 7000);

  const procedurePrices = {
    mri: {
      name: "MRI Knee",
      cpt: "73721",
      allowedAmount: 1150,
      low: 450,
      high: 3200,
      auth: "Usually required",
      alt: "Freestanding imaging center"
    },
    urgent: {
      name: "Urgent Care Visit",
      cpt: "99203",
      allowedAmount: 180,
      low: 95,
      high: 350,
      auth: "Usually not required",
      alt: "Telehealth or primary care"
    },
    er: {
      name: "Emergency Room Visit",
      cpt: "99284",
      allowedAmount: 2200,
      low: 900,
      high: 6000,
      auth: "Not before emergency care",
      alt: "Urgent care if not life-threatening"
    },
    colonoscopy: {
      name: "Colonoscopy",
      cpt: "45378",
      allowedAmount: 2100,
      low: 900,
      high: 4800,
      auth: "Sometimes required",
      alt: "Ambulatory surgery center"
    },
    heartCath: {
      name: "Diagnostic Heart Cath",
      cpt: "93458",
      allowedAmount: 14500,
      low: 6500,
      high: 32000,
      auth: "Often required unless emergency",
      alt: "Ask about facility, physician, and anesthesia fees"
    }
  };

  const p = procedurePrices[procedure];

  const output = document.getElementById("estimateOutput");
  if (!output) return;

  output.innerHTML = "<p>Contacting backend estimator...</p>";

  try {
    const response = await fetch(`${BACKEND_URL}/api/estimator/estimate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        allowedAmount: p.allowedAmount,
        deductible,
        deductibleMet,
        coinsurancePercent,
        copay,
        outOfPocketMax
      })
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const estimate = await response.json();

    output.innerHTML = `
      <h3>${p.name} <span class="tag">CPT ${p.cpt}</span></h3>
      <p class="small">Estimated total medical price range: $${p.low.toLocaleString()}–$${p.high.toLocaleString()}</p>
      <div class="cost-big">$${Math.round(estimate.estimatedPatientCost).toLocaleString()}</div>
      <p>
        <strong>Plain English:</strong>
        You have about $${estimate.remainingDeductible.toLocaleString()} left before your deductible is met.
        Your estimated deductible portion is $${Math.round(estimate.deductiblePortion).toLocaleString()}.
        Your estimated coinsurance is $${Math.round(estimate.coinsurance).toLocaleString()}.
      </p>
      <div class="options">
        <div class="option"><strong>✅ Prior authorization</strong><br>${p.auth}</div>
        <div class="option"><strong>💡 Cheaper alternative</strong><br>${p.alt}</div>
        <div class="option"><strong>🗺 Network tip</strong><br>Confirm facility and doctor are both in-network.</div>
      </div>
    `;
  } catch (error) {
    output.innerHTML = `
      <h3>Backend connection problem</h3>
      <p>Your front-end loaded, but it could not reach the backend.</p>
      <p><strong>Check:</strong></p>
      <ul>
        <li>Did you replace <code>YOUR-RENDER-URL</code> in <code>script.js</code>?</li>
        <li>Is your Render backend live?</li>
        <li>Does <code>${BACKEND_URL}/api/health</code> work?</li>
      </ul>
      <p class="small">${error.message}</p>
    `;
  }
}

// -------------------------
// Public price lookup demo
// This remains front-end demo data.
// -------------------------

const demoPrices = [
  {
    procedure: "MRI Knee",
    cpt: "73721",
    facility: "Treasure Valley Imaging Center",
    type: "Freestanding imaging",
    payer: "Blue Cross",
    price: 690,
    cash: 520,
    location: "Boise, ID"
  },
  {
    procedure: "MRI Knee",
    cpt: "73721",
    facility: "Metro Hospital",
    type: "Hospital outpatient",
    payer: "Blue Cross",
    price: 2450,
    cash: 2100,
    location: "Boise, ID"
  },
  {
    procedure: "MRI Knee",
    cpt: "73721",
    facility: "Community Radiology",
    type: "Freestanding imaging",
    payer: "Aetna",
    price: 760,
    cash: 540,
    location: "Meridian, ID"
  },
  {
    procedure: "Colonoscopy",
    cpt: "45378",
    facility: "Ambulatory Surgery Center",
    type: "ASC",
    payer: "United",
    price: 1320,
    cash: 980,
    location: "Boise, ID"
  },
  {
    procedure: "Colonoscopy",
    cpt: "45378",
    facility: "Metro Hospital",
    type: "Hospital outpatient",
    payer: "Aetna",
    price: 3100,
    cash: 2500,
    location: "Boise, ID"
  },
  {
    procedure: "Diagnostic Heart Cath",
    cpt: "93458",
    facility: "Regional Heart Hospital",
    type: "Hospital outpatient",
    payer: "Blue Cross",
    price: 14200,
    cash: 11900,
    location: "Boise, ID"
  },
  {
    procedure: "Urgent Care Visit",
    cpt: "99203",
    facility: "QuickCare Clinic",
    type: "Urgent care",
    payer: "Cash",
    price: 155,
    cash: 135,
    location: "Boise, ID"
  }
];

function searchPrices() {
  const q = (document.getElementById("priceSearch")?.value || "").toLowerCase();
  const payer = document.getElementById("payerSearch")?.value || "all";
  const priceResults = document.getElementById("priceResults");

  if (!priceResults) return;

  let results = demoPrices.filter((r) => {
    const matchesQuery =
      !q ||
      r.procedure.toLowerCase().includes(q) ||
      r.cpt.includes(q);

    const matchesPayer =
      payer === "all" || r.payer === payer || payer === "Cash";

    return matchesQuery && matchesPayer;
  });

  if (!results.length) {
    priceResults.innerHTML = "<p>No demo records found. Try MRI, 73721, colonoscopy, or cath.</p>";
    return;
  }

  results.sort((a, b) => a.price - b.price);

  priceResults.innerHTML =
    `<h3>Price results</h3>
     <p class="small">Demo data. Replace with real hospital/insurer machine-readable files in production.</p>` +
    results
      .map(
        (r) => `
        <div class="price-row">
          <div>
            <strong>${r.procedure}</strong><br>
            <span class="small">${r.facility} • ${r.type}</span>
          </div>
          <div>
            <span class="tag">CPT ${r.cpt}</span>
            <span class="tag">${r.payer}</span>
          </div>
          <div>
            <strong>$${r.price.toLocaleString()}</strong><br>
            <span class="small">negotiated</span>
          </div>
          <div>
            <strong>$${r.cash.toLocaleString()}</strong><br>
            <span class="small">cash</span>
          </div>
        </div>
      `
      )
      .join("");
}

// -------------------------
// Insurance connection status
// Calls backend Blue Button placeholder/status endpoint.
// -------------------------

async function simulateConnect() {
  const connectStatus = document.getElementById("connectStatus");
  if (!connectStatus) return;

  connectStatus.innerHTML = "<p>Checking backend insurance connection status...</p>";

  try {
    const response = await fetch(`${BACKEND_URL}/api/bluebutton/status`);
    const data = await response.json();

    connectStatus.innerHTML = `
      <h3>Insurance connection status</h3>
      <p><strong>Connected:</strong> ${data.connected ? "Yes" : "No"}</p>
      <p>${data.message || "Backend responded successfully."}</p>
      <div class="options">
        <div class="option"><strong>Manual Mode</strong><br>Available now</div>
        <div class="option"><strong>Blue Button/FHIR</strong><br>Needs credentials</div>
        <div class="option"><strong>Private Payers</strong><br>Requires payer partnerships</div>
      </div>
    `;
  } catch (error) {
    connectStatus.innerHTML = `
      <h3>Could not reach backend</h3>
      <p>Check your Render URL in <code>script.js</code>.</p>
      <p class="small">${error.message}</p>
    `;
  }
}

// -------------------------
// Prior authorization checker
// This now calls your Render backend.
// -------------------------

async function checkPriorAuth() {
  const service = document.getElementById("authService")?.value || "MRI Knee";
  const payer = document.getElementById("authPayer")?.value || "Blue Cross";
  const urgency = document.getElementById("authUrgency")?.value || "planned";

  const cptMap = {
    "MRI Knee": "73721",
    "CT Chest": "71250",
    "Urgent Care": "99203",
    "Heart Cath": "93458",
    "Physical Therapy": "97110"
  };

  const authOutput = document.getElementById("authOutput");
  if (!authOutput) return;

  authOutput.innerHTML = "<p>Checking prior authorization with backend...</p>";

  try {
    const response = await fetch(`${BACKEND_URL}/api/priorauth/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        service,
        cpt: cptMap[service] || "",
        payer,
        urgency
      })
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const result = await response.json();

    authOutput.innerHTML = `
      <h3>${service}</h3>
      <div class="cost-big" style="font-size:28px">${result.status}</div>
      <p><strong>Reason:</strong> ${result.reason}</p>
      <p><strong>Risk level:</strong> ${result.riskLevel}</p>
      <div class="options">
        ${(result.checklist || [])
          .slice(0, 3)
          .map((item, index) => `<div class="option"><strong>${index + 1}.</strong><br>${item}</div>`)
          .join("")}
      </div>
      <p><strong>If denied:</strong> ask for the denial reason, medical necessity criteria, appeal deadline, and peer-to-peer option.</p>
    `;
  } catch (error) {
    authOutput.innerHTML = `
      <h3>Backend connection problem</h3>
      <p>The prior authorization checker could not reach your backend.</p>
      <p><strong>Check:</strong></p>
      <ul>
        <li>Did you replace <code>YOUR-RENDER-URL</code> in <code>script.js</code>?</li>
        <li>Is your Render backend live?</li>
        <li>Does <code>${BACKEND_URL}/api/health</code> work?</li>
      </ul>
      <p class="small">${error.message}</p>
    `;
  }
}

// -------------------------
// AI Navigator mockup
// Real OpenAI connection should go through backend later.
// -------------------------

function sendChat() {
  const input = document.getElementById("chatInput");
  const box = document.getElementById("chatMessages");
  if (!input || !box) return;

  const msg = input.value.trim();
  if (!msg) return;

  box.innerHTML += `<div class="user">${msg}</div>`;

  const lower = msg.toLowerCase();

  let reply =
    "I can explain that in plain English. In the final version, this connects through a secure backend to OpenAI and your approved plan data.";

  if (lower.includes("deductible")) {
    reply =
      "A deductible is what you usually pay first before insurance shares more cost. Example: if your deductible is $2,000 and you met $650, you have $1,350 left.";
  }

  if (lower.includes("coinsurance")) {
    reply =
      "Coinsurance is a percentage split after deductible. If your coinsurance is 20%, you pay 20% of the covered amount and insurance pays 80%.";
  }

  if (lower.includes("prior") || lower.includes("authorization")) {
    reply =
      "Prior authorization means approval is needed before selected care. Ask: has it been submitted, is it approved, what is the approval number, and when does it expire?";
  }

  if (lower.includes("appeal") || lower.includes("denial")) {
    reply =
      "For a denial, request the denial letter, reason code, medical necessity criteria, appeal deadline, and whether a peer-to-peer review is available.";
  }

  if (lower.includes("mri")) {
    reply =
      "Before an MRI, ask if the imaging center is in-network, whether prior authorization is approved, the CPT code, and your estimated patient responsibility.";
  }

  setTimeout(() => {
    box.innerHTML += `<div class="bot">${reply}</div>`;
    box.scrollTop = box.scrollHeight;
  }, 250);

  input.value = "";
}

// -------------------------
// Backend health test
// Optional helper for debugging
// -------------------------

async function testBackendHealth() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    const data = await response.json();
    console.log("Backend health:", data);
    alert("Backend connected: " + data.message);
  } catch (error) {
    console.error("Backend health failed:", error);
    alert("Backend connection failed. Check your Render URL.");
  }
}
