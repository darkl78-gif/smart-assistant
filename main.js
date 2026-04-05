alert("🔥 FINAL VERSION RUNNING");

(async function () {

  if (!location.href.includes("/buy/arb")) {
    alert("❌ Open BUY ARB page first");
    return;
  }

  // UID
  let UID = localStorage.getItem("arb_uid");
  if (!UID) {
    UID = prompt("Enter UID");
    localStorage.setItem("arb_uid", UID);
  }

  const res = await fetch("https://raw.githubusercontent.com/darkl78-gif/smart-assistant/main/users.json?" + Date.now());
  const users = await res.json();

  if (!users.includes(UID)) {
    alert("❌ Access Denied");
    return;
  }

  alert("✅ Access Granted");

  // Remove old UI
  document.getElementById("arb_panel")?.remove();

  // UI
  const panel = document.createElement("div");
  panel.id = "arb_panel";
  panel.style = `
    position:fixed;
    top:600px;
    right:200px;
    width:800px;
    background:#111;
    color:#0f0;
    padding:15px;
    z-index:999999;
    border-radius:10px;
    font-size:18px;
  `;

  panel.innerHTML = `
    <div id="drag" style="font-weight:bold;margin-bottom:10px;cursor:move;">
      Arb Auto Click
    </div>
    <input id="amt" placeholder="Enter amount (e.g. 1000)" 
      style="width:100%;padding:10px;margin-bottom:10px;">
    <button id="go" style="width:100%;padding:10px;">SEARCH & CLICK</button>
    <div id="out" style="margin-top:10px;">Idle</div>
  `;

  document.body.appendChild(panel);

  const out = document.getElementById("out");

  // 🔥 CORE LOGIC (REAL FIX)
  function findAndClick(amount) {

    const all = document.querySelectorAll("div,button,span");

    for (let el of all) {

      if (!el.innerText) continue;

      if (el.innerText.includes(amount)) {

        // go up to clickable parent
        let clickable = el;

        for (let i = 0; i < 3; i++) {
          if (clickable.onclick || clickable.role === "button") break;
          clickable = clickable.parentElement;
          if (!clickable) break;
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

  // BUTTON
  document.getElementById("go").onclick = () => {
    const val = document.getElementById("amt").value.trim();

    if (!val) {
      out.innerText = "❌ Enter amount";
      return;
    }

    const ok = findAndClick(val);

    out.innerText = ok ? "✅ Clicked " + val : "❌ Not found";
  };

  // 🔥 DRAG
  let isDrag = false, x, y;

  document.getElementById("drag").onmousedown = e => {
    isDrag = true;
    x = e.clientX - panel.offsetLeft;
    y = e.clientY - panel.offsetTop;
  };

  document.onmousemove = e => {
    if (!isDrag) return;
    panel.style.left = e.clientX - x + "px";
    panel.style.top = e.clientY - y + "px";
  };

  document.onmouseup = () => isDrag = false;

})();