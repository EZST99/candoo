import * as SecureStore from "expo-secure-store";

async function authenticatedFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const authToken = SecureStore.getItem("sessionId");
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${authToken}`,
    },
  }).then((res) => res.json());
}

export default authenticatedFetch;
