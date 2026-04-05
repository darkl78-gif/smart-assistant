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
    width:360px;
    max-height:450px;
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
    <input id="searchAmount" type="text" placeholder="Enter amount to search" style="width:100%;padding:10px;margin-bottom:10px;font-size:16px;">
    <button id="searchBtn" style="width:100%;padding:12px;margin-bottom:10px;font-size:16px;">🔍 SEARCH & CLICK</button>
    <div id="output" style="margin-top:10px;font-size:18px;">Idle</div>
  `;

  document.body.appendChild(panel);

  // --- SEARCH & CLICK FUNCTION ---
  function searchAndClick(amount) {
    let found = false;

    // 1️⃣ scan all elements with text
    const elements = document.querySelectorAll("body *");
    elements.forEach(el => {
      if (el.innerText && el.innerText.trim() === amount) {
        el.click();
        found = true;
      }
    });

    return found;
  }

  // --- BUTTON LOGIC ---
  const searchBtn = document.getElementById("searchBtn");
  const output = document.getElementById("output");
  const input = document.getElementById("searchAmount");

  searchBtn.onclick = () => {
    const val = input.value.trim();
    if (!val) {
      output.innerText = "❌ Enter an amount first";
      return;
    }

    const clicked = searchAndClick(val);
    output.innerText = clicked ? `✅ Found & clicked ${val}` : `❌ ${val} not found`;
  };

})();