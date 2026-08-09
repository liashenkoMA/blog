import { IArticle, IArticleCreateResponse } from "@/_interfaces/interfaces";
import { createArticle } from "@/_utils/client/articleApi";

global.fetch = jest.fn();

describe("Article Api", () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createArticle", () => {
    const mockFormData: IArticle = {
      slug: "test-article",
      title: "Тестовая статья | Title",
      h1: "Тестовая статья",
      description: "Описание тестовой статьи",
      category: "category-1",
      tags: ["tag-1", "tag-2"],
      image: "https://example.com/article.jpg",
      imageAlt: "Тестовая статья",
      content: "# Тестовая статья\n\nТекст статьи",
      status: "draft",
    };

    it("Ошибка сети при создании статьи", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(createArticle(mockFormData)).rejects.toThrow(
        "Network Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное создание статьи", async () => {
      const mockResponse: IArticleCreateResponse = {
        message: "Статья создана",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await createArticle(mockFormData);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/articles"),
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mockFormData),
        }),
      );
    });

    it("Сервер вернул !res.ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: "Internal Server Error" }),
      } as Response);

      await expect(createArticle(mockFormData)).rejects.toThrow(
        "Internal Server Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
