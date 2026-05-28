const pages = document.querySelectorAll('.page');
const navBtns = document.querySelectorAll('.nav-btn');
function showPage(id){
  pages.forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  navBtns.forEach(b=>b.classList.toggle('active', b.dataset.page===id));
}
navBtns.forEach(btn=>btn.addEventListener('click',()=>showPage(btn.dataset.page)));

const modules = [
  ["💳 Premium","Your monthly membership cost for having insurance."],
  ["⛰ Deductible","What you pay before insurance starts sharing more cost."],
  ["☕ Copay","A fixed price for certain care, like a visit or prescription."],
  ["🥧 Coinsurance","A percentage split between you and insurance."],
  ["🏦 HSA/FSA","Accounts that help pay healthcare costs with tax advantages."],
  ["🗺 Network","In-network usually costs less than out-of-network."],
  ["🚦 Prior Auth","Approval required before some tests, meds, or procedures."],
  ["☂️ OOP Max","The most you should pay in covered costs for the year."]
];
const moduleGrid = document.getElementById('moduleGrid');
modules.forEach(([title,body])=>{
  const div=document.createElement('div');
  div.className='module';
  div.innerHTML=`<strong>${title}</strong><p>${body}</p><div class="progress"><span style="width:${35+Math.random()*55}%"></span></div>`;
  moduleGrid.appendChild(div);
});

const styleButtons = document.querySelectorAll('.style-btn');
const styleOutput = document.getElementById('styleOutput');
const styleText = {
  visual:["Visual Mode","Insurance terms become diagrams, progress bars, color maps, and storyboards."],
  audio:["Audio Mode","Lessons become short podcast-style explanations and spoken scenarios."],
  reading:["Reading Mode","Lessons become definitions, flashcards, notes, summaries, and examples."],
  hands:["Hands-on Mode","You learn by comparing plans, dragging choices, and running simulations."],
  game:["Gamified Mode","Earn XP, badges, streaks, and mastery levels as you complete challenges."]
};
styleButtons.forEach(btn=>{
  btn.addEventListener('click',()=>{
    styleButtons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const [h,p]=styleText[btn.dataset.style];
    styleOutput.querySelector('h3').textContent=h;
    styleOutput.querySelector('p').textContent=p;
  });
});

function runScenario(choice){
  const output=document.getElementById('scenarioResult');
  const data = {
    er:["ER","Estimated patient cost: $1,250–$2,900","Best for true emergencies. Usually highest facility fees."],
    urgent:["Urgent Care","Estimated patient cost: $120–$350","Good for non-life-threatening issues. Lower cost than ER."],
    ortho:["In-network Ortho","Estimated patient cost: $180–$500","Best planned option. May need referral or prior authorization for MRI."]
  };
  const d=data[choice];
  output.innerHTML=`<strong>${d[0]}</strong><br>${d[1]}<br><span class="small">${d[2]}</span>`;
}

function estimateCost(){
  const procedure=document.getElementById('procedure').value;
  const deductible=Number(document.getElementById('deductible').value);
  const met=Number(document.getElementById('met').value);
  const coins=Number(document.getElementById('coinsurance').value)/100;
  const copay=Number(document.getElementById('copay').value);
  const oop=Number(document.getElementById('oop').value);

  const prices = {
    mri:{name:"MRI Knee", low:450, avg:1150, high:3200, auth:"Usually required", alt:"Freestanding imaging center"},
    urgent:{name:"Urgent Care Visit", low:95, avg:180, high:350, auth:"Usually not required", alt:"Telehealth or primary care"},
    er:{name:"Emergency Room Visit", low:900, avg:2200, high:6000, auth:"Not before emergency", alt:"Urgent care if not life-threatening"},
    colonoscopy:{name:"Colonoscopy", low:900, avg:2100, high:4800, auth:"Sometimes required", alt:"Ambulatory surgery center"},
    heartCath:{name:"Diagnostic Heart Cath", low:6500, avg:14500, high:32000, auth:"Often required unless emergency", alt:"Ask about facility, physician, and anesthesia fees"}
  };
  const p=prices[procedure];
  const remaining=Math.max(deductible-met,0);
  const afterDeductible=Math.max(p.avg-remaining,0);
  const estimated=Math.min(remaining + afterDeductible*coins + copay, oop);
  document.getElementById('estimateOutput').innerHTML=`
    <h3>${p.name}</h3>
    <p class="small">Estimated total medical price range: $${p.low.toLocaleString()}–$${p.high.toLocaleString()}</p>
    <div class="cost-big">$${Math.round(estimated).toLocaleString()}</div>
    <p><strong>Plain English:</strong> You still have $${remaining.toLocaleString()} left before your deductible is met. After that, your estimated coinsurance is ${Math.round(coins*100)}%.</p>
    <div class="options">
      <div class="option"><strong>✅ Prior authorization</strong><br>${p.auth}</div>
      <div class="option"><strong>💡 Cheaper alternative</strong><br>${p.alt}</div>
      <div class="option"><strong>🗺 Network tip</strong><br>Confirm facility and doctor are both in-network.</div>
    </div>
  `;
}

function sendChat(){
  const input=document.getElementById('chatInput');
  const msg=input.value.trim();
  if(!msg) return;
  const box=document.getElementById('chatMessages');
  box.innerHTML += `<div class="user">${msg}</div>`;
  const lower=msg.toLowerCase();
  let reply="I can explain that in plain English. In the final version, this would connect to a secure AI backend and your plan data.";
  if(lower.includes("deductible")) reply="A deductible is the amount you usually pay first before insurance starts sharing more costs. Example: if your deductible is $2,000 and you have met $500, you have $1,500 left.";
  if(lower.includes("coinsurance")) reply="Coinsurance is a percentage split. If your coinsurance is 20% and the covered bill is $1,000 after deductible, you may pay $200.";
  if(lower.includes("prior")) reply="Prior authorization means your insurance wants approval before the service. Ask the provider: Has authorization been submitted and approved?";
  if(lower.includes("network")) reply="In-network means your insurer has a contract with that provider. Out-of-network can cost much more or may not be covered.";
  setTimeout(()=>{
    box.innerHTML += `<div class="bot">${reply}</div>`;
    box.scrollTop=box.scrollHeight;
  },300);
  input.value="";
}

function fakeLogin(){
  const email=document.getElementById('email').value || "demo@email.com";
  document.getElementById('loginStatus').textContent=`Demo account created for ${email}. Firebase connection can be added next.`;
}
