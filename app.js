alert("🚀 FINAL WORKING VERSION");

(function () {

  // remove old panel
  document.getElementById("arb_panel")?.remove();

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
    font-size:18px;
    box-shadow:0 0 10px #000;
  `;

  panel.innerHTML = `
    <div id="drag" style="cursor:move;font-weight:bold;margin-bottom:10px;">
      Arb Auto Tool
    </div>

    <input id="amt" placeholder="Enter amount (e.g. 1000)" 
      style="width:100%;padding:10px;margin-bottom:10px;font-size:16px;">

    <button id="go" style="width:100%;padding:10px;margin-bottom:10px;">
      🔍 SEARCH & CLICK
    </button>

    <button id="startAuto" style="width:100%;padding:10px;margin-bottom:10px;">
      ⚡ AUTO START
    </button>

    <button id="stopAuto" style="width:100%;padding:10px;">
      ⛔ STOP
    </button>

    <div id="out" style="margin-top:10px;">Idle</div>
  `;

  document.body.appendChild(panel);

  const out = document.getElementById("out");

  // ===== CORE LOGIC =====
  function findAndClick(amount) {

    const target = amount.replace(/[^0-9]/g, "");

    const all = document.querySelectorAll("div,button,span");

    for (let el of all) {

      if (!el.innerText) continue;

      const text = el.innerText.replace(/[^0-9]/g, "");
      if (!text) continue;

      if (text.includes(target)) {

        let clickable = el;

        for (let i = 0; i < 5; i++) {
          if (!clickable) break;

          const style = window.getComputedStyle(clickable);

          if (
            clickable.tagName === "BUTTON" ||
            clickable.onclick ||
            clickable.getAttribute("role") === "button" ||
            style.cursor === "pointer"
          ) break;

          clickable = clickable.parentElement;
        }

        if (clickable) {
          clickable.scrollIntoView({behavior:"smooth", block:"center"});
          clickable.style.outline = "3px solid red";

          setTimeout(() => clickable.style.outline = "", 1500);

          clickable.click();
          return true;
        }
      }
    }

    return false;
  }

  // ===== BUTTON CLICK =====
  document.getElementById("go").onclick = () => {
    const val = document.getElementById("amt").value.trim();

    if (!val) {
      out.innerText = "❌ Enter amount";
      return;
    }

    const ok = findAndClick(val);
    out.innerText = ok ? "✅ Clicked " + val : "❌ Not found";
  };

  // ===== AUTO OBSERVER =====
  let observer = null;

  document.getElementById("startAuto").onclick = () => {
    const val = document.getElementById("amt").value.trim();

    if (!val) {
      out.innerText = "❌ Enter amount first";
      return;
    }

    if (observer) return;

    observer = new MutationObserver(() => {
      const ok = findAndClick(val);
      if (ok) out.innerText = "⚡ Auto clicked " + val;
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    out.innerText = "⚡ Auto started";
  };

  document.getElementById("stopAuto").onclick = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
      out.innerText = "⛔ Stopped";
    }
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