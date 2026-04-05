function scan() {
    let val = parseInt(document.getElementById("amt").value);

    document.querySelectorAll("div").forEach(e => {
        let text = e.innerText;

        if (!text) return;

        let match = text.match(/₹\s?(\d+)/);
        if (!match) return;

        let price = parseInt(match[1]);

        if (price === val) {
            let btn = e.querySelector("button");

            if (btn && btn.innerText.toLowerCase().includes("buy")) {
                e.style.border = "2px solid red";

                // 🔥 auto click
                btn.click();

                console.log("Clicked:", price);
            }
        }
    });
}