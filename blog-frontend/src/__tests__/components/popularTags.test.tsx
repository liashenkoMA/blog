import PopularTags from "@/_components/PopularTags/PopularTags";
import { getTags } from "@/_utils/server/tagApi";

jest.mock("../../_utils/server/tagApi", () => ({
  getTags: jest.fn(),
}));

describe("PopularTags component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Вызывает getTags", async () => {
    (getTags as jest.Mock).mockResolvedValue([]);

    await PopularTags();

    expect(getTags).toHaveBeenCalledTimes(1);
  });
});
