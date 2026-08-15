import { ICategoryResponse } from "@/_interfaces/interfaces";

const address = {
  SERVER_API_URL: process.env.API_BASE_URL,
};

async function checkResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json();
    throw new Error(`${error.message}`);
  }

  const result: T = await res.json();
  return result;
}

export async function getCategories(): Promise<ICategoryResponse[]> {
  const res = await fetch(`${address.SERVER_API_URL}/categories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return checkResponse<ICategoryResponse[]>(res);
}

export async function getCategory(slug: string): Promise<ICategoryResponse> {
  const res = await fetch(`${address.SERVER_API_URL}/categories/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return checkResponse<ICategoryResponse>(res);
}
