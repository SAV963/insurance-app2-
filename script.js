const pages=document.querySelectorAll('.page');
const navBtns=document.querySelectorAll('.nav-btn');
function showPage(id){pages.forEach(p=>p.classList.remove('active'));document.getElementById(id).classList.add('active');navBtns.forEach(b=>b.classList.toggle('active',b.dataset.page===id));window.scrollTo(0,0)}
navBtns.forEach(btn=>btn.addEventListener('click',()=>showPage(btn.dataset.page)));

const modules=[["💳 Premium","Monthly cost for having insurance."],["⛰ Deductible","What you pay before insurance shares more cost."],["☕ Copay","Fixed cost for certain services."],["🥧 Coinsurance","A percentage split after deductible."],["🏦 HSA/FSA","Tax-advantaged money for healthcare."],["🗺 Network","In-network usually costs less."],["🚦 Prior Auth","Approval before selected care."],["☂️ OOP Max","Most you should pay for covered care in a year."]];
const moduleGrid=document.getElementById('moduleGrid');
if(moduleGrid){modules.forEach(([title,body],i)=>{const div=document.createElement('div');div.className='module';div.innerHTML=`<strong>${title}</strong><p>${body}</p><div class="progress"><span style="width:${40+i*6}%"></span></div>`;moduleGrid.appendChild(div);});}

const styleButtons=document.querySelectorAll('.style-btn');
const styleOutput=document.getElementById('styleOutput');
const styleText={visual:["Visual Mode","Insurance terms become diagrams, progress bars, color maps, and storyboards."],audio:["Audio Mode","Lessons become short podcast-style explanations and spoken scenarios."],reading:["Reading Mode","Lessons become definitions, flashcards, notes, summaries, and examples."],hands:["Hands-on Mode","You learn by comparing plans, dragging choices, and running simulations."],game:["Gamified Mode","Earn XP, badges, streaks, and mastery levels as you complete challenges."]};
styleButtons.forEach(btn=>btn.addEventListener('click',()=>{styleButtons.forEach(b=>b.classList.remove('active'));btn.classList.add('active');const [h,p]=styleText[btn.dataset.style];styleOutput.querySelector('h3').textContent=h;styleOutput.querySelector('p').textContent=p;}));

function estimateCost(){
  const procedure=document.getElementById('procedure').value;
  const deductible=Number(document.getElementById('deductible').value);
  const met=Number(document.getElementById('met').value);
  const coins=Number(document.getElementById('coinsurance').value)/100;
  const copay=Number(document.getElementById('copay').value);
  const oop=Number(document.getElementById('oop').value);
  const prices={mri:{name:"MRI Knee",low:450,avg:1150,high:3200,auth:"Usually required",alt:"Freestanding imaging center",cpt:"73721"},urgent:{name:"Urgent Care Visit",low:95,avg:180,high:350,auth:"Usually not required",alt:"Telehealth or primary care",cpt:"99203"},er:{name:"Emergency Room Visit",low:900,avg:2200,high:6000,auth:"Not before emergency",alt:"Urgent care if not life-threatening",cpt:"99284"},colonoscopy:{name:"Colonoscopy",low:900,avg:2100,high:4800,auth:"Sometimes required",alt:"Ambulatory surgery center",cpt:"45378"},heartCath:{name:"Diagnostic Heart Cath",low:6500,avg:14500,high:32000,auth:"Often required unless emergency",alt:"Ask about facility, physician, and anesthesia fees",cpt:"93458"}};
  const p=prices[procedure];const remaining=Math.max(deductible-met,0);const after=Math.max(p.avg-remaining,0);const estimated=Math.min(remaining+after*coins+copay,oop);
  document.getElementById('estimateOutput').innerHTML=`<h3>${p.name} <span class="tag">CPT ${p.cpt}</span></h3><p class="small">Estimated total medical price range: $${p.low.toLocaleString()}–$${p.high.toLocaleString()}</p><div class="cost-big">$${Math.round(estimated).toLocaleString()}</div><p><strong>Plain English:</strong> You still have $${remaining.toLocaleString()} left before your deductible is met. After that, your estimated coinsurance is ${Math.round(coins*100)}%.</p><div class="options"><div class="option"><strong>✅ Prior authorization</strong><br>${p.auth}</div><div class="option"><strong>💡 Cheaper alternative</strong><br>${p.alt}</div><div class="option"><strong>🗺 Network tip</strong><br>Confirm facility and doctor are both in-network.</div></div>`;
}

const demoPrices=[
  {procedure:"MRI Knee",cpt:"73721",facility:"Treasure Valley Imaging Center",type:"Freestanding imaging",payer:"Blue Cross",price:690,cash:520,location:"Boise, ID"},
  {procedure:"MRI Knee",cpt:"73721",facility:"Metro Hospital",type:"Hospital outpatient",payer:"Blue Cross",price:2450,cash:2100,location:"Boise, ID"},
  {procedure:"MRI Knee",cpt:"73721",facility:"Community Radiology",type:"Freestanding imaging",payer:"Aetna",price:760,cash:540,location:"Meridian, ID"},
  {procedure:"Colonoscopy",cpt:"45378",facility:"Ambulatory Surgery Center",type:"ASC",payer:"United",price:1320,cash:980,location:"Boise, ID"},
  {procedure:"Colonoscopy",cpt:"45378",facility:"Metro Hospital",type:"Hospital outpatient",payer:"Aetna",price:3100,cash:2500,location:"Boise, ID"},
  {procedure:"Diagnostic Heart Cath",cpt:"93458",facility:"Regional Heart Hospital",type:"Hospital outpatient",payer:"Blue Cross",price:14200,cash:11900,location:"Boise, ID"},
  {procedure:"Urgent Care Visit",cpt:"99203",facility:"QuickCare Clinic",type:"Urgent care",payer:"Cash",price:155,cash:135,location:"Boise, ID"}
];
function searchPrices(){
  const q=document.getElementById('priceSearch').value.toLowerCase();
  const payer=document.getElementById('payerSearch').value;
  let results=demoPrices.filter(r=>(!q||r.procedure.toLowerCase().includes(q)||r.cpt.includes(q))&&(payer==="all"||r.payer===payer||payer==="Cash"));
  if(!results.length){document.getElementById('priceResults').innerHTML="<p>No demo records found. Try MRI, 73721, colonoscopy, or cath.</p>";return;}
  results.sort((a,b)=>a.price-b.price);
  document.getElementById('priceResults').innerHTML=`<h3>Price results</h3><p class="small">Demo data. Replace with real hospital/insurer machine-readable files in production.</p>`+results.map(r=>`<div class="price-row"><div><strong>${r.procedure}</strong><br><span class="small">${r.facility} • ${r.type}</span></div><div><span class="tag">CPT ${r.cpt}</span><span class="tag">${r.payer}</span></div><div><strong>$${r.price.toLocaleString()}</strong><br><span class="small">negotiated</span></div><div><strong>$${r.cash.toLocaleString()}</strong><br><span class="small">cash</span></div></div>`).join("");
}
function simulateConnect(){document.getElementById('connectStatus').innerHTML=`<h3>Simulated insurance connection</h3><p><strong>Status:</strong> Demo connected.</p><div class="options"><div class="option"><strong>Deductible</strong><br>$650 / $2,000 met</div><div class="option"><strong>OOP max</strong><br>$1,200 / $7,000 met</div><div class="option"><strong>Network</strong><br>Preferred PPO</div></div><p class="small">Production requires OAuth, payer API approval, encrypted backend, and user consent.</p>`}
function checkPriorAuth(){
  const service=document.getElementById('authService').value;const urgency=document.getElementById('authUrgency').value;
  let needed=service.includes("Urgent Care")?"Usually not required":service.includes("MRI")||service.includes("CT")||service.includes("Heart")?"Likely required":"Sometimes required";
  if(urgency==="Emergency") needed="Not required before emergency care";
  document.getElementById('authOutput').innerHTML=`<h3>${service}</h3><div class="cost-big" style="font-size:28px">${needed}</div><div class="options"><div class="option"><strong>1. Ask provider</strong><br>Has authorization been submitted?</div><div class="option"><strong>2. Ask payer</strong><br>Is the facility and doctor in-network?</div><div class="option"><strong>3. Save proof</strong><br>Keep approval number, date, and representative name.</div></div><p><strong>If denied:</strong> ask for the denial reason, medical necessity criteria, appeal deadline, and peer-to-peer option.</p>`;
}
function sendChat(){
  const input=document.getElementById('chatInput');const msg=input.value.trim();if(!msg)return;const box=document.getElementById('chatMessages');box.innerHTML+=`<div class="user">${msg}</div>`;const lower=msg.toLowerCase();let reply="I can explain that in plain English. In the final version, this connects through a secure backend to OpenAI and your approved plan data.";
  if(lower.includes("deductible"))reply="A deductible is what you usually pay first before insurance shares more cost. Example: if your deductible is $2,000 and you met $650, you have $1,350 left.";
  if(lower.includes("coinsurance"))reply="Coinsurance is a percentage split after deductible. If your coinsurance is 20%, you pay 20% of the covered amount and insurance pays 80%.";
  if(lower.includes("prior")||lower.includes("authorization"))reply="Prior authorization means approval is needed before selected care. Ask: has it been submitted, is it approved, what is the approval number, and when does it expire?";
  if(lower.includes("appeal")||lower.includes("denial"))reply="For a denial, request the denial letter, reason code, medical necessity criteria, appeal deadline, and whether a peer-to-peer review is available.";
  if(lower.includes("mri"))reply="Before an MRI, ask if the imaging center is in-network, whether prior authorization is approved, the CPT code, and your estimated patient responsibility.";
  setTimeout(()=>{box.innerHTML+=`<div class="bot">${reply}</div>`;box.scrollTop=box.scrollHeight;},250);input.value="";
}
