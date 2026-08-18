
    if (action === 'download-registrations') downloadRegistrations();
  });
}

function init() {
  $('#activity-form [name="type"]').innerHTML = options(ACTIVITY_TYPES);
  $('#activity-form [name="audience"]').innerHTML = options(AUDIENCES);
  renderOrganization(); renderFilters(); renderPublicActivities(); initEvents();
  if (isAdmin()) showAdmin(); else hideAdmin();
  handleTemporaryQr();
}
init();