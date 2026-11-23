export const dynamic = "force-dynamic";

import ManageUsers from "@/components/modules/Dashboard/Users";
import { getAllUsers } from "@/services/User";

export default async function UsersManagementPage() {
  const response = await getAllUsers(1000).catch(() => ({ data: { result: [] } }));
  const users = response?.data?.result ?? response?.data ?? [];

  return (
    <div className="space-y-6">
      <ManageUsers users={users} />
    </div>
  );
}
