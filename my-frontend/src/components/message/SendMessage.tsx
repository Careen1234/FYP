import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../Firebase";

export const sendMessage = async (chatId: string, senderId: string, content: string) => {
  const msgRef = collection(db, "chats", chatId, "messages");
  await addDoc(msgRef, {
    senderId,
    content,
    createdAt: Timestamp.now(),
  });
};
