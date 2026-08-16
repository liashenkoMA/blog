import { getTags } from "../../_utils/server/tagApi";
import Page from "@/app/(admin)/dashboard/tag/page";

jest.mock("../../_utils/server/tagApi", () => ({
  getTags: jest.fn(),
}));

describe("Tag Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Вызывает getTags", async () => {
    (getTags as jest.Mock).mockResolvedValue([]);

    await Page();

    expect(getTags).toHaveBeenCalledTimes(1);
  });
});
