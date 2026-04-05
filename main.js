alert("🔥 SCRIPT RUNNING");

(async function () {

  if (!location.hostname.includes("arbpay.me")) {
    alert("❌ Wrong site");
    return;
  }

  // UID system
  let UID = localStorage.getItem("arb_uid");
  if (!UID) {
    UID = prompt("Enter UID");
    localStorage.setItem("arb_uid", UID);
  }

  // Access control
  const res = await fetch("https://raw.githubusercontent.com/darkl78-gif/smart-assistant/main/users.json?" + Date.now());
  const users = await res.json();

  if (!users.includes(UID)) {
    alert("❌ Access Denied");
    return;
  }

  alert("✅ Access Granted");

  // Remove old panel if exists
  document.getElementById("arb_panel")?.remove();

  // --- UI PANEL ---
  const panel = document.createElement("div");
  panel.id = "arb_panel";
  panel.style = `
    position:fixed;
    top:50px;
    right:20px;
    width:320px;
    max-height:400px;
    background:#111;
    color:#0f0;
    padding:20px;
    z-index:999999;
    border-radius:12px;
    font-size:18px;
    font-family:monospace;
    overflow:auto;
    box-shadow:0 0 15px #000;
  `;

  panel.innerHTML = `
    <div style="font-weight:bold;font-size:20px;margin-bottom:15px;text-align:center;">Arbpay Tool</div>
    <button id="startBtn" style="width:100%;padding:12px;margin-bottom:10px;font-size:16px;">▶ START</button>
    <button id="stopBtn" style="width:100%;padding:12px;margin-bottom:10px;font-size:16px;">⏹ STOP</button>
    <div id="output" style="margin-top:10px;font-size:18px;">Idle</div>
  `;

  document.body.appendChild(panel);

  // --- STRONG AMOUNT DETECTION ---
  function findAmount() {
    // 1️⃣ Try common classes
    const selectors = ["[class*='amount']", "[class*='price']", "[class*='balance']"];
    for (let sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.innerText.trim().length > 0) return el.innerText.trim();
    }

    // 2️⃣ Search for ₹ followed by numbers anywhere
    const text = document.body.innerText;
    const match = text.match(/₹\s?\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?/g);
    if (match && match.length > 0) return match[0];

    return "Not found";
  }

  // --- OBSERVER FOR LIVE UPDATE ---
  let observer = null;

  function startTracking() {
    if (observer) return;

    observer = new MutationObserver(() => {
      const amt = findAmount();
      document.getElementById("output").innerText = "Amount: " + amt;
      console.log("Amount:", amt);
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function stopTracking() {
    if (observer) {
      observer.disconnect();
      observer = null;
      document.getElementById("output").innerText = "Stopped";
    }
  }

  // --- BUTTONS ---
  document.getElementById("startBtn").onclick = startTracking;
  document.getElementById("stopBtn").onclick = stopTracking;

})();