fetch("assets/js/evento.json")
  .then((res) => res.json())
  .then((data) => {
    window.__EVENT_DATA__ = data; // 👈 AGREGAR ESTA LÍNEA

    // ================= INVITADO (API o DEMO) =================
    const invitadoDemo = {
      nombre: "Familia Pérez",
      pases: 4,
      mesa: 8,
    };

    // Si la API ya definió __INVITADO__, se usa.
    // Si no, usamos el demo.
    window.__INVITADO__ = window.__INVITADO__ ?? invitadoDemo;

    /* ================= INVITADO ================= */

    document.querySelectorAll(".rsvp-guest-name").forEach((el) => {
      el.textContent = window.__INVITADO__.nombre || "";
    });
    /* ================= 🔧 HELPERS ================= */

    const isEnabled = (obj) => obj?.enabled !== false;

    const removeSection = (id) => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el && value !== undefined && value !== null) {
        el.textContent = value;
      }
    };

    const setHTML = (id, value) => {
      const el = document.getElementById(id);
      if (el && value !== undefined && value !== null) {
        el.innerHTML = value;
      }
    };

    /* ================= META ================= */

    if (data.meta?.title) document.title = data.meta.title;
    if (data.meta?.lang) document.documentElement.lang = data.meta.lang;

    if (data.meta?.favicon) {
      let link =
        document.querySelector("link[rel='icon']") ||
        document.createElement("link");
      link.rel = "icon";
      link.href = `assets/img/${data.meta.favicon}`;
      document.head.appendChild(link);
    }

    /* ================= LOGO ================= */

    const logoEl = document.querySelector(".logo");
    if (logoEl && data.logo?.type === "text") {
      logoEl.textContent = data.logo.value;
    }

    /* ================= AUDIO ================= */

    const audio = document.getElementById("bgSong");
    const musicToggle = document.getElementById("musicToggle");
    const musicIcon = document.getElementById("musicIcon");

    if (audio && isEnabled(data.audio)) {
      audio.src = `assets/audio/${data.audio.src}`;
      audio.loop = data.audio.loop ?? true;
      audio.volume = data.audio.volume ?? 1;

      if (musicIcon && data.audio.icons?.play) {
        musicIcon.src = `assets/img/${data.audio.icons.play}`;
      }

      if (musicToggle && musicIcon) {
        musicToggle.addEventListener("click", () => {
          if (audio.paused) {
            audio.play().catch(() => { });
            musicIcon.src = `assets/img/${data.audio.icons.pause}`;
          } else {
            audio.pause();
            musicIcon.src = `assets/img/${data.audio.icons.play}`;
          }
        });
      }
    }

    /* ================= NAVBAR ================= */

    const navMenu = document.getElementById("navMenu");

    if (navMenu && isEnabled(data.navbar)) {
      navMenu.innerHTML = "";

      data.navbar.items.forEach((item) => {
        if (!item.href || !item.label) return;

        const targetId = item.href.replace("#", "");
        if (data[targetId]?.enabled === false) return;

        navMenu.insertAdjacentHTML(
          "beforeend",
          `<li><a href="${item.href}">${item.label}</a></li>`,
        );
      });
    }

    /* ================= HERO ================= */

    if (isEnabled(data.hero)) {
      const hero = data.hero;

      const heroNamesEl = document.getElementById("hero-names");

      if (hero.names?.festejada) {
        const texto = hero.names.festejada || "";

        const partes = texto.trim().split(" ");

        const titulo = partes.slice(0, 2).join(" ");
        const nombre = partes.slice(2).join(" ");

        heroNamesEl.innerHTML = `
  <span class="hero-title">${titulo}</span>
  <span class="hero-name">${nombre}</span>
`;
        setTimeout(() => {
          heroNamesEl.innerHTML = `
    <span class="hero-title">${titulo}</span>
    <span class="hero-name">${nombre}</span>
  `;
        }, 50);
      } else if (hero.names?.novia && hero.names?.novio) {
        heroNamesEl.textContent = `${hero.names.novia} & ${hero.names.novio}`;
      }

      const heroBg = document.querySelector(".hero-bg");
      if (heroBg && data.media?.hero_background) {
        heroBg.style.backgroundImage = `url('assets/img/${data.media.hero_background}')`;
      }

      const labels = hero.countdown_labels;
      if (labels) {
        setText("label-dias", labels.dias);
        setText("label-horas", labels.horas);
        setText("label-minutos", labels.minutos);
        setText("label-segundos", labels.segundos || "Segundos");
      }
    } else {
      removeSection("inicio");
    }

    /* ================= PRESENTACIÓN ================= */

    if (isEnabled(data.presentacion)) {
      const p = data.presentacion;

      setText("titulo-presentacion", p.titulo);
      setText("nombres-presentacion", p.nombres);
      setText("frase-presentacion", p.frase);

      const padresNoviaEl = document.getElementById("padres-novia");
      const padresNovioEl = document.getElementById("padres-novio");

      const labelPadresNoviaEl = document.getElementById("label-padres-novia");
      const labelPadresNovioEl = document.getElementById("label-padres-novio");

      /* ===== XV ===== */
      if (p.padres?.festejada) {
        setHTML("padres-novia", p.padres.festejada.join("<br>"));
        setText("label-padres-novia", p.labels?.padres || "Mis Padres");

        padresNovioEl?.closest(".arco-grupo")?.remove();

        if (p.padrinos?.length) {
          setHTML("padrinos", p.padrinos.join("<br>"));
          setText("label-padrinos", p.labels?.padrinos || "Mis Padrinos");
        }
      } else {
        /* ===== BODA ===== */
        setHTML("padres-novia", p.padres?.novia?.join("<br>") || "");
        setHTML("padres-novio", p.padres?.novio?.join("<br>") || "");

        setText("label-padres-novia", p.labels?.padres_novia || "");
        setText("label-padres-novio", p.labels?.padres_novio || "");
      }

      setText("texto-final-presentacion", p.texto_final || "");

      const img = document.querySelector(".arco-img img");
      if (img && data.media?.presentacion) {
        img.src = `assets/img/${data.media.presentacion}`;
      }
    } else {
      removeSection("presentacion");
    }

    /* ================= UBICACIÓN ================= */

    if (isEnabled(data.ubicacion)) {
      const u = data.ubicacion;
      setText("ubicacion-titulo", u.titulo);

      const fechaGeneralEl = document.getElementById("ubicacion-fecha-general");

      if (fechaGeneralEl && data.evento?.fecha) {
        const fecha = new Date(data.evento.fecha);

        const dia = fecha.toLocaleDateString("es-MX", {
          weekday: "long",
        });

        const fechaBonita = fecha.toLocaleDateString("es-MX", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        const hora = fecha.toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        });

        fechaGeneralEl.innerHTML = `
    <div class="fecha-wrapper">
      <span class="fecha-dia">${dia}</span>
      <span class="fecha-completa">${fechaBonita}</span>
    </div>
  `;
      }

      const lista = document.getElementById("ubicacion-lista");
      lista.innerHTML = "";

      u.lugares
        .filter((l) => isEnabled(l) && l.lugar && l.hora)
        .forEach((lugar) => {
          lista.insertAdjacentHTML(
            "beforeend",
            `
            <div class="ubicacion-card reveal">
              <h3 class="ubicacion-subtitle">${lugar.tipo}</h3>
              <div class="ubicacion-hora">${lugar.hora}</div>
              <div class="ubicacion-lugar">${lugar.lugar}</div>
              ${lugar.direccion?.length
              ? `<div class="ubicacion-direccion">${lugar.direccion.join(
                "<br>",
              )}</div>`
              : ""
            }
              ${lugar.mapa
              ? `<a href="${lugar.mapa}" target="_blank" class="btn-ubicacion">Ver ubicación</a>`
              : ""
            }
            </div>
          `,
          );
        });
    } else {
      removeSection("ubicacion");
    }

    /* ================= PROGRAMA ================= */

    if (isEnabled(data.programa)) {
      const programa = data.programa;
      setText("programa-titulo", programa.titulo);

      const timeline = document.getElementById("timeline-programa");
      timeline.innerHTML = "";

      programa.items.forEach((item, index) => {
        const lado = index % 2 === 0 ? "left" : "right";

        timeline.insertAdjacentHTML(
          "beforeend",
          `
          <div class="item ${lado} reveal reveal-${lado}">
            <img class="icon" src="assets/img/${item.icono}">
            <div class="hora">${item.hora}</div>
            <div class="texto">${item.texto}</div>
          </div>
        `,
        );
      });
    } else {
      removeSection("programa");
    }

    /* ================= VESTIMENTA ================= */

    if (isEnabled(data.vestimenta)) {
      const v = data.vestimenta;
      setText("vestimenta-titulo", v.titulo);

      const icon = document.getElementById("vestimenta-icon");
      if (icon && data.media?.vestimenta_icon) {
        icon.src = `assets/img/${data.media.vestimenta_icon}`;
      }

      setText("vestimenta-formal", v.formal);
      setHTML("vestimenta-mujeres", v.mujeres);
      setHTML("vestimenta-hombres", v.hombres);
    } else {
      removeSection("vestimenta");
    }

    /* ================= REGALOS ================= */

    if (isEnabled(data.regalos)) {
      const r = data.regalos;
      setText("regalos-titulo", r.titulo);
      setHTML("regalos-desc", r.descripcion);

      const cont = document.getElementById("regalos-inner");
      cont.innerHTML = "";

      r.items.forEach((item) => {
        cont.insertAdjacentHTML(
          "beforeend",
          `
          <div class="regalo-item reveal">
            <img src="assets/img/${item.icono}" class="regalo-icon">
            <p class="regalo-label">${item.label}</p>
          </div>
        `,
        );
      });
    } else {
      removeSection("regalos");
    }

    /* ================= GALERÍA ================= */

    if (isEnabled(data.galeria)) {
      const g = data.galeria;
      setText("galeria-titulo", g.titulo);

      const track = document.getElementById("carousel-track");
      track.innerHTML = "";

      (data.media?.galeria || []).forEach((img) => {
        track.insertAdjacentHTML(
          "beforeend",
          `<img src="assets/img/${img}" class="carousel-img">`,
        );
      });
    } else {
      removeSection("galeria");
    }


    /* ================= RSVP ================= */

    if (isEnabled(data.rsvp)) {
      const rsvp = data.rsvp;

      const form = document.getElementById("rsvp-form");

      if (form) {
        // TÍTULO E INTRODUCCIÓN
        setText("rsvp-form-title", rsvp.titulo || "");

        const intro = form.querySelector(".rsvp-text");
        if (intro) {
          intro.textContent = rsvp.texto || "";
        }

        // SELECTOR DE ASISTENCIA
        const selectAsistencia = document.getElementById("rsvpAttendance");

        if (selectAsistencia) {
          selectAsistencia.innerHTML = "";

          const opcionInicial = document.createElement("option");
          opcionInicial.value = "";
          opcionInicial.textContent = "Selecciona tu respuesta";
          opcionInicial.disabled = true;
          opcionInicial.selected = true;

          const opcionSi = document.createElement("option");
          opcionSi.value = "Sí asistiré";
          opcionSi.textContent = rsvp.botones?.si || "Sí, asistiré";

          const opcionNo = document.createElement("option");
          opcionNo.value = "No podré asistir";
          opcionNo.textContent = rsvp.botones?.no || "No podré asistir";

          selectAsistencia.append(
            opcionInicial,
            opcionSi,
            opcionNo
          );
        }

        // BOTÓN DE CONFIRMACIÓN
        const btnEnviar = document.getElementById("rsvpButton");

        if (btnEnviar) {
          btnEnviar.textContent = "Confirmar por WhatsApp";
        }

        // FECHA LÍMITE
        let nota = rsvp.nota || "";

        if (rsvp.fecha_limite) {
          const fecha = new Date(rsvp.fecha_limite + "T00:00:00");

          const fechaBonita = fecha.toLocaleDateString("es-MX", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          nota = nota.replace("{{fecha_limite}}", fechaBonita);
        }

        const notaEl = document.getElementById("rsvpNote");

        if (notaEl) {
          notaEl.innerHTML = nota;
        }
      }

      // INFORMACIÓN DE PASES
      const passLabel = document.getElementById("rsvpPassLabel");
      const passValue = document.getElementById("rsvpPassValue");

      const tableLabel = document.getElementById("rsvpTableLabel");
      const tableValue = document.getElementById("rsvpTableValue");

      if (rsvp.pase?.enabled !== false && passLabel && passValue) {
        passLabel.textContent = rsvp.pase.label || "Pase para";

        const pases =
          window.__INVITADO__?.pases ??
          rsvp.pase.cantidad ??
          0;

        passValue.textContent =
          pases === 1 ? "1 persona" : `${pases} personas`;

      } else {
        passLabel?.closest(".rsvp-pass-item")?.remove();
      }

      // INFORMACIÓN DE MESA
      if (rsvp.mesa?.enabled !== false && tableLabel && tableValue) {
        tableLabel.textContent = rsvp.mesa.label || "Mesa asignada";

        const mesa =
          window.__INVITADO__?.mesa ??
          rsvp.mesa.numero ??
          "-";

        tableValue.textContent = `Mesa ${mesa}`;

      } else {
        tableLabel?.closest(".rsvp-pass-item")?.remove();
      }

      // OCULTAR CONTENEDOR SI NO HAY PASES NI MESA
      const passInfo = document.querySelector(".rsvp-pass-info");

      if (
        passInfo &&
        rsvp.pase?.enabled === false &&
        rsvp.mesa?.enabled === false
      ) {
        passInfo.remove();
      }

      // CONFIGURAR PANTALLA FINAL
      const rsvpNames = document.getElementById("rsvp-names");
      const rsvpFinalTitle = document.getElementById("rsvp-final-title");
      const rsvpFinalText = document.getElementById("rsvp-final-text");

      if (rsvp.final) {
        if (rsvpFinalTitle) {
          rsvpFinalTitle.textContent = rsvp.final.titulo || "";
        }

        if (rsvpFinalText) {
          rsvpFinalText.textContent = rsvp.final.texto || "";
        }

        if (rsvpNames) {
          rsvpNames.textContent = rsvp.final.firma || "";
        }
      }

    } else {
      removeSection("rsvp");
    }


    /* ================= FOOTER ================= */

    if (data.footer?.enabled !== false) {
      const footer = document.getElementById("footer-text");
      if (footer && data.footer?.text) {
        footer.innerHTML = data.footer.text;
      }
    }

    /* ================= EDITORIAL TEXTS ================= */

    applyEditorialTexts(data.editorial);

    /* ================= EVENT READY ================= */

    document.dispatchEvent(new Event("event:data:ready"));
    window.refreshScrollAnimations?.();
  })
  .catch((err) => {
    console.error("Error cargando evento.json:", err);
  });

/* ================= EDITORIAL ENGINE ================= */

function applyEditorialTexts(editorial) {
  if (!editorial) return;

  document.querySelectorAll("[data-editorial]").forEach((el) => {
    const key = el.dataset.editorial;
    const cfg = editorial[key];

    if (!cfg || !cfg.enabled || !cfg.text) {
      el.remove();
      return;
    }

    el.textContent = cfg.text;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(el);
  });
}