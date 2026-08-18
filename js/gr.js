export function buildTemporaryQrUrl(activityId, minutes) {
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = 'atividades';
  url.searchParams.set('activity', activityId);
  url.searchParams.set('expires', String(Date.now() + Number(minutes) * 60 * 1000));
  url.searchParams.set('token', crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);
  return url.toString();
}

export function qrImageUrl(content, size = 600) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&format=png&data=${encodeURIComponent(content)}`;
}

export function formatExpiry(timestamp) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(Number(timestamp)));
}