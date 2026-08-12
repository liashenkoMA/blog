import Sidebar from "@/_components/Sidebar/Sidebar";
import { getCategories } from "@/_utils/server/categoryApi";
import { getTags } from "@/_utils/server/tagApi";

jest.mock("../../_utils/server/tagApi", () => ({
  getTags: jest.fn(),
}));

jest.mock("../../_utils/server/categoryApi", () => ({
  getCategories: jest.fn(),
}));

describe("Sidebar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Вызывает getCategories и getTags", async () => {
    (getCategories as jest.Mock).mockResolvedValue([]);
    (getTags as jest.Mock).mockResolvedValue([]);

    await Sidebar();

    expect(getCategories).toHaveBeenCalledTimes(1);
    expect(getTags).toHaveBeenCalledTimes(1);
  });
});
