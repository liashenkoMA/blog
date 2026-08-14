import {
  IArticleListResponse,
  ILastArticleResponse,
} from "@/_interfaces/interfaces";

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

export async function getLastArticles(): Promise<ILastArticleResponse[]> {
  const res = await fetch(`${address.SERVER_API_URL}/articles/last`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return checkResponse<ILastArticleResponse[]>(res);
}

export async function getArticles(page: number): Promise<IArticleListResponse> {
  const res = await fetch(`${address.SERVER_API_URL}/articles?page=${page}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return checkResponse<IArticleListResponse>(res);
}
