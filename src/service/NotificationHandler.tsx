import { useEffect } from "react";
import { getToken } from "firebase/messaging";
import { db, messaging } from "@/firebase/firebase.init";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const NotificationHandler = () => {
  useEffect(() => {
    const requestPermission = async () => {
      try {
        // ব্রাউজারের কাছে পারমিশন চাওয়া
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
          // টোকেন জেনারেট করা
          const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_VAPIDKEY,
          });

          if (token) {
            console.log("FCM Token Generated:", token);

            // টোকেনের প্রথম ১০ অক্ষরের ওপর ভিত্তি করে একটি ইউনিক আইডি তৈরি করা
            const docId = `token_${token.substring(0, 15)}`;
            const tokenRef = doc(db, "userTokens", docId);

            // ডাটাবেসে সেভ করা
            await setDoc(
              tokenRef,
              {
                fcmToken: token,
                lastUpdated: serverTimestamp(),
                platform: "web",
                status: "active",
              },
              { merge: true }
            );
          }
        } else {
          console.warn("Permission not granted for notifications");
        }
      } catch (error) {
        console.error("Error in Notification Handler:", error);
      }
    };

    requestPermission();
  }, []); // এটি শুধুমাত্র সাইট লোড হওয়ার সময় একবার রান করবে

  return null;
};

export default NotificationHandler;
