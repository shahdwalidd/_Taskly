import type { AddProjectPayload, AddProjectErrorResponse } from "../types/addproject.types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
export async function createProject(
  payload: AddProjectPayload,
  accessToken: string
) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/projects`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();
  let result: unknown = null;

  if (responseText) {
    try {
      result = JSON.parse(responseText);
    } catch {
      result = responseText;
    }
  }

  if (!response.ok) {
    const errorData = result as AddProjectErrorResponse;
    throw new Error(errorData?.message || "Failed To Add New Project, Try Again Later");
  }

  return result;
}