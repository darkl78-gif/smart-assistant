alert("🔥 SCRIPT RUNNING");

(async function () {

  // ✅ Run only on arbpay
  if (!location.hostname.includes("arbpay.me")) {
    alert("❌ Wrong site");
    return;
  }

  // 👤 UID system
  let UID = localStorage.getItem("arb_uid");
  if (!UID) {
    UID = prompt("Enter UID");
    localStorage.setItem("arb_uid", UID);
  }

  // 🔐 Access control
  const res = await fetch("https://raw.githubusercontent.com/darkl78-gif/smart-assistant/main/users.json?" + Date.now());
  const users = await res.json();

  if (!users.includes(UID)) {
    alert("❌ Access Denied");
    return;
  }

  alert("✅ Access Granted");

  // ❌ Remove old panel if exists
  document.getElementById("arb_panel")?.remove();

  // 🎛️ Create UI panel
  const panel = document.createElement("div");
  panel.id = "arb_panel";
  panel.style = `
    position:fixed;
    top:80px;
    right:20px;
    width:260px;
    background:#000;
    color:#0f0;
    padding:15px;
    z-index:999999;
    border-radius:10px;
    font-size:16px;
  `;

  panel.innerHTML = `
    <div style="font-weight:bold;margin-bottom:10px;">Arbpay Tool</div>
    <button id="startBtn" style="width:100%;padding:10px;margin-bottom:8px;">START</button>
    <button id="stopBtn" style="width:100%;padding:10px;">STOP</button>
    <div id="output" style="margin-top:10px;">Idle</div>
  `;

  document.body.appendChild(panel);

  // 🔍 SMART AMOUNT FINDER
  function findAmount() {
    let el =
      document.querySelector("[class*='amount']") ||
      document.querySelector("[class*='price']") ||
      document.querySelector("[class*='balance']");

    if (el && el.innerText.trim().length > 0) {
      return el.innerText.trim();
    }

    // 🔥 fallback (scan whole page)
    const text = document.body.innerText;
    const match = text.match(/₹\s?\d+[.,]?\d*/);

    if (match) return match[0];

    return "Not found";
  }

  // ⚡ OBSERVER (auto detect changes)
  let observer = null;

  function startTracking() {
    if (observer) return;

    observer = new MutationObserver(() => {
      const amt = findAmount();
      document.getElementById("output").innerText = "Amount: " + amt;
      console.log("Amount:", amt);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function stopTracking() {
    if (observer) {
      observer.disconnect();
      observer = null;
      document.getElementById("output").innerText = "Stopped";
    }
  }

  // 🎯 BUTTONS
  document.getElementById("startBtn").onclick = startTracking;
  document.getElementById("stopBtn").onclick = stopTracking;

})();