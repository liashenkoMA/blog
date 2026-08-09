import Page from "@/app/(admin)/dashboard/article/page";
import { getCategories } from "../../_utils/server/categoryApi";
import { getTags } from "../../_utils/server/tagApi";

jest.mock("../../_utils/server/categoryApi", () => ({
  getCategories: jest.fn(),
}));

jest.mock("../../_utils/server/tagApi", () => ({
  getTags: jest.fn(),
}));

jest.mock("@/_components/AdminArticleForm/AdminArticleForm", () => ({
  __esModule: true,
  default: () => <div>Admin Article Form</div>,
}));

describe("Article Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Вызывает getCategories и getTags", async () => {
    (getCategories as jest.Mock).mockResolvedValue([]);
    (getTags as jest.Mock).mockResolvedValue([]);

    await Page();

    expect(getCategories).toHaveBeenCalledTimes(1);
    expect(getTags).toHaveBeenCalledTimes(1);
  });
});
