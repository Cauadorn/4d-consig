/* 4D Consig — interações da landing page */
import { CONFIG, whatsappUrl } from './config.js';
import { initCookies } from './cookies.js';

var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- WhatsApp (número vem do config.js) ---------- */
document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function (a) { a.href = whatsappUrl(); });

/* ---------- Nav ---------- */
var nav = document.querySelector('.nav');
var toggle = document.querySelector('.nav__toggle');

function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 40); }
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

toggle.addEventListener('click', function () {
  var open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
nav.querySelectorAll('.nav__links a').forEach(function (a) {
  a.addEventListener('click', function () {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- Revelar ao rolar ---------- */
var toReveal = document.querySelectorAll('.reveal');
document.querySelectorAll('.funnel__list, .about__proofs, .hero__copy, .pains__list, .plans__grid').forEach(function (group) {
  group.querySelectorAll('.reveal').forEach(function (el, i) { el.style.setProperty('--d', (i * 0.09) + 's'); });
});

if ('IntersectionObserver' in window && !reduceMotion) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  toReveal.forEach(function (el) { io.observe(el); });
} else {
  toReveal.forEach(function (el) { el.classList.add('is-in'); });
}

/* ---------- Hero: tira de leads (ilustrativa) ----------
   Clicar num perfil mostra quem chegou e de onde veio; sozinho, vai trocando.
   Perfis genéricos de exemplo, não são dados de clientes reais. */
var leadBtns = document.querySelectorAll('.leads button');
var leadCard = document.querySelector('.toast');

function showLead(btn) {
  leadBtns.forEach(function (b) { b.setAttribute('aria-selected', b === btn); });
  leadCard.querySelector('[data-lead-who]').textContent = btn.dataset.who;
  leadCard.querySelector('[data-lead-src]').textContent = btn.dataset.src;
  leadCard.querySelector('.toast__face').src = btn.querySelector('img').src;
  if (!reduceMotion) {
    leadCard.classList.remove('is-new');
    void leadCard.offsetWidth;
    leadCard.classList.add('is-new');
  }
}

if (leadBtns.length && leadCard) {
  var leadI = 0;
  var auto = null;
  leadBtns.forEach(function (b, i) {
    b.addEventListener('click', function () {
      leadI = i;
      showLead(b);
      clearInterval(auto);   /* escolheu na mão: para de girar */
      auto = null;
    });
  });
  if (!reduceMotion) {
    auto = setInterval(function () {
      if (document.hidden) return;
      leadI = (leadI + 1) % leadBtns.length;
      showLead(leadBtns[leadI]);
    }, 3800);
  }
}

/* ---------- Solução: medidor do funil acompanha a rolagem ---------- */
var stages = document.querySelectorAll('.stage');
var meterN = document.querySelector('.meter__n');
var meterBar = document.querySelector('.meter__bar');
var current = 0;

function updateMeter() {
  var mark = window.innerHeight * 0.5;
  var n = 1;
  stages.forEach(function (s, i) { if (s.getBoundingClientRect().top < mark) n = i + 1; });
  if (n === current) return;
  current = n;
  stages.forEach(function (s, i) { s.classList.toggle('is-current', i + 1 === n); });
  meterN.textContent = n;
  meterBar.style.setProperty('--p', n / stages.length);
  if (!reduceMotion) {
    meterN.classList.remove('is-tick');
    void meterN.offsetWidth;
    meterN.classList.add('is-tick');
  }
}
if (stages.length && meterN) {
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { updateMeter(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', updateMeter);
  updateMeter();
}

/* ---------- Planos: mensal x anual ---------- */
var plansSection = document.querySelector('.plans');
var billingBtns = document.querySelectorAll('[data-billing]');

function brl(n) { return n.toLocaleString('pt-BR'); }

function setBilling(mode) {
  plansSection.dataset.billing = mode;
  billingBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.billing === mode); });
  document.querySelectorAll('.plan').forEach(function (p) {
    var monthly = +p.dataset.monthly;
    var annual = +p.dataset.annual;
    p.querySelector('.plan__value').textContent = brl(mode === 'annual' ? annual : monthly);
    p.querySelector('.plan__was').textContent = 'R$ ' + brl(monthly);
    p.querySelector('.plan__save span').textContent = 'R$ ' + brl((monthly - annual) * 12);
  });
}
if (plansSection) {
  billingBtns.forEach(function (b) { b.addEventListener('click', function () { setBilling(b.dataset.billing); }); });
  setBilling(CONFIG.defaultBilling === 'monthly' ? 'monthly' : 'annual');
}

/* ---------- Formulário: diagnóstico em 2 etapas ---------- */
var form = document.getElementById('form-diagnostico');
var status = form.querySelector('.form__status');
var phone = form.querySelector('[name="your-phone"]');
var planInput = form.querySelector('[name="your-plan"]');
var planChip = form.querySelector('.plan-chip');
var steps = form.querySelectorAll('.step');
var progressBar = form.querySelector('.progress__bar i');
var progressTxt = form.querySelector('.progress__txt b');

/* Escolher um plano leva ao formulário já com o plano marcado */
function setPlan(name) {
  planInput.value = name || '';
  planChip.hidden = !name;
  planChip.querySelector('[data-plan-name]').textContent = name ? name + ' · ' + (plansSection.dataset.billing === 'annual' ? 'anual' : 'mensal') : '';
}
document.querySelectorAll('[data-choose]').forEach(function (a) {
  a.addEventListener('click', function () { setPlan(a.dataset.choose); });
});
planChip.querySelector('button').addEventListener('click', function () { setPlan(''); });

/* Máscara do WhatsApp */
phone.addEventListener('input', function () {
  var d = phone.value.replace(/\D/g, '').slice(0, 11);
  var out = d;
  if (d.length > 2) out = '(' + d.slice(0, 2) + ') ' + d.slice(2);
  if (d.length > 7) out = '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(-4);
  phone.value = out;
});

function fieldOf(el) { return el.closest('.field') || el.closest('.check'); }

form.addEventListener('change', function (e) {
  var f = fieldOf(e.target);
  if (f) f.classList.remove('is-invalid');
  if (status.classList.contains('is-err')) { status.textContent = ''; status.className = 'form__status'; }
});

/* Valida os campos obrigatórios dentro de `scope`; devolve o primeiro inválido */
function validate(scope) {
  var firstBad = null;
  var seen = {};
  scope.querySelectorAll('[required]').forEach(function (el) {
    var ok;
    if (el.type === 'radio') {
      if (seen[el.name]) return;
      seen[el.name] = true;
      ok = !!form.querySelector('[name="' + el.name + '"]:checked');
    } else if (el.type === 'checkbox') {
      ok = el.checked;
    } else if (el.name === 'your-phone') {
      ok = el.value.replace(/\D/g, '').length >= 10;
    } else {
      ok = el.value.trim() !== '' && el.checkValidity();
    }
    var f = fieldOf(el);
    if (f) f.classList.toggle('is-invalid', !ok);
    if (!ok && !firstBad) firstBad = el;
  });
  if (firstBad) {
    status.className = 'form__status is-err';
    status.textContent = 'Confira os campos destacados para continuar.';
    firstBad.focus({ preventScroll: true });
    fieldOf(firstBad).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  }
  return firstBad;
}

function goStep(n) {
  steps.forEach(function (s) { s.classList.toggle('is-active', +s.dataset.step === n); });
  progressBar.style.width = n === 1 ? '50%' : '92%';
  progressTxt.textContent = n;
  status.textContent = '';
  status.className = 'form__status';
}

/* Com JavaScript ativo, o formulário vira 2 etapas (sem JS, tudo aparece de uma vez) */
form.classList.add('is-steps');
goStep(1);

form.querySelector('.step__next').addEventListener('click', function () {
  if (validate(steps[0])) return;
  goStep(2);
  form.querySelector('[name="your-name"]').focus({ preventScroll: true });
  form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
});
form.querySelector('.step__back').addEventListener('click', function () { goStep(1); });

/* Escolher o investimento já enche parte da barra: a pessoa sente que está perto do fim */
form.querySelectorAll('[name="your-investment"]').forEach(function (r) {
  r.addEventListener('change', function () { progressBar.style.width = '70%'; });
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (validate(steps[0])) { goStep(1); return; }
  if (validate(steps[1])) return;

  var btn = form.querySelector('[type="submit"]');
  btn.disabled = true;
  status.className = 'form__status';
  status.textContent = 'Enviando…';

  var data = new FormData(form);
  try {
    sessionStorage.setItem('4dconsig-lead', JSON.stringify({
      name: data.get('your-name'), plan: data.get('your-plan'), investment: data.get('your-investment')
    }));
  } catch (err) { /* segue sem guardar */ }

  var done = function () { window.location.href = CONFIG.thankYouPage; };
  var fail = function () {
    status.className = 'form__status is-err';
    status.textContent = 'Não foi possível enviar agora. Tente novamente ou fale com a gente pelo WhatsApp.';
    btn.disabled = false;
  };

  if (!CONFIG.formEndpoint) { setTimeout(done, 600); return; }
  fetch(CONFIG.formEndpoint, { method: 'POST', body: data })
    .then(function (r) { r.ok ? done() : fail(); })
    .catch(fail);
});

/* ---------- CTA fixo no celular: aparece depois do hero, some no formulário ---------- */
var sticky = document.querySelector('.sticky-cta');
var heroCtas = document.querySelector('.hero__ctas');
var contact = document.getElementById('contato');
if (sticky && heroCtas && contact && 'IntersectionObserver' in window) {
  var heroVisible = true;
  var formVisible = false;
  var sync = function () {
    var on = !heroVisible && !formVisible;
    sticky.classList.toggle('is-on', on);
    document.body.classList.toggle('has-sticky', on);
  };
  new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; sync(); }).observe(heroCtas);
  new IntersectionObserver(function (e) { formVisible = e[0].isIntersecting; sync(); }, { rootMargin: '0px 0px -20% 0px' }).observe(contact);
}

/* ---------- Cookies + ano no rodapé ---------- */
initCookies();
var y = document.querySelector('[data-year]');
if (y) y.textContent = new Date().getFullYear();
