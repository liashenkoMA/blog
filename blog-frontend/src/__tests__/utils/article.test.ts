import {
  IArticle,
  IArticleCreateResponse,
  IArticleListResponse,
  IArticleResponse,
  ILastArticleResponse,
} from "@/_interfaces/interfaces";
import { createArticle } from "@/_utils/client/articleApi";
import {
  getArticle,
  getArticles,
  getCategoryArticles,
  getLastArticles,
  getTagArticles,
} from "@/_utils/server/articleApi";

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

  describe("getLastArticles", () => {
    it("Ошибка сети при получении последних статей", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getLastArticles()).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение последних статей", async () => {
      const mockResponse: ILastArticleResponse[] = [
        {
          _id: "id1",
          slug: "test-article",
          title: "Тестовая статья",
          h1: "Тестовая статья",
          description: "Описание тестовой статьи",
          category: {
            _id: "category-id1",
            slug: "frontend",
            name: "Frontend",
            image: "https://example.com/frontend.jpg",
            imageAlt: "Frontend",
            title: "Frontend разработка",
            description: "Статьи о frontend разработке",
          },
          tags: [
            {
              _id: "tag-id1",
              slug: "react",
              name: "React",
              image: "https://example.com/react.jpg",
              imageAlt: "React",
              title: "React",
              description: "Статьи о React",
            },
          ],
          image: "https://example.com/article.jpg",
          imageAlt: "Тестовая статья",
          readingTime: 5,
          status: "published",
          publishedAt: "2026-08-11",
          createdAt: "2026-08-11",
          updatedAt: "2026-08-11",
        },
        {
          _id: "id2",
          slug: "another-article",
          title: "Другая статья",
          h1: "Другая статья",
          description: "Описание другой статьи",
          category: {
            _id: "category-id2",
            slug: "backend",
            name: "Backend",
            image: "https://example.com/backend.jpg",
            imageAlt: "Backend",
            title: "Backend разработка",
            description: "Статьи о backend разработке",
          },
          tags: [
            {
              _id: "tag-id2",
              slug: "nestjs",
              name: "NestJS",
              image: "https://example.com/nestjs.jpg",
              imageAlt: "NestJS",
              title: "NestJS",
              description: "Статьи о NestJS",
            },
          ],
          image: "https://example.com/another.jpg",
          imageAlt: "Другая статья",
          readingTime: 7,
          status: "published",
          publishedAt: "2026-08-10",
          createdAt: "2026-08-11",
          updatedAt: "2026-08-11",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await getLastArticles();

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/articles/last"),
        expect.objectContaining({
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }),
      );
    });

    it("Сервер вернул !res.ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: "Internal Server Error" }),
      } as Response);

      await expect(getLastArticles()).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("getArticles", () => {
    it("Ошибка сети при получении статей", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getArticles(1)).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение статей", async () => {
      const mockResponse: IArticleListResponse = {
        articles: [
          {
            _id: "id1",
            slug: "test-article",
            title: "Тестовая статья",
            h1: "Тестовая статья",
            description: "Описание тестовой статьи",
            category: {
              _id: "category-id1",
              slug: "frontend",
              name: "Frontend",
              image: "https://example.com/frontend.jpg",
              imageAlt: "Frontend",
              title: "Frontend разработка",
              description: "Статьи о frontend разработке",
            },
            tags: [
              {
                _id: "tag-id1",
                slug: "react",
                name: "React",
                image: "https://example.com/react.jpg",
                imageAlt: "React",
                title: "React",
                description: "Статьи о React",
              },
            ],
            image: "https://example.com/article.jpg",
            imageAlt: "Тестовая статья",
            readingTime: 5,
            status: "published",
            publishedAt: "2026-08-11",
            createdAt: "2026-08-11",
            updatedAt: "2026-08-11",
          },
          {
            _id: "id2",
            slug: "another-article",
            title: "Другая статья",
            h1: "Другая статья",
            description: "Описание другой статьи",
            category: {
              _id: "category-id2",
              slug: "backend",
              name: "Backend",
              image: "https://example.com/backend.jpg",
              imageAlt: "Backend",
              title: "Backend разработка",
              description: "Статьи о Backend",
            },
            tags: [
              {
                _id: "tag-id2",
                slug: "nestjs",
                name: "NestJS",
                image: "https://example.com/nestjs.jpg",
                imageAlt: "NestJS",
                title: "NestJS",
                description: "Статьи о NestJS",
              },
            ],
            image: "https://example.com/another.jpg",
            imageAlt: "Другая статья",
            readingTime: 7,
            status: "published",
            publishedAt: "2026-08-10",
            createdAt: "2026-08-11",
            updatedAt: "2026-08-11",
          },
        ],
        totalCount: 2,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await getArticles(1);

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/articles?page=1"),
        expect.objectContaining({
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }),
      );
    });

    it("Сервер вернул !res.ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: "Internal Server Error" }),
      } as Response);

      await expect(getArticles(1)).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("getCategoryArticles", () => {
    const mockSlug = "cat";
    const mockPage = 3;

    it("Ошибка сети при получении статей", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getCategoryArticles(mockSlug, mockPage)).rejects.toThrow(
        "Network Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение статей", async () => {
      const mockResponse: IArticleListResponse = {
        articles: [
          {
            _id: "id1",
            slug: "test-article",
            title: "Тестовая статья",
            h1: "Тестовая статья",
            description: "Описание тестовой статьи",
            category: {
              _id: "category-id1",
              slug: "frontend",
              name: "Frontend",
              image: "https://example.com/frontend.jpg",
              imageAlt: "Frontend",
              title: "Frontend разработка",
              description: "Статьи о frontend разработке",
            },
            tags: [
              {
                _id: "tag-id1",
                slug: "react",
                name: "React",
                image: "https://example.com/react.jpg",
                imageAlt: "React",
                title: "React",
                description: "Статьи о React",
              },
            ],
            image: "https://example.com/article.jpg",
            imageAlt: "Тестовая статья",
            readingTime: 5,
            status: "published",
            publishedAt: "2026-08-11",
            createdAt: "2026-08-11",
            updatedAt: "2026-08-11",
          },
          {
            _id: "id2",
            slug: "another-article",
            title: "Другая статья",
            h1: "Другая статья",
            description: "Описание другой статьи",
            category: {
              _id: "category-id2",
              slug: "backend",
              name: "Backend",
              image: "https://example.com/backend.jpg",
              imageAlt: "Backend",
              title: "Backend разработка",
              description: "Статьи о Backend",
            },
            tags: [
              {
                _id: "tag-id2",
                slug: "nestjs",
                name: "NestJS",
                image: "https://example.com/nestjs.jpg",
                imageAlt: "NestJS",
                title: "NestJS",
                description: "Статьи о NestJS",
              },
            ],
            image: "https://example.com/another.jpg",
            imageAlt: "Другая статья",
            readingTime: 7,
            status: "published",
            publishedAt: "2026-08-10",
            createdAt: "2026-08-11",
            updatedAt: "2026-08-11",
          },
        ],
        totalCount: 2,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await getCategoryArticles(mockSlug, mockPage);

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/articles/category/cat?page=3"),
        expect.objectContaining({
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }),
      );
    });

    it("Сервер вернул !res.ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: "Internal Server Error" }),
      } as Response);

      await expect(getCategoryArticles(mockSlug, mockPage)).rejects.toThrow(
        "Internal Server Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("getTagArticles", () => {
    const mockSlug = "tag";
    const mockPage = 3;

    it("Ошибка сети при получении статей", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getTagArticles(mockSlug, mockPage)).rejects.toThrow(
        "Network Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение статей", async () => {
      const mockResponse: IArticleListResponse = {
        articles: [
          {
            _id: "id1",
            slug: "test-article",
            title: "Тестовая статья",
            h1: "Тестовая статья",
            description: "Описание тестовой статьи",
            category: {
              _id: "category-id1",
              slug: "frontend",
              name: "Frontend",
              image: "https://example.com/frontend.jpg",
              imageAlt: "Frontend",
              title: "Frontend разработка",
              description: "Статьи о frontend разработке",
            },
            tags: [
              {
                _id: "tag-id1",
                slug: "react",
                name: "React",
                image: "https://example.com/react.jpg",
                imageAlt: "React",
                title: "React",
                description: "Статьи о React",
              },
            ],
            image: "https://example.com/article.jpg",
            imageAlt: "Тестовая статья",
            readingTime: 5,
            status: "published",
            publishedAt: "2026-08-11",
            createdAt: "2026-08-11",
            updatedAt: "2026-08-11",
          },
          {
            _id: "id2",
            slug: "another-article",
            title: "Другая статья",
            h1: "Другая статья",
            description: "Описание другой статьи",
            category: {
              _id: "category-id2",
              slug: "backend",
              name: "Backend",
              image: "https://example.com/backend.jpg",
              imageAlt: "Backend",
              title: "Backend разработка",
              description: "Статьи о Backend",
            },
            tags: [
              {
                _id: "tag-id2",
                slug: "nestjs",
                name: "NestJS",
                image: "https://example.com/nestjs.jpg",
                imageAlt: "NestJS",
                title: "NestJS",
                description: "Статьи о NestJS",
              },
            ],
            image: "https://example.com/another.jpg",
            imageAlt: "Другая статья",
            readingTime: 7,
            status: "published",
            publishedAt: "2026-08-10",
            createdAt: "2026-08-11",
            updatedAt: "2026-08-11",
          },
        ],
        totalCount: 2,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await getTagArticles(mockSlug, mockPage);

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/articles/tag/tag?page=3"),
        expect.objectContaining({
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }),
      );
    });

    it("Сервер вернул !res.ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: "Internal Server Error" }),
      } as Response);

      await expect(getTagArticles(mockSlug, mockPage)).rejects.toThrow(
        "Internal Server Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("getArticle", () => {
    const mockSlug = "test-article";

    it("Ошибка сети при получении статьи", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getArticle(mockSlug)).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение статьи", async () => {
      const mockResponse: IArticleResponse = {
        _id: "article-id",
        slug: "test-article",
        title: "Тестовая статья",
        h1: "Тестовая статья",
        description: "Описание тестовой статьи",
        category: "frontend",
        tags: ["react", "nextjs"],
        image: "https://example.com/article.jpg",
        imageAlt: "Тестовая статья",
        content: "# Тестовая статья\n\nСодержание статьи",
        status: "published",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await getArticle(mockSlug);

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/articles/test-article"),
        expect.objectContaining({
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }),
      );
    });

    it("Сервер вернул !res.ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: "Internal Server Error" }),
      } as Response);

      await expect(getArticle(mockSlug)).rejects.toThrow(
        "Internal Server Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
