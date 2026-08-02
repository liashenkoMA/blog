import { IFileResponse } from "@/_interfaces/interfaces";

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

export async function postFile(file: File): Promise<IFileResponse> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${address.baseUrl}/files/add`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    return checkResponse<IFileResponse>(res);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}
