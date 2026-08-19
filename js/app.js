import {
  qrImageUrl,
  formatExpiry
} from './gr.js';

import {
  loadState,
  saveState,
  createId,
  resetState
} from './storage.js';

import {
  INITIAL_STATE,
  ACTIVITY_TYPES,
  AUDIENCES,
  ORGANIZATION
} from './data.js';


/* =========================================================
   UTILIDADES
   ========================================================= */

const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];


function escapeHTML(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}


function options(values, selected = '') {
  return values
    .map(value => {
      const isSelected =
        String(value) === String(selected)
          ? ' selected'
          : '';

      return `
        <option value="${escapeHTML(value)}"${isSelected}>
          ${escapeHTML(value)}
        </option>
      `;
    })
    .join('');
}


/* =========================================================
   ESTADO
   ========================================================= */

let state = loadState();

let activities = state.activities || [];
let registrations = state.registrations || [];
let contacts = state.contacts || [];

const icons = {
  Participação: '✦',
  Informação: 'ⓘ',
  Evento: '◉',
  Oportunidade: '↗',
  Campanha: '♥',
  Doação: '♥'
};


/* =========================================================
   PERSISTÊNCIA
   ========================================================= */

function persist() {
  state = {
    ...state,
    activities,
    registrations,
    contacts
  };

  saveState(state);
}


/* =========================================================
   ORGANIZAÇÃO
   ========================================================= */

function renderOrganization() {

  $$('[data-org-name]').forEach(element => {
    element.textContent =
      ORGANIZATION.name || 'GIRO';
  });


  $$('[data-org-headline]').forEach(element => {
    if (ORGANIZATION.headline) {
      element.textContent =
        ORGANIZATION.headline;
    }
  });


  $$('[data-org-summary]').forEach(element => {
    if (ORGANIZATION.summary) {
      element.textContent =
        ORGANIZATION.summary;
    }
  });


  const heroTotal =
    $('#hero-activity-total');

  if (heroTotal) {
    heroTotal.textContent =
      activities.length;
  }
}


/* =========================================================
   FILTROS
   ========================================================= */

function renderFilters() {

  const typeFilter =
    $('#filter-type');

  const periodFilter =
    $('#filter-period');

  const audienceFilter =
    $('#filter-audience');


  if (typeFilter) {
    typeFilter.innerHTML =
      `<option value="">Todos os tipos</option>` +
      options(ACTIVITY_TYPES);
  }


  if (periodFilter) {

    const periods = [
      ...new Set(
        activities
          .map(activity => activity.month)
          .filter(Boolean)
      )
    ];

    periodFilter.innerHTML =
      `<option value="">Todas as datas</option>` +
      options(periods);
  }


  if (audienceFilter) {
    audienceFilter.innerHTML =
      `<option value="">Todos os públicos</option>` +
      options(AUDIENCES);
  }
}
/* =========================================================
   ATIVIDADES PÚBLICAS
   ========================================================= */

function renderPublicActivities() {

  const container =
    $('#public-activities');

  if (!container) return;


  const type =
    $('#filter-type')?.value || '';

  const period =
    $('#filter-period')?.value || '';

  const audience =
    $('#filter-audience')?.value || '';


  const filtered =
    activities.filter(activity => {

      const matchesType =
        !type || activity.type === type;

      const matchesPeriod =
        !period || activity.month === period;

      const matchesAudience =
        !audience || activity.audience === audience;

      return (
        matchesType &&
        matchesPeriod &&
        matchesAudience
      );
    });


  const count =
    $('#activity-count');

  if (count) {
    count.textContent =
      `${filtered.length} ${
        filtered.length === 1
          ? 'atividade encontrada'
          : 'atividades encontradas'
      }`;
  }


  if (!filtered.length) {

    container.innerHTML = `
      <p class="empty">
        Nenhuma atividade corresponde
        aos filtros escolhidos.
      </p>
    `;

    return;
  }


  container.innerHTML =
    filtered
      .map(activity => `

        <article
          class="card activity-card"
        >

          <div
            class="activity-icon"
            aria-hidden="true"
          >
            ${
              activity.icon ||
              icons[activity.type] ||
              '✦'
            }
          </div>

          <div class="card-body">

            <span class="tag">
              ${escapeHTML(activity.type)}
            </span>

            <h3>
              ${escapeHTML(activity.title)}
            </h3>

            <p>
              ${escapeHTML(activity.description)}
            </p>

            <div class="activity-details">

              <span>
                <b>Data:</b>
                ${escapeHTML(activity.date)}
              </span>

              <span>
                <b>Horário:</b>
                ${escapeHTML(activity.time)}
              </span>

              <span>
                <b>Local:</b>
                ${escapeHTML(activity.place)}
              </span>

              <span>
                <b>Público:</b>
                ${escapeHTML(activity.audience)}
              </span>

              <span>
                <b>Vagas:</b>
                ${escapeHTML(
                  activity.spots ||
                  'A confirmar'
                )}
              </span>

            </div>


            <div class="activity-actions">

              <button
                class="button button-primary"
                type="button"
                data-register="${escapeHTML(activity.id)}"
              >
                Quero participar
              </button>

              <a
                class="button button-outline"
                target="_blank"
                rel="noopener"
                href="https://maps.google.com/?q=${encodeURIComponent(
                  activity.place || ''
                )}"
              >
                Ver local
              </a>

            </div>

          </div>

        </article>

      `)
      .join('');


  $$('[data-register]').forEach(button => {

    button.addEventListener(
      'click',
      () => {

        openRegistration(
          button.dataset.register
        );

      }
    );

  });
}


/* =========================================================
   ATIVIDADES EM DESTAQUE
   ========================================================= */

function renderFeatured() {

  const container =
    $('#featured-activities');

  if (!container) return;


  const featured =
    activities.slice(0, 3);


  container.innerHTML =
    featured
      .map(activity => `

        <article class="card">

          <div
            class="activity-icon"
            aria-hidden="true"
          >
            ${
              activity.icon ||
              icons[activity.type] ||
              '✦'
            }
          </div>

          <div class="card-body">

            <span class="tag">
              ${escapeHTML(activity.type)}
            </span>

            <h3>
              ${escapeHTML(activity.title)}
            </h3>

            <p>
              ${escapeHTML(activity.description)}
            </p>

            <div class="card-footer">

              <span class="meta">
                ${escapeHTML(activity.date)}
              </span>

              <button
                class="button button-primary"
                type="button"
                data-feature-register="${escapeHTML(activity.id)}"
              >
                Participar
              </button>

            </div>

          </div>

        </article>

      `)
      .join('');


  $$('[data-feature-register]').forEach(button => {

    button.addEventListener(
      'click',
      () => {

        openRegistration(
          button.dataset.featureRegister
        );

      }
    );

  });
}
/* =========================================================
   INSCRIÇÕES
   ========================================================= */

function openRegistration(id = '') {

  const dialog =
    $('#registration-dialog');

  const form =
    $('#registration-form');

  const activitySelect =
    $('#registration-activity');

  if (!dialog || !form || !activitySelect) {
    return;
  }


  /*
   * Preenche a lista de atividades.
   */

  activitySelect.innerHTML =
    `
      <option value="">
        Escolha uma atividade
      </option>
    ` +
    activities
      .map(activity => `
        <option
          value="${escapeHTML(activity.title)}"
          data-id="${escapeHTML(activity.id)}"
          ${String(activity.id) === String(id)
            ? 'selected'
            : ''}
        >
          ${escapeHTML(activity.title)}
        </option>
      `)
      .join('');


  /*
   * Se uma atividade específica foi escolhida,
   * preenche automaticamente o formulário.
   */

  if (id) {

    const activity =
      activities.find(
        item => String(item.id) === String(id)
      );

    if (activity) {
      activitySelect.value =
        activity.title;
    }
  }


  /*
   * Limpa os campos pessoais.
   */

  const name =
    $('#registration-name');

  const phone =
    $('#registration-phone');

  const email =
    $('#registration-email');

  if (name) name.value = '';
  if (phone) phone.value = '';
  if (email) email.value = '';


  /*
   * Abre o diálogo.
   */

  if (!dialog.open) {

    try {
      dialog.showModal();

    } catch {
      dialog.setAttribute(
        'open',
        ''
      );
    }

  }
}


/* =========================================================
   FECHAR DIÁLOGOS
   ========================================================= */

function closeDialog(dialog) {

  if (!dialog) return;

  if (dialog.open) {

    try {
      dialog.close();

    } catch {
      dialog.removeAttribute(
        'open'
      );
    }

  }

}


/* =========================================================
   TOAST / AVISOS
   ========================================================= */

function showToast(message) {

  const toast =
    $('#toast');

  if (!toast) return;

  toast.textContent =
    message;

  toast.classList.add(
    'is-visible'
  );


  window.clearTimeout(
    showToast.timer
  );


  showToast.timer =
    window.setTimeout(
      () => {

        toast.classList.remove(
          'is-visible'
        );

      },
      3500
    );
}


/* =========================================================
   FORMULÁRIO DE INSCRIÇÃO
   ========================================================= */

function handleRegistrationSubmit(
  event
) {

  event.preventDefault();


  const form =
    event.currentTarget;

  const data =
    Object.fromEntries(
      new FormData(form)
    );


  if (!data.activityTitle) {

    showToast(
      'Escolha uma atividade antes de continuar.'
    );

    return;
  }


  const registration = {

    id:
      createId('registration'),

    activityId:
      data.activityId || '',

    activityTitle:
      data.activityTitle,

    name:
      data.name || '',

    phone:
      data.phone || '',

    email:
      data.email || '',

    createdAt:
      new Date().toISOString()

  };


  registrations.push(
    registration
  );


  persist();


  closeDialog(
    $('#registration-dialog')
  );


  form.reset();


  renderAdmin();


  showToast(
    'Inscrição realizada com sucesso!'
  );
}


/* =========================================================
   FORMULÁRIO DE CONTATO
   ========================================================= */

function handleContactSubmit(
  event
) {

  event.preventDefault();


  const form =
    event.currentTarget;


  const data =
    Object.fromEntries(
      new FormData(form)
    );


  const contact = {

    id:
      createId('message'),

    name:
      data.name || '',

    email:
      data.email || '',

    phone:
      data.phone || '',

    subject:
      data.subject || '',

    message:
      data.message || '',

    createdAt:
      new Date().toISOString()

  };


  contacts.push(
    contact
  );


  persist();


  form.reset();


  renderAdmin();


  showToast(
    'Mensagem enviada com sucesso!'
  );
}
/* =========================================================
   ADMINISTRAÇÃO
   ========================================================= */

function isAdmin() {
  return sessionStorage.getItem(
    'giro-admin'
  ) === 'true';
}


/* =========================================================
   MOSTRAR / OCULTAR ADMIN
   ========================================================= */

function showAdmin() {

  const login =
    $('#admin-login');

  const panel =
    $('#admin-panel');

  if (login) {
    login.hidden = true;
  }

  if (panel) {
    panel.hidden = false;
    panel.classList.add(
      'is-visible'
    );
  }

  renderAdmin();
}


function hideAdmin() {

  const login =
    $('#admin-login');

  const panel =
    $('#admin-panel');

  if (login) {
    login.hidden = false;
  }

  if (panel) {
    panel.hidden = true;
    panel.classList.remove(
      'is-visible'
    );
  }
}


/* =========================================================
   RENDERIZAR ADMINISTRAÇÃO
   ========================================================= */

function renderAdmin() {

  const registrationTotal =
    $('#registration-total');

  const activityTotal =
    $('#activity-total');

  const contactTotal =
    $('#contact-total');


  if (registrationTotal) {
    registrationTotal.textContent =
      registrations.length;
  }

  if (activityTotal) {
    activityTotal.textContent =
      activities.length;
  }

  if (contactTotal) {
    contactTotal.textContent =
      contacts.length;
  }


  /*
   * Tabela de inscrições
   */

  const registrationTable =
    $('#registration-table');

  if (registrationTable) {

    if (!registrations.length) {

      registrationTable.innerHTML = `
        <tr>
          <td colspan="4">
            Ainda não há inscrições.
          </td>
        </tr>
      `;

    } else {

      registrationTable.innerHTML =
        registrations
          .map(item => `

            <tr>

              <td>
                ${escapeHTML(
                  item.name
                )}
              </td>

              <td>
                ${escapeHTML(
                  item.activityTitle ||
                  item.activity ||
                  ''
                )}
              </td>

              <td>
                ${escapeHTML(
                  item.phone || ''
                )}
                <br>
                ${escapeHTML(
                  item.email || ''
                )}
              </td>

              <td>
                ${formatDateTime(
                  item.createdAt
                )}
              </td>

            </tr>

          `)
          .join('');
    }
  }


  /*
   * Tabela de mensagens
   */

  const messageTable =
    $('#message-table');

  if (messageTable) {

    if (!contacts.length) {

      messageTable.innerHTML = `
        <tr>
          <td colspan="4">
            Ainda não há mensagens.
          </td>
        </tr>
      `;

    } else {

      messageTable.innerHTML =
        contacts
          .map(item => `

            <tr>

              <td>
                ${escapeHTML(
                  item.name || ''
                )}
              </td>

              <td>
                ${escapeHTML(
                  item.subject || ''
                )}
              </td>

              <td>
                ${escapeHTML(
                  item.message || ''
                )}
              </td>

              <td>
                ${formatDateTime(
                  item.createdAt
                )}
              </td>

            </tr>

          `)
          .join('');
    }
  }


  /*
   * Lista de atividades para QR Code
   */

  const qrActivity =
    $('#qr-activity');

  if (qrActivity) {

    qrActivity.innerHTML =
      `
        <option value="">
          Escolha uma atividade
        </option>
      ` +
      activities
        .map(activity => `

          <option
            value="${escapeHTML(
              activity.id
            )}"
          >
            ${escapeHTML(
              activity.title
            )}
          </option>

        `)
        .join('');
  }
}


/* =========================================================
   FORMATAÇÃO DE DATA E HORA
   ========================================================= */

function formatDateTime(
  value
) {

  if (!value) {
    return '—';
  }

  try {

    return new Intl.DateTimeFormat(
      'pt-BR',
      {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    ).format(
      new Date(value)
    );

  } catch {

    return '—';
  }
}


/* =========================================================
   LOGIN ADMINISTRATIVO
   ========================================================= */

function handleAdminLogin(
  event
) {

  event.preventDefault();


  const password =
    $('#admin-password');

  if (!password) {
    return;
  }


  /*
   * Senha usada pela demonstração.
   */

  if (
    password.value ===
    'conecta2026'
  ) {

    sessionStorage.setItem(
      'giro-admin',
      'true'
    );

    password.value = '';

    showAdmin();

    showToast(
      'Acesso administrativo liberado.'
    );

  } else {

    showToast(
      'Senha incorreta.'
    );

  }
}


/* =========================================================
   SAIR DA ADMINISTRAÇÃO
   ========================================================= */

function handleAdminLogout() {

  sessionStorage.removeItem(
    'giro-admin'
  );

  hideAdmin();

  showToast(
    'Sessão administrativa encerrada.'
  );
}


/* =========================================================
   NAVEGAÇÃO DA ADMINISTRAÇÃO
   ========================================================= */

function showAdminPage(
  pageName
) {

  $$('.admin-page').forEach(page => {

    const isActive =
      page.dataset.page === pageName;

    page.hidden = !isActive;

  });


  $$('.admin-nav [data-page]').forEach(
    button => {

      const isActive =
        button.dataset.page === pageName;

      button.classList.toggle(
        'is-active',
        isActive
      );

    }
  );
}


/* =========================================================
   DOWNLOAD DE INSCRIÇÕES — CSV
   ========================================================= */

function downloadRegistrations() {

  if (!registrations.length) {

    showToast(
      'Ainda não existem inscrições para baixar.'
    );

    return;
  }


  const header = [
    'Nome',
    'Atividade',
    'Telefone',
    'E-mail',
    'Recebida em'
  ];


  const rows =
    registrations.map(item => [

      item.name || '',

      item.activityTitle ||
      item.activity ||
      '',

      item.phone || '',

      item.email || '',

      formatDateTime(
        item.createdAt
      )

    ]);


  const csv = [
    header,
    ...rows
  ]
    .map(row =>
      row
        .map(value =>
          `"${String(value)
            .replaceAll('"', '""')}"`
        )
        .join(',')
    )
    .join('\n');


  const blob =
    new Blob(
      ['\ufeff' + csv],
      {
        type:
          'text/csv;charset=utf-8;'
      }
    );


  const url =
    URL.createObjectURL(blob);


  const link =
    document.createElement('a');

  link.href = url;

  link.download =
    'inscricoes-giro.csv';

  document.body.appendChild(
    link
  );

  link.click();

  link.remove();

  URL.revokeObjectURL(
    url
  );
}
/* =========================================================
   QR CODE TEMPORÁRIO
   ========================================================= */

function buildTemporaryQrUrl(
  activityId,
  minutes
) {

  const activity =
    activities.find(
      item =>
        String(item.id) ===
        String(activityId)
    );

  if (!activity) {
    return '';
  }


  const expiresAt =
    Date.now() +
    Number(minutes) * 60 * 1000;


  const url =
    new URL(
      window.location.href
    );


  url.searchParams.set(
    'activity',
    activity.id
  );

  url.searchParams.set(
    'expires',
    String(expiresAt)
  );


  return url.toString();
}


/* =========================================================
   GERAR QR CODE
   ========================================================= */

function handleQrSubmit(
  event
) {

  event.preventDefault();


  const form =
    event.currentTarget;


  const formData =
    new FormData(form);


  const activityId =
    formData.get(
      'activityId'
    );


  const minutes =
    Number(
      formData.get(
        'minutes'
      )
    );


  const output =
    $('#qr-output');


  if (!output || !activityId) {

    showToast(
      'Escolha uma atividade.'
    );

    return;
  }


  const activity =
    activities.find(
      item =>
        String(item.id) ===
        String(activityId)
    );


  if (!activity) {

    showToast(
      'Atividade não encontrada.'
    );

    return;
  }


  const expiresAt =
    Date.now() +
    minutes * 60 * 1000;


  const temporaryUrl =
    buildTemporaryQrUrl(
      activityId,
      minutes
    );


  const qrUrl =
    qrImageUrl(
      temporaryUrl,
      500
    );


  output.innerHTML = `

    <div class="qr-result">

      <h3>
        ${escapeHTML(
          activity.title
        )}
      </h3>

      <img
        src="${escapeHTML(qrUrl)}"
        alt="QR Code da atividade"
      >

      <p>
        Válido até
        ${escapeHTML(
          formatExpiry(expiresAt)
        )}
      </p>

      <a
        class="button button-outline"
        href="${escapeHTML(qrUrl)}"
        target="_blank"
        rel="noopener"
      >
        Abrir QR Code
      </a>

    </div>

  `;
}


/* =========================================================
   LEITURA DE QR CODE TEMPORÁRIO
   ========================================================= */

function handleTemporaryQr() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  const activityId =
    params.get(
      'activity'
    );


  const expires =
    Number(
      params.get(
        'expires'
      )
    );


  if (
    !activityId ||
    !expires
  ) {
    return;
  }


  if (
    Date.now() >= expires
  ) {

    showToast(
      'Este QR Code expirou.'
    );

    return;
  }


  const activity =
    activities.find(
      item =>
        String(item.id) ===
        String(activityId)
    );


  if (!activity) {
    return;
  }


  /*
   * Abre automaticamente
   * o formulário da atividade.
   */

  window.setTimeout(
    () => {

      openRegistration(
        activity.id
      );

    },
    250
  );
}


/* =========================================================
   CRIAÇÃO DE ATIVIDADES
   ========================================================= */

function handleActivitySubmit(
  event
) {

  event.preventDefault();


  const form =
    event.currentTarget;


  const data =
    Object.fromEntries(
      new FormData(form)
    );


  const activity = {

    id:
      createId('activity'),

    title:
      data.title || '',

    description:
      data.description || '',

    type:
      data.type || '',

    audience:
      data.audience || '',

    date:
      data.date || '',

    time:
      data.time || '',

    place:
      data.place || '',

    month:
      data.month ||
      data.period ||
      '',

    spots:
      data.spots || '',

    icon:
      data.icon || ''

  };


  if (!activity.title) {

    showToast(
      'Informe o nome da atividade.'
    );

    return;
  }


  activities.push(
    activity
  );


  persist();


  form.reset();


  renderFilters();

  renderPublicActivities();

  renderFeatured();

  renderAdmin();

  renderOrganization();


  showToast(
    'Atividade criada com sucesso!'
  );
}


/* =========================================================
   REMOVER ATIVIDADE
   ========================================================= */

function deleteActivity(
  id
) {

  const activity =
    activities.find(
      item =>
        String(item.id) ===
        String(id)
    );


  if (!activity) {
    return;
  }


  const confirmed =
    window.confirm(
      `Deseja remover a atividade "${activity.title}"?`
    );


  if (!confirmed) {
    return;
  }


  activities =
    activities.filter(
      item =>
        String(item.id) !==
        String(id)
    );


  persist();


  renderFilters();

  renderPublicActivities();

  renderFeatured();

  renderAdmin();

  renderOrganization();


  showToast(
    'Atividade removida.'
  );
}
/* =========================================================
   EVENTOS DA INTERFACE
   ========================================================= */

function initEvents() {

  /* -------------------------------------------------------
     MENU
     ------------------------------------------------------- */

  const menuButton =
    $('[data-action="toggle-menu"]');

  const menu =
    $('#menu');

  if (menuButton && menu) {

    menuButton.addEventListener(
      'click',
      () => {

        const isOpen =
          menu.classList.toggle(
            'is-open'
          );

        menuButton.setAttribute(
          'aria-expanded',
          String(isOpen)
        );

      }
    );
  }


  /* -------------------------------------------------------
     FECHAR MENU AO CLICAR EM UM LINK
     ------------------------------------------------------- */

  $$('#menu a').forEach(link => {

    link.addEventListener(
      'click',
      () => {

        if (!menu) return;

        menu.classList.remove(
          'is-open'
        );

        menuButton?.setAttribute(
          'aria-expanded',
          'false'
        );

      }
    );

  });


  /* -------------------------------------------------------
     FILTROS
     ------------------------------------------------------- */

  [
    '#filter-type',
    '#filter-period',
    '#filter-audience'
  ].forEach(selector => {

    const element =
      $(selector);

    if (!element) return;

    element.addEventListener(
      'change',
      renderPublicActivities
    );

  });


  /* -------------------------------------------------------
     BOTÃO GERAL "QUERO PARTICIPAR"
     ------------------------------------------------------- */

  const generalRegistration =
    $('[data-action="open-general-registration"]');

  if (generalRegistration) {

    generalRegistration.addEventListener(
      'click',
      () => openRegistration()
    );

  }


  /* -------------------------------------------------------
     FECHAR DIALOG
     ------------------------------------------------------- */

  $$('[data-action="close-dialog"]').forEach(
    button => {

      button.addEventListener(
        'click',
        () => {

          const dialog =
            button.closest('dialog');

          closeDialog(dialog);

        }
      );

    }
  );


  /* -------------------------------------------------------
     FORMULÁRIO DE INSCRIÇÃO
     ------------------------------------------------------- */

  const registrationForm =
    $('#registration-form');

  if (registrationForm) {

    registrationForm.addEventListener(
      'submit',
      handleRegistrationSubmit
    );

  }


  /* -------------------------------------------------------
     FORMULÁRIO DE CONTATO
     ------------------------------------------------------- */

  const contactForm =
    $('#contact-form');

  if (contactForm) {

    contactForm.addEventListener(
      'submit',
      handleContactSubmit
    );

  }


  /* -------------------------------------------------------
     LOGIN ADMINISTRATIVO
     ------------------------------------------------------- */

  const adminForm =
    $('#admin-form');

  if (adminForm) {

    adminForm.addEventListener(
      'submit',
      handleAdminLogin
    );

  }


  /* -------------------------------------------------------
     LOGOUT
     ------------------------------------------------------- */

  const adminLogout =
    $('#admin-logout');

  if (adminLogout) {

    adminLogout.addEventListener(
      'click',
      handleAdminLogout
    );

  }


  /* -------------------------------------------------------
     QR CODE
     ------------------------------------------------------- */

  const qrForm =
    $('#qr-form');

  if (qrForm) {

    qrForm.addEventListener(
      'submit',
      handleQrSubmit
    );

  }


  /* -------------------------------------------------------
     FORMULÁRIO DE ATIVIDADE
     ------------------------------------------------------- */

  const activityForm =
    $('#activity-form');

  if (activityForm) {

    activityForm.addEventListener(
      'submit',
      handleActivitySubmit
    );

  }


  /* -------------------------------------------------------
     NAVEGAÇÃO ADMINISTRATIVA
     ------------------------------------------------------- */

  $$('.admin-nav [data-page]').forEach(
    button => {

      button.addEventListener(
        'click',
        () => {

          showAdminPage(
            button.dataset.page
          );

        }
      );

    }
  );


  /* -------------------------------------------------------
     BOTÃO DE DOWNLOAD CSV
     ------------------------------------------------------- */

  $$('[data-action]').forEach(
    button => {

      button.addEventListener(
        'click',
        () => {

          const action =
            button.dataset.action;

          if (
            action ===
            'download-registrations'
          ) {

            downloadRegistrations();

          }

        }
      );

    }
  );


  /* -------------------------------------------------------
     VOLUNTARIADO
     ------------------------------------------------------- */

  const volunteerButton =
    $('[data-action="filter-volunteer"]');

  if (volunteerButton) {

    volunteerButton.addEventListener(
      'click',
      () => {

        const filter =
          $('#filter-type');

        if (!filter) return;

        const volunteerType =
          ACTIVITY_TYPES.find(
            type =>
              type
                .toLowerCase()
                .includes('volunt')
          );

        if (volunteerType) {

          filter.value =
            volunteerType;

          renderPublicActivities();

          document
            .querySelector('#atividades')
            ?.scrollIntoView({
              behavior: 'smooth'
            });

        } else {

          document
            .querySelector('#atividades')
            ?.scrollIntoView({
              behavior: 'smooth'
            });

        }

      }
    );

  }


  /* -------------------------------------------------------
     BOTÕES DE REMOÇÃO DE ATIVIDADES
     ------------------------------------------------------- */

  $$('[data-delete-activity]').forEach(
    button => {

      button.addEventListener(
        'click',
        () => {

          deleteActivity(
            button.dataset.deleteActivity
          );

        }
      );

    }
  );


  /* -------------------------------------------------------
     NAVEGAÇÃO PARA ADMINISTRAÇÃO
     ------------------------------------------------------- */

  $$('a[href="#administracao"]').forEach(
    link => {

      link.addEventListener(
        'click',
        () => {

          if (isAdmin()) {
            showAdmin();
          }

        }
      );

    }
  );

}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

function init() {

  renderOrganization();

  renderFilters();

  renderPublicActivities();

  renderFeatured();

  initEvents();


  if (isAdmin()) {
    showAdmin();
  } else {
    hideAdmin();
  }


  handleTemporaryQr();

}


/* =========================================================
   INICIAR A APLICAÇÃO
   ========================================================= */

init();