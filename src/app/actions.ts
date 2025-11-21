"use server";

export async function submitEmail(email: string) {
  const apiKey = process.env.OCTOPUS_KEY;
  const listId = process.env.OCTOPUS_LIST;

  if (!apiKey || !listId) {
    console.error("Missing EmailOctopus credentials in environment variables");
    throw new Error("Email service not configured");
  }

  console.log("VIP Email submitted:", email);
  console.log("Timestamp:", new Date().toISOString());

  try {
    const response = await fetch(
      `https://api.emailoctopus.com/lists/${listId}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          tags: ["vip", "morristown-popup"],
          status: "subscribed",
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("EmailOctopus API error:", errorData);

      // Handle duplicate email gracefully
      if (errorData.error?.code === "MEMBER_EXISTS_WITH_EMAIL_ADDRESS") {
        console.log("Email already subscribed:", email);
        return { success: true, alreadySubscribed: true };
      }

      throw new Error(errorData.error?.message || "Failed to subscribe email");
    }

    const data = await response.json();
    console.log("Successfully added to EmailOctopus:", data);

    return { success: true, alreadySubscribed: false };
  } catch (error) {
    console.error("Error submitting email to EmailOctopus:", error);
    throw error;
  }
}
