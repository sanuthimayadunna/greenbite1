/* ------- HOME ------ */
document.addEventListener('DOMContentLoaded', function () {
  // Rotating hero quotes: swap the text in #hero-quote every 4s
  var QUOTES = [
    "Small steps every day beat big changes once.",
    "Hydrate before you caffeinate.",
    "Move your body — your mind will thank you.",
    "Add a veg to every plate.",
    "Sleep is the best pre-workout."
  ];
  var quoteEl = document.getElementById('hero-quote');
  if (quoteEl) {
    var i = 0;                        // start at first quote
    quoteEl.textContent = QUOTES[i];  // set initial quote
    setInterval(function () {         // rotate through quotes
      i = (i + 1) % QUOTES.length;
      quoteEl.textContent = QUOTES[i];
    }, 4000);
  }

  // Daily tip of the day: pick one based on today's date
  var TIPS = [
    "Start with a high-protein breakfast.",
    "Aim for 8,000+ steps today.",
    "Do a 5-minute stretch between tasks.",
    "Replace one sugary drink with water.",
    "Write 3 things you’re grateful for."
  ];
  var tipEl = document.getElementById('daily-tip');
  if (tipEl) tipEl.textContent = TIPS[new Date().getDate() % TIPS.length];

  // Newsletter signup: store unique emails in localStorage
  var nlForm = document.getElementById('newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (document.getElementById('nl-email').value || '').trim();
      var msgEl = document.getElementById('nl-msg');
      var list = [];
      try { list = JSON.parse(localStorage.getItem('gb_newsletter') || '[]'); } catch(e){}
      if (email && list.indexOf(email) === -1) {
        list.push(email);
        localStorage.setItem('gb_newsletter', JSON.stringify(list));
        if (msgEl) msgEl.textContent = "Thanks! You're in.";
        nlForm.reset();
      } else {
        if (msgEl) msgEl.textContent = "That email looks already added.";
      }
    });
  }

  // Footer year: keep © year current
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});


/* ------- RECIPES PAGE ------- */
(function () {
  // Only run on recipes page (needs #recipes list container)
  var listEl = document.getElementById('recipes');
  if (!listEl) return;

  // UI elements for filtering + modal
  var searchEl = document.getElementById('recipe-search');
  var catEl = document.getElementById('recipe-category');
  var modal = document.getElementById('recipe-modal');
  var closeBtn = document.getElementById('recipe-close');

  // Recipe data: used to render the cards + modal content
  var DATA = [
    {
      id: "oats",
      title: "Overnight Oats",
      desc: "Creamy oats with chia and fruits.",
      category: "Breakfast",
      img: "./images/oatmeal.png",
      ingredients: ["½ cup rolled oats","1 tbsp chia seeds","½ cup milk","½ cup yogurt","1 tsp honey","Fruit to top"],
      steps: ["Combine oats, chia, milk and yogurt.","Refrigerate overnight.","Top with fruit and honey."],
      nutrition: {"Calories":"320 kcal","Carbs":"45 g","Protein":"16 g","Fat":"9 g"}
    },
    {
      id: "bowl",
      title: "Rainbow Buddha Bowl",
      desc: "Grains, greens and beans with tahini.",
      category: "Lunch",
      img: "./images/rainbow bowl.png",
      ingredients: ["1 cup quinoa","1 cup chickpeas","2 cups mixed veg","2 tbsp tahini","1 tbsp lemon juice","Salt & pepper"],
      steps: ["Cook quinoa.","Roast or steam veg.","Mix tahini with lemon.","Assemble bowl and drizzle."],
      nutrition: {"Calories":"480 kcal","Carbs":"70 g","Protein":"20 g","Fat":"14 g"}
    },
    {
      id: "salmon",
      title: "Herby Baked Salmon",
      desc: "Quick protein-packed dinner.",
      category: "Dinner",
      img: "./images/baked salmon.png",
      ingredients: ["200 g salmon","1 tbsp olive oil","Herbs, lemon","Salt & pepper"],
      steps: ["Heat oven to 200°C.","Season salmon and drizzle oil.","Bake 12–15 min until flaky."],
      nutrition: {"Calories":"360 kcal","Carbs":"2 g","Protein":"34 g","Fat":"22 g"}
    },
    {
      id: "energy-bites",
      title: "Energy Bites",
      desc: "No-bake nutty date snacks.",
      category: "Snack",
      img: "./images/energy bites.png",
      ingredients: ["1 cup dates","½ cup peanuts","2 tbsp cocoa","Pinch salt"],
      steps: ["Blend all ingredients.","Roll into balls.","Chill 20 min."],
      nutrition: {"Calories":"110 kcal","Carbs":"14 g","Protein":"3 g","Fat":"5 g"}
    },
    {
      id: "green-smoothie",
      title: "Green Smoothie",
      desc: "Spinach, banana and yogurt.",
      category: "Drink",
      img: "./images/green smoothie.png",
      ingredients: ["1 banana","1 cup spinach","½ cup yogurt","½ cup water","Ice"],
      steps: ["Blend all until smooth."],
      nutrition: {"Calories":"220 kcal","Carbs":"40 g","Protein":"8 g","Fat":"3 g"}
    }
  ];

  // Helpers to read/write saved recipe ids (for the ☆/⭐ toggle)
  function getSaved() {
    try { return JSON.parse(localStorage.getItem('gb_saved') || "[]"); } catch (e) { return []; }
  }
  function setSaved(arr) { localStorage.setItem('gb_saved', JSON.stringify(arr)); }

  // Render visible recipe cards based on search + category
  function renderList() {
    var term = (searchEl && searchEl.value ? searchEl.value : "").toLowerCase();
    var cat = (catEl && catEl.value) ? catEl.value : "";
    listEl.innerHTML = "";
    var saved = getSaved();

    for (var i = 0; i < DATA.length; i++) {
      var r = DATA[i];
      var okCat = !cat || r.category === cat;
      var okTerm = r.title.toLowerCase().indexOf(term) !== -1;
      if (!okCat || !okTerm) continue;

      // Build a card for each matching recipe
      var card = document.createElement('article');
      card.className = 'card-item';
      card.innerHTML =
        '<img src="' + r.img + '" alt="' + r.title + '">' +
        '<div class="card-body">' +
        ' <div style="display:flex;align-items:center;gap:8px">' +
        '   <h4>' + r.title + '</h4>' +
        '   <button class="star" title="Save" data-id="' + r.id + '">' + (saved.indexOf(r.id) !== -1 ? '⭐' : '☆') + '</button>' +
        ' </div>' +
        ' <p>' + r.desc + '</p>' +
        ' <div class="row">' +
        '   <span class="tag">' + r.category + '</span>' +
        '   <button class="btn" data-open="' + r.id + '">View</button>' +
        ' </div>' +
        '</div>';
      listEl.appendChild(card);
    }
  }

  // Open the modal dialog and fill it with recipe details by id
  function openModal(id) {
    if (!modal) return;
    var r = null;
    for (var i = 0; i < DATA.length; i++) if (DATA[i].id === id) r = DATA[i];
    if (!r) return;

    // Grab modal fields
    var t = document.getElementById('recipe-title');
    var d = document.getElementById('recipe-desc');
    var img = document.getElementById('recipe-img');
    var ing = document.getElementById('recipe-ingredients');
    var steps = document.getElementById('recipe-steps');
    var nut = document.getElementById('recipe-nutrition');

    // Fill modal content
    if (t) t.textContent = r.title;
    if (d) d.textContent = r.desc;
    if (img) { img.src = r.img; img.alt = r.title; }

    // Build ingredients list
    if (ing) {
      ing.innerHTML = "";
      for (var a = 0; a < r.ingredients.length; a++) {
        var li = document.createElement('li'); li.textContent = r.ingredients[a]; ing.appendChild(li);
      }
    }
    // Build steps list
    if (steps) {
      steps.innerHTML = "";
      for (var b = 0; b < r.steps.length; b++) {
        var li2 = document.createElement('li'); li2.textContent = r.steps[b]; steps.appendChild(li2);
      }
    }
    // Build nutrition table rows
    if (nut) {
      nut.innerHTML = "";
      for (var k in r.nutrition) {
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + k + '</td><td>' + r.nutrition[k] + '</td>';
        nut.appendChild(tr);
      }
    }
    modal.hidden = false; // show modal
  }

  // Handle clicks: open modal on "View", toggle save on star
  listEl.addEventListener('click', function (e) {
    var target = e.target;
    var idOpen = target.getAttribute('data-open');
    var idStar = target.getAttribute('data-id');

    if (idOpen) openModal(idOpen);

    if (idStar) {
      var saved = getSaved();
      var idx = saved.indexOf(idStar);
      if (idx !== -1) saved.splice(idx, 1); else saved.push(idStar);
      setSaved(saved);
      renderList(); // re-render to update star
    }
  });

  // Close modal via X button or clicking the backdrop
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', function () { modal.hidden = true; });
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.hidden = true; });
  }

  // React to user typing / changing category
  if (searchEl) searchEl.addEventListener('input', renderList);
  if (catEl) catEl.addEventListener('change', renderList);

  renderList(); // initial render
})();

/* ------ CALCULATOR PAGE ----- */
(function () {
  // Only run if the calculator form exists
  var form = document.getElementById('calc-form');
  if (!form) return;

  // Output elements
  var res = document.getElementById('results');
  var bmrEl = document.getElementById('bmr');
  var tdeeEl = document.getElementById('tdee');
  var carbsG = document.getElementById('carbs-g');
  var proteinG = document.getElementById('protein-g');
  var fatG = document.getElementById('fat-g');
  var carbsBar = document.getElementById('carbs-bar');
  var proteinBar = document.getElementById('protein-bar');
  var fatBar = document.getElementById('fat-bar');

  // Ensure a value stays within min/max (used for progress widths)
  function clamp(n, min, max) { if (n < min) return min; if (n > max) return max; return n; }

  // Main submit: compute BMR, TDEE, and macro grams
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var age = +document.getElementById('age').value;
    var gender = document.getElementById('gender').value;
    var height = +document.getElementById('height').value;
    var weight = +document.getElementById('weight').value;
    var activity = +document.getElementById('activity').value;

    // BMR (Mifflin–St Jeor formula)
    var bmr = Math.round(10 * weight + 6.25 * height - 5 * age + (gender === 'Male' ? 5 : -161));
    var tdee = Math.round(bmr * activity); // daily calories based on activity

    // Macro split 50% carbs / 20% protein / 30% fat
    var carbs = Math.round((tdee * 0.50) / 4);
    var protein = Math.round((tdee * 0.20) / 4);
    var fat = Math.round((tdee * 0.30) / 9);

    // Write numbers
    if (bmrEl) bmrEl.textContent = bmr + " kcal/day";
    if (tdeeEl) tdeeEl.textContent = tdee + " kcal/day";
    if (carbsG) carbsG.textContent = carbs;
    if (proteinG) proteinG.textContent = protein;
    if (fatG) fatG.textContent = fat;

    // Update progress bars relative to total grams
    var totalG = carbs + protein + fat;
    if (carbsBar) carbsBar.style.width = clamp((carbs / totalG) * 100, 0, 100) + "%";
    if (proteinBar) proteinBar.style.width = clamp((protein / totalG) * 100, 0, 100) + "%";
    if (fatBar) fatBar.style.width = clamp((fat / totalG) * 100, 0, 100) + "%";

    if (res) res.hidden = false; // reveal results section
  });
})();

/* ---------- WORKOUT PAGE ---------- */
(function () {
  // Only run if the workout generator exists
  var formW = document.getElementById('workout-form');
  if (!formW) return;

  // UI elements for the generated plan + timer
  var plan = document.getElementById('plan');
  var list = document.getElementById('plan-list');
  var label = document.getElementById('timer-label');
  var out = document.getElementById('countdown');
  var btnStart = document.getElementById('start');
  var btnPause = document.getElementById('pause');
  var btnReset = document.getElementById('reset');

  // Library of moves grouped by body part + equipment
  var MOVES = {
    "Full Body": {
      "None": ["Jumping Jacks","Bodyweight Squats","Push-ups","Mountain Climbers","Burpees"],
      "Dumbbells": ["DB Thrusters","DB Deadlifts","DB Rows","DB Press","DB Lunges"],
      "Resistance Band": ["Band Squats","Band Rows","Band Press","Band Good Mornings","Band Pull-aparts"]
    },
    "Arms": {
      "None": ["Diamond Push-ups","Chair Dips","Inchworms","Pike Push-ups"],
      "Dumbbells": ["DB Curls","DB Tricep Extensions","Hammer Curls","DB Kickbacks"],
      "Resistance Band": ["Band Curls","Band Pressdowns","Band Curls Wide"]
    },
    "Legs": {
      "None": ["Squats","Lunges","Glute Bridges","Wall Sit","Calf Raises"],
      "Dumbbells": ["DB Squats","DB Lunges","DB Romanian Deadlift","DB Step-ups"],
      "Resistance Band": ["Band Squats","Band Walks","Band Leg Press","Band Deadlift"]
    },
    "Back": {
      "None": ["Supermans","Reverse Snow Angels","Prone Y-T-I"],
      "Dumbbells": ["DB Rows","DB Deadlifts","DB Pullovers"],
      "Resistance Band": ["Band Rows","Band Face Pulls","Band Pull-aparts"]
    },
    "Chest": {
      "None": ["Push-ups","Incline Push-ups","Decline Push-ups"],
      "Dumbbells": ["DB Bench Press","DB Floor Press","DB Flyes"],
      "Resistance Band": ["Band Chest Press","Band Fly","Band Push-ups"]
    },
    "Core": {
      "None": ["Plank","Dead Bug","Bicycle Crunch","Leg Raises"],
      "Dumbbells": ["DB Russian Twist","DB Sit-ups","DB Dead Bug"],
      "Resistance Band": ["Band Pallof Press","Band Crunch"]
    }
  };

  // Timer state
  var queue = [];     // selected moves
  var idx = 0;        // which move we’re on
  var secs = 30;      // seconds left in the current move
  var timer = null;   // setTimeout handle

  // Short tone at each interval change (best-effort; may be blocked)
  function beep() {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = 880; g.gain.value = 0.06;
      o.connect(g); g.connect(ctx.destination); o.start();
      setTimeout(function(){ o.stop(); ctx.close(); }, 200);
    } catch (e) {}
  }

  // Format seconds as mm:ss
  function fmt(n) {
    var m = Math.floor(n/60).toString().padStart(2,'0');
    var s = (n%60).toString().padStart(2,'0');
    return m+":"+s;
  }

  // Countdown tick (called every second)
  function tick(){
    if (out) out.textContent = fmt(secs);
    if (secs === 0){ beep(); next(); }
    else { secs--; timer = setTimeout(tick, 1000); }
  }

  // Advance to next move or finish
  function next(){
    if (idx >= queue.length){
      if (label) label.textContent = "Done 🎉";
      if (out) out.textContent = "00:00";
      clearTimeout(timer); timer = null;
      return;
    }
    if (label) label.textContent = queue[idx];
    secs = 30; if (out) out.textContent = fmt(secs);
    idx++; clearTimeout(timer); timer = null;
    timer = setTimeout(tick, 1000);
  }

  // Build a random list of 5 moves based on form choices
  formW.addEventListener('submit', function (e) {
    e.preventDefault();
    var body = document.getElementById('body').value;
    var equip = document.getElementById('equip').value;
    var moves = (MOVES[body] && MOVES[body][equip]) ? MOVES[body][equip] : [];
    queue = moves.slice().sort(function(){ return Math.random()-0.5; }).slice(0,5);

    // Show the plan as a list (each 30s)
    if (list) {
      list.innerHTML = "";
      for (var i=0;i<queue.length;i++){
        var li = document.createElement('li');
        li.textContent = queue[i] + " — 30s";
        list.appendChild(li);
      }
    }
    idx=0; secs=30; if (out) out.textContent=fmt(secs);
    if (label) label.textContent = "Ready";
    if (plan) plan.hidden = false; // reveal the plan section
  });

  // Timer controls
  if (btnStart) btnStart.addEventListener('click', function(){ if(!timer) next(); });
  if (btnPause) btnPause.addEventListener('click', function(){ if(timer){ clearTimeout(timer); timer=null; }});
  if (btnReset) btnReset.addEventListener('click', function(){
    clearTimeout(timer); timer=null; idx=0; secs=30;
    if (out) out.textContent = fmt(secs);
    if (label) label.textContent = "Ready";
  });
})();

/* ---------- MINDFULNESS PAGE ---------- */
(function () {
  // Only run if breathing/timer UI exists
  var circle = document.getElementById('breath-circle');
  var breathLabel = document.getElementById('breath-label');
  var bStart = document.getElementById('breath-start');
  var bStop = document.getElementById('breath-stop');

  var bTimer = null; // interval handle for repeating breath cycle

  // One 6s breathing cycle: 4s inhale, 2s exhale (with a short hold label)
  function breathCycle(){
    if (breathLabel) breathLabel.textContent = "Inhale…";
    if (circle) circle.classList.add('animate');
    setTimeout(function(){ if (breathLabel) breathLabel.textContent = "Hold…"; }, 4000);
    setTimeout(function(){
      if (breathLabel) breathLabel.textContent = "Exhale…";
      if (circle) circle.classList.remove('animate');
    }, 6000);
  }

  // Start/stop the repeating breathing animation
  if (bStart) bStart.addEventListener('click', function(){
    if (bTimer) return;
    breathCycle(); bTimer = setInterval(breathCycle, 6000);
  });
  if (bStop) bStop.addEventListener('click', function(){
    clearInterval(bTimer); bTimer=null;
    if (breathLabel) breathLabel.textContent="Paused";
    if (circle) circle.classList.remove('animate');
  });

  // Simple meditation countdown timer + session counter
  var minEl = document.getElementById('mind-mins');
  var sStart = document.getElementById('mind-start');
  var sStop = document.getElementById('mind-stop');
  var statusEl = document.getElementById('mind-status');
  var sessionsEl = document.getElementById('sessions');

  var left = 0, timer = null; // seconds left, interval handle

  // Load total sessions completed from localStorage
  if (sessionsEl) {
    var stored = "0";
    try { stored = localStorage.getItem('gb_sessions') || "0"; } catch (e) {}
    sessionsEl.textContent = stored;
  }

  // Update the status text with mm:ss or "Idle"
  function updateStatus(){
    var m = Math.floor(left/60).toString().padStart(2,'0');
    var s = (left%60).toString().padStart(2,'0');
    if (statusEl) statusEl.textContent = left>0 ? (m+":"+s+" remaining") : "Idle";
  }

  // Start the meditation countdown for N minutes
  if (sStart) sStart.addEventListener('click', function(){
    var mins = Math.max(1, +(minEl ? minEl.value : 5));
    left = mins*60; updateStatus();
    if (timer) clearInterval(timer);
    timer = setInterval(function(){
      left--; updateStatus();
      if (left<=0){
        clearInterval(timer); timer=null;
        if (statusEl) statusEl.textContent="Done!";
        // Increment stored session count and play a chime
        var c = 0; try { c = +(localStorage.getItem('gb_sessions') || "0"); } catch(e){}
        c++; localStorage.setItem('gb_sessions', String(c));
        if (sessionsEl) sessionsEl.textContent = String(c);
        try{
          var ctx = new (window.AudioContext||window.webkitAudioContext)();
          var o=ctx.createOscillator(); var g=ctx.createGain();
          o.type='sine'; o.frequency.value=660; g.gain.value=0.04;
          o.connect(g); g.connect(ctx.destination); o.start();
          setTimeout(function(){o.stop(); ctx.close();}, 500);
        }catch(e){}
      }
    }, 1000);
  });

  // Stop the meditation timer early
  if (sStop) sStop.addEventListener('click', function(){
    clearInterval(timer); timer=null;
    if (statusEl) statusEl.textContent="Stopped";
  });

  // Ambient sounds (rain/waves/chimes) generated with Web Audio API
  var audioCtx=null, nodes=[];
  function stopSound(){
    for (var i=0;i<nodes.length;i++){ try{nodes[i].stop();}catch(e){} }
    nodes=[]; if(audioCtx){ try{audioCtx.close();}catch(e){} audioCtx=null; }
  }
  var offBtn = document.getElementById('sound-off');
  if (offBtn) offBtn.addEventListener('click', stopSound);

  // Start the selected ambient sound
  var soundBtns = document.querySelectorAll('.sound-btn');
  for (var s=0;s<soundBtns.length;s++){
    soundBtns[s].addEventListener('click', function(){
      stopSound(); audioCtx = new (window.AudioContext||window.webkitAudioContext)();
      var type = this.getAttribute('data-sound');

      // "Rain": looped white noise, very low volume
      if (type==='rain'){
        var N = 2*audioCtx.sampleRate;
        var buf = audioCtx.createBuffer(1, N, audioCtx.sampleRate);
        var ch = buf.getChannelData(0);
        for (var i=0;i<N;i++) ch[i] = Math.random()*2-1;
        var white = audioCtx.createBufferSource(); white.buffer=buf; white.loop=true;
        var gain = audioCtx.createGain(); gain.gain.value=0.02;
        white.connect(gain).connect(audioCtx.destination); white.start(); nodes=[white];

      // "Waves": low sine wave with slow amplitude LFO
      } else if (type==='waves'){
        var o=audioCtx.createOscillator(); var g=audioCtx.createGain();
        o.type='sine'; o.frequency.value=120; g.gain.value=0.01;
        o.connect(g).connect(audioCtx.destination);
        var lfo=audioCtx.createOscillator(); var lg=audioCtx.createGain();
        lfo.frequency.value=0.2; lg.gain.value=0.008; lfo.connect(lg).connect(g.gain);
        o.start(); lfo.start(); nodes=[o,lfo];

      // "Chimes": gentle triangle tone
      } else if (type==='chimes'){
        var oc=audioCtx.createOscillator(); var gg=audioCtx.createGain();
        oc.type='triangle'; oc.frequency.value=880; gg.gain.value=0.02;
        oc.connect(gg).connect(audioCtx.destination); oc.start(); nodes=[oc];
      }
    });
  }
})();

/* ---------- CONTACT PAGE ---------- */
(function () {
  // Only run if contact form exists
  var form = document.getElementById('contact-form');
  if (!form) return;

  var statusEl = document.getElementById('c-status');

  // Helper: show a status message (green for OK, red for error)
  function show(msg, ok){
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.color = ok ? 'green' : 'crimson';
  }
  // Basic email validation
  function validEmail(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

  // Save feedback to localStorage (no server)
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = (document.getElementById('c-name')||{}).value || "";
    var email = (document.getElementById('c-email')||{}).value || "";
    var msg = (document.getElementById('c-msg')||{}).value || "";
    name=name.trim(); email=email.trim(); msg=msg.trim();

    // Simple validation messages
    if (name.length<2){ show("Please enter your full name."); return; }
    if (!validEmail(email)){ show("Please enter a valid email."); return; }
    if (msg.length<10){ show("Message should be at least 10 characters."); return; }

    // Append to local list
    var feedback=[]; try{ feedback = JSON.parse(localStorage.getItem('gb_feedback') || "[]"); }catch(e){}
    feedback.push({ name:name, email:email, msg:msg, at:new Date().toISOString() });
    localStorage.setItem('gb_feedback', JSON.stringify(feedback));

    show("Thanks! Your message was saved on this device.", true);
    form.reset();
  });

  // FAQ accordion: toggle open/close the next panel
  var btns = document.querySelectorAll('.acc-btn');
  for (var i=0;i<btns.length;i++){
    btns[i].addEventListener('click', function(){
      this.classList.toggle('active');
      var p = this.nextElementSibling;
      if (p) p.style.display = (p.style.display === 'block') ? 'none' : 'block';
    });
  }
})();
