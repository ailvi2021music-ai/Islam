const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));

function showToast(text){
  const t = $("#toast");
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(showToast._tm);
  showToast._tm = setTimeout(()=> t.classList.remove("show"), 1200);
}

function setView(name){
  $$(".view").forEach(v => {
    v.hidden = v.dataset.view !== name;
  });

  $$(".tab").forEach(b => {
    const active = b.dataset.tab === name;
    b.classList.toggle("active", active);
    b.setAttribute("aria-selected", active ? "true" : "false");
  });

  const subtitleMap = { today:"Today", quran:"Qur’an", dua:"Dua", settings:"Settings" };
  $("#subtitle").textContent = subtitleMap[name] || "Today";
  history.replaceState(null, "", `#${name}`);
}

function initTabs(){
  $$(".tab").forEach(btn=>{
    btn.addEventListener("click", ()=> setView(btn.dataset.tab));
  });

  // "быстрые кнопки"
  $$("[data-toast]").forEach(b=>{
    b.addEventListener("click", ()=> showToast(b.dataset.toast));
  });

  // deep-link
  const hash = (location.hash || "").replace("#","").trim();
  if(["today","quran","dua","settings"].includes(hash)) setView(hash);
  else setView("today");
}

async function initPWA(){
  if("serviceWorker" in navigator){
    try{
      await navigator.serviceWorker.register("./sw.js");
    }catch(e){
      // без паники: просто офлайн-кэш не включится
    }
  }
}

document.addEventListener("DOMContentLoaded", async ()=>{
  initTabs();
  await initPWA();
});
