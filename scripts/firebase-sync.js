/**
 * Pecera Social - Firebase Firestore Cloud Real-time Synchronization
 * Connects webapp with Firestore so tickets submitted from iPhone (iOS Shortcuts),
 * Android (HTTP Shortcuts / PWA) or web input synchronize in real-time across devices.
 */

const FIREBASE_STORAGE_KEY = 'pecera_social_firebase_config_v1';

export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDLl_2Wjkh4wYGqISIkmiYcL5vkgTWcGqo",
  authDomain: "fishtickets.firebaseapp.com",
  projectId: "fishtickets",
  storageBucket: "fishtickets.firebasestorage.app",
  messagingSenderId: "811875185407",
  appId: "1:811875185407:web:3d426b1192705b696912ca",
  measurementId: "G-D3KB2TPKEY"
};

export class FirebaseSync {
  constructor() {
    this.app = null;
    this.db = null;
    this.unsubscribeTickets = null;
    this.unsubscribeCategories = null;
    this.onTicketsSync = null;
    this.onCategoriesSync = null;
    this.status = 'unconfigured'; // 'unconfigured' | 'connecting' | 'connected' | 'error'
    this.statusMessage = 'Modo Local (localStorage activo)';
    this.listeners = new Set();
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(FIREBASE_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.projectId && parsed.apiKey) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Could not read firebase config:', e);
    }
    return { ...DEFAULT_FIREBASE_CONFIG };
  }

  saveConfig(newConfig) {
    if (!newConfig || !newConfig.projectId) {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(FIREBASE_STORAGE_KEY);
      }
      this.config = null;
      this.disconnect();
      return;
    }
    this.config = {
      apiKey: newConfig.apiKey.trim(),
      authDomain: newConfig.authDomain ? newConfig.authDomain.trim() : `${newConfig.projectId.trim()}.firebaseapp.com`,
      projectId: newConfig.projectId.trim(),
      storageBucket: newConfig.storageBucket ? newConfig.storageBucket.trim() : `${newConfig.projectId.trim()}.appspot.com`,
      messagingSenderId: newConfig.messagingSenderId ? newConfig.messagingSenderId.trim() : '',
      appId: newConfig.appId ? newConfig.appId.trim() : ''
    };
    localStorage.setItem(FIREBASE_STORAGE_KEY, JSON.stringify(this.config));
    this.init();
  }

  isConfigured() {
    return Boolean(this.config && this.config.projectId && this.config.apiKey);
  }

  onStatusChange(callback) {
    this.listeners.add(callback);
    callback({ status: this.status, message: this.statusMessage, config: this.config });
    return () => this.listeners.delete(callback);
  }

  notifyStatus(status, message) {
    this.status = status;
    this.statusMessage = message;
    this.listeners.forEach(cb => {
      try { cb({ status: this.status, message: this.statusMessage, config: this.config }); } catch (e) {}
    });
  }

  async init(onTicketsSyncCallback = null, onCategoriesSyncCallback = null) {
    if (onTicketsSyncCallback) {
      this.onTicketsSync = onTicketsSyncCallback;
    }
    if (onCategoriesSyncCallback) {
      this.onCategoriesSync = onCategoriesSyncCallback;
    }

    if (!this.isConfigured()) {
      this.notifyStatus('unconfigured', 'Modo Local (Sin sincronización en la nube)');
      return false;
    }

    this.notifyStatus('connecting', 'Conectando con Firebase Firestore...');

    try {
      // Dynamically load official Firebase v10 SDK via CDN ES Modules
      const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js');
      const { 
        getFirestore, 
        collection, 
        onSnapshot, 
        doc, 
        setDoc, 
        deleteDoc, 
        query, 
        orderBy, 
        limit 
      } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');

      this.firestoreOps = { doc, setDoc, deleteDoc, collection, query, orderBy, limit };

      const existingApps = getApps();
      this.app = existingApps.length > 0 ? existingApps[0] : initializeApp(this.config);
      this.db = getFirestore(this.app);

      this.setupTicketsListener(collection, query, orderBy, limit, onSnapshot);
      this.setupCategoriesListener(collection, onSnapshot);
      this.notifyStatus('connected', `Conectado a Firebase (${this.config.projectId})`);
      return true;
    } catch (err) {
      console.error('Firebase initialization error:', err);
      this.notifyStatus('error', `Error de conexión: ${err.message || 'Verifica tus credenciales'}`);
      return false;
    }
  }

  setupTicketsListener(collection, query, orderBy, limit, onSnapshot) {
    if (this.unsubscribeTickets) {
      this.unsubscribeTickets();
      this.unsubscribeTickets = null;
    }

    try {
      const ticketsCol = collection(this.db, 'tickets');
      // Listen to recent 200 tickets (query without strict orderBy so documents created via REST API without createdAt are not omitted by Firestore)
      const q = query(ticketsCol, limit(200));

      this.unsubscribeTickets = onSnapshot(q, (snapshot) => {
        const cloudTickets = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          // Fallback to Firestore document createTime or now if createdAt was not supplied
          const resolvedCreatedAt = data.createdAt || 
            (docSnap._document?.createTime?.timestamp ? new Date(docSnap._document.createTime.timestamp.seconds * 1000).toISOString() : new Date().toISOString());

          cloudTickets.push({
            id: docSnap.id,
            url: data.url || '',
            platform: data.platform || 'generic',
            title: data.title || 'Publicación',
            author: data.author || '',
            thumbnail: data.thumbnail || '',
            mediaType: data.mediaType || 'video',
            categoryId: data.categoryId || 'cat-general',
            sender: data.sender || 'General',
            createdAt: resolvedCreatedAt
          });
        });

        // Sort descending by createdAt in memory
        cloudTickets.sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        });

        if (this.onTicketsSync) {
          this.onTicketsSync(cloudTickets);
        }
      }, (err) => {
        console.warn('Firestore tickets snapshot error:', err);
        this.notifyStatus('error', `Error en tiempo real (tickets): ${err.message}`);
      });
    } catch (e) {
      console.error('Failed to setup tickets listener:', e);
    }
  }

  setupCategoriesListener(collection, onSnapshot) {
    if (this.unsubscribeCategories) {
      this.unsubscribeCategories();
      this.unsubscribeCategories = null;
    }

    try {
      const categoriesCol = collection(this.db, 'categories');

      this.unsubscribeCategories = onSnapshot(categoriesCol, (snapshot) => {
        const cloudCategories = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          cloudCategories.push({
            id: docSnap.id,
            name: data.name || 'Categoría',
            color: data.color || '#00e5ff',
            order: typeof data.order === 'number' ? data.order : 999,
            createdAt: data.createdAt || ''
          });
        });

        // Sort by order ascending, then by createdAt
        cloudCategories.sort((a, b) => (a.order - b.order) || (a.createdAt > b.createdAt ? 1 : -1));

        if (this.onCategoriesSync) {
          this.onCategoriesSync(cloudCategories);
        }
      }, (err) => {
        console.warn('Firestore categories snapshot error:', err);
      });
    } catch (e) {
      console.error('Failed to setup categories listener:', e);
    }
  }

  async addTicket(ticket) {
    if (!this.db || !this.firestoreOps) return false;
    try {
      const { doc, setDoc } = this.firestoreOps;
      const ticketRef = doc(this.db, 'tickets', ticket.id);
      await setDoc(ticketRef, {
        url: ticket.url,
        platform: ticket.platform || 'generic',
        title: ticket.title || 'Publicación',
        author: ticket.author || '',
        thumbnail: ticket.thumbnail || '',
        mediaType: ticket.mediaType || 'video',
        categoryId: ticket.categoryId || 'cat-general',
        sender: ticket.sender || 'George',
        createdAt: ticket.createdAt || new Date().toISOString()
      });
      return true;
    } catch (e) {
      console.error('Failed to add ticket to Firestore:', e);
      return false;
    }
  }

  async deleteTicket(ticketId) {
    if (!this.db || !this.firestoreOps) return false;
    try {
      const { doc, deleteDoc } = this.firestoreOps;
      await deleteDoc(doc(this.db, 'tickets', ticketId));
      return true;
    } catch (e) {
      console.error('Failed to delete ticket from Firestore:', e);
      return false;
    }
  }

  async addCategory(category, order = 999) {
    if (!this.db || !this.firestoreOps) return false;
    try {
      const { doc, setDoc } = this.firestoreOps;
      const catRef = doc(this.db, 'categories', category.id);
      await setDoc(catRef, {
        name: category.name,
        color: category.color || '#00e5ff',
        order: typeof category.order === 'number' ? category.order : order,
        createdAt: category.createdAt || new Date().toISOString()
      });
      return true;
    } catch (e) {
      console.error('Failed to add category to Firestore:', e);
      return false;
    }
  }

  async deleteCategory(categoryId) {
    if (!this.db || !this.firestoreOps) return false;
    try {
      const { doc, deleteDoc } = this.firestoreOps;
      await deleteDoc(doc(this.db, 'categories', categoryId));
      return true;
    } catch (e) {
      console.error('Failed to delete category from Firestore:', e);
      return false;
    }
  }

  disconnect() {
    if (this.unsubscribeTickets) {
      this.unsubscribeTickets();
      this.unsubscribeTickets = null;
    }
    if (this.unsubscribeCategories) {
      this.unsubscribeCategories();
      this.unsubscribeCategories = null;
    }
    this.notifyStatus('unconfigured', 'Modo Local (localStorage activo)');
  }

  /**
   * Generates the REST API endpoint and JSON payload for iOS Shortcuts and Android HTTP Shortcuts.
   */
  getRestApiInfo(senderName = 'George') {
    const projectId = this.config ? this.config.projectId : 'TU-PROYECTO-FIREBASE';
    const endpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/tickets`;
    
    const samplePayload = {
      fields: {
        url: { stringValue: "https://www.instagram.com/reel/ejemplo/" },
        sender: { stringValue: senderName },
        title: { stringValue: `Reel compartido por ${senderName}` },
        platform: { stringValue: "instagram" },
        mediaType: { stringValue: "video" },
        categoryId: { stringValue: "cat-general" },
        createdAt: { stringValue: new Date().toISOString() }
      }
    };

    return {
      endpoint,
      projectId,
      samplePayload,
      curlCommand: `curl -X POST "${endpoint}" -H "Content-Type: application/json" -d '${JSON.stringify(samplePayload)}'`
    };
  }
}

export const firebaseSync = new FirebaseSync();
