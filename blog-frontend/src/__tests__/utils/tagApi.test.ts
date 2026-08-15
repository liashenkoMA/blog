import {
  ITag,
  ITagCreateResponse,
  ITagResponse,
} from "@/_interfaces/interfaces";
import { createTag } from "../../_utils/client/tagApi";
import { getTag, getTags } from "@/_utils/server/tagApi";

global.fetch = jest.fn();

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    toString: () => "mock-cookie",
  })),
}));

describe("Tag API", () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTag", () => {
    const mockFormData: ITag = {
      slug: "test-tag",
      name: "Тестовый тег",
      image: "https://example.com/tag.jpg",
      imageAlt: "Тестовый тег",
      title: "Тестовый тег | Title",
      description: "Описание тестового тега",
    };

    it("Ошибка сети при создании тега", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(createTag(mockFormData)).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное создание тега", async () => {
      const mockResponse: ITagCreateResponse = {
        createTag: {
          _id: "123456",
          slug: "test-tag",
          name: "Тестовый тег",
          image: "https://example.com/tag.jpg",
          imageAlt: "Тестовый тег",
          title: "Тестовый тег | Title",
          description: "Описание тестового тега",
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await createTag(mockFormData);

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/tags"),
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug: mockFormData.slug,
            name: mockFormData.name,
            image: mockFormData.image,
            imageAlt: mockFormData.imageAlt,
            title: mockFormData.title,
            description: mockFormData.description,
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

      await expect(createTag(mockFormData)).rejects.toThrow(
        "Internal Server Error",
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("getTags", () => {
    it("Ошибка сети при получении тегов", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getTags()).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение тегов", async () => {
      const mockResponse: ITagResponse[] = [
        {
          _id: "id1",
          slug: "frontend",
          name: "Frontend",
          image: "https://example.com/frontend.jpg",
          imageAlt: "Frontend",
          title: "Frontend",
          description: "Тег Frontend",
        },
        {
          _id: "id2",
          slug: "backend",
          name: "Backend",
          image: "https://example.com/backend.jpg",
          imageAlt: "Backend",
          title: "Backend",
          description: "Тег Backend",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await getTags();

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/tags"),
        expect.objectContaining({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
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

      await expect(getTags()).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("getTag", () => {
    it("Ошибка сети при получении тега", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(getTag("frontend")).rejects.toThrow("Network Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное получение тега", async () => {
      const mockResponse: ITagResponse = {
        _id: "id1",
        slug: "frontend",
        name: "Frontend",
        image: "https://example.com/frontend.jpg",
        imageAlt: "Frontend",
        title: "Frontend",
        description: "Тег Frontend",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await getTag("frontend");

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/tags/frontend"),
        expect.objectContaining({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
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

      await expect(getTag("frontend")).rejects.toThrow("Internal Server Error");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
