const MODAL_KEY = "jconnect_coming_soon_dismissed_v1";

function qs(sel, root=document){ return root.querySelector(sel); }
function qsa(sel, root=document){ return [...root.querySelectorAll(sel)]; }

function getParam(name){
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function stars(rating){
  const full = Math.floor(rating);
  const half = (rating - full) >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}

function slugify(s){
  return (s || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function renderHeader(active){
  const link = (href, label, key) =>
    `<a href="${href}" class="${active===key ? "active" : ""}">${label}</a>`;

  return `
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="index.html" aria-label="Jconnect Home">
        <span class="brand-mark" aria-hidden="true">JC</span>
        <span class="brand-text">
          <strong>Jconnect</strong>
          <small>Find & hire trusted tradies</small>
        </span>
      </a>

      <nav class="nav" aria-label="Primary">
        ${link("how-it-works.html", "How it works", "how")}
        ${link("categories.html", "Categories", "cats")}
        ${link("request.html", "Get quotes", "request")}
        ${link("for-tradies.html", "For tradies", "tradies")}
        ${link("contact.html", "Contact", "contact")}
        <a class="btn btn-primary" href="request.html">Post a job</a>
      </nav>

      <button class="btn btn-outline mobile-toggle" id="mobileToggle" type="button" aria-label="Open menu">
        ☰ Menu
      </button>

      <div class="mobile-drawer" id="mobileDrawer" aria-label="Mobile menu">
        ${link("how-it-works.html", "How it works", "how")}
        ${link("categories.html", "Categories", "cats")}
        ${link("request.html", "Get quotes", "request")}
        ${link("for-tradies.html", "For tradies", "tradies")}
        ${link("contact.html", "Contact", "contact")}
        <a class="btn btn-primary btn-block" href="request.html" style="margin-top:10px;">Post a job</a>
      </div>
    </div>
  </header>`;
}

function renderFooter(){
  return `
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-col">
        <h3>Jconnect</h3>
        <p class="muted">A tradie recommendation & lead marketplace (preview). Find professionals for electrical, AC, plumbing and more.</p>
        <p class="micro muted">
          Email: <a href="mailto:hello@jconnect.example">hello@jconnect.example</a><br/>
          Australia-wide (demo)
        </p>
      </div>

      <div class="footer-col">
        <h4>Explore</h4>
        <ul class="links">
          <li><a href="how-it-works.html">How it works</a></li>
          <li><a href="categories.html">Categories</a></li>
          <li><a href="request.html">Post a job</a></li>
          <li><a href="for-tradies.html">For tradies</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Support</h4>
        <ul class="links">
          <li><a href="contact.html">Contact</a></li>
          <li><a href="terms.html">Terms</a></li>
          <li><a href="privacy.html">Privacy</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Coming soon</h4>
        <ul class="links">
          <li><a href="request.html">Instant quote requests</a></li>
          <li><a href="for-tradies.html">Tradie onboarding</a></li>
          <li><a href="categories.html">More categories</a></li>
        </ul>
      </div>
    </div>

    <div class="container footer-bottom">
      <span>© <span id="year"></span> Jconnect. All rights reserved.</span>
      <span class="muted">Preview Website • Nur Hadi</span>
    </div>
  </footer>`;
}

function injectModal(){
  const mount = qs("#modalMount");
  if(!mount) return;

  mount.innerHTML = `
    <div class="modal-backdrop" id="modalBackdrop" aria-hidden="true"></div>

    <section class="modal" id="comingSoonModal" role="dialog" aria-modal="true"
      aria-labelledby="modalTitle" aria-describedby="modalDesc">
      <div class="modal-header">
        <h2 id="modalTitle" style="margin:0;">Jconnect is coming soon</h2>
        <button class="icon-btn" id="closeModalBtn" aria-label="Close">×</button>
      </div>

      <p id="modalDesc" class="muted" style="margin-top:8px;">
        We’re currently in preview. Join the early access list to get notified when job requests and messaging go live.
      </p>

      <form class="modal-form" id="modalWaitlistForm">
        <label for="modalEmail" style="display:none;">Email</label>
        <input id="modalEmail" type="email" placeholder="Enter your email" required />
        <button class="btn btn-primary" type="submit">Notify me</button>
      </form>

      <div class="modal-actions">
        <button class="btn btn-outline" id="modalLaterBtn" type="button">Maybe later</button>
        <a class="btn btn-outline" href="request.html">Post a job</a>
        <a class="btn btn-outline" href="for-tradies.html">I’m a tradie</a>
      </div>

      <p class="micro muted" style="margin-top:10px;">You can close this anytime.</p>
    </section>
  `;

  const modal = qs("#comingSoonModal");
  const backdrop = qs("#modalBackdrop");
  const closeBtn = qs("#closeModalBtn");
  const laterBtn = qs("#modalLaterBtn");

  const open = () => {
    modal.style.display = "block";
    backdrop.style.display = "block";
    backdrop.setAttribute("aria-hidden","false");
  };
  const close = () => {
    modal.style.display = "none";
    backdrop.style.display = "none";
    backdrop.setAttribute("aria-hidden","true");
    localStorage.setItem(MODAL_KEY, "1");
  };

  backdrop.addEventListener("click", close);
  closeBtn.addEventListener("click", close);
  laterBtn.addEventListener("click", close);

  qs("#modalWaitlistForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = (qs("#modalEmail").value || "").trim();
    alert(`Thanks! We'll notify you at: ${email}\n\n(Preview demo — connect this to your backend later.)`);
    close();
  });

  const dismissed = localStorage.getItem(MODAL_KEY);
  if(!dismissed) open();
}

function renderTradieCard(t){
  const tradeSlug = slugify(t.trade);
  return `
    <article class="listing" role="listitem">
      <div class="listing-top">
        <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
          <span class="badge">${t.trade}</span>
          ${t.verified ? `<span class="pill">✅ Verified</span>` : `<span class="pill">Unverified</span>`}
          <span class="pill">📍 ${t.areas.slice(0,2).join(", ")}${t.areas.length>2 ? "…" : ""}</span>
        </div>

        <h3><a href="tradie.html?id=${encodeURIComponent(t.id)}">${t.name}</a></h3>
        <p class="meta">${t.response} • Hours: ${t.hours}</p>
        <p class="stars">${stars(t.rating)} <span class="muted">(${t.rating.toFixed(1)} • ${t.reviews} reviews)</span></p>
        <p class="meta muted">Services: ${t.services.slice(0,3).join(", ")}${t.services.length>3 ? "…" : ""}</p>
      </div>

      <div class="listing-actions">
        <a class="btn btn-primary" href="request.html?cat=${encodeURIComponent(tradeSlug)}">Request quotes</a>
        <a class="btn btn-outline" href="tradie.html?id=${encodeURIComponent(t.id)}">View profile</a>
      </div>
    </article>
  `;
}

function initGlobal(){
  const data = window.JCONNECT;
  const page = document.body.getAttribute("data-page") || "home";

  // Inject header/footer/modal
  const headerMount = qs("#headerMount");
  if(headerMount) headerMount.innerHTML = renderHeader(page);

  const footerMount = qs("#footerMount");
  if(footerMount) footerMount.innerHTML = renderFooter();

  const year = qs("#year");
  if(year) year.textContent = new Date().getFullYear();

  // Mobile menu toggle
  const toggle = qs("#mobileToggle");
  const drawer = qs("#mobileDrawer");
  if(toggle && drawer){
    toggle.addEventListener("click", () => {
      const isOpen = drawer.style.display === "block";
      drawer.style.display = isOpen ? "none" : "block";
    });
    document.addEventListener("click", (e) => {
      if(!drawer.contains(e.target) && e.target !== toggle){
        drawer.style.display = "none";
      }
    });
  }

  // Chips (optional)
  qsa(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const value = chip.getAttribute("data-chip") || "";
      const input = qs("#searchInput");
      if(input) input.value = value;
    });
  });

  injectModal();

  // Page initializers
  if(page === "home") initHome(data);
  if(page === "cats") initCategories(data);
  if(page === "category") initCategory(data);
  if(page === "request") initRequest(data);
  if(page === "tradies") initForTradies();
  if(page === "tradie") initTradieProfile(data);
  if(page === "contact") initContact();
}

function initHome(data){
  // Featured tradies
  const featured = qs("#featuredTradies");
  if(featured){
    const top = [...data.tradies].sort((a,b) => (b.verified - a.verified) || (b.rating - a.rating)).slice(0, 6);
    featured.innerHTML = top.map(renderTradieCard).join("");
  }

  // Quick categories
  const catGrid = qs("#categoryGrid");
  if(catGrid){
    catGrid.innerHTML = data.categories.slice(0,6).map(c => `
      <article class="card" role="listitem">
        <div style="display:flex; gap:10px; align-items:center;">
          <div class="icon" aria-hidden="true">${c.icon}</div>
          <div>
            <h3 style="margin:0;">${c.name}</h3>
            <div class="micro muted">${c.blurb}</div>
          </div>
        </div>
        <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
          <a class="btn btn-outline btn-small" href="category.html?cat=${encodeURIComponent(c.slug)}">Browse</a>
          <a class="btn btn-primary btn-small" href="request.html?cat=${encodeURIComponent(c.slug)}">Get quotes</a>
        </div>
      </article>
    `).join("");
  }

  // Search => go to category page with query
  const form = qs("#searchForm");
  if(form){
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = (qs("#searchInput")?.value || "").trim();
      const cat = (qs("#categorySelect")?.value || "all").trim();
      window.location.href = `category.html?cat=${encodeURIComponent(cat)}&q=${encodeURIComponent(q)}`;
    });
  }
}

function initCategories(data){
  const mount = qs("#allCategories");
  if(!mount) return;

  mount.innerHTML = data.categories.map(c => `
    <article class="card" role="listitem">
      <div style="display:flex; gap:10px; align-items:center;">
        <div class="icon" aria-hidden="true">${c.icon}</div>
        <div>
          <h3 style="margin:0;">${c.name}</h3>
          <div class="micro muted">${c.blurb}</div>
        </div>
      </div>

      <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
        <a class="btn btn-outline" href="category.html?cat=${encodeURIComponent(c.slug)}">Browse tradies</a>
        <a class="btn btn-primary" href="request.html?cat=${encodeURIComponent(c.slug)}">Post a job</a>
      </div>
    </article>
  `).join("");
}

function initCategory(data){
  const slug = getParam("cat") || "all";
  const q = (getParam("q") || "").toLowerCase().trim();

  const categoryName = slug === "all"
    ? "All categories"
    : (data.categories.find(c => c.slug === slug)?.name || "Category");

  const crumb = qs("#crumbCategory");
  if(crumb) crumb.textContent = categoryName;

  const input = qs("#searchInput");
  const select = qs("#categorySelect");
  if(input) input.value = getParam("q") || "";
  if(select) select.value = slug;

  const mount = qs("#results");
  const count = qs("#resultsCount");
  const active = qs("#activeFilter");

  const filter = () => {
    const cat = (select?.value || slug);
    const query = (input?.value || q).toLowerCase().trim();

    let list = data.tradies.filter(t => {
      const matchCat = cat === "all" ? true : slugify(t.trade) === cat;
      const hay = `${t.name} ${t.trade} ${t.areas.join(" ")} ${t.services.join(" ")} ${t.about}`.toLowerCase();
      const matchQ = query ? hay.includes(query) : true;
      return matchCat && matchQ;
    });

    list.sort((a,b) => (b.verified - a.verified) || (b.rating - a.rating));

    if(count) count.textContent = `Showing: ${list.length}`;
    if(active) active.textContent = `Category: ${cat === "all" ? "All" : (data.categories.find(c=>c.slug===cat)?.name || cat)}`;

    mount.innerHTML = list.length
      ? list.map(renderTradieCard).join("")
      : `<div class="card" style="grid-column:1/-1;">
           <h3>No results found</h3>
           <p class="muted">Try a different keyword or choose another category.</p>
         </div>`;
  };

  qs("#searchForm")?.addEventListener("submit", (e) => { e.preventDefault(); filter(); });
  select?.addEventListener("change", filter);
  qs("#resetBtn")?.addEventListener("click", () => {
    if(input) input.value = "";
    if(select) select.value = "all";
    filter();
  });

  filter();
}

function initRequest(data){
  // Preselect category from URL
  const catParam = getParam("cat");
  const catSelect = qs("#jobCategory");
  if(catSelect){
    catSelect.innerHTML = `<option value="">Select a category</option>` +
      data.categories.map(c => `<option value="${c.slug}">${c.name}</option>`).join("");
    if(catParam) catSelect.value = catParam;
  }

  const form = qs("#jobForm");
  const mount = qs("#matchMount");

  if(!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const payload = {
      category: qs("#jobCategory").value.trim(),
      postcode: qs("#jobPostcode").value.trim(),
      description: qs("#jobDesc").value.trim(),
      name: qs("#custName").value.trim(),
      email: qs("#custEmail").value.trim(),
      consent: qs("#jobConsent").checked
    };

    if(!payload.category || !payload.postcode || !payload.description || !payload.name || !payload.email || !payload.consent){
      alert("Please complete required fields and accept the consent checkbox.");
      return;
    }

    // Demo matching: show tradies by category
    const matched = data.tradies
      .filter(t => slugify(t.trade) === payload.category)
      .sort((a,b) => (b.verified - a.verified) || (b.rating - a.rating))
      .slice(0, 3);

    // Save demo job locally
    const key = "jconnect_jobs_demo";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.push({ ...payload, createdAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(existing));

    const catName = data.categories.find(c=>c.slug===payload.category)?.name || "Selected category";

    mount.innerHTML = `
      <div class="card">
        <h3 style="margin-top:0;">Job posted (preview)</h3>
        <p class="muted" style="margin:0 0 8px;">
          Category: <strong>${catName}</strong> • Postcode: <strong>${payload.postcode}</strong>
        </p>
        <p class="muted" style="margin:0;">
          In the live version, tradies will message you and send quotes. Below is a demo match list.
        </p>
      </div>

      <div class="toolbar">
        <span class="pill">Recommended tradies: ${matched.length}</span>
        <span class="pill">Next: compare profiles & request quotes</span>
      </div>

      <div class="grid listings" role="list">
        ${matched.length ? matched.map(renderTradieCard).join("") : `
          <div class="card" style="grid-column:1/-1;">
            <h3>No tradies found (demo)</h3>
            <p class="muted">Try another category or expand your service area.</p>
          </div>
        `}
      </div>
    `;

    form.reset();
    window.scrollTo({ top: mount.offsetTop - 80, behavior: "smooth" });
  });
}

function initForTradies(){
  const form = qs("#tradieJoinForm");
  if(!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = (qs("#tName").value || "").trim();
    const trade = (qs("#tTrade").value || "").trim();
    const email = (qs("#tEmail").value || "").trim();
    alert(`Thanks ${name}!\n\nWe’ll contact you at ${email} about joining as a ${trade}.\n(Preview demo — connect to backend later.)`);
    form.reset();
  });
}

function initTradieProfile(data){
  const id = getParam("id");
  const t = data.tradies.find(x => x.id === id);

  const mount = qs("#tradieMount");
  if(!mount) return;

  if(!t){
    mount.innerHTML = `
      <div class="card">
        <h2>Tradie not found</h2>
        <p class="muted">This profile doesn’t exist.</p>
        <a class="btn btn-primary" href="categories.html">Browse categories</a>
      </div>`;
    return;
  }

  mount.innerHTML = `
    <div class="breadcrumbs">
      <a href="index.html">Home</a> /
      <a href="categories.html">Categories</a> /
      <a href="category.html?cat=${encodeURIComponent(slugify(t.trade))}">${t.trade}</a> /
      <span>${t.name}</span>
    </div>

    <div class="two-col">
      <section class="card">
        <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
          <span class="badge">${t.trade}</span>
          ${t.verified ? `<span class="pill">✅ Verified</span>` : `<span class="pill">Unverified</span>`}
          <span class="pill">📍 ${t.areas.join(", ")}</span>
        </div>

        <h1 style="margin:10px 0 6px; letter-spacing:-0.02em;">${t.name}</h1>
        <p class="muted" style="margin:0;">${t.response} • Hours: ${t.hours}</p>
        <p class="stars">${stars(t.rating)} <span class="muted">(${t.rating.toFixed(1)} • ${t.reviews} reviews)</span></p>

        <p class="muted">${t.about}</p>

        <div class="pill" style="margin-top:10px;">Services: ${t.services.join(", ")}</div>

        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:12px;">
          <a class="btn btn-primary" href="request.html?cat=${encodeURIComponent(slugify(t.trade))}">Request quotes</a>
          <a class="btn btn-outline" href="mailto:${t.email}?subject=${encodeURIComponent("Quote request - " + t.name)}">Email</a>
          <button class="btn btn-outline" id="callBtn" type="button">Call</button>
        </div>

        <p class="micro muted" style="margin-top:10px;">
          Note: Messaging & secure payments are coming soon. Use phone/email for now (preview).
        </p>
      </section>

      <aside class="card">
        <h3 style="margin:0 0 10px;">Quick info</h3>
        <div class="kv">
          <div class="kv-row"><span>Trade</span><strong>${t.trade}</strong></div>
          <div class="kv-row"><span>Rating</span><strong>${t.rating.toFixed(1)}</strong></div>
          <div class="kv-row"><span>Reviews</span><strong>${t.reviews}</strong></div>
          <div class="kv-row"><span>Areas</span><strong>${t.areas.slice(0,2).join(", ")}${t.areas.length>2 ? "…" : ""}</strong></div>
        </div>

        <div class="surface" style="padding:14px; margin-top:14px;">
          <h4 style="margin:0 0 6px;">Need multiple quotes?</h4>
          <p class="micro muted" style="margin:0 0 10px;">Post your job once — compare recommended tradies.</p>
          <a class="btn btn-primary btn-block" href="request.html?cat=${encodeURIComponent(slugify(t.trade))}">Post a job</a>
        </div>
      </aside>
    </div>
  `;

  qs("#callBtn")?.addEventListener("click", () => {
    alert(`Call ${t.phone}\n\n(Preview demo — replace with tel: link when you’re ready.)`);
  });
}

function initContact(){
  const form = qs("#contactForm");
  if(!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = (qs("#cName").value || "").trim();
    const email = (qs("#cEmail").value || "").trim();
    alert(`Thanks ${name}! We received your message (preview).\nWe’ll reply to: ${email}`);
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", initGlobal);
