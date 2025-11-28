
import { useParams } from "react-router";

export default function QrVerify() {
  const { id } = useParams();
  return <div>QrVerify Page: {id}</div>;
}
