import {
  IArticleListResponse,
  IArticleResponse,
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

export async function getCategoryArticles(
  slug: string,
  page: number,
): Promise<IArticleListResponse> {
  const res = await fetch(
    `${address.SERVER_API_URL}/articles/category/${slug}?page=${page}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return checkResponse<IArticleListResponse>(res);
}

export async function getTagArticles(
  slug: string,
  page: number,
): Promise<IArticleListResponse> {
  const res = await fetch(
    `${address.SERVER_API_URL}/articles/tag/${slug}?page=${page}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return checkResponse<IArticleListResponse>(res);
}

export async function getArticle(slug: string): Promise<IArticleResponse> {
  const res = await fetch(`${address.SERVER_API_URL}/articles/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return checkResponse<IArticleResponse>(res);
}
