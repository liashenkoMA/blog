import AdminGalleryForm from "../../_components/AdminGalleryForm/AdminGalleryForm";
import { postFile } from "../../_utils/client/fileApi";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("../../_utils/client/fileApi", () => ({
  postFile: jest.fn(),
}));

const createObjectURLMock = jest.fn();
const revokeObjectURLMock = jest.fn();

Object.defineProperty(URL, "createObjectURL", {
  writable: true,
  value: createObjectURLMock,
});

Object.defineProperty(URL, "revokeObjectURL", {
  writable: true,
  value: revokeObjectURLMock,
});

function createTestFile(bytes: number[], name: string, type: string) {
  const file = new File([new Uint8Array(bytes)], name, { type });

  file.slice = jest.fn().mockReturnValue({
    arrayBuffer: () => Promise.resolve(new Uint8Array(bytes).buffer),
  });

  return file;
}

describe("Admin Gallery Form component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    createObjectURLMock.mockReturnValue("blob:http://localhost/preview");
  });

  it("Рендер формы", () => {
    render(<AdminGalleryForm />);

    expect(
      screen.getByText("Выберите файл или перетащите его сюда"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Загрузить картинку" }),
    ).toBeInTheDocument();
    expect(screen.getByText("URL картинки:")).toBeInTheDocument();
    expect(screen.getByLabelText("Выберите изображение")).toBeInTheDocument();
  });

  it("Выбор JPEG файла работает", async () => {
    render(<AdminGalleryForm />);

    const file = createTestFile([0xff, 0xd8, 0xff], "photo.jpg", "image/jpeg");

    const input = screen.getByLabelText("Выберите изображение");

    fireEvent.change(input, {
      target: { files: [file] },
    });

    expect(await screen.findByText("Выбран файл:")).toBeInTheDocument();
    expect(screen.getByText("photo.jpg")).toBeInTheDocument();
    expect(createObjectURLMock).toHaveBeenCalledWith(file);
  });

  it("Превью файла отображается", async () => {
    render(<AdminGalleryForm />);

    const file = createTestFile([0xff, 0xd8, 0xff], "photo.jpg", "image/jpeg");

    const input = screen.getByLabelText("Выберите изображение");

    fireEvent.change(input, {
      target: { files: [file] },
    });

    const image = await screen.findByAltText("Превью картинки");

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "blob:http://localhost/preview");
  });

  it("Удаление выбранного файла работает", async () => {
    render(<AdminGalleryForm />);

    const file = createTestFile([0xff, 0xd8, 0xff], "photo.jpg", "image/jpeg");

    const input = screen.getByLabelText("Выберите изображение");

    fireEvent.change(input, {
      target: { files: [file] },
    });

    expect(await screen.findByText("photo.jpg")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Удалить" }));

    expect(screen.queryByText("photo.jpg")).not.toBeInTheDocument();
    expect(
      screen.getByText("Выберите файл или перетащите его сюда"),
    ).toBeInTheDocument();
  });

  it("Ошибка при некорректной JPEG сигнатуре", async () => {
    render(<AdminGalleryForm />);

    const file = createTestFile(
      [0x89, 0x50, 0x4e, 0x47],
      "photo.jpg",
      "image/jpeg",
    );

    const input = screen.getByLabelText("Выберите изображение");

    fireEvent.change(input, {
      target: { files: [file] },
    });

    await screen.findByText("Выбран файл:");

    fireEvent.click(screen.getByRole("button", { name: "Загрузить картинку" }));

    await waitFor(() => {
      expect(screen.getByText("Файл не является JPEG.")).toBeInTheDocument();
    });
    expect(postFile).not.toHaveBeenCalled();
  });

  it("Ошибка при некорректной PNG сигнатуре", async () => {
    render(<AdminGalleryForm />);

    const file = createTestFile([0xff, 0xd8, 0xff], "photo.png", "image/png");

    const input = screen.getByLabelText("Выберите изображение");

    fireEvent.change(input, {
      target: { files: [file] },
    });

    await screen.findByText("Выбран файл:");

    fireEvent.click(screen.getByRole("button", { name: "Загрузить картинку" }));

    await waitFor(() => {
      expect(screen.getByText("Файл не является PNG.")).toBeInTheDocument();
    });
    expect(postFile).not.toHaveBeenCalled();
  });

  it("Ошибка при некорректной WebP сигнатуре", async () => {
    render(<AdminGalleryForm />);

    const file = createTestFile(
      [0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
      "photo.webp",
      "image/webp",
    );

    const input = screen.getByLabelText("Выберите изображение");

    fireEvent.change(input, {
      target: { files: [file] },
    });

    await screen.findByText("Выбран файл:");

    fireEvent.click(screen.getByRole("button", { name: "Загрузить картинку" }));

    await waitFor(() => {
      expect(screen.getByText("Файл не является WebP.")).toBeInTheDocument();
    });
    expect(postFile).not.toHaveBeenCalled();
  });

  it("Успешная загрузка JPEG", async () => {
    render(<AdminGalleryForm />);

    const file = createTestFile([0xff, 0xd8, 0xff], "photo.jpg", "image/jpeg");

    const response = {
      filePath: "https://example.com/files/photo.jpg",
    };

    (postFile as jest.Mock).mockResolvedValueOnce(response);

    const input = screen.getByLabelText("Выберите изображение");

    fireEvent.change(input, {
      target: { files: [file] },
    });

    await screen.findByText("Выбран файл:");

    fireEvent.click(screen.getByRole("button", { name: "Загрузить картинку" }));

    await waitFor(() => {
      expect(postFile).toHaveBeenCalledWith(file);
    });
    expect(
      screen.getByText("https://example.com/files/photo.jpg"),
    ).toBeInTheDocument();
    expect(screen.queryByText("photo.jpg")).not.toBeInTheDocument();
  });

  it("Ошибка сервера отображается", async () => {
    render(<AdminGalleryForm />);

    const file = createTestFile([0xff, 0xd8, 0xff], "photo.jpg", "image/jpeg");

    const errorMessage = "Ошибка сервера";

    (postFile as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const input = screen.getByLabelText("Выберите изображение");

    fireEvent.change(input, {
      target: { files: [file] },
    });

    await screen.findByText("Выбран файл:");

    fireEvent.click(screen.getByRole("button", { name: "Загрузить картинку" }));

    const errorText = await screen.findByText(errorMessage);

    expect(errorText).toBeInTheDocument();
  });

  it("Кнопка блокируется во время загрузки", async () => {
    render(<AdminGalleryForm />);

    const file = createTestFile([0xff, 0xd8, 0xff], "photo.jpg", "image/jpeg");

    (postFile as jest.Mock).mockResolvedValueOnce({
      filePath: "https://example.com/files/photo.jpg",
    });

    const input = screen.getByLabelText("Выберите изображение");
    const button = screen.getByRole("button", {
      name: "Загрузить картинку",
    });

    fireEvent.change(input, {
      target: { files: [file] },
    });

    await screen.findByText("Выбран файл:");

    fireEvent.click(button);

    expect(button).toBeDisabled();
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it("Snapshot", () => {
    const { container } = render(<AdminGalleryForm />);

    expect(container).toMatchSnapshot();
  });
});
