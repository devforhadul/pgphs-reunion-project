import { DashboardSidebar } from "@/components/DashboardSidebar";
import { ProfileCard } from "@/components/ProfileCard";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import { db } from "@/firebase/firebase.init";
import { AuthContext } from "@/provider/AuthProvider";
import type { RegistrationData } from "@/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";

export default function UserDashboard() {
  const { user } = useContext(AuthContext)!;
  const [myUser, setMyUser] = useState<RegistrationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
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
        setLoading(false);
      }
    };

    fetchUser();
  }, [user?.email]);

  // if (!user) {
  //   Swal.fire({
  //     icon: "error",
  //     title: "You are not Registered person",
  //     text: "Please register first to access the dashboard.",
  //     footer: '<a href="#">Registration now==></a>',
  //   });
  // }
  return (
    <main className="min-h-screen bg-[#f1f4f0] p-6 md:p-10 flex items-start justify-center">
      {loading && <LoadingOverlay />}
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
        <DashboardSidebar />
        {myUser && <ProfileCard myUser={myUser} />}
      </div>
    </main>
  );
}
