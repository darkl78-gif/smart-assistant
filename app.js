alert("🚀 NEW FILE LOADED");

(function () {

  document.getElementById("arb_panel")?.remove();

  const panel = document.createElement("div");
  panel.id = "arb_panel";

  panel.style = `
    position:fixed;
    top:100px;
    left:20px;
    width:300px;
    background:black;
    color:white;
    padding:15px;
    z-index:999999;
    border-radius:10px;
    font-size:18px;
  `;

  panel.innerHTML = `
    <div id="drag" style="cursor:move;font-weight:bold;">DRAG ME</div>
    <input id="amt" placeholder="Enter amount" style="width:100%;margin-top:10px;padding:8px;">
    <button id="go" style="width:100%;margin-top:10px;padding:10px;">CLICK</button>
    <div id="out">Idle</div>
  `;

  document.body.appendChild(panel);

  // TEST BUTTON
  document.getElementById("go").onclick = () => {
    document.getElementById("out").innerText = "Button Working ✅";
  };

  // DRAG FIX
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