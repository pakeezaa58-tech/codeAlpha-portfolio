// CodeAlpha Frontend Development Internship | Task 3: Portfolio Website
document.documentElement.classList.add("js");

// 1. Mobile menu
const nav = document.getElementById("nav");
document.getElementById("burger").onclick = () => nav.classList.toggle("open");
nav.querySelectorAll("a").forEach(a => a.onclick = () => nav.classList.remove("open"));

// 2. Fade sections in when they scroll into view
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.12 });
document.querySelectorAll(".rv").forEach(el => io.observe(el));

// 3. Contact form: opens the visitor's email app with the message filled in
document.getElementById("form").addEventListener("submit", e => {
  e.preventDefault();
  const n = name.value, m = msg.value, em = email.value;
  location.href = "mailto:pakeezaa58@gmail.com?subject=" + encodeURIComponent("Portfolio message from " + n) +
    "&body=" + encodeURIComponent(m + "\n\nFrom: " + n + " (" + em + ")");
});
document.getElementById("year").textContent = new Date().getFullYear();

// 4. PROJECTS: linked to GitHub automatically.
//    Add a repo named CodeAlpha_Something on GitHub and it appears here by itself.
const GH = "pakeezaa58-tech";
const projects = [
  { repo: "CodeAlpha_ImageGallery", title: "Image Gallery", tags: "HTML \u00B7 CSS \u00B7 JavaScript",
    desc: "Responsive gallery with category filters, hover effects and a lightbox viewer with keyboard and swipe support." },
  { repo: "CodeAlpha_Calculator", title: "Calculator", tags: "HTML \u00B7 CSS \u00B7 JavaScript",
    desc: "Calculator with all four operations, chained calculations, keyboard support and error handling." },
  { repo: "CodeAlpha_Portfolio", title: "Portfolio Website", tags: "HTML \u00B7 CSS \u00B7 JavaScript",
    desc: "This site: responsive layout, animations, a downloadable resume and live GitHub project links." },
    { repo: "AI accessibility_driven suite", title: "driven suite", tags: " Python",
    desc: "This is real app desktop that use and it contain touchless mouse and signlanguage " },
];
const cards = document.getElementById("cards");
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// state: "unknown" (could not check), "missing" (not uploaded yet), "ready" (on GitHub)
function cardHTML(p, state, hasPages) {
  const code = `https://github.com/${GH}/${p.repo}`;
  const demo = `https://${GH}.github.io/${p.repo}/`;
  let links;
  if (state === "missing") links = '<span class="soon">Uploading soon</span>';
  else links = `<a href="${code}" target="_blank" rel="noopener">View code &rarr;</a>` +
    (state === "unknown" || hasPages ? `<a href="${demo}" target="_blank" rel="noopener">Live demo &rarr;</a>` : "");
  return `<article class="card"><h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p>
    <p class="tags">${esc(p.tags)}</p><div class="row">${links}</div></article>`;
}
function draw(state, repos) {
  const byName = {}; (repos || []).forEach(r => byName[r.name] = r);
  let html = projects.map(p => {
    const r = byName[p.repo];
    return cardHTML(p, state === "unknown" ? "unknown" : (r ? "ready" : "missing"), r && r.has_pages);
  }).join("");
  (repos || []).filter(r => /^CodeAlpha_/i.test(r.name) && !projects.some(p => p.repo === r.name)).forEach(r => {
    html += cardHTML({ repo: r.name, title: r.name.replace(/^CodeAlpha_/i, "").replace(/_/g, " "),
      tags: r.language || "GitHub project", desc: r.description || "CodeAlpha internship project." }, "ready", r.has_pages);
  });
  cards.innerHTML = html;
}
draw("unknown");
fetch(`https://api.github.com/users/${GH}/repos?per_page=100`)
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(repos => draw("checked", repos))
  .catch(() => {});          // if GitHub cannot be reached, the links above stay as they are
