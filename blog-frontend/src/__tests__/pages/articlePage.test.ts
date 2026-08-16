import { getArticle } from "@/_utils/server/articleApi";
import { getUser } from "@/_utils/server/userApi";
import Page from "@/app/(public)/[slug]/[article]/page";

jest.mock("@/_utils/server/articleApi", () => ({
  getArticle: jest.fn(),
}));

jest.mock("@/_utils/server/userApi", () => ({
  getUser: jest.fn(),
}));

jest.mock("@/_components/UI/ArticleContent/ArticleContent", () => ({
  ArticleContent: () => null,
}));

describe("Article Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Вызываем getArticle и getUser", async () => {
    const mockParams = {
      article: "/article",
      category: "/category",
    };

    (getArticle as jest.Mock).mockResolvedValue({
      _id: "article-id",
      slug: "test-article",
      title: "Тестовая статья",
      h1: "Заголовок тестовой статьи",
      description: "Описание тестовой статьи",
      category: "test-category",
      tags: ["test", "article"],
      image: "/image.jpg",
      imageAlt: "Изображение тестовой статьи",
      content: "Текст тестовой статьи",
      status: "published",
      publishedAt: "2026-08-16T10:00:00.000Z",
      createdAt: "2026-08-16T09:00:00.000Z",
      updatedAt: "2026-08-16T09:00:00.000Z",
    });
    (getUser as jest.Mock).mockResolvedValue({
      name: "Максим",
      email: "test@example.com",
      avatarLink: "https://example.com/avatar.jpg",
      telegram: "https://t.me/test",
      vk: "https://vk.com/test",
      gitHub: "https://github.com/test",
      linkedin: "https://linkedin.com/in/test",
      mySite: "https://example.com",
    });

    await Page({ params: mockParams });

    expect(getArticle).toHaveBeenCalledTimes(1);
    expect(getArticle).toHaveBeenCalledWith(mockParams.article);
    expect(getUser).toHaveBeenCalledTimes(1);
  });
});
