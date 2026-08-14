import { getArticles } from "@/_utils/server/articleApi";
import { getUser } from "@/_utils/server/userApi";
import Page from "@/app/(public)/blog/page";

jest.mock("../../_utils/server/articleApi", () => ({
  getArticles: jest.fn(),
}));

jest.mock("../../_utils/server/userApi", () => ({
  getUser: jest.fn(),
}));

describe("Blog Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Вызывает getArticles и getUser", async () => {
    const mockPage = 1;

    (getArticles as jest.Mock).mockResolvedValue({
      articles: [],
      totalCount: 0,
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

    await Page({ searchParams: { page: String(mockPage) } });

    expect(getArticles).toHaveBeenCalledTimes(1);
    expect(getArticles).toHaveBeenCalledWith(mockPage);
    expect(getUser).toHaveBeenCalledTimes(1);
  });
});
