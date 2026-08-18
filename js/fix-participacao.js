/*
 * Correção de segurança para o botão "Quero Participar".
 * Este arquivo deve ficar na mesma pasta do index.html.
 * Ele abre o formulário mesmo se a integração com banco de dados ainda não estiver pronta.
 */
(() => {
  function openRegistration(button) {
    const dialog = document.getElementById('register-dialog');
    const form = document.getElementById('registration-form');
    const activityField = document.getElementById('registration-activity');
    const activityName = document.getElementById('register-activity-name');
    if (!dialog || !form || !activityField || !activityName) return;

    const card = button.closest('.card');
    const title = card?.querySelector('h3')?.textContent?.trim() || '';
    form.reset();
    activityField.value = title;
    activityName.textContent = title || 'Escolha uma atividade na lista abaixo.';

    if (!dialog.open) {
      try {
        dialog.showModal();
      } catch {
        dialog.setAttribute('open', '');
      }
    }
    document.getElementById('registration-name')?.focus();
  }

  document.addEventListener('click', (event) => {
    const closeButton = event.target.closest('[data-close-dialog]');
    if (closeButton) {
      const dialog = closeButton.closest('dialog');
      if (dialog?.open) dialog.close();
      return;
    }

    const button = event.target.closest('[data-register], [data-feature-register], [data-db-register], [data-open-register]');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openRegistration(button);
  }, true);
})();