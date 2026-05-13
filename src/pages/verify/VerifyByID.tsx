import { db } from "@/firebase/firebase.init";
import { RegistrationData } from "@/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

type StatusType = "idle" | "loading" | "success" | "error";

export default function VerifyByID() {
    const { id } = useParams<{ id: string }>();
    const [status, setStatus] = useState<StatusType>("idle");
    const [user, setUser] = useState<RegistrationData | null>(null);


    useEffect(() => {
        const verifyById = async () => {
            try {
                setStatus("loading");
                if (!id) {
                    setStatus("error");
                    return;
                }

                const q = query(
                    collection(db, "pgphs_ru_reqisterd_users"),
                    where("reg_id", "==", id)
                );

                const querySnapshot = await getDocs(q);

                querySnapshot.forEach((docSnap) => {
                    console.log("Found user:", docSnap.id, docSnap.data());
                    setStatus("success");
                    setUser(docSnap.data() as RegistrationData)
                });

                if (querySnapshot.empty) {
                    setUser(null);
                    setStatus("error");
                }
            } catch (error) {
                console.error(error);
                setStatus("error");
            }
        }
        verifyById()
    },[id])


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">

            {/* Title */}
            <h1 className="text-2xl font-semibold mb-4">
                User Verification
            </h1>
            {/* Result */}
            <div className="w-full max-w-md mt-6">

                {/* Loading */}
                {status === "loading" && (
                    <div className="bg-white p-6 rounded-2xl shadow text-center">
                        <p className="text-gray-500">Checking...</p>
                    </div>
                )}

                {/* Success */}
                {status === "success" && user && (
                    <div className="bg-green-100 border border-green-300 p-6 rounded-2xl shadow text-center">

                        <img
                            src={user.photo}
                            alt={user.fullName}
                            className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border"
                        />

                        <h2 className="text-lg font-semibold">
                            {user.fullName}
                        </h2>

                        <p className="text-sm text-gray-600">
                            ID: {user.reg_id}
                        </p>

                        <div className="mt-3 text-2xl text-green-700 font-medium">
                            ✔ Verified User
                        </div>
                    </div>
                )}

                {/* Error */}
                {status === "error" && (
                    <div className="bg-red-100 border border-red-300 p-6 rounded-2xl shadow text-center">
                        <p className="text-red-600 font-medium">
                            ❌ Invalid  User
                        </p>
                    </div>
                )}
            </div>
        </div >
    )
}
