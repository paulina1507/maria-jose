
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

    function showFinal(nombre) {
      formBox.classList.add("hidden");
      section.classList.add("completed");

      const passLabel = document.getElementById("rsvpPassLabel");
      const passValue = document.getElementById("rsvpPassValue");
      const tableLabel = document.getElementById("rsvpTableLabel");
      const tableValue = document.getElementById("rsvpTableValue");

      if (rsvp.pase?.enabled && invitado?.pases) {
        if (passLabel) passLabel.textContent = rsvp.pase.label || "Pase para";
        if (passValue) {
          passValue.textContent =
            invitado.pases === 1 ? "1 persona" : `${invitado.pases} personas`;
        }
      } else {
        passLabel?.closest(".rsvp-pass-item")?.remove();
      }

      if (rsvp.mesa?.enabled && invitado?.mesa) {
        if (tableLabel) tableLabel.textContent = rsvp.mesa.label || "Mesa";
        if (tableValue) tableValue.textContent = `Mesa ${invitado.mesa}`;
      } else {
        tableLabel?.closest(".rsvp-pass-item")?.remove();
      }

      if (titleEl) {
        titleEl.textContent = rsvp.final?.titulo || "¡Gracias por responder!";
      }

      if (textEl) {
        textEl.textContent =
          rsvp.final?.texto ||
          "Agradecemos mucho que nos hayas compartido tu respuesta.";
      }

      if (namesEl) {
        namesEl.textContent = rsvp.final?.firma || "";
      }

      document.querySelectorAll(".rsvp-guest-name").forEach((el) => {
        el.textContent = nombre;
      });

      finalBox.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }

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

    // EVENTO DEL BOTÓN
    btnEnviar?.addEventListener("click", (e) => {
      e.preventDefault();
      enviarWhatsApp();
    });
  }

  // ESPERAR A QUE SE CARGUE EL JSON
  document.addEventListener("event:data:ready", initRSVP);

  if (window.__EVENT_DATA__) {
    initRSVP();
  }
})();
