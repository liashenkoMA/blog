import { IProfileFormData, IProfileResponse } from "@/_interfaces/interfaces";

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

export async function updateUser(
  formData: IProfileFormData,
): Promise<IProfileResponse> {
  try {
    const res = await fetch(`${address.baseUrl}/user/update`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        avatarLink: formData.avatarLink,
        telegram: formData.telegram,
        vk: formData.vk,
        gitHub: formData.gitHub,
        linkedin: formData.linkedin,
        mySite: formData.mySite,
      }),
    });

    return checkResponse<IProfileResponse>(res);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}
