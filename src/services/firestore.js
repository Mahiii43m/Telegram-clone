// src/services/firestore.js
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  onSnapshot, 
  doc, 
  updateDoc,
  setDoc,
  query,
  orderBy,
} from 'firebase/firestore';

// ─── DEPARTMENTS ──────────────────────────────────────────────
// Real‑time listener for departments
export const getDepartments = (callback) => {
  const q = collection(db, 'departments');
  return onSnapshot(q, (snapshot) => {
    const departments = [];
    snapshot.forEach((doc) => {
      departments.push({ id: doc.id, ...doc.data() });
    });
    callback(departments);
  }, (error) => {
    console.error('Error fetching departments:', error);
  });
};

// Update a department's name
export const updateDepartment = async (id, data) => {
  try {
    await updateDoc(doc(db, 'departments', id), data);
  } catch (error) {
    console.error('Error updating department:', error);
    throw error;
  }
};

// ─── CHATS ──────────────────────────────────────────────────────
// Real‑time listener for chats (ordered by lastMessageTime descending)
export const getChats = (callback) => {
  const q = query(collection(db, 'chats'), orderBy('lastMessageTime', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const chats = [];
    snapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() });
    });
    callback(chats);
  }, (error) => {
    console.error('Error fetching chats:', error);
  });
};

// Mark a chat as read (set unread to 0)
export const markChatRead = async (chatId) => {
  try {
    await updateDoc(doc(db, 'chats', chatId), { unread: 0 });
  } catch (error) {
    console.error('Error marking chat read:', error);
    throw error;
  }
};

// ─── SEED DATA (run once to populate Firestore) ──────────────
export const seedInitialData = async () => {
  try {
    // Departments
    const depts = [
      { name: 'Geologo Department', admin: 'Dr. Alene', status: 'online', time: new Date().toLocaleTimeString() },
      { name: 'Natan Ethiopia', admin: '', status: 'online', time: 'now' },
      { name: 'Space Operations', admin: 'Dir. Kassa', status: 'online', time: new Date().toLocaleTimeString() },
      { name: 'Geospatial Division', admin: 'Amina', status: 'warning', time: new Date().toLocaleTimeString() },
      { name: 'Orbit Chat Support', admin: '', status: 'online', time: 'always' },
    ];
    for (const dept of depts) {
      const docRef = doc(collection(db, 'departments'));
      await setDoc(docRef, dept);
    }

    // Chats
    const chats = [
      { 
        name: 'Dr. Alene', 
        last: 'See you tomorrow', 
        time: '11:45 AM', 
        unread: 2, 
        thread: ['Hi, meeting at 10?', 'Yes, see you tomorrow'], 
        lastMessageTime: new Date('2026-07-31T11:45:00') 
      },
      { 
        name: 'Dir. Kassa', 
        last: 'Launch go/no-go', 
        time: '11:42 AM', 
        unread: 5, 
        thread: ['Checklist ready?', 'Launch go/no-go', 'All systems nominal'], 
        lastMessageTime: new Date('2026-07-31T11:42:00') 
      },
      { 
        name: 'Amina', 
        last: 'Coordinates sent', 
        time: '10:35 AM', 
        unread: 1, 
        thread: ['Coordinate data updated', 'Coordinates sent'], 
        lastMessageTime: new Date('2026-07-31T10:35:00') 
      },
      { 
        name: 'Support Bot', 
        last: 'Welcome!', 
        time: '09:10 AM', 
        unread: 1, 
        thread: ['Welcome to your premium terminal'], 
        lastMessageTime: new Date('2026-07-31T09:10:00') 
      },
    ];
    for (const chat of chats) {
      const docRef = doc(collection(db, 'chats'));
      await setDoc(docRef, chat);
    }
    console.log('✅ Seed data added successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
};