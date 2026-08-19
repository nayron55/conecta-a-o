/* =========================================================
   GIRO INTERFACE
   Microinterações visuais
   ========================================================= */

(() => {

  "use strict";


  /* =======================================================
     ELEMENTOS INTERATIVOS
     ======================================================= */

  const interactiveIcons = document.querySelectorAll(
    ".activity-icon, .support-icon"
  );


  /* =======================================================
     EFEITO DE PROXIMIDADE

     Não espera apenas o :hover.
     Quando o mouse chega perto do ícone,
     ele pode responder suavemente.
     ======================================================= */

  document.addEventListener("mousemove", (event) => {

    interactiveIcons.forEach((icon) => {

      const rect = icon.getBoundingClientRect();

      const centerX =
        rect.left + rect.width / 2;

      const centerY =
        rect.top + rect.height / 2;

      const distance = Math.hypot(
        event.clientX - centerX,
        event.clientY - centerY
      );


      /*
       * Só reage quando o cursor está
       * relativamente próximo.
       */

      if (distance < 90) {

        const intensity =
          Math.max(
            0,
            1 - distance / 90
          );

        const scale =
          1 + (0.055 * intensity);

        icon.style.transform =
          `scale(${scale})`;

        icon.style.filter =
          `brightness(${1 + intensity * 0.08})`;

      } else {

        /*
         * Não força transformações
         * quando o cursor está longe.
         */

        if (
          !icon.matches(":hover")
        ) {

          icon.style.transform = "";
          icon.style.filter = "";
        }
      }

    });

  });


})();
/* =========================================================
   GIRO — CURSOR LIGHT
   ========================================================= */

(() => {

  const hero =
    document.querySelector(".giro-hero");

  if (!hero) return;


  hero.addEventListener(
    "mousemove",
    (event) => {

      const rect =
        hero.getBoundingClientRect();

      const x =
        ((event.clientX - rect.left) / rect.width) * 100;

      const y =
        ((event.clientY - rect.top) / rect.height) * 100;


      hero.style.setProperty(
        "--cursor-x",
        `${x}%`
      );

      hero.style.setProperty(
        "--cursor-y",
        `${y}%`
      );

    }
  );


})();