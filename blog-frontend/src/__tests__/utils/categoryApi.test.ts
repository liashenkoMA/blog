import { ICategory, ICategoryCreateResponse } from "@/_interfaces/interfaces";
import { createCategory } from "../../_utils/client/categoryApi";

global.fetch = jest.fn();

describe("Category API", () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createCategory", () => {
    const mockFormData: ICategory = {
      slug: "test-category",
      name: "Тестовая категория",
      image: "https://example.com/category.jpg",
      imageAlt: "Тестовая категория",
      title: "Тестовая категория | Title",
      description: "Описание тестовой категории",
    };

    it("Ошибка сети при создании категории", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network Error"));

      await expect(createCategory(mockFormData)).rejects.toThrow(
        "Network Error",
      );

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("Успешное создание категории", async () => {
      const mockResponse: ICategoryCreateResponse = {
        createCategory: {
          _id: "123456",
          slug: "test-category",
          name: "Тестовая категория",
          image: "https://example.com/category.jpg",
          imageAlt: "Тестовая категория",
          title: "Тестовая категория | Title",
          description: "Описание тестовой категории",
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const data = await createCategory(mockFormData);

      expect(data).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/categories"),
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

      await expect(createCategory(mockFormData)).rejects.toThrow(
        "Internal Server Error",
      );

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
