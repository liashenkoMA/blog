import { getUser } from "../../_utils/server/userApi";
import Page from "@/app/(admin)/dashboard/profile/page";

jest.mock("../../_utils/server/userApi", () => ({
  getUser: jest.fn(),
}));

describe("Profile Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Вызывает getUser", async () => {
    (getUser as jest.Mock).mockResolvedValue({
      name: "Максим",
      email: "max@mail.ru",
      avatarLink: "https://example.com/avatar.jpg",
      telegram: "https://t.me/max",
      vk: "https://vk.com/max",
      gitHub: "https://github.com/max",
      linkedin: "https://linkedin.com/in/max",
      mySite: "https://example.com",
    });

    await Page();

    expect(getUser).toHaveBeenCalledTimes(1);
  });

  it("Дожидается получения пользователя", async () => {
    let userResolved = false;

    (getUser as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            userResolved = true;

            resolve({
              name: "Максим",
              email: "max@mail.ru",
              avatarLink: "https://example.com/avatar.jpg",
              telegram: "https://t.me/max",
              vk: "https://vk.com/max",
              gitHub: "https://github.com/max",
              linkedin: "https://linkedin.com/in/max",
              mySite: "https://example.com",
            });
          }, 20);
        }),
    );

    await Page();

    expect(userResolved).toBe(true);
  });
});
