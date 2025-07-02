// components/AudioCall.tsx
import React, { useEffect, useRef } from 'react';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  onSnapshot
} from 'firebase/firestore';
import { firestore } from '../Firebase'; // Adjust path if needed

const servers = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

interface AudioCallProps {
  callId: string;     // Firestore doc ID shared between user and provider
  isCaller: boolean;  // true = provider initiates, false = user joins
}

const AudioCall: React.FC<AudioCallProps> = ({ callId, isCaller }) => {
  const pc = useRef<RTCPeerConnection>(new RTCPeerConnection(servers));
  const localAudio = useRef<HTMLAudioElement>(null);
  const remoteAudio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    startAudioCall();
    // Cleanup on unmount
    return () => pc.current.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startAudioCall = async () => {
    // 1. Get local mic
    const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localAudio.current!.srcObject = localStream;

    const remoteStream = new MediaStream();
    remoteAudio.current!.srcObject = remoteStream;

    // 2. Add local tracks
    localStream.getTracks().forEach(track => {
      pc.current.addTrack(track, localStream);
    });

    // 3. Receive remote tracks
    pc.current.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
    };

    const callDoc = doc(firestore, 'calls', callId);
    const offerCandidates = collection(callDoc, 'offerCandidates');
    const answerCandidates = collection(callDoc, 'answerCandidates');

    // 4. Send local ICE
    pc.current.onicecandidate = async (event) => {
      if (event.candidate) {
        await addDoc(isCaller ? offerCandidates : answerCandidates, event.candidate.toJSON());
      }
    };

    if (isCaller) {
      // 5. Caller: Create Offer
      const offerDesc = await pc.current.createOffer();
      await pc.current.setLocalDescription(offerDesc);

      await setDoc(callDoc, { offer: { type: offerDesc.type, sdp: offerDesc.sdp } });

      // 6. Listen for answer
      onSnapshot(callDoc, (snapshot) => {
        const data = snapshot.data();
        if (data?.answer && !pc.current.currentRemoteDescription) {
          pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        }
      });

      // 7. Listen for answer ICE
      onSnapshot(answerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.current.addIceCandidate(candidate);
          }
        });
      });

    } else {
      // 5. Receiver: Get offer
      const callData = (await getDoc(callDoc)).data();
      const offer = callData?.offer;
      if (!offer) return alert("Call offer not found");

      await pc.current.setRemoteDescription(new RTCSessionDescription(offer));

      // 6. Create Answer
      const answerDesc = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answerDesc);

      await setDoc(callDoc, { answer: { type: answerDesc.type, sdp: answerDesc.sdp } }, { merge: true });

      // 7. Listen for caller ICE
      onSnapshot(offerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.current.addIceCandidate(candidate);
          }
        });
      });
    }
  };

  return (
    <div>
      <h3>{isCaller ? "Calling User..." : "Receiving Call..."}</h3>
      <audio ref={localAudio} autoPlay controls muted />
      <audio ref={remoteAudio} autoPlay controls />
    </div>
  );
};

export default AudioCall;