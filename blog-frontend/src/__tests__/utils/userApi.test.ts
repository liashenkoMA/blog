import {
  IProfileFormData,
  IProfileResponse,
  IUser,
} from "@/_interfaces/interfaces";
import { getUser } from "../../_utils/server/userApi";
import { updateUser } from "../../_utils/client/userApi";

global.fetch = jest.fn();

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    toString: () => "mock-cookie",
  })),
}));

describe("User API", () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUser", () => {
    it("Ошибка сети при получении пользователя", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getUser()).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение пользователя", async () => {
      const mockResponse: IUser = {
        name: "Максим",
        email: "max@mail.ru",
        avatarLink: "https://example.com/avatar.jpg",
        telegram: "https://t.me/max",
        vk: "https://vk.com/max",
        gitHub: "https://github.com/max",
        linkedin: "https://linkedin.com/in/max",
        mySite: "https://example.com",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data: IUser = await getUser();

      await expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/user"),
        expect.objectContaining({
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Cookie: "mock-cookie",
          },
        }),
      );
    });

    it("Сервер вернул !res.ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: "Internal Server Error" }),
      } as Response);

      await expect(getUser()).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateUser", () => {
    const mockFormData: IProfileFormData = {
      name: "Максим",
      email: "max@mail.ru",
      avatarLink: "https://example.com/avatar.jpg",
      telegram: "https://t.me/max",
      vk: "https://vk.com/max",
      gitHub: "https://github.com/max",
      linkedin: "https://linkedin.com/in/max",
      mySite: "https://example.com",
    };

    it("Ошибка сети при изменении пользователя", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(updateUser(mockFormData)).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное изменение пользователя", async () => {
      const mockResponse: IProfileResponse = {
        name: "Максим",
        email: "max@mail.ru",
        avatarLink: "https://example.com/avatar.jpg",
        telegram: "https://t.me/max",
        vk: "https://vk.com/max",
        gitHub: "https://github.com/max",
        linkedin: "https://linkedin.com/in/max",
        mySite: "https://example.com",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await updateUser(mockFormData);

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/user/update"),
        expect.objectContaining({
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: mockFormData.name,
            email: mockFormData.email,
            avatarLink: mockFormData.avatarLink,
            telegram: mockFormData.telegram,
            vk: mockFormData.vk,
            gitHub: mockFormData.gitHub,
            linkedin: mockFormData.linkedin,
            mySite: mockFormData.mySite,
          }),
        }),
      );
    });

    it("Сервер вернул !res.ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          message: "Internal Server Error",
        }),
      } as Response);

      await expect(updateUser(mockFormData)).rejects.toThrow(
        "Internal Server Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
