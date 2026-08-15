import { ITagResponse } from "@/_interfaces/interfaces";

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

export async function getTags(): Promise<ITagResponse[]> {
  const res = await fetch(`${address.SERVER_API_URL}/tags`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return checkResponse<ITagResponse[]>(res);
}

export async function getTag(slug: string): Promise<ITagResponse> {
  const res = await fetch(`${address.SERVER_API_URL}/tags/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return checkResponse<ITagResponse>(res);
}
