import { INITIAL_STATE } from './data.js';

const STORAGE_KEY = 'conecta-acao-v2-state';
const clone = (value) => JSON.parse(JSON.stringify(value));

export function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (error) {
    console.warn('Não foi possível ler os dados locais.', error);
  }
  const initial = clone(INITIAL_STATE);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

export function createId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function resetState() {
  const initial = clone(INITIAL_STATE);
  saveState(initial);
  return initial;
}