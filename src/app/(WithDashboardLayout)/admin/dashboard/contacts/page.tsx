export const dynamic = "force-dynamic";

import ManageContacts from "@/components/modules/Dashboard/Contacts";
import { getAllContacts } from "@/services/Contact";

export default async function ContactManagementPage() {
  const response = await getAllContacts().catch(() => ({ data: [] }));
  const contacts = response?.data ?? [];

  return (
    <div className="space-y-6">
      <ManageContacts contacts={contacts} />
    </div>
  );
}
