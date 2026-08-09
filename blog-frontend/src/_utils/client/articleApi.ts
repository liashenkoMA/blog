import { IArticle, IArticleCreateResponse } from "@/_interfaces/interfaces";

const address = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

async function checkResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`${err.message}`);
  }
  const result: T = await res.json();
  return result;
}

export async function createArticle(
  formData: IArticle,
): Promise<IArticleCreateResponse> {
  try {
    const res = await fetch(`${address.baseUrl}/articles`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    return checkResponse<IArticleCreateResponse>(res);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}
