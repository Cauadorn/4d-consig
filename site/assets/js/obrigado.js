/* 4D Consig — página de obrigado */
import { whatsappUrl } from './config.js';

document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function (a) { a.href = whatsappUrl(); });

/* Mostra o plano (ou o investimento) que a pessoa escolheu no formulário */
try {
  var lead = JSON.parse(sessionStorage.getItem('4dconsig-lead') || 'null');
  if (lead) {
    var p = document.querySelector('[data-lead-plan]');
    if (p) p.textContent = lead.plan ? 'Plano de interesse: ' + lead.plan : (lead.investment || 'Diagnóstico gratuito');
  }
} catch (e) { /* sem dados: mantém o texto padrão */ }

var y = document.querySelector('[data-year]');
if (y) y.textContent = new Date().getFullYear();
