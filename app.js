// app.js
let PAGE_SIZE_DEFAULT = 10;
let pageSize = PAGE_SIZE_DEFAULT;
let currentPage = 1;
let activeSource = "both"; // "powerpoint", "word", or "both"
let masterQuestions = [];
const selections = new Map(); // key: "source::index" -> selected option

// Ensure the two source arrays exist
if (typeof QUESTIONS_POWERPOINT === "undefined") window.QUESTIONS_POWERPOINT = [];
if (typeof QUESTIONS_WORD === "undefined") window.QUESTIONS_WORD = [];
if (typeof QUESTIONS_FUNDAMENTALS === "undefined") window.QUESTIONS_FUNDAMENTALS = [];
if (typeof QUESTIONS_EXCEL === "undefined") window.QUESTIONS_EXCEL = [];
if (typeof QUESTIONS_SUDURPASCHIM === "undefined") window.QUESTIONS_SUDURPASCHIM = [];
if (typeof QUESTIONS_DATABASE === "undefined") window.QUESTIONS_DATABASE = [];
if (typeof QUESTIONS_OS === "undefined") window.QUESTIONS_OS = [];
if (typeof QUESTIONS_WEB === "undefined") window.QUESTIONS_WEB = [];
if (typeof QUESTIONS_CN === "undefined") window.QUESTIONS_CN = [];
if (typeof QUESTIONS_CYBER_SECURITY === "undefined") window.QUESTIONS_CYBER_SECURITY = [];
if (typeof QUESTIONS_HARDWARE_MAINTENANCE === "undefined") window.QUESTIONS_HARDWARE_MAINTENANCE = [];
if (typeof QUESTIONS_RULES_AND_RELIGATIONS === "undefined") window.QUESTIONS_RULES_AND_RELIGATIONS = [];
if (typeof QUESTIONS_SHORTCUTKEY.map ==="undefined") window.QUESTIONS_SHORTCUTKEY = [];



// Build masterQuestions based on activeSource
function buildMaster() {
  if (activeSource === "fundamentals") {
  masterQuestions = QUESTIONS_FUNDAMENTALS.map((q, i) => ({ ...q, __src: " Computer Fundamentals", __srcIndex: i }));
  } else if (activeSource === "powerpoint") {
    masterQuestions = QUESTIONS_POWERPOINT.map((q, i) => ({ ...q, __src: "powerpoint", __srcIndex: i }));
  } else if (activeSource === "msexcel") {
    masterQuestions = QUESTIONS_EXCEL.map((q, i) => ({ ...q, __src: "Excel", __srcIndex: i }));
  } else if (activeSource === "SDP") {
    masterQuestions = QUESTIONS_SUDURPASCHIM.map((q, i) => ({ ...q, __src: "Sudurpaschim", __srcIndex: i }));
  } else if (activeSource === "Database") {
    masterQuestions = QUESTIONS_DATABASE.map((q, i) => ({ ...q, __src: "Database System", __srcIndex: i }));
  } else if (activeSource === "OS") {
    masterQuestions = QUESTIONS_OS.map((q, i) => ({ ...q, __src: "OS", __srcIndex: i }));
  } else if (activeSource === "webdesign") {
    masterQuestions = QUESTIONS_WEB.map((q, i) => ({ ...q, __src: "Web Designing", __srcIndex: i }));
  } else if (activeSource === "Networking") {
    masterQuestions = QUESTIONS_CN.map((q, i) => ({ ...q, __src: "Computer Network", __srcIndex: i }));
  } else if (activeSource === "Security") {
    masterQuestions = QUESTIONS_CYBER_SECURITY.map((q, i) => ({ ...q, __src: "Cyber Security", __srcIndex: i }));
  } else if (activeSource === "Maintenance") {
    masterQuestions = QUESTIONS_HARDWARE_MAINTENANCE.map((q, i) => ({ ...q, __src: "Hardware Maintenance", __srcIndex: i }));
  } else if (activeSource === "Legislations") {
    masterQuestions = QUESTIONS_RULES_AND_RELIGATIONS.map((q, i) => ({ ...q, __src: "Relevant Legislations", __srcIndex: i }));
  } else if (activeSource === "shortcutkey") {
    masterQuestions = QUESTIONS_SHORTCUTKEY.map((q, i) => ({ ...q, __src: "Shortcut Keys", __srcIndex: i }));
  else if (activeSource === "msword") {
    masterQuestions = QUESTIONS_WORD.map((q, i) => ({ ...q, __src: "MS Word", __srcIndex: i }));
  } else { // both
    // keep source identity and ensure stable ordering: powerpoint then word
    masterQuestions = [
      ...QUESTIONS_FUNDAMENTALS.map((q,i) => ({...q, __src: "fundamentals", __srcIndex: i})),
      ...QUESTIONS_OS.map((q,i) => ({...q, __src: "OS", __srcIndex: i})),
      ...QUESTIONS_WORD.map((q, i) => ({ ...q, __src: "MS Word", __srcIndex: i })),
      ...QUESTIONS_EXCEL.map((q,i) => ({...q, __src: "Excel", __srcIndex: i})),
      ...QUESTIONS_POWERPOINT.map((q, i) => ({ ...q, __src: "powerpoint", __srcIndex: i })),
      ...QUESTIONS_DATABASE.map((q,i) => ({...q, __src: "Database System", __srcIndex: i})),
      ...QUESTIONS_SHORTCUTKEY.map((q, i) => ({...q, __src: "Shortcut Keys", __srcIndex: i})),
      ...QUESTIONS_WEB.map((q,i) => ({...q, __src: "Web Designing", __srcIndex: i})),
      ...QUESTIONS_CN.map((q,i) => ({...q, __src: "Computer Network", __srcIndex: i})),
      ...QUESTIONS_CYBER_SECURITY.map((q,i) => ({...q, __src: "Cyber Security", __srcIndex: i})),
      ...QUESTIONS_HARDWARE_MAINTENANCE.map((q,i) => ({...q, __src: "Hardware Maintenance", __srcIndex: i})),
      ...QUESTIONS_RULES_AND_RELIGATIONS.map((q,i) => ({...q, __src: "Relevant Legislations", __srcIndex: i}))
    ];
    pageSize = 20;
  }
  const sel = document.getElementById("pageSizeSelect");
  if (sel) sel.value = String(pageSize);
  currentPage = 1;
}

// Helpers
function sliceForPage(list, page, size) {
  const start = (page - 1) * size;
  return list.slice(start, start + size);
}

function goToTopInstant() {
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}
function goToTopSmooth() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateNavButtons() {
  const total = Math.ceil(masterQuestions.length / pageSize);
  document.getElementById("prevBtn").disabled = currentPage <= 1;
  document.getElementById("nextBtn").disabled = currentPage >= total;
  document.getElementById("jumpBack5").disabled = currentPage <= 5;
  document.getElementById("jumpBack10").disabled = currentPage <= 10;
  document.getElementById("jumpForward5").disabled = currentPage + 5 > total;
  document.getElementById("jumpForward10").disabled = currentPage + 10 > total;
}

function updateProgress() {
  const totalPages = Math.max(1, Math.ceil(masterQuestions.length / pageSize));
  const pct = Math.round((currentPage / totalPages) * 100);
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressLabel');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = `Page ${currentPage} / ${totalPages}`;
}

function renderPage() {
  const grid = document.getElementById("questionGrid");
  grid.innerHTML = "";

  const totalPages = Math.max(1, Math.ceil(masterQuestions.length / pageSize));
  if (currentPage > totalPages) currentPage = totalPages;

  const paged = sliceForPage(masterQuestions, currentPage, pageSize);

  document.getElementById("pageInfo").textContent = `Page ${currentPage} / ${totalPages}`;

  let correctCount = 0;

  paged.forEach((q, i) => {
    const absoluteId = `${q.__src}::${q.__srcIndex}`;
    const selected = selections.get(absoluteId);

    const card = document.createElement("div");
    card.className = "card";

    const title = document.createElement("div");
    title.className = "q-title";
    title.textContent = `Q${(currentPage - 1) * pageSize + i + 1}: ${q.question}`;

    const meta = document.createElement("div");
    meta.className = "q-meta";
    meta.textContent = q.__src ? `Source: ${q.__src}` : "";

    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.appendChild(title);
    header.appendChild(meta);

    card.appendChild(header);

    const opts = document.createElement("div");
    opts.className = "options";

    q.options.forEach(opt => {
      const label = document.createElement("label");
      label.className = "option";

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = `q-${absoluteId}`;
      radio.value = opt;
      radio.checked = selected === opt;

      radio.addEventListener("change", () => {
        selections.set(absoluteId, opt);
        // Re-render to show correctness but do NOT scroll
        renderPage();
        // keep focus on the question grid for accessibility
        grid.focus({ preventScroll: true });
      });

      const span = document.createElement("span");
      span.textContent = opt;

      label.appendChild(radio);
      label.appendChild(span);

      if (selected) {
        if (opt === q.answer) label.classList.add("correct");
        else if (opt === selected && opt !== q.answer) label.classList.add("wrong");
      }

      opts.appendChild(label);
    });

    card.appendChild(opts);

    if (selected) {
      const reason = document.createElement("div");
      reason.className = "answer-reason";
      const isCorrect = selected === q.answer;
      reason.innerHTML = (isCorrect ? `<strong style="color:#16a34a">Correct.</strong> ` : `<strong style="color:#ef4444">Incorrect.</strong> `)
        + (q.reason || "");
      card.appendChild(reason);
      if (isCorrect) correctCount++;
    }

    grid.appendChild(card);
  });

  document.getElementById("scoreInfo").textContent = `Score: ${correctCount} / ${paged.length}`;

  updateNavButtons();
  updateProgress();
}

// UI bindings
document.addEventListener("DOMContentLoaded", () => {
  // Source buttons
  document.querySelectorAll(".src-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      // if already active, do nothing
      if (btn.classList.contains("active")) return;

      document.querySelectorAll(".src-btn").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      activeSource = btn.dataset.src;
      buildMaster();
      renderPage();
      goToTopSmooth();
    });

    // keyboard accessibility: Enter/Space triggers click
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Page size select
  document.getElementById("pageSizeSelect").addEventListener("change", (e) => {
    pageSize = parseInt(e.target.value, 10) || PAGE_SIZE_DEFAULT;
    currentPage = 1;
    renderPage();
    goToTopSmooth();
  });

  // Prev / Next
  document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentPage > 1) { currentPage--; renderPage(); goToTopSmooth(); }
  });
  document.getElementById("nextBtn").addEventListener("click", () => {
    const totalPages = Math.ceil(masterQuestions.length / pageSize);
    if (currentPage < totalPages) { currentPage++; renderPage(); goToTopSmooth(); }
  });

  // Jump buttons
  document.getElementById("jumpBack5").addEventListener("click", () => {
    currentPage = Math.max(1, currentPage - 5);
    renderPage();
    goToTopSmooth();
  });
  document.getElementById("jumpBack10").addEventListener("click", () => {
    currentPage = Math.max(1, currentPage - 10);
    renderPage();
    goToTopSmooth();
  });
  document.getElementById("jumpForward5").addEventListener("click", () => {
    const total = Math.ceil(masterQuestions.length / pageSize);
    currentPage = Math.min(total, currentPage + 5);
    renderPage();
    goToTopSmooth();
  });
  document.getElementById("jumpForward10").addEventListener("click", () => {
    const total = Math.ceil(masterQuestions.length / pageSize);
    currentPage = Math.min(total, currentPage + 10);
    renderPage();
    goToTopSmooth();
  });

  // Shuffle current masterQuestions
  document.getElementById("shuffleBtn").addEventListener("click", () => {
    for (let i = masterQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [masterQuestions[i], masterQuestions[j]] = [masterQuestions[j], masterQuestions[i]];
    }
    currentPage = 1;
    renderPage();
    goToTopSmooth();
  });

  // Reset selections on visible page
  document.getElementById("resetBtn").addEventListener("click", () => {
    const paged = sliceForPage(masterQuestions, currentPage, pageSize);
    paged.forEach(q => {
      const absoluteId = `${q.__src}::${q.__srcIndex}`;
      selections.delete(absoluteId);
    });
    renderPage();
    // do not scroll on reset
  });

  // Initialize with default source and ensure top-of-page on load
  buildMaster();
  renderPage();
  goToTopInstant();

});
