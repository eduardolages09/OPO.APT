/* site-fabrica — agência, composição «arco»: a folha lateral («Ver tudo o que está incluído»); a moldura do Premium que cresce até
   ao ecrã inteiro com o scroll; o hero do Premium segue o scroll devagar; a tira de pormenores do Premium corre com o scroll; a cortina do Destaque; no bairro, a linha da lista acende o seu número no mapa. */
(() => {
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // folha lateral
  let volta = null;
  const fecha = (f) => {
    f.classList.remove('aberta');
    document.documentElement.classList.remove('folha-aberta');
    setTimeout(() => { f.hidden = true; }, calmo ? 0 : 600);
    volta?.focus();
  };
  document.querySelectorAll('[data-folha-abre]').forEach((b) => b.addEventListener('click', () => {
    const f = document.getElementById(b.dataset.folhaAbre);
    if (!f) return;
    volta = b;
    f.hidden = false;
    document.documentElement.classList.add('folha-aberta');
    requestAnimationFrame(() => requestAnimationFrame(() => f.classList.add('aberta')));
    f.querySelector('.a-folha__x')?.focus();
  }));
  document.querySelectorAll('.a-folha').forEach((f) => {
    f.querySelectorAll('[data-folha-fecha]').forEach((x) => x.addEventListener('click', () => fecha(f)));
    f.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') fecha(f); });
  });

  // Premium: a moldura cresce com o scroll (0 = pequena no meio do escuro, 1 = ecrã inteiro); o texto aparece no fim
  const mold = document.querySelector('[data-moldura]');
  if (mold && !calmo) {
    mold.classList.add('vivo');
    const f = mold.querySelector('.a-mold__f');
    const t = mold.querySelector('.a-mold__t');
    let pede = false;
    const passo = () => {
      pede = false;
      const r = mold.getBoundingClientRect();
      const total = r.height - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / (total * .7)));
      const e = 1 - Math.pow(1 - p, 3);
      f.style.setProperty('--pp', e.toFixed(4));
      mold.style.setProperty('--pp', e.toFixed(4));   // o fundo escurece e a linha de entrada sai (ronda 3)
      t.style.setProperty('--t', Math.min(1, Math.max(0, (p - .72) / .28)).toFixed(3));
    };
    addEventListener('scroll', () => { if (!pede) { pede = true; requestAnimationFrame(passo); } }, { passive: true });
    addEventListener('resize', passo);
    passo();
  }

  // Premium: a tira de pormenores corre de lado enquanto atravessa o ecrã (no telemóvel e com movimento reduzido, arrasta-se)
  const tira = document.querySelector('[data-tira]');
  if (tira && !calmo && matchMedia('(min-width: 761px)').matches) {
    tira.classList.add('vivo');
    const fila = tira.querySelector('.a-tira__fila');
    let pede = false;
    const corre = () => {
      pede = false;
      const r = tira.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
      const sobra = Math.max(0, fila.scrollWidth - tira.clientWidth);
      fila.style.setProperty('--x', `${(-sobra * p).toFixed(1)}px`);
    };
    addEventListener('scroll', () => { if (!pede) { pede = true; requestAnimationFrame(corre); } }, { passive: true });
    addEventListener('resize', corre);
    corre();
  }

  // Destaque (ronda 3): a cortina; cada foto sobe por cima da anterior com o scroll e pára inteira antes da seguinte
  const cort = document.querySelector('[data-cortina]');
  if (cort && !calmo) {
    cort.classList.add('vivo');
    const S = [...cort.querySelectorAll('.a-cort__s')];
    const suave = (x) => x * x * (3 - 2 * x);
    let pede = false;
    const desce = () => {
      pede = false;
      const r = cort.getBoundingClientRect();
      const curso = r.height - innerHeight;
      const t = curso > 0 ? Math.min(1, Math.max(0, -r.top / curso)) * (S.length - 1) : 0;
      S.forEach((s, i) => {
        const q = i === 0 ? 1 : suave(Math.min(1, Math.max(0, (t - (i - 1) - .12) / .7)));
        const seg = i + 1 < S.length ? suave(Math.min(1, Math.max(0, (t - i - .12) / .7))) : 0;   // a seguinte a tapar esta
        s.style.setProperty('--q', q.toFixed(4));
        s.style.setProperty('--q2', seg.toFixed(4));
        s.classList.toggle('tapada', seg > 0);
        s.style.visibility = q > 0 && seg < 1 ? '' : 'hidden';
      });
    };
    addEventListener('scroll', () => { if (!pede) { pede = true; requestAnimationFrame(desce); } }, { passive: true });
    addEventListener('resize', desce);
    desce();
  }

  // Premium: o hero segue o scroll devagar
  const voo = document.querySelector('.a-voo');
  if (voo && !calmo) {
    let pede = false;
    const move = () => { pede = false; const y = Math.min(scrollY, innerHeight); voo.style.transform = `translate3d(0, ${(y * .3).toFixed(1)}px, 0)`; };
    addEventListener('scroll', () => { if (!pede) { pede = true; requestAnimationFrame(move); } }, { passive: true });
  }

  // bairro: a linha da lista acende o número no mapa
  document.querySelectorAll('.a-lug li[data-b]').forEach((li) => {
    const pin = document.querySelector(`.e-pin[data-b="${li.dataset.b}"]`);
    if (!pin) return;
    const liga = (s) => () => pin.classList.toggle('acende', s);
    li.addEventListener('mouseenter', liga(true));
    li.addEventListener('mouseleave', liga(false));
  });
})();
