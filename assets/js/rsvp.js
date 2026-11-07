
(function () {
  let initialized = false;

  function initRSVP() {
    if (initialized) return;

    const formBox = document.getElementById("rsvp-form");
    const finalBox = document.getElementById("rsvp-final");
    const section = document.getElementById("rsvp");

    const data = window.__EVENT_DATA__;
    const invitado = window.__INVITADO__;

    if (!formBox || !finalBox || !section || !data?.rsvp) return;

    initialized = true;

    const rsvp = data.rsvp;

    const inputNombre = document.getElementById("rsvpNombreInput");
    const selectAsistencia = document.getElementById("rsvpAttendance");
    const inputMensaje = document.getElementById("rsvpMessage");
    const btnEnviar = document.getElementById("rsvpButton");

    // ELEMENTOS DE CONFIRMACIÓN FINAL
    const titleEl = document.getElementById("rsvp-final-title");
    const textEl = document.getElementById("rsvp-final-text");
    const namesEl = document.getElementById("rsvp-names");

    // CONFIGURAR SELECTOR
    if (selectAsistencia) {
      selectAsistencia.innerHTML = `
        <option value="" disabled selected>Selecciona tu respuesta</option>
        <option value="Sí asistiré">${rsvp.botones?.si || "Sí, asistiré"}</option>
        <option value="No podré asistir">${rsvp.botones?.no || "No podré asistir"}</option>
      `;
    }

    // CONFIGURAR BOTÓN
    if (btnEnviar) {
      btnEnviar.textContent = "Confirmar por WhatsApp";
    }

    // ==========================================
    // MOSTRAR CONFIRMACIÓN FINAL
    // ==========================================

    function showFinal(nombre) {
      formBox.classList.add("hidden");
      section.classList.add("completed");

      // ELEMENTOS DE PASES EN LA PANTALLA FINAL
      const passLabel = document.getElementById("rsvpFinalPassLabel");
      const passValue = document.getElementById("rsvpFinalPassValue");

      const tableLabel = document.getElementById("rsvpFinalTableLabel");
      const tableValue = document.getElementById("rsvpFinalTableValue");

      const finalPassInfo = document.querySelector(".rsvp-final-pass");

      let mostrarInformacion = false;

      // ==========================================
      // PASE PARA
      // ==========================================

      if (rsvp.pase?.enabled === true && invitado?.pases != null) {
        if (passLabel) {
          passLabel.textContent = rsvp.pase.label || "Pase para";
        }

        if (passValue) {
          passValue.textContent =
            invitado.pases === 1
              ? "1 persona"
              : `${invitado.pases} personas`;
        }

        mostrarInformacion = true;
      } else {
        passLabel?.closest(".rsvp-pass-item")?.remove();
      }

      // ==========================================
      // MESA ASIGNADA
      // ==========================================

      if (rsvp.mesa?.enabled === true && invitado?.mesa != null) {
        if (tableLabel) {
          tableLabel.textContent = rsvp.mesa.label || "Mesa";
        }

        if (tableValue) {
          tableValue.textContent = `Mesa ${invitado.mesa}`;
        }

        mostrarInformacion = true;
      } else {
        tableLabel?.closest(".rsvp-pass-item")?.remove();
      }

      // OCULTAR CONTENEDOR SI NO HAY DATOS
      if (finalPassInfo && !mostrarInformacion) {
        finalPassInfo.remove();
      }

      // ==========================================
      // TEXTOS DE CONFIRMACIÓN
      // ==========================================

      if (titleEl) {
        titleEl.textContent =
          rsvp.final?.titulo || "¡Gracias por responder!";
      }

      if (textEl) {
        textEl.textContent =
          rsvp.final?.texto ||
          "Agradecemos mucho que nos hayas compartido tu respuesta.";
      }

      if (namesEl) {
        namesEl.textContent = rsvp.final?.firma || "";
      }

      // ACTUALIZAR NOMBRE DEL INVITADO
      document.querySelectorAll(".rsvp-guest-name").forEach((el) => {
        el.textContent = nombre;
      });

      // DESPLAZAR A LA CONFIRMACIÓN
      finalBox.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }

    // ==========================================
    // ENVIAR CONFIRMACIÓN POR WHATSAPP
    // ==========================================

    function enviarWhatsApp() {
      const nombre = inputNombre?.value?.trim();
      const asistencia = selectAsistencia?.value;
      const mensajePersonal = inputMensaje?.value?.trim();

      // VALIDAR NOMBRE
      if (!nombre) {
        alert("Por favor, completa el campo de tu nombre 😊");
        inputNombre?.focus();
        return;
      }

      // VALIDAR ASISTENCIA
      if (!asistencia) {
        alert("Por favor, selecciona si podrás acompañarnos 😊");
        selectAsistencia?.focus();
        return;
      }

      // VALIDAR TELÉFONO
      const telefono = rsvp.telefono;

      if (!telefono) {
        alert("No hay un número de WhatsApp configurado.");
        return;
      }

      const nombreLimpio = nombre.replace(/^Familia\s+/i, "");
      const nombreEvento = data.evento?.host?.nombre || "María José";

      let textoWA = "";

      if (asistencia === "Sí asistiré") {
        textoWA = `Hola
Soy ${nombreLimpio}.

Con mucha alegría confirmo mi asistencia a los XV años de ${nombreEvento}.

${mensajePersonal
          ? `Mi mensaje: ${mensajePersonal}`
          : "¡Nos vemos pronto!"}`;
      } else {
        textoWA = `Hola
Soy ${nombreLimpio}.

Lamentablemente no podré acompañarlos en los XV años de ${nombreEvento}.

${mensajePersonal
          ? `Mi mensaje: ${mensajePersonal}`
          : "Les mando un abrazo con cariño."}`;
      }

      const url = `https://wa.me/${telefono}?text=${encodeURIComponent(textoWA)}`;

      // ABRIR WHATSAPP
      window.open(url, "_blank");

      // MOSTRAR CONFIRMACIÓN FINAL
      showFinal(nombreLimpio);
    }

    // ==========================================
    // EVENTO DEL BOTÓN
    // ==========================================

    btnEnviar?.addEventListener("click", (e) => {
      e.preventDefault();
      enviarWhatsApp();
    });
  }

  // ==========================================
  // ESPERAR A QUE SE CARGUE EL JSON
  // ==========================================

  document.addEventListener("event:data:ready", initRSVP);

  if (window.__EVENT_DATA__) {
    initRSVP();
  }
})();
