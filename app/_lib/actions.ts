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
