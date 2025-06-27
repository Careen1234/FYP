import { onSnapshot, query, orderBy, collection, doc } from "firebase/firestore";
import { db } from "../Firebase";

export const listenToMessages = (chatId: string, callback: (msgs: any[]) => void) => {
  const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt"));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
};

export const listenToChatMeta = (chatId: string, callback: (meta: any) => void) => {
  const chatDocRef = doc(db, "chats", chatId);
  return onSnapshot(chatDocRef, (docSnap) => {
    callback(docSnap.exists() ? docSnap.data() : null);
  });
};
