"use server";

export async function submitEmail(email: string) {
  console.log("VIP Email submitted:", email);
  console.log("Timestamp:", new Date().toISOString());

  // Here you could add database storage, email service integration, etc.

  return { success: true };
}
