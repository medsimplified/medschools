// ...pseudo code for admin subscription reporting...
import prisma from "../../../lib/prisma";

export default async function AdminSubscriptionsPage() {
  const users = await prisma.user.findMany({
    select: {
      email: true,
      subscriptionPlan: true,
      subscriptionStatus: true,
      subscriptionEnd: true,
      hasActiveSubscription: true,
    }
  });

  return (
    <div className="container py-5">
      <h2>User Subscriptions</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Plan</th>
            <th>Status</th>
            <th>End Date</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={user.email ?? idx}>
              <td>{user.email ?? "-"}</td>
              <td>{user.subscriptionPlan ?? "-"}</td>
              <td>{user.subscriptionStatus ?? "-"}</td>
              <td>
                {user.subscriptionEnd
                  ? new Date(user.subscriptionEnd).toLocaleDateString()
                  : "-"}
              </td>
              <td>{user.hasActiveSubscription ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ✅ Your code is correct for fetching user subscriptions with Prisma.
// ⚠ If you still get "table does not exist" errors on Render, the issue is with your database, not this file.

// Troubleshooting steps:
// 1. Make sure your database is migrated and contains the User table.
//    - Run: npx prisma migrate deploy
//    - Or: npx prisma db push
// 2. Check your DATABASE_URL in .env is correct for Render's database.
// 3. If you changed your schema, redeploy and migrate again.
