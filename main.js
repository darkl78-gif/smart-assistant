(async function () {

  // ✅ Run only on arbpay
  if (!location.hostname.includes("arbpay.me")) {
    alert("❌ This works only on arbpay.me");
    return;
  }

  // 👤 Get UID
  const UID = localStorage.getItem("arb_uid") || prompt("Enter your UID");
  localStorage.setItem("arb_uid", UID);

  // 🔐 Load allowed users
  const res = await fetch("https://raw.githubusercontent.com/darkl78-gif/smart-assistant/main/users.json");
  const users = await res.json();

  if (!users.includes(UID)) {
    alert("❌ Access Denied");
    return;
  }

  alert("✅ Access Granted");

  // 🎛️ Create UI
  const panel = document.createElement("div");
  panel.style = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: black;
    color: lime;
    padding: 10px;
    z-index: 99999;
    border-radius: 8px;
  `;

  panel.innerHTML = `
    <div>Arbpay Tool</div>
    <button id="startBtn">Start</button>
    <button id="stopBtn">Stop</button>
    <div id="output">Idle</div>
  `;

  document.body.appendChild(panel);

  let interval = null;

  function findAmount() {
    const el =
      document.querySelector(".amount") ||
      document.querySelector(".price") ||
      document.querySelector("[class*='amount']");

    return el ? el.innerText : "Not found";
  }

  document.getElementById("startBtn").onclick = () => {
    if (interval) return;

    interval = setInterval(() => {
      const amt = findAmount();
      document.getElementById("output").innerText = "Amount: " + amt;
      console.log("Amount:", amt);
    }, 2000);
  };

  document.getElementById("stopBtn").onclick = () => {
    clearInterval(interval);
    interval = null;
    document.getElementById("output").innerText = "Stopped";
  };

})();