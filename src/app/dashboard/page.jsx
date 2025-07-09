import LogoutButton from "@/app/Components/logout";

export default function Dashboard() {
  const email = "user@example.com"; // You can fetch this from session or JWT

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <LogoutButton email={email} />
    </div>
  );
}
