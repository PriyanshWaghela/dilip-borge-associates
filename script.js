const services = [
  ["business", "GST Registration", "Tax-ready registration support with document checklist.", "", "badge-indian-rupee"],
  ["business", "GST Return Filing", "Monthly, quarterly and annual return preparation.", "", "receipt"],
  ["business", "Income Tax Return Filing", "ITR filing for individuals, professionals and businesses.", "", "landmark"],
  ["business", "TDS Services", "TDS calculation, return filing and compliance checks.", "", "percent"],
  ["business", "MSME Registration", "Udyam registration and advisory documentation.", "", "building-2"],
  ["business", "Company Compliance", "Annual filings, registers, governance and reminders.", "", "briefcase-business"],
  ["business", "LLP Compliance", "LLP annual filing and partner compliance support.", "", "folder-check"],
  ["business", "Partnership Deed", "Drafting and coordination for business partnerships.", "", "handshake"],
  ["business", "Trademark Coordination", "Search, filing coordination and response support.", "", "badge-check"],
  ["business", "Audit Services", "Audit support, working papers and compliance coordination.", "", "clipboard-check"],
  ["business", "Bookkeeping Services", "Day-to-day books, ledger maintenance, reconciliations and MIS reports.", "", "book-open-check"],
  ["legal", "Agreements", "Business, service, vendor and personal agreements.", "", "file-pen-line"],
  ["legal", "Affidavits", "Drafting and notary-ready affidavit preparation.", "", "file-text"],
  ["legal", "Rent Agreements", "Rental agreement drafting and execution support.", "", "home"],
  ["legal", "Legal Notices", "Careful notice drafting and dispatch coordination.", "", "mail-warning"],
  ["legal", "Power of Attorney", "General and specific POA documentation.", "", "key-round"],
  ["legal", "Registered Sale Deed", "Sale deed drafting and registration coordination.", "", "scroll-text"],
  ["legal", "Adoption Deed", "Sensitive deed drafting and documentation support.", "", "heart-handshake"],
  ["legal", "Gift Deed", "Property and asset transfer deed drafting.", "", "gift"],
  ["legal", "Will Documentation", "Will drafting with clarity and confidentiality.", "", "file-lock-2"],
  ["legal", "Marriage Registration", "Documentation support for registration process.", "", "badge-check"],
  ["legal", "Trust Deed", "Trust formation deed and compliance coordination.", "", "landmark"],
  ["legal", "Mortgage Deed", "Mortgage documentation and review support.", "", "file-key-2"],
  ["legal", "Property Documentation", "Property document drafting and checklist review.", "", "folder-open"],
  ["legal", "Title Clearance", "Title document review and clearance coordination.", "", "shield-check"],
  ["notary", "Urgent Notarization", "Fast-track notarization for complete documents.", "", "stamp"],
  ["notary", "Document Authentication", "Identity and document authentication support.", "", "fingerprint"],
  ["notary", "Business Agreement Notarization", "Notary support for commercial agreements.", "", "badge-check"],
  ["litigation", "GST Notices", "Notice review, reply drafting and representation support.", "", "mail-warning"],
  ["litigation", "Income Tax Scrutiny", "Scrutiny response preparation and documentation.", "", "search-check"],
  ["litigation", "Civil Matters", "Case preparation and representation coordination.", "", "scale"],
  ["litigation", "Criminal Matters", "Confidential legal coordination and case support.", "", "shield-alert"],
  ["litigation", "Family Matters", "Sensitive representation support and documentation.", "", "users"],
  ["litigation", "Section 138 Recovery Matters", "Cheque dishonor recovery process support.", "", "badge-dollar-sign"],
  ["litigation", "Mortgage Matters", "Mortgage documentation and representation.", "", "file-key-2"]
];

const resources = [
  ["GST", "Monthly return hygiene for growing businesses", "Practical checks before filing GSTR returns.", "Reconcile outward supplies, input tax credit, e-way bills and payment ledgers before the due date."],
  ["Tax", "Income tax scrutiny readiness checklist", "Keep statements, proofs and explanations aligned.", "Maintain a clean trail of bank statements, tax credit statements, invoices and capital transaction notes."],
  ["Legal", "Agreement clauses founders should not ignore", "Drafting details that protect future decisions.", "Termination, jurisdiction, confidentiality, payment terms and indemnity clauses deserve careful review."],
  ["Compliance", "Annual compliance calendar for LLPs", "Deadlines, filings and internal reminders.", "A simple compliance calendar helps avoid late fees and governance gaps across annual filings."],
  ["Business", "MSME registration benefits explained", "When registration helps and what records matter.", "MSME registration can help eligible businesses access schemes, delayed payment protections and credibility."],
  ["Notary", "Preparing documents for urgent notarization", "Identity proofs, originals and attestation flow.", "Carry originals, identity proof, supporting copies and authorization documents to avoid repeat visits."]
];

const calculatorConfigs = {
  gst: {
    fields: [["amount", "Amount", 10000], ["rate", "GST Rate %", 18]],
    note: "GST amount and total value estimate.",
    calculate: ({ amount, rate }) => ({ value: amount * rate / 100, note: `Total with GST: ${formatMoney(amount + amount * rate / 100)}` })
  },
  tax: {
    fields: [["income", "Annual Income", 900000], ["deductions", "Deductions", 150000]],
    note: "Simplified slab preview for planning only.",
    calculate: ({ income, deductions }) => {
      const taxable = Math.max(income - deductions, 0);
      let tax = 0;
      if (taxable > 1000000) tax = (taxable - 1000000) * .3 + 112500;
      else if (taxable > 500000) tax = (taxable - 500000) * .2 + 12500;
      else if (taxable > 250000) tax = (taxable - 250000) * .05;
      return { value: tax, note: `Approx. taxable income: ${formatMoney(taxable)}` };
    }
  },
  tds: {
    fields: [["payment", "Payment Amount", 50000], ["rate", "TDS Rate %", 10]],
    note: "TDS deduction and net payable estimate.",
    calculate: ({ payment, rate }) => ({ value: payment * rate / 100, note: `Net payable: ${formatMoney(payment - payment * rate / 100)}` })
  },
  emi: {
    fields: [["principal", "Loan Amount", 800000], ["rate", "Interest %", 9], ["months", "Tenure Months", 60]],
    note: "Monthly EMI estimate.",
    calculate: ({ principal, rate, months }) => {
      const monthly = rate / 100 / 12;
      const emi = monthly ? principal * monthly * Math.pow(1 + monthly, months) / (Math.pow(1 + monthly, months) - 1) : principal / months;
      return { value: emi, note: `Total payable: ${formatMoney(emi * months)}` };
    }
  },
  loan: {
    fields: [["principal", "Principal", 500000], ["rate", "Interest %", 10], ["years", "Years", 5]],
    note: "Simple interest planning estimate.",
    calculate: ({ principal, rate, years }) => {
      const interest = principal * rate * years / 100;
      return { value: interest, note: `Total amount: ${formatMoney(principal + interest)}` };
    }
  },
  stamp: {
    fields: [["property", "Property Value", 5000000], ["rate", "Stamp Duty %", 6]],
    note: "Stamp duty estimate based on provided rate.",
    calculate: ({ property, rate }) => ({ value: property * rate / 100, note: `Document value: ${formatMoney(property)}` })
  }
};

const storage = {
  get(key) {
    try { return window.localStorage?.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { window.localStorage?.setItem(key, value); } catch {}
  }
};

const grid = document.querySelector("#serviceGrid");
const serviceSearch = document.querySelector("#serviceSearch");
const filters = document.querySelector("#serviceFilters");
let activeFilter = "all";
let bookingStep = 0;
let selectedSlot = "12:30 PM";
let selectedCalculator = "gst";

function formatMoney(value) {
  const rounded = Math.max(Number(value) || 0, 0);
  return `Rs. ${Math.round(rounded).toLocaleString("en-IN")}`;
}

function icon(name) {
  return `<i data-lucide="${name}"></i>`;
}

function toast(message) {
  const node = document.querySelector("#toast");
  if (!node) return;
  node.textContent = message;
  node.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => node.classList.remove("show"), 3000);
}

function refreshIcons() {
  window.lucide?.createIcons();
}

function renderServices() {
  if (!grid) return;
  const query = (serviceSearch?.value || "").toLowerCase();
  grid.innerHTML = services
    .filter(([cat, title, desc]) => (activeFilter === "all" || cat === activeFilter) && `${title} ${desc}`.toLowerCase().includes(query))
    .map(([cat, title, desc, iconName]) => `
      <article class="service-card" data-category="${cat}">
        <div class="icon-wrap">${icon(iconName)}</div>
        <h3>${title}</h3>
        <p>${desc}</p>
        <details>
          <summary>View scope</summary>
          <p>Includes consultation, document checklist, execution timeline and portal-ready status tracking.</p>
        </details>
        <button class="btn btn-secondary service-book" type="button" data-service="${title}">Book this service</button>
      </article>
    `).join("");
  refreshIcons();
}

function setBookingService(serviceName) {
  const select = document.querySelector("#bookingService");
  if (!select) {
    storage.set("dba-selected-service", serviceName);
    window.location.href = "consultation.html";
    return;
  }
  const match = [...select.options].find((option) => serviceName.toLowerCase().includes(option.textContent.toLowerCase().split(" ")[0]));
  select.value = match?.value || "Legal Documentation";
  document.querySelector("#consultation")?.scrollIntoView({ behavior: "smooth", block: "start" });
  toast(`${serviceName} selected for consultation.`);
}

function renderMiniCalendar() {
  const calendar = document.querySelector("#miniCalendar");
  const dateInput = document.querySelector("#bookingDate");
  if (!calendar || !dateInput) return;
  const today = new Date();
  const days = Array.from({ length: 14 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return date;
  });
  calendar.innerHTML = days.map((date, index) => {
    const value = date.toISOString().slice(0, 10);
    return `<button type="button" class="${index === 0 ? "selected" : ""}" data-date="${value}">${date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</button>`;
  }).join("");
  dateInput.value = days[0].toISOString().slice(0, 10);
}

function updateBookingWizard() {
  if (!document.querySelector("#bookingBack") || !document.querySelector("#bookingNext")) return;
  document.querySelectorAll("[data-panel]").forEach((panel) => panel.classList.toggle("active", Number(panel.dataset.panel) === bookingStep));
  document.querySelectorAll("#bookingProgress [data-step]").forEach((step) => step.classList.toggle("active", Number(step.dataset.step) <= bookingStep));
  document.querySelector("#bookingBack").style.visibility = bookingStep === 0 ? "hidden" : "visible";
  document.querySelector("#bookingNext").textContent = bookingStep === 4 ? "Confirm Appointment" : "Next";
  if (bookingStep === 4) renderBookingSummary();
}

function renderBookingSummary() {
  if (!document.querySelector("#bookingSummary")) return;
  const files = document.querySelector("#bookingFiles")?.files?.length || 0;
  const type = document.querySelector("input[name='type']:checked")?.value || "Online";
  document.querySelector("#bookingSummary").innerHTML = `
    <p><strong>Client:</strong> ${document.querySelector("#bookingName").value || "Not provided"}</p>
    <p><strong>Service:</strong> ${document.querySelector("#bookingService").value}</p>
    <p><strong>Date:</strong> ${document.querySelector("#bookingDate").value || "Today"}</p>
    <p><strong>Time:</strong> ${selectedSlot}</p>
    <p><strong>Type:</strong> ${type}</p>
    <p><strong>Documents:</strong> ${files} file(s) attached</p>
  `;
}

function listFiles(input, targetSelector) {
  const list = document.querySelector(targetSelector);
  if (!list) return;
  list.innerHTML = [...(input.files || [])].map((file) => `<li><span>${file.name}</span><small>${Math.ceil(file.size / 1024)} KB</small></li>`).join("");
}

function renderCalculator() {
  const config = calculatorConfigs[selectedCalculator];
  const fields = document.querySelector("#calculatorFields");
  if (!fields) return;
  fields.innerHTML = config.fields.map(([name, label, value]) => `
    <label>${label}
      <input name="${name}" type="number" min="0" step="any" value="${value}">
    </label>
  `).join("");
  document.querySelector("#calculatorNote").textContent = config.note;
  calculateCurrent();
}

function calculateCurrent() {
  if (!document.querySelector("#calculatorFields")) return;
  const formData = Object.fromEntries([...document.querySelectorAll("#calculatorFields input")].map((input) => [input.name, Number(input.value)]));
  const result = calculatorConfigs[selectedCalculator].calculate(formData);
  document.querySelector("#calculatorResult").textContent = formatMoney(result.value);
  document.querySelector("#calculatorNote").textContent = result.note;
}

function renderResources() {
  if (!document.querySelector("#blog")) return;
  const query = (document.querySelector("#resourceSearch")?.value || "").toLowerCase();
  const active = document.querySelector("#resourceFilters .active")?.dataset.topic || "all";
  document.querySelector("#blog").innerHTML = resources
    .filter(([topic, title, summary]) => (active === "all" || topic === active) && `${topic} ${title} ${summary}`.toLowerCase().includes(query))
    .map(([topic, title, summary], index) => `
      <article>
        <span>${topic}</span>
        <h3>${title}</h3>
        <p>${summary}</p>
        <button class="btn btn-ghost" type="button" data-article="${index}">Read insight</button>
      </article>
    `).join("");
}

function openArticle(index) {
  const [topic, title, summary, body] = resources[index];
  document.querySelector("#articleTopic").textContent = topic;
  document.querySelector("#articleTitle").textContent = title;
  document.querySelector("#articleBody").textContent = `${summary} ${body}`;
  openModal("articleModal");
}

function renderGlobalSearch() {
  const query = (document.querySelector("#globalSearchInput")?.value || "").toLowerCase();
  const results = [
    ...services.map(([, title, desc]) => ({ type: "Service", title, desc, href: "#services" })),
    ...resources.map(([topic, title, desc]) => ({ type: topic, title, desc, href: "#resources" }))
  ].filter((item) => `${item.type} ${item.title} ${item.desc}`.toLowerCase().includes(query || "gst")).slice(0, 8);
  document.querySelector("#globalSearchResults").innerHTML = results.map((item) => `
    <a href="${item.href}" data-close-search>
      <strong>${item.title}</strong>
      <span>${item.type} - ${item.desc}</span>
    </a>
  `).join("");
}

function switchClientTab(tab) {
  document.querySelectorAll("[data-client-tab]").forEach((button) => button.classList.toggle("active", button.dataset.clientTab === tab));
  document.querySelectorAll("[data-client-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.clientPanel === tab || tab === "overview"));
}

function switchAdminTab(tab) {
  document.querySelectorAll("[data-admin-tab]").forEach((button) => button.classList.toggle("active", button.dataset.adminTab === tab));
  toast(`Admin ${tab} view selected.`);
}

function sendChat(message) {
  const text = (message || document.querySelector("#chatInput").value).trim();
  if (!text) return;
  const messages = document.querySelector("#chatMessages");
  messages.insertAdjacentHTML("beforeend", `<p><strong>You:</strong> ${text}</p>`);
  const lower = text.toLowerCase();
  let reply = "A senior advisor can review this in consultation. You can book a slot or upload documents for a faster response.";
  if (lower.includes("gst")) reply = "For GST support, keep PAN, Aadhaar, address proof, bank details, business proof and sales/purchase records ready.";
  if (lower.includes("tax")) reply = "For income tax work, keep Form 16, AIS/TIS, bank statements, investment proofs and capital gain details available.";
  if (lower.includes("book")) reply = "Use the consultation form to select a service, date, slot and meeting type. I can also prefill GST Consultation for you.";
  if (lower.includes("document")) reply = "Upload clear PDF or image files. The portal tracker will show review, approval and missing-item status.";
  messages.insertAdjacentHTML("beforeend", `<p><strong>Assistant:</strong> ${reply}</p>`);
  document.querySelector("#chatInput").value = "";
  messages.scrollTop = messages.scrollHeight;
}

function openModal(id) {
  document.getElementById(id)?.classList.add("open");
  document.getElementById(id)?.setAttribute("aria-hidden", "false");
  if (id === "searchModal") renderGlobalSearch();
}

function closePanel(id) {
  document.getElementById(id)?.classList.remove("open");
  document.getElementById(id)?.setAttribute("aria-hidden", "true");
}

renderServices();
renderMiniCalendar();
updateBookingWizard();
renderCalculator();
renderResources();

const preselectedService = storage.get("dba-selected-service");
if (preselectedService && document.querySelector("#bookingService")) {
  setBookingService(preselectedService);
  storage.set("dba-selected-service", "");
}

serviceSearch?.addEventListener("input", renderServices);
filters?.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  activeFilter = button.dataset.filter;
  filters.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  renderServices();
});
grid?.addEventListener("click", (event) => {
  const button = event.target.closest(".service-book");
  if (button) setBookingService(button.dataset.service);
});

document.querySelector("#themeToggle")?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  storage.set("dba-theme", document.body.classList.contains("dark") ? "dark" : "light");
  toast(document.body.classList.contains("dark") ? "Dark mode enabled." : "Light mode enabled.");
});
if (storage.get("dba-theme") === "dark") document.body.classList.add("dark");

document.querySelector("#mobileMenuBtn")?.addEventListener("click", () => {
  document.querySelector(".site-header").classList.toggle("menu-open");
});

document.querySelector("#miniCalendar")?.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  document.querySelectorAll("#miniCalendar button").forEach((item) => item.classList.remove("selected"));
  button.classList.add("selected");
  document.querySelector("#bookingDate").value = button.dataset.date;
});
document.querySelector("#slotGrid")?.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  selectedSlot = button.dataset.slot;
  document.querySelectorAll("#slotGrid button").forEach((item) => item.classList.remove("selected"));
  button.classList.add("selected");
});
document.querySelector("#bookingBack")?.addEventListener("click", () => {
  bookingStep = Math.max(bookingStep - 1, 0);
  updateBookingWizard();
});
document.querySelector("#bookingNext")?.addEventListener("click", async () => {
  if (bookingStep < 4) {
    bookingStep += 1;
    updateBookingWizard();
    return;
  }
  // Gather booking data
  const data = {
    name: document.querySelector("#bookingName").value,
    email: document.querySelector("#bookingEmail").value,
    service: document.querySelector("#bookingService").value,
    date: document.querySelector("#bookingDate").value || "Today",
    time: selectedSlot,
    type: document.querySelector("input[name='type']:checked")?.value || "Online",
    files: document.querySelector("#bookingFiles").files?.length || 0
  };
  try {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error("Server error");
    const result = await response.json();
    toast(result.message || "Appointment booked and emailed.");
    document.querySelector("#portalAppointment").textContent = `${data.date}, ${data.time}`;
  } catch (err) {
    console.error(err);
    toast("Failed to send appointment email.");
  }
  // Reset wizard
  bookingStep = 0;
  updateBookingWizard();
});
document.querySelector("#bookingFiles")?.addEventListener("change", (event) => listFiles(event.target, "#bookingFileList"));

document.querySelector("#calculatorTabs")?.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  selectedCalculator = button.dataset.calculator;
  document.querySelectorAll("#calculatorTabs button").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  renderCalculator();
});
document.querySelector("#calculatorForm")?.addEventListener("input", calculateCurrent);

document.querySelector("#resourceSearch")?.addEventListener("input", renderResources);
document.querySelector("#resourceFilters")?.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  document.querySelectorAll("#resourceFilters button").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  renderResources();
});
document.querySelector("#blog")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-article]");
  if (button) openArticle(Number(button.dataset.article));
});
document.querySelector("#saveArticleBtn")?.addEventListener("click", () => toast("Insight saved to the client portal."));

document.querySelectorAll("[data-client-tab]").forEach((button) => button.addEventListener("click", () => switchClientTab(button.dataset.clientTab)));
document.querySelectorAll("[data-admin-tab]").forEach((button) => button.addEventListener("click", () => switchAdminTab(button.dataset.adminTab)));
document.querySelector("#payInvoiceBtn")?.addEventListener("click", () => {
  document.querySelector("#paymentHistory").textContent = "Payment received. Receipt DBA-2026-104 is available for download.";
  toast("Payment marked as successful.");
});
document.querySelector("#downloadReportBtn")?.addEventListener("click", () => toast("Report prepared for download."));
document.querySelector("#sendPortalMessage")?.addEventListener("click", () => {
  const input = document.querySelector("#portalMessageInput");
  if (!input.value.trim()) return;
  document.querySelector("#portalMessages").insertAdjacentHTML("beforeend", `<p><strong>You:</strong> ${input.value.trim()}</p>`);
  input.value = "";
  toast("Secure message sent.");
});
document.querySelector("#approveDocBtn")?.addEventListener("click", () => {
  const count = document.querySelector("#approvalCount");
  count.textContent = Math.max(Number(count.textContent) - 1, 0);
  document.querySelector("#activityLog").insertAdjacentHTML("afterbegin", "<li>Document approved and client notified.</li>");
  toast("Document approved.");
});

document.querySelector("#faqSearch")?.addEventListener("input", (event) => {
  const query = event.target.value.toLowerCase();
  document.querySelectorAll(".faq-list details").forEach((item) => {
    item.style.display = item.textContent.toLowerCase().includes(query) ? "" : "none";
  });
});

document.querySelector("#inquiryForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  toast(`Inquiry submitted for ${document.querySelector("#inquiryService").value}.`);
  event.target.reset();
});

document.querySelector("#clientLoginBtn")?.addEventListener("click", () => {
  if (document.querySelector("#loginModal")) openModal("loginModal");
  else window.location.href = "portal.html";
});
document.querySelector("#loginForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  closePanel("loginModal");
  const target = document.querySelector("#loginAdmin").checked ? "#admin-dashboard" : "#client-portal";
  document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  toast(document.querySelector("#loginAdmin").checked ? "Admin workspace unlocked." : "Client portal unlocked.");
});

document.querySelector("#searchBtn")?.addEventListener("click", () => openModal("searchModal"));
document.querySelector("#globalSearchInput")?.addEventListener("input", renderGlobalSearch);
document.querySelector("#globalSearchResults")?.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-search]")) closePanel("searchModal");
});
document.querySelectorAll("[data-open-modal]").forEach((button) => button.addEventListener("click", () => openModal(button.dataset.openModal)));
document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => closePanel(button.dataset.close)));
document.querySelectorAll(".modal").forEach((modal) => modal.addEventListener("click", (event) => {
  if (event.target === modal) closePanel(modal.id);
}));

document.querySelector("#modalUploadInput")?.addEventListener("change", (event) => listFiles(event.target, "#modalFileList"));
document.querySelector("#submitUploadBtn")?.addEventListener("click", () => {
  const count = document.querySelector("#modalUploadInput")?.files?.length || 0;
  closePanel("uploadModal");
  if (count) document.querySelector("#portalDocs")?.insertAdjacentHTML("beforeend", `<li>${count} newly uploaded document(s)</li>`);
  toast(count ? `${count} document(s) submitted for review.` : "Select files before submitting.");
});

document.querySelector("#chatbotBtn")?.addEventListener("click", () => {
  document.querySelector("#chatPanel").classList.toggle("open");
});
document.querySelector("#chatSend")?.addEventListener("click", () => sendChat());
document.querySelector("#chatInput")?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") sendChat();
});
document.querySelector(".quick-prompts")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-prompt]");
  if (button) sendChat(button.dataset.prompt);
});
document.querySelector("#notificationBtn")?.addEventListener("click", () => {
  document.querySelector("#notificationPanel").classList.toggle("open");
});

document.querySelector("#acceptCookies")?.addEventListener("click", () => {
  document.querySelector("#cookieBanner").classList.add("hidden");
  storage.set("dba-cookies", "accepted");
});
if (storage.get("dba-cookies") === "accepted") {
  document.querySelector("#cookieBanner")?.classList.add("hidden");
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      entry.target.querySelectorAll("[data-count]").forEach((counter) => animateCounter(counter));
    }
  });
}, { threshold: .12 });
document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

const animated = new WeakSet();
function animateCounter(counter) {
  if (animated.has(counter)) return;
  animated.add(counter);
  const target = Number(counter.dataset.count);
  const duration = 1600;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    counter.textContent = `${Math.floor(target * progress).toLocaleString("en-IN")}+`;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const testimonials = [...document.querySelectorAll(".testimonial")];
let testimonialIndex = 0;
setInterval(() => {
  testimonials[testimonialIndex]?.classList.remove("active");
  testimonialIndex = (testimonialIndex + 1) % testimonials.length;
  testimonials[testimonialIndex]?.classList.add("active");
}, 3600);

let exitShown = false;
document.addEventListener("mouseleave", (event) => {
  if (!exitShown && event.clientY <= 0 && window.innerWidth > 900) {
    exitShown = true;
    openModal("exitPopup");
  }
});

function hideLoader() {
  setTimeout(() => document.querySelector("#loader")?.classList.add("hidden"), 450);
}

window.addEventListener("load", () => {
  refreshIcons();
  hideLoader();
});

if (document.readyState === "interactive" || document.readyState === "complete") {
  refreshIcons();
  hideLoader();
} else {
  document.addEventListener("DOMContentLoaded", () => {
    refreshIcons();
    hideLoader();
  });
}

setTimeout(hideLoader, 2200);
