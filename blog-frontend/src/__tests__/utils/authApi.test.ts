import { ILoginFormData } from "@/_interfaces/interfaces";
import { login } from "@/_utils/server/authApi";
import * as headers from "next/headers";

global.fetch = jest.fn();

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    set: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  })),
}));

describe("Auth Api", () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  describe("login", () => {
    let mockFormData: ILoginFormData;

    beforeEach(() => {
      jest.clearAllMocks();

      mockFormData = {
        email: "test@test.ru",
        password: "test",
        duplicate: "test",
      };
    });

    it("Ошибка сети при авторизации", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(login(mockFormData)).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешная авторизация, запись в cookies", async () => {
      const setMock = jest.fn();
      (headers.cookies as jest.Mock).mockReturnValue({ set: setMock });

      const user = {
        message: "Добро пожаловать!",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: "Token",
        }),
      } as Response);

      const result = await login(mockFormData);

      expect(result).toEqual(user);
      expect(setMock).toHaveBeenCalledWith(
        "session_blog_lm",
        "Token",
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
        }),
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/auth\/signin$/),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Accept: "application/json",
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({
            email: mockFormData.email,
            password: mockFormData.password,
          }),
        }),
      );
    });

    it("Сервер вернул !res.ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({ message: "Internal Server Error" }),
      } as Response);

      await expect(login(mockFormData)).rejects.toThrow(
        "Internal Server Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
