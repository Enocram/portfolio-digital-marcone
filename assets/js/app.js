// app.js – renderização dinâmica + PWA + Intersection Observer
(async function() {
  const root = document.getElementById('root');
  
  // Carrega dados do JSON com fallback
  let content = null;
  try {
    const res = await fetch('data/content.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    content = await res.json();
  } catch (error) {
    console.error('Erro ao carregar conteúdo:', error);
    root.innerHTML = `<div class="loader" style="color:#b00;">⚠️ Não foi possível carregar o conteúdo. Verifique a conexão ou tente recarregar.</div>`;
    return;
  }

  // Renderiza HTML completo
  const html = `
    <main>
      <!-- SEÇÃO HERO -->
      <section class="hero" id="hero">
        <video class="video-background" autoplay muted loop playsinline poster="assets/video/hero-bg.mp4">
          <source src="assets/video/hero-bg.mp4" type="video/mp4">
        </video>
        <div class="hero-content container fade-up">
          <h1 class="hero-title">${content.hero.title}</h1>
          <p class="hero-sub">${content.hero.subtitle}</p>
          <div class="btn-group">
            <a href="#solucoes" class="btn btn-primary">${content.hero.btnPrimary}</a>
            <a href="#contato" class="btn btn-outline">${content.hero.btnSecondary}</a>
          </div>
        </div>
      </section>

      <!-- SEÇÃO SOLUÇÕES -->
      <section id="solucoes" class="section">
        <div class="container">
          <div style="text-align: center;"><h2>${content.solutions.title}</h2></div>
          <div class="grid-cards">
            ${content.solutions.items.map(item => `
              <div class="card fade-up">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- SEÇÃO PROJETOS -->
      <section id="projetos" class="section" style="background:#ecece8;">
        <div class="container">
          <div style="text-align: center;"><h2>${content.projects.title}</h2></div>
          <div class="grid-cards">
            ${content.projects.items.map(proj => `
              <div class="card fade-up">
              <img src="${proj.image}" alt="${proj.name}" class="project-img" loading="lazy">
              <h3><a href="${proj.url}" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">${proj.name}</a></h3>
              <p>${proj.description}</p>
            </div>
          `).join('')}
          </div>
        </div>
      </section>

      <!-- SEÇÃO PRINCÍPIOS (COMO PENSO) -->
      <section class="section">
        <div class="container">
          <div style="text-align: center;"><h2>${content.principles.title}</h2></div>
          <div class="principles-grid">
            ${content.principles.items.map(p => `
              <div class="principle fade-up">
                <div class="principle-icon">${p.icon}</div>
                <h3>${p.name}</h3>
                <p>${p.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- SEÇÃO SOBRE -->
      <section class="section" style="background:#ecece8;">
        <div class="container">
          <div style="text-align: center;"><h2>${content.about.title}</h2></div>
          <div class="about-wrapper">
            <div class="about-img fade-up">
              <img src="${content.about.image}" alt="Marcone Arruda" loading="lazy">
            </div>
            <div class="about-text fade-up">
              <p>${content.about.bio}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- SEÇÃO CONTATO -->
      <section id="contato" class="section">
        <div class="container">
          <div class="contact-box fade-up">
            <div style="text-align: center;"><h2>${content.contact.title}</h2></div>
            <p>${content.contact.message}</p>
            <a href="${content.contact.whatsappLink}" class="btn btn-primary whatsapp-btn" target="_blank" rel="noopener noreferrer">
              💬 ${content.contact.buttonText}
            </a>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <p>${content.footer.name} · ${content.footer.role}</p>
      <div class="social-links">
        ${content.footer.social.map(social => `<a href="${social.url}" target="_blank" rel="noopener">${social.platform}</a>`).join(' · ')}
      </div>
      <p style="margin-top:1rem; font-size:0.8rem;">${content.footer.copyright} ${new Date().getFullYear()}</p>
    </footer>
  `;

  root.innerHTML = html;

  // Ativar animações fade-up com Intersection Observer
  const faders = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  faders.forEach(el => observer.observe(el));

  // Navegação suave para links internos (já garantido pelo CSS)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Registro do Service Worker (PWA)
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', { scope: './' });
      console.log('SW registrado:', registration);
    } catch (err) {
      console.log('SW falhou:', err);
    }
  }
})();