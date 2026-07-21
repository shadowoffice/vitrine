import { redirect } from "next/navigation";

export const metadata = {
  title: "ProJD",
  description: "ERP construction ProJD.",
};

export default function LegacyProductRedirectPage() {
  redirect("/projd");
}
