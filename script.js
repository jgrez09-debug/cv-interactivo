/**
 * CV Interactivo — Jonathan Grez Parada
 * script.js
 *
 * Efectos implementados:
 * 1. Modo claro / oscuro (dark mode toggle)
 * 2. Navbar con sombra + link activo al hacer scroll
 * 3. Animación reveal al hacer scroll (IntersectionObserver)
 * 4. Animación de barras de habilidades
 * 5. Cambio de color de acento (jQuery - onClick)
 * 6. Validación de formulario en tiempo real (jQuery - onChange / onInput)
 * 7. Scroll suave a secciones (jQuery)
 */

$(document).ready(function () {

  /* ============================================================
     1. MODO CLARO / OSCURO
     Evento: onClick en botón #themeToggle
     Guarda preferencia en localStorage
  ============================================================ */
  const savedTheme = localStorage.getItem('cvTheme') || 'light';
  if (savedTheme === 'dark') {
    $('body').attr('data-theme', 'dark');
    $('#themeIcon').removeClass('bi-moon-fill').addClass('bi-sun-fill');
  }

  $('#themeToggle').on('click', function () {
    const isDark = $('body').attr('data-theme') === 'dark';
    if (isDark) {
      $('body').removeAttr('data-theme');
      $('#themeIcon').removeClass('bi-sun-fill').addClass('bi-moon-fill');
      localStorage.setItem('cvTheme', 'light');
    } else {
      $('body').attr('data-theme', 'dark');
      $('#themeIcon').removeClass('bi-moon-fill').addClass('bi-sun-fill');
      localStorage.setItem('cvTheme', 'dark');
    }
  });


  /* ============================================================
     2. NAVBAR: sombra al scroll + link activo por sección
     Evento: onScroll en window
  ============================================================ */
  $(window).on('scroll', function () {
    // Sombra en navbar
    $(this).scrollTop() > 50
      ? $('#mainNav').addClass('scrolled')
      : $('#mainNav').removeClass('scrolled');

    // Resaltar link activo según sección visible
    const scrollPos = $(this).scrollTop() + 100;
    $('section[id]').each(function () {
      const top    = $(this).offset().top;
      const bottom = top + $(this).outerHeight();
      const id     = $(this).attr('id');
      if (scrollPos >= top && scrollPos < bottom) {
        $('.nav-link').removeClass('active');
        $(`.nav-link[href="#${id}"]`).addClass('active');
      }
    });
  });


  /* ============================================================
     3. ANIMACIÓN REVEAL AL HACER SCROLL
     Usa IntersectionObserver para detectar elementos visibles
  ============================================================ */
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        $(entry.target).addClass('visible');
        // Activar skill bars si la sección de habilidades entra en vista
        if ($(entry.target).closest('#habilidades').length) {
          animateSkillBars();
        }
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  // Observar todos los elementos .reveal
  $('.reveal').each(function () {
    revealObserver.observe(this);
  });

  // El hero se activa inmediatamente al cargar
  setTimeout(function () {
    $('#hero .reveal').addClass('visible');
  }, 120);


  /* ============================================================
     4. ANIMACIÓN DE BARRAS DE HABILIDADES
     Se dispara cuando la sección #habilidades entra en pantalla
  ============================================================ */
  let skillsDone = false;

  function animateSkillBars() {
    if (skillsDone) return;
    skillsDone = true;
    $('.skill-fill').each(function () {
      $(this).css('width', $(this).data('width') + '%');
    });
  }


  /* ============================================================
     5. CAMBIO DE COLOR DE ACENTO
     Evento: onClick en botón #colorBtn
     Rota entre 6 paletas de acento apagadas (tonos premium)
  ============================================================ */
  const acentos = [
    { gold: '#b8a88a', accent2: '#9e9e9e' },  // Dorado neutro (default)
    { gold: '#7bafd4', accent2: '#5a9ec5' },  // Azul acero
    { gold: '#7dc49e', accent2: '#5aab83' },  // Verde salvia
    { gold: '#c4a87d', accent2: '#a8865a' },  // Ámbar cálido
    { gold: '#b07dc4', accent2: '#9560a8' },  // Malva
    { gold: '#c47d7d', accent2: '#a85a5a' },  // Terracota
  ];
  let acentoIdx = 0;

  $('#colorBtn').on('click', function () {
    acentoIdx = (acentoIdx + 1) % acentos.length;
    const p = acentos[acentoIdx];
    document.documentElement.style.setProperty('--gold',    p.gold);
    document.documentElement.style.setProperty('--accent2', p.accent2);
  });


  /* ============================================================
     6. VALIDACIÓN DEL FORMULARIO EN TIEMPO REAL
     Evento: onInput + onChange en cada campo (jQuery)
     Evento: onSubmit para validación final
  ============================================================ */

  // Validar nombre — mínimo 3 caracteres
  $('#inputNombre').on('input change', function () {
    $(this).val().trim().length >= 3
      ? $(this).removeClass('is-invalid').addClass('is-valid')
      : $(this).removeClass('is-valid').addClass('is-invalid');
  });

  // Validar email — formato válido con regex
  $('#inputEmail').on('input change', function () {
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($(this).val().trim())
      ? $(this).removeClass('is-invalid').addClass('is-valid')
      : $(this).removeClass('is-valid').addClass('is-invalid');
  });

  // Validar asunto — mínimo 3 caracteres
  $('#inputAsunto').on('input change', function () {
    $(this).val().trim().length >= 3
      ? $(this).removeClass('is-invalid').addClass('is-valid')
      : $(this).removeClass('is-valid').addClass('is-invalid');
  });

  // Validar mensaje — mínimo 10 caracteres
  $('#inputMensaje').on('input change', function () {
    $(this).val().trim().length >= 10
      ? $(this).removeClass('is-invalid').addClass('is-valid')
      : $(this).removeClass('is-valid').addClass('is-invalid');
  });

  // Envío del formulario — validación final
  $('#contactForm').on('submit', function (e) {
    e.preventDefault();
    let formValido = true;

    if ($('#inputNombre').val().trim().length < 3) {
      $('#inputNombre').addClass('is-invalid').removeClass('is-valid');
      formValido = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('#inputEmail').val().trim())) {
      $('#inputEmail').addClass('is-invalid').removeClass('is-valid');
      formValido = false;
    }
    if ($('#inputAsunto').val().trim().length < 3) {
      $('#inputAsunto').addClass('is-invalid').removeClass('is-valid');
      formValido = false;
    }
    if ($('#inputMensaje').val().trim().length < 10) {
      $('#inputMensaje').addClass('is-invalid').removeClass('is-valid');
      formValido = false;
    }

    if (formValido) {
      // Mostrar mensaje de éxito con animación jQuery slideDown
      $('#formSuccess').removeClass('d-none').hide().slideDown(400);
      // Limpiar campos
      $('#contactForm input, #contactForm textarea')
        .val('')
        .removeClass('is-valid is-invalid');
      // Ocultar mensaje después de 5 segundos
      setTimeout(function () {
        $('#formSuccess').slideUp(400, function () {
          $(this).addClass('d-none');
        });
      }, 5000);
    }
  });


  /* ============================================================
     7. SCROLL SUAVE A SECCIONES
     Evento: onClick en links de navegación (jQuery)
  ============================================================ */
  $('a[href^="#"]').on('click', function (e) {
    const target = $(this).attr('href');
    if ($(target).length) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: $(target).offset().top - 70
      }, 600);
      // Cerrar menú móvil si está abierto
      $('#navMenu').collapse('hide');
    }
  });

}); // END document.ready
