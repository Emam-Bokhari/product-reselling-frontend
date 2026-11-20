export const dynamic = "force-dynamic";

import ManageNewsLetters from "@/components/modules/Dashboard/NewsLetters";
import { getAllNewsLetters } from "@/services/NewsLetter";

export default async function NewsLettersManagementPage() {
  const response = await getAllNewsLetters().catch(() => ({ data: [] }));
  const newsLetters = response?.data ?? [];

  return (
    <div className="space-y-6">
      <ManageNewsLetters newsLetters={newsLetters} />
    </div>
  );
}
