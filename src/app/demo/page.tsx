import { redirect } from "next/navigation";

import { demoErpUrl } from "@/lib/site-content";

export const metadata = {
  title: "Démo ERP ProJD",
  description: "Accès à la démo publique ProJD en lecture seule.",
};

export default function DemoPage() {
  redirect(demoErpUrl);
}
