alert("🚀 NETWORK BOT ACTIVE");

(function () {

  document.getElementById("arb_panel")?.remove();

  let targetAmount = null;
  let lastData = null;

  // ===== UI =====
  const panel = document.createElement("div");
  panel.id = "arb_panel";

  panel.style = `
    position:fixed;
    top:100px;
    left:20px;
    width:320px;
    background:#000;
    color:#0f0;
    padding:15px;
    z-index:999999;
    border-radius:10px;
  `;

  panel.innerHTML = `
    <div id="drag" style="cursor:move;font-weight:bold;margin-bottom:10px;">
      Network Finder
    </div>

    <input id="amt" placeholder="Enter amount (e.g. 1000)"
      style="width:100%;padding:10px;margin-bottom:10px;">

    <button id="start" style="width:100%;padding:10px;margin-bottom:10px;">
      ▶ START
    </button>

    <div id="out">Idle</div>
  `;

  document.body.appendChild(panel);

  const out = document.getElementById("out");

  // ===== CLICK FUNCTION =====
  function clickByIndex(index) {
    const offers = document.querySelectorAll("button, div[role='button']");
    if (offers[index]) {
      offers[index].scrollIntoView({behavior:"smooth", block:"center"});
      offers[index].style.outline = "3px solid red";
      setTimeout(() => offers[index].style.outline = "", 1500);
      offers[index].click();
      return true;
    }
    return false;
  }

  // ===== PROCESS API DATA =====
  function processData(data) {
    if (!targetAmount) return;

    try {
      let list = data.data || data.list || data.orders || [];

      for (let i = 0; i < list.length; i++) {
        let amt = list[i].amount || list[i].price || list[i].value;

        if (!amt) continue;

        if (String(amt).includes(targetAmount)) {
          out.innerText = "✅ Found in API → clicking...";
          clickByIndex(i);
          return;
        }
      }

      out.innerText = "🔄 Searching in API...";
    } catch (e) {}
  }

  // ===== HOOK FETCH =====
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const res = await originalFetch(...args);

    try {
      const clone = res.clone();
      const json = await clone.json();

      processData(json);
    } catch (e) {}

    return res;
  };

  // ===== HOOK XHR =====
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    this.addEventListener("load", function () {
      try {
        const json = JSON.parse(this.responseText);
        processData(json);
      } catch (e) {}
    });
    origOpen.apply(this, arguments);
  };

  // ===== START BUTTON =====
  document.getElementById("start").onclick = () => {
    const val = document.getElementById("amt").value.trim();

    if (!val) {
      out.innerText = "❌ Enter amount";
      return;
    }

    targetAmount = val.replace(/[^0-9]/g, "");
    out.innerText = "🔍 Waiting for API data...";
  };

  // ===== DRAG =====
  let isDown = false, x, y;

  document.getElementById("drag").onmousedown = e => {
    isDown = true;
    x = e.clientX - panel.offsetLeft;
    y = e.clientY - panel.offsetTop;
  };

  document.onmousemove = e => {
    if (!isDown) return;
    panel.style.left = e.clientX - x + "px";
    panel.style.top = e.clientY - y + "px";
  };

  document.onmouseup = () => isDown = false;

})();