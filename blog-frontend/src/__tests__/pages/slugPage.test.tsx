import Page from "@/app/(public)/[slug]/page";
import {
  getCategoryArticles,
  getTagArticles,
} from "@/_utils/server/articleApi";
import { getCategory } from "@/_utils/server/categoryApi";
import { getTag } from "@/_utils/server/tagApi";
import { notFound } from "next/navigation";

jest.mock("@/_utils/server/articleApi", () => ({
  getCategoryArticles: jest.fn(),
  getTagArticles: jest.fn(),
}));

jest.mock("@/_utils/server/categoryApi", () => ({
  getCategory: jest.fn(),
}));

jest.mock("@/_utils/server/tagApi", () => ({
  getTag: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

describe("[slug] Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Получаем статьи категории", async () => {
    (getCategory as jest.Mock).mockResolvedValue({
      _id: "category-id",
      slug: "frontend",
      name: "Frontend",
      image: "https://example.com/frontend.jpg",
      imageAlt: "Frontend",
      title: "Frontend разработка",
      description: "Статьи о frontend",
    });

    (getTag as jest.Mock).mockRejectedValue(new Error("Tag not found"));

    (getCategoryArticles as jest.Mock).mockResolvedValue({
      articles: [],
      totalCount: 0,
    });

    const result = await Page({
      params: { slug: "frontend" },
    });

    expect(getCategory).toHaveBeenCalledTimes(1);
    expect(getCategory).toHaveBeenCalledWith("frontend");

    expect(getTag).toHaveBeenCalledTimes(1);
    expect(getTag).toHaveBeenCalledWith("frontend");

    expect(getCategoryArticles).toHaveBeenCalledTimes(1);
    expect(getCategoryArticles).toHaveBeenCalledWith("frontend", 1);

    expect(getTagArticles).not.toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it("Получаем статьи тега", async () => {
    (getCategory as jest.Mock).mockRejectedValue(
      new Error("Category not found"),
    );

    (getTag as jest.Mock).mockResolvedValue({
      _id: "tag-id",
      slug: "react",
      name: "React",
      image: "https://example.com/react.jpg",
      imageAlt: "React",
      title: "React",
      description: "Статьи о React",
    });

    (getTagArticles as jest.Mock).mockResolvedValue({
      articles: [],
      totalCount: 0,
    });

    const result = await Page({
      params: { slug: "react" },
    });

    expect(getCategory).toHaveBeenCalledWith("react");
    expect(getTag).toHaveBeenCalledWith("react");

    expect(getTagArticles).toHaveBeenCalledTimes(1);
    expect(getTagArticles).toHaveBeenCalledWith("react", 1);

    expect(getCategoryArticles).not.toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it("Вызывает notFound, если slug не является категорией или тегом", async () => {
    (getCategory as jest.Mock).mockRejectedValue(
      new Error("Category not found"),
    );

    (getTag as jest.Mock).mockRejectedValue(new Error("Tag not found"));

    await expect(
      Page({
        params: { slug: "unknown" },
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalledTimes(1);
    expect(getCategoryArticles).not.toHaveBeenCalled();
    expect(getTagArticles).not.toHaveBeenCalled();
  });
});
