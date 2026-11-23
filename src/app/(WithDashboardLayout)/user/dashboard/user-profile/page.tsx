export const dynamic = "force-dynamic";
import { Fragment } from "react";
import UserProfile from "@/components/modules/Dashboard/UserProfile";
import { getMe } from "@/services/User";

export default async function UserProfilePage() {
  const res = await getMe().catch(() => null);
  const profileData = res?.data || null;

  return (
    <Fragment>
      <UserProfile profileData={profileData} />
    </Fragment>
  );
}
