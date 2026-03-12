export async function getUserDetails(email: string | null) {
  try {
    const response = await fetch(`/api/auth`, {
      method: "POST",
      body: JSON.stringify({ email }),
      credentials: "include",
    });
    const user = await response.json();
    console.log(user);

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export function formatCommentTime(date: Date | string) {
  const now = new Date().getTime();
  const created = new Date(date).getTime();

  const diff = Math.floor((now - created) / 1000); // seconds

  if (diff < 60) return `${diff}s`;

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;

  const weeks = Math.floor(days / 7);

  return `${Math.min(weeks, 78)}w`;
}
