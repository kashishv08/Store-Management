import Admin from "@/components/Admin";
import { getUserFromCookie, usertype } from "@/lib/helper";
import { redirect } from "next/navigation";
import { userNoPass } from "@/components/context/user-context";

export default function Home() {
  return (
    <div>
      <Admin />
    </div>
  );
}
