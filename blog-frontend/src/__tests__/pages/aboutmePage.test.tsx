import { getUser } from "@/_utils/server/userApi";
import Page from "@/app/(public)/aboutme/page";

jest.mock("../../_utils/server/userApi", () => ({
  getUser: jest.fn(),
}));

describe("About Me Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Вызываем getUser", async () => {
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

    await Page();

    expect(getUser).toHaveBeenCalledTimes(1);
  });
});
