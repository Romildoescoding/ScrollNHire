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

export function formatNotificationTime(date: Date | string) {
  const now = new Date();
  const inputDate = typeof date === "string" ? new Date(date) : date;

  const diffMs = now.getTime() - inputDate.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // ⏱ Seconds
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  }

  // ⏱ Minutes
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }

  // ⏱ Hours
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  // 📅 Yesterday
  if (days === 1) {
    return "Yesterday";
  }

  // 📅 Days (< 7)
  if (days < 7) {
    return `${days} days ago`;
  }

  // 📅 Exactly 1 week
  if (days < 14) {
    return "A week ago";
  }

  // 📅 Beyond 1 week → full date
  return inputDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
