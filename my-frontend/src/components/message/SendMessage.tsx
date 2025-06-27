import { collection, addDoc, Timestamp, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";

export const sendMessage = async (chatId: string, senderId: string, content: string) => {
  const msgRef = collection(db, "chats", chatId, "messages");
  const createdAt = Timestamp.now();
  await addDoc(msgRef, {
    senderId,
    content,
    createdAt,
  });
  // Update lastMessage in chat doc
  const chatDocRef = doc(db, "chats", chatId);
  await setDoc(chatDocRef, {
    lastMessage: { content, senderId, createdAt },
  }, { merge: true });
};
