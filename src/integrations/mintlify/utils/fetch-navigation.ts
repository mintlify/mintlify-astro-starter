import type { NavigationResponse } from "../types";

export async function fetchNavigation(
  apiHost: string,
  projectId: string,
  apiKey: string,
): Promise<NavigationResponse> {
  const navUrl = `${apiHost}/v1/headless/${projectId}/navigation`;
  const response = await fetch(navUrl, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        "[@mintlify/astro]: Invalid API key. Check your MINTLIFY_API_KEY.",
      );
    }
    if (response.status === 404) {
      throw new Error(
        `[@mintlify/astro]: Project not found: "${projectId}". Check your projectId.`,
      );
    }
    throw new Error(
      `[@mintlify/astro]: Failed to fetch navigation (${response.status}): ${response.statusText}`,
    );
  }

  return response.json();
}
