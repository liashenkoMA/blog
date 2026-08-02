import { IFileResponse } from "@/_interfaces/interfaces";
import { postFile } from "@/_utils/client/fileApi";

global.fetch = jest.fn();

describe("File Api", () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  describe("postFile Api", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("Ошибка сети при отправке файла", async () => {
      const mockFile = new File(["test"], "test.txt");

      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(postFile(mockFile)).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешная отправка файла", async () => {
      const mockResponse: IFileResponse = { filePath: "https://filepaht.ru" };
      const mockFile = new File(["test"], "test.txt");
      const mockFormData = new FormData();
      mockFormData.append("file", mockFile);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await postFile(mockFile);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/files\/add$/),
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          body: mockFormData,
        }),
      );
    });

    it("Сервер вернул !res.ok", async () => {
      const mockFile = new File(["test"], "test.txt");

      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({ message: "Internal Server Error" }),
      } as Response);

      await expect(postFile(mockFile)).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
