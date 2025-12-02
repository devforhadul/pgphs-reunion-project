import type { RegistrationData } from "@/types";
import type { CSSProperties } from "react";

interface ReunionTicketProps {
  user: RegistrationData;
}

const ReunionTicket = ({ user }: ReunionTicketProps) => {
  // তথ্যের অবজেক্ট
  const data = {
    id: "2025145",
    polytechnic: "Compact Polytechnic Institute, Feni",
    studentName: "Forhadul Islam",
    parentName: "Md. Mostafa Mansur",
    course: "MERN Stack (Batch: EITMS250701)",
    grade: "A+",
    duration: "18 Aug, 2025 to 20 Nov, 2025",
    institution: "European IT Solutions Institute, Dhaka, Bangladesh",
    website: "www.europeanit-inst.com",
  };

  // CSS স্টাইল অবজেক্ট
  const styles: { [key: string]: CSSProperties } = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f3f4f6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    },
    card: {
      backgroundColor: "#ffffff",
      width: "100%",
      maxWidth: "850px",
      borderRadius: "4px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      border: "1px solid #e5e7eb",
    },
    header: {
      backgroundColor: "#00adef",
      color: "#ffffff",
      padding: "20px",
      textAlign: "center" as const,
    },
    headerTitle: {
      fontSize: "22px",
      fontWeight: "bold",
      textTransform: "uppercase",
      margin: "0",
    },
    headerSubtitle: {
      fontSize: "14px",
      marginTop: "5px",
      opacity: 0.9,
      margin: "5px 0 0 0",
    },
    body: {
      padding: "40px 50px",
    },
    topSection: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "40px",
    },
    mainTitle: {
      fontSize: "24px",
      fontWeight: 600,
      color: "#333",
      textTransform: "uppercase",
      margin: "0",
    },
    qrCode: {
      width: "90px",
      height: "90px",
      border: "1px solid #ddd",
      padding: "2px",
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "200px 1fr",
      rowGap: "12px",
      fontSize: "15px",
    },
    label: {
      fontWeight: "bold",
      color: "#2d3748",
    },
    value: {
      color: "#4a5568",
      fontWeight: 500,
    },
    footer: {
      backgroundColor: "#f9fafb",
      borderTop: "1px solid #e5e7eb",
      padding: "15px",
      textAlign: "center" as const,
      fontSize: "14px",
      color: "#718096",
    },
    link: {
      color: "#00adef",
      textDecoration: "none",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>
            Certificate Verification Successful
          </h1>
          <p style={styles.headerSubtitle}>
            This certificate has been verified as authentic and valid.
          </p>
        </div>

        <div style={styles.body}>
          <div style={styles.topSection}>
            <h2 style={styles.mainTitle}>Certificate of Completion</h2>
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Verified"
              alt="QR Code"
              style={styles.qrCode}
            />
          </div>

          <div style={styles.infoGrid}>
            <div style={styles.label}>Registration ID:</div>
            <div style={styles.value}>{user.reg_id}</div>

            <div style={styles.label}>Polytechnic Name:</div>
            <div style={styles.value}>{data.polytechnic}</div>

            <div style={styles.label}>Student Name:</div>
            <div style={styles.value}>{data.studentName}</div>

            <div style={styles.label}>Parent's Name:</div>
            <div style={styles.value}>{data.parentName}</div>

            <div style={styles.label}>Course:</div>
            <div style={styles.value}>{data.course}</div>

            <div style={styles.label}>Grade:</div>
            <div style={styles.value}>{data.grade}</div>

            <div style={styles.label}>Duration:</div>
            <div style={styles.value}>{data.duration}</div>

            <div style={styles.label}>Institution:</div>
            <div style={styles.value}>{data.institution}</div>
          </div>
        </div>

        <div style={styles.footer}>
          This certificate can be verified at{" "}
          <a href={`https://${data.website}`} style={styles.link}>
            {data.website}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReunionTicket;
