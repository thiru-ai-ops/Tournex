import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  onSnapshot, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { UserProfile, Expense, Booking, Message } from '../types';
import { apiPost } from './api';

/**
 * Creates or retrieves user profile securely from Firestore.
 */
export async function syncUserProfile(userId: string, defaultProfile: UserProfile): Promise<UserProfile> {
  const profileRef = doc(db, 'users', userId);
  const path = `users/${userId}`;
  
  try {
    const snap = await getDoc(profileRef);
    if (snap.exists()) {
      const data = snap.data();
      // map flat schema keys to nested schema structure in UserProfile state
      const profile: UserProfile = {
        name: data.name || defaultProfile.name,
        tier: data.tier || defaultProfile.tier,
        bio: data.bio || defaultProfile.bio,
        location: data.location || defaultProfile.location,
        joinDate: data.joinDate || defaultProfile.joinDate,
        avatar: data.avatar || defaultProfile.avatar,
        stats: {
          statesVisited: data.statesVisited ?? defaultProfile.stats.statesVisited,
          savedTripsCount: data.savedTripsCount ?? defaultProfile.stats.savedTripsCount,
          reviewsCount: data.reviewsCount ?? defaultProfile.stats.reviewsCount,
          savedTotal: data.savedTotal ?? defaultProfile.stats.savedTotal,
        },
        level: data.level ?? defaultProfile.level,
        currentXp: data.currentXp ?? defaultProfile.currentXp,
        maxXp: data.maxXp ?? defaultProfile.maxXp,
      };
      return profile;
    } else {
      // Flatten the profile schema before storing in Firestore to conform with rules checks
      const flatProfile = {
        name: defaultProfile.name,
        tier: defaultProfile.tier,
        bio: defaultProfile.bio,
        location: defaultProfile.location,
        joinDate: defaultProfile.joinDate,
        avatar: defaultProfile.avatar,
        statesVisited: defaultProfile.stats.statesVisited,
        savedTripsCount: defaultProfile.stats.savedTripsCount,
        reviewsCount: defaultProfile.stats.reviewsCount,
        savedTotal: defaultProfile.stats.savedTotal,
        level: defaultProfile.level,
        currentXp: defaultProfile.currentXp,
        maxXp: defaultProfile.maxXp,
      };
      await setDoc(profileRef, flatProfile);
      return defaultProfile;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return defaultProfile;
  }
}

/**
 * Updates User Profile values securely in Firestore.
 */
export async function updateUserProfile(userId: string, updatedProfile: UserProfile): Promise<void> {
  const profileRef = doc(db, 'users', userId);
  const path = `users/${userId}`;
  
  const flatProfile = {
    name: updatedProfile.name,
    tier: updatedProfile.tier,
    bio: updatedProfile.bio,
    location: updatedProfile.location,
    avatar: updatedProfile.avatar,
    statesVisited: updatedProfile.stats.statesVisited,
    savedTripsCount: updatedProfile.stats.savedTripsCount,
    reviewsCount: updatedProfile.stats.reviewsCount,
    savedTotal: updatedProfile.stats.savedTotal,
    level: updatedProfile.level,
    currentXp: updatedProfile.currentXp,
    maxXp: updatedProfile.maxXp,
  };

  try {
    await updateDoc(profileRef, flatProfile);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Subscribes to Real-Time user expenses from Firestore.
 */
export function subscribeExpenses(userId: string, onUpdate: (expenses: Expense[]) => void) {
  const collPath = `users/${userId}/expenses`;
  const expensesRef = collection(db, 'users', userId, 'expenses');
  
  return onSnapshot(
    expensesRef, 
    (snapshot) => {
      const items: Expense[] = [];
      snapshot.forEach((snapDoc) => {
        const d = snapDoc.data();
        items.push({
          id: d.id,
          description: d.description,
          amount: Number(d.amount),
          paidBy: d.paidBy,
          splitWith: Array.isArray(d.splitWith) ? d.splitWith : [],
          category: d.category,
          date: d.date,
        });
      });
      onUpdate(items);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, collPath);
    }
  );
}

/**
 * Adds or Updates an individual Expense in Firestore.
 */
export const saveExpense = async (uid: string, expense: Expense) => {
  return apiPost("/expenses/add", { uid, expense });
};

/**
 * Deletes an Expense from Firestore.
 */
export async function deleteExpenseFromDb(userId: string, expenseId: string): Promise<void> {
  const path = `users/${userId}/expenses/${expenseId}`;
  const docRef = doc(db, 'users', userId, 'expenses', expenseId);
  
  try {
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

/**
 * Subscribes to Real-time trip bookings from Firestore.
 */
export function subscribeBookings(userId: string, onUpdate: (bookings: Booking[]) => void) {
  const collPath = `users/${userId}/bookings`;
  const bookingsRef = collection(db, 'users', userId, 'bookings');
  
  return onSnapshot(
    bookingsRef,
    (snapshot) => {
      const items: Booking[] = [];
      snapshot.forEach((snapDoc) => {
        const d = snapDoc.data();
        items.push({
          id: d.id,
          name: d.name,
          status: d.status,
          dates: d.dates,
          price: Number(d.price),
          bookingId: d.bookingId,
          image: d.image,
        });
      });
      onUpdate(items);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, collPath);
    }
  );
}

/**
 * Saves a Trip Booking securely in Firestore.
 */
export async function saveBookingToDb(userId: string, booking: Booking): Promise<void> {
  const path = `users/${userId}/bookings/${booking.id}`;
  const docRef = doc(db, 'users', userId, 'bookings', booking.id);

  try {
    await setDoc(docRef, {
      id: booking.id,
      name: booking.name,
      status: booking.status,
      dates: booking.dates,
      price: Number(booking.price),
      bookingId: booking.bookingId,
      image: booking.image,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Subscribes to companion chat messages log in real-time.
 */
export function subscribeMessages(userId: string, onUpdate: (messages: Message[]) => void) {
  const collPath = `users/${userId}/messages`;
  const messagesRef = collection(db, 'users', userId, 'messages');

  return onSnapshot(
    messagesRef,
    (snapshot) => {
      const items: Message[] = [];
      snapshot.forEach((snapDoc) => {
        const d = snapDoc.data();
        items.push({
          id: d.id,
          sender: d.sender,
          text: d.text,
          time: d.time,
          image: d.image || undefined,
        });
      });
      // Sort messages locally or store consistently
      onUpdate(items);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, collPath);
    }
  );
}

/**
 * Saves companion message log.
 */
export async function saveMessageToDb(userId: string, message: Message): Promise<void> {
  const path = `users/${userId}/messages/${message.id}`;
  const docRef = doc(db, 'users', userId, 'messages', message.id);

  try {
    await setDoc(docRef, {
      id: message.id,
      sender: message.sender,
      text: message.text,
      time: message.time,
      image: message.image || '',
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}
