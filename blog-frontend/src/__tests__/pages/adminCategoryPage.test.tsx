import { getCategories } from "../../_utils/server/categoryApi";
import Page from "@/app/(admin)/dashboard/category/page";

jest.mock("../../_utils/server/categoryApi", () => ({
  getCategories: jest.fn(),
}));

describe("Category Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Вызывает getCategories", async () => {
    (getCategories as jest.Mock).mockResolvedValue([]);

    await Page();

    expect(getCategories).toHaveBeenCalledTimes(1);
  });
});
