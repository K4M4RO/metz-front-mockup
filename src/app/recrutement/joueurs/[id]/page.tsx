import { ProfilePage } from "@/components/profile/ProfilePage";

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;
  return <ProfilePage />;
}
