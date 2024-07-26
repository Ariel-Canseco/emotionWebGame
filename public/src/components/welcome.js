export function initWelcome() {
  const root = document.getElementById("root");
  root.innerHTML = `
      <div id="welcome">
        <div class="box" data-section="section1">Section 1</div>
        <div class="box" data-section="section2">Section 2</div>
        <div class="box" data-section="section3">Section 3</div>
        <div class="box" data-section="section4">Section 4</div>
      </div>
      <div id="content"></div>
    `;
  document.querySelectorAll(".box").forEach((box) => {
    box.addEventListener("click", function () {
      const section = this.getAttribute("data-section");
      loadSection(section);
    });
  });
}

function loadSection(section) {
  const content = document.getElementById("content");
  let info;
  switch (section) {
    case "section1":
      info = "Information about section 1";
      break;
    case "section2":
      info = "Information about section 2";
      break;
    // Add cases for section3 and section4
    default:
      info = "Default information";
  }
  content.innerHTML = `<h2>${section}</h2><p>${info}</p><button onclick="startGame('${section}')">Start Game</button>`;
}
