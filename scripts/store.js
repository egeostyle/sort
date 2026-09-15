import { firebaseSync } from './firebase-sync.js';

const STORAGE_KEYS = {
  TICKETS: 'pecera_social_tickets_v1',
  CATEGORIES: 'pecera_social_categories_v1',
  SETTINGS: 'pecera_social_settings_v1',
  ACTIVE_SENDER: 'pecera_social_active_sender_v1'
};

const DEFAULT_CATEGORIES = [
  { id: 'cat-viral', name: 'Viral & Tendencias', color: '#00e5ff' },
  { id: 'cat-humor', name: 'Humor & Memes', color: '#ff2a85' },
  { id: 'cat-aprender', name: 'Tips & Aprendizaje', color: '#ffd166' },
  { id: 'cat-musica', name: 'Música & Arte', color: '#a855f7' },
  { id: 'cat-general', name: 'General', color: '#06d6a0' }
];

class Store {
  constructor() {
    this.subscribers = new Map();
    this.categories = this.loadCategories();
    this.tickets = this.loadTickets();
    this.settings = this.loadSettings();
    this.activeSender = (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEYS.ACTIVE_SENDER)) || 'George';
    this.initCloudSync();
  }

  setActiveSender(sender) {
    this.activeSender = sender || 'George';
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SENDER, this.activeSender);
    }
    this.emit('SENDER_CHANGED', this.activeSender);
  }

  initCloudSync() {
    firebaseSync.init(
      (cloudTickets) => {
        this.handleCloudTickets(cloudTickets);
      },
      (cloudCategories) => {
        this.handleCloudCategories(cloudCategories);
      }
    );
  }

  handleCloudCategories(cloudCategories) {
    if (!Array.isArray(cloudCategories)) return;

    // If Firestore has NO categories at all yet, seed them from current local store
    if (cloudCategories.length === 0 && this.categories.length > 0) {
      if (firebaseSync.isConfigured()) {
        console.log('🌱 Inicializando categorías base en Firestore...');
        this.categories.forEach((cat, idx) => {
          firebaseSync.addCategory({ ...cat, order: idx });
        });
      }
      return;
    }

    if (cloudCategories.length > 0) {
      // Check if different from current local categories to avoid unnecessary re-renders
      const currentJson = JSON.stringify(this.categories);
      const newJson = JSON.stringify(cloudCategories);
      if (currentJson !== newJson) {
        this.categories = cloudCategories;
        this.saveLocalCategoriesOnly();
        this.emit('CATEGORIES_UPDATED', this.categories);
      }
    }
  }

  saveLocalCategoriesOnly() {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(this.categories));
    } catch (err) {
      console.error('Failed to save categories locally:', err);
    }
  }

  handleCloudTickets(cloudTickets) {
    if (!Array.isArray(cloudTickets)) return;

    const existingIds = new Set(this.tickets.map(t => t.id));
    const newItems = cloudTickets.filter(t => !existingIds.has(t.id));

    this.tickets = cloudTickets;
    this.saveLocalTicketsOnly();
    this.emit('TICKETS_UPDATED', this.tickets);

    // If new tickets arrived from another device (iPhone / Android shortcut)
    if (newItems.length > 0) {
      newItems.forEach(item => {
        this.emit('TICKET_ADDED', item);
      });
      this.emit('REMOTE_TICKETS_ARRIVED', newItems);
    }
  }

  saveLocalTicketsOnly() {
    try {
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(this.tickets));
    } catch (err) {
      console.error('Failed to save tickets locally:', err);
    }
  }

  // Pub / Sub mechanism
  on(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Error in event listener for ${event}:`, e);
        }
      });
    }
  }

  // Categories
  loadCategories() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.warn('Could not read categories from localStorage:', err);
    }
    return [...DEFAULT_CATEGORIES];
  }

  saveCategories() {
    this.saveLocalCategoriesOnly();
    this.emit('CATEGORIES_UPDATED', this.categories);
  }

  addCategory(name, color) {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const newCat = {
      id: 'cat-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: trimmed,
      color: color || '#00e5ff',
      order: this.categories.length,
      createdAt: new Date().toISOString()
    };
    this.categories.push(newCat);
    this.saveCategories();
    this.emit('CATEGORY_ADDED', newCat);

    if (firebaseSync.isConfigured()) {
      firebaseSync.addCategory(newCat, this.categories.length);
    }

    return newCat;
  }

  deleteCategory(categoryId) {
    // Reassign tickets in deleted category to first available category
    const remaining = this.categories.filter(c => c.id !== categoryId);
    if (remaining.length === 0) {
      alert('Debe existir al menos una categoría.');
      return false;
    }
    const fallbackId = remaining[0].id;
    this.tickets.forEach(ticket => {
      if (ticket.categoryId === categoryId) {
        ticket.categoryId = fallbackId;
      }
    });
    this.saveTickets();

    this.categories = remaining;
    this.saveCategories();
    this.emit('CATEGORY_DELETED', categoryId);

    if (firebaseSync.isConfigured()) {
      firebaseSync.deleteCategory(categoryId);
    }
    return true;
  }

  getCategory(categoryId) {
    return this.categories.find(c => c.id === categoryId) || this.categories[0];
  }

  // Tickets
  loadTickets() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TICKETS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (err) {
      console.warn('Could not read tickets from localStorage:', err);
    }
    return [];
  }

  saveTickets() {
    try {
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(this.tickets));
    } catch (err) {
      console.error('Failed to save tickets:', err);
    }
    this.emit('TICKETS_UPDATED', this.tickets);
  }

  addTicket(ticketData) {
    const ticket = {
      id: 'tkt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      url: ticketData.url,
      platform: ticketData.platform || 'generic',
      title: ticketData.title || 'Publicación',
      author: ticketData.author || '',
      thumbnail: ticketData.thumbnail || '',
      mediaType: ticketData.mediaType || 'video',
      categoryId: ticketData.categoryId || (this.categories[0] ? this.categories[0].id : 'cat-general'),
      sender: ticketData.sender || this.activeSender || 'George',
      createdAt: new Date().toISOString()
    };

    this.tickets.unshift(ticket);
    this.saveTickets();
    this.emit('TICKET_ADDED', ticket);

    // Sync to cloud if Firebase is connected
    if (firebaseSync.isConfigured()) {
      firebaseSync.addTicket(ticket);
    }

    return ticket;
  }

  deleteTicket(ticketId) {
    const index = this.tickets.findIndex(t => t.id === ticketId);
    if (index !== -1) {
      const removed = this.tickets.splice(index, 1)[0];
      this.saveTickets();
      this.emit('TICKET_DELETED', removed);

      if (firebaseSync.isConfigured()) {
        firebaseSync.deleteTicket(ticketId);
      }
      return true;
    }
    return false;
  }

  clearAllTickets() {
    const toDelete = [...this.tickets];
    this.tickets = [];
    this.saveTickets();
    this.emit('TICKETS_CLEARED');

    if (firebaseSync.isConfigured()) {
      toDelete.forEach(t => firebaseSync.deleteTicket(t.id));
    }
  }

  getTickets(categoryId = null, sender = null) {
    let pool = this.tickets;
    if (categoryId && categoryId !== 'all') {
      pool = pool.filter(t => t.categoryId === categoryId);
    }
    if (sender && sender !== 'all') {
      pool = pool.filter(t => (t.sender || '').toLowerCase() === sender.toLowerCase());
    }
    return pool;
  }

  getTicketCount(categoryId = null, sender = null) {
    return this.getTickets(categoryId, sender).length;
  }

  getSenderCounts() {
    let george = 0;
    let yenka = 0;
    let other = 0;

    this.tickets.forEach(t => {
      const s = (t.sender || '').toLowerCase();
      if (s.includes('george')) george++;
      else if (s.includes('yenka')) yenka++;
      else other++;
    });

    return { george, yenka, other, total: this.tickets.length };
  }

  // Raffle selection logic
  drawRandomTicket(categoryId = 'all', sender = 'all') {
    const pool = this.getTickets(categoryId, sender);
    if (!pool || pool.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }

  // Settings
  loadSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return { soundEnabled: true };
  }

  saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    } catch (e) {}
    this.emit('SETTINGS_UPDATED', this.settings);
  }

  setSoundEnabled(enabled) {
    this.settings.soundEnabled = Boolean(enabled);
    this.saveSettings();
  }

  // Export / Import
  exportBackup() {
    return JSON.stringify({
      version: 1,
      exportedAt: new Date().toISOString(),
      categories: this.categories,
      tickets: this.tickets
    }, null, 2);
  }

  importBackup(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.categories)) {
        this.categories = data.categories;
        this.saveCategories();
        if (firebaseSync.isConfigured()) {
          this.categories.forEach((cat, idx) => {
            firebaseSync.addCategory({ ...cat, order: idx });
          });
        }
      }
      if (Array.isArray(data.tickets)) {
        this.tickets = data.tickets;
        this.saveTickets();
        if (firebaseSync.isConfigured()) {
          this.tickets.forEach(t => firebaseSync.addTicket(t));
        }
      }
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }
}

export const store = new Store();
