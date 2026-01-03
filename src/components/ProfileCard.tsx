import { db } from "@/firebase/firebase.init";
import { AuthContext } from "@/provider/AuthProvider";
import type { RegistrationData } from "@/types";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { useContext, useEffect, useState } from "react";

export function ProfileCard() {
  const { user } = useContext(AuthContext)!;
  const [myUser, setMyUser] = useState<RegistrationData | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const q = query(
        collection(db, "pgphs_ru_reqisterd_users"),
        where("email", "==", user?.email?.toLowerCase())
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        setMyUser({
          id: snap.docs[0].id,
          ...snap.docs[0].data(),
        } as RegistrationData);
      }
    };

    fetchUser();
  }, [user?.email]);

  const details = [
    { label: "Registration no", value: myUser?.reg_id || "N/A" },
    { label: "Email", value: myUser?.email || "N/A" },
    { label: "Mobile", value: myUser?.phone },
    { label: "Address", value: myUser?.address },
    { label: "Occupation", value: myUser?.occupation },
  ];

  return (
    <div className="flex-1 bg-white border border-[#e5e7eb] rounded-lg p-6 shadow-sm">
      <h1 className="text-3xl font-medium text-black mb-6">
        Welcome, {myUser?.fullName}
      </h1>

      <div className="bg-[#FFFFE1] border border-[#f0f0c0] rounded-xl p-8 flex flex-col md:flex-row gap-8 items-center md:items-start min-h-[300px]">
        <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-white bg-white shrink-0">
          <img
            src={myUser?.photo}
            alt="Profile Picture"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-4 py-4 w-full">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="grid grid-cols-[140px_1fr] items-baseline gap-2"
            >
              <span className="font-bold text-black text-sm">
                {detail.label}:
              </span>
              <span
                className={`text-gray-800 text-sm break-all`}
              >
                {detail.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
