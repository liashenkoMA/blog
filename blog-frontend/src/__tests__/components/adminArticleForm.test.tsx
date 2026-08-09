import AdminArticleForm from "@/_components/AdminArticleForm/AdminArticleForm";
import { ARTICLE_FORM_INPUTS } from "@/_constants/articleForm.constant";
import { ICategoryResponse, ITagResponse } from "@/_interfaces/interfaces";
import { createArticle } from "../../_utils/client/articleApi";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("../../_utils/client/articleApi", () => ({
  createArticle: jest.fn(),
}));

jest.mock("../../_components/UI/MarkdownEditor/MarkdownEditor", () => ({
  __esModule: true,
  default: ({ onChange }: { onChange: (content: string) => void }) => (
    <textarea
      data-testid="markdown-editor"
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

describe("Admin Article Form component", () => {
  const mockCategories: ICategoryResponse[] = [
    {
      _id: "category-1",
      slug: "frontend",
      name: "Frontend",
      image: "https://example.com/frontend.jpg",
      imageAlt: "Frontend",
      title: "Frontend",
      description: "Frontend category",
    },
    {
      _id: "category-2",
      slug: "backend",
      name: "Backend",
      image: "https://example.com/backend.jpg",
      imageAlt: "Backend",
      title: "Backend",
      description: "Backend category",
    },
  ];

  const mockTags: ITagResponse[] = [
    {
      _id: "tag-1",
      slug: "react",
      name: "React",
      title: "React",
      description: "React tag",
      image: "https://example.com/frontend.jpg",
      imageAlt: "Frontend",
    },
    {
      _id: "tag-2",
      slug: "nextjs",
      name: "Next.js",
      title: "Next.js",
      description: "Next.js tag",
      image: "https://example.com/backend.jpg",
      imageAlt: "Backend",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Рендер всех полей", () => {
    render(<AdminArticleForm categories={mockCategories} tags={mockTags} />);

    ARTICLE_FORM_INPUTS.forEach((input) => {
      const field = screen.getByPlaceholderText(input.placeholder as string);

      expect(field).toBeInTheDocument();
    });

    expect(screen.getByTestId("markdown-editor")).toBeInTheDocument();
  });

  it("Рендер категорий", () => {
    render(<AdminArticleForm categories={mockCategories} tags={mockTags} />);

    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
  });

  it("Рендер тегов", () => {
    render(<AdminArticleForm categories={mockCategories} tags={mockTags} />);

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  it("Ввод данных работает", () => {
    render(<AdminArticleForm categories={mockCategories} tags={mockTags} />);

    const input = screen.getByPlaceholderText("Введите slug");

    fireEvent.change(input, {
      target: { value: "test-article" },
    });

    expect(input).toHaveValue("test-article");
  });

  it("Выбор категории работает", () => {
    render(<AdminArticleForm categories={mockCategories} tags={mockTags} />);

    const category = screen.getByRole("combobox");

    fireEvent.change(category, {
      target: { value: "category-1" },
    });

    expect(category).toHaveValue("category-1");
  });

  it("Выбор тегов работает", () => {
    render(<AdminArticleForm categories={mockCategories} tags={mockTags} />);

    const reactTag = screen.getByRole("checkbox", {
      name: "React",
    });

    const nextTag = screen.getByRole("checkbox", {
      name: "Next.js",
    });

    fireEvent.click(reactTag);
    fireEvent.click(nextTag);

    expect(reactTag).toBeChecked();
    expect(nextTag).toBeChecked();
  });

  it("Снятие выбранного тега работает", () => {
    render(<AdminArticleForm categories={mockCategories} tags={mockTags} />);

    const reactTag = screen.getByRole("checkbox", {
      name: "React",
    });

    fireEvent.click(reactTag);

    expect(reactTag).toBeChecked();

    fireEvent.click(reactTag);

    expect(reactTag).not.toBeChecked();
  });

  it("Ввод контента статьи работает", () => {
    render(<AdminArticleForm categories={mockCategories} tags={mockTags} />);

    const editor = screen.getByTestId("markdown-editor");

    fireEvent.change(editor, {
      target: {
        value: "# Тестовая статья",
      },
    });

    expect(editor).toHaveValue("# Тестовая статья");
  });

  it("Ошибки валидации отображаются", () => {
    render(<AdminArticleForm categories={mockCategories} tags={mockTags} />);

    const button = screen.getByRole("button", {
      name: /Создать статью/i,
    });

    fireEvent.click(button);

    expect(
      screen.getByText("Slug должен быть не короче 2 символов"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Title должен быть не короче 2 символов"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("H1 должен быть не короче 2 символов"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Description должна быть не короче 2 символов"),
    ).toBeInTheDocument();
    expect(screen.getByText("Выберите категорию")).toBeInTheDocument();
    expect(
      screen.getByText("Введите корректную ссылку на изображение"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Alt должен быть не короче 2 символов"),
    ).toBeInTheDocument();
    expect(createArticle).not.toHaveBeenCalled();
  });

  it("Ошибка валидации исчезает после изменения поля", async () => {
    render(<AdminArticleForm categories={mockCategories} tags={mockTags} />);

    const button = screen.getByRole("button", {
      name: /Создать статью/i,
    });

    fireEvent.click(button);

    expect(
      screen.getByText("Slug должен быть не короче 2 символов"),
    ).toBeInTheDocument();

    const slugInput = screen.getByPlaceholderText("Введите slug");

    fireEvent.change(slugInput, {
      target: { value: "test-article" },
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Slug должен быть не короче 2 символов"),
      ).not.toBeInTheDocument();
    });
  });

  it("Успешное создание статьи", async () => {
    render(<AdminArticleForm categories={mockCategories} tags={mockTags} />);

    (createArticle as jest.Mock).mockResolvedValueOnce({
      _id: "article-1",
      slug: "test-article",
    });

    fireEvent.change(screen.getByPlaceholderText("Введите slug"), {
      target: { value: "test-article" },
    });

    fireEvent.change(screen.getByPlaceholderText("Введите title"), {
      target: { value: "Тестовая статья" },
    });

    fireEvent.change(screen.getByPlaceholderText("Введите H1"), {
      target: { value: "Тестовая статья H1" },
    });

    fireEvent.change(screen.getByPlaceholderText("Введите description"), {
      target: { value: "Описание тестовой статьи" },
    });

    fireEvent.change(screen.getByPlaceholderText("Введите URL изображения"), {
      target: {
        value: "https://example.com/image.jpg",
      },
    });

    fireEvent.change(
      screen.getByPlaceholderText("Введите описание изображения"),
      {
        target: {
          value: "Тестовая статья",
        },
      },
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "category-1" },
    });

    fireEvent.click(
      screen.getByRole("checkbox", {
        name: "React",
      }),
    );

    fireEvent.change(screen.getByTestId("markdown-editor"), {
      target: {
        value: "# Тестовая статья\n\nТекст статьи",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /Создать статью/i,
      }),
    );

    await waitFor(() => {
      expect(createArticle).toHaveBeenCalledTimes(1);
    });
    expect(createArticle).toHaveBeenCalledWith({
      slug: "test-article",
      title: "Тестовая статья",
      h1: "Тестовая статья H1",
      description: "Описание тестовой статьи",
      category: "category-1",
      tags: ["tag-1"],
      image: "https://example.com/image.jpg",
      imageAlt: "Тестовая статья",
      content: "# Тестовая статья\n\nТекст статьи",
      status: "draft",
    });
  });

  it("Ошибка сервера отображается", async () => {
    render(<AdminArticleForm categories={mockCategories} tags={mockTags} />);

    const errorMessage = "Ошибка сервера";

    (createArticle as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    fireEvent.change(screen.getByPlaceholderText("Введите slug"), {
      target: { value: "test-article" },
    });

    fireEvent.change(screen.getByPlaceholderText("Введите title"), {
      target: { value: "Тестовая статья" },
    });

    fireEvent.change(screen.getByPlaceholderText("Введите H1"), {
      target: { value: "Тестовая статья H1" },
    });

    fireEvent.change(screen.getByPlaceholderText("Введите description"), {
      target: { value: "Описание тестовой статьи" },
    });

    fireEvent.change(screen.getByPlaceholderText("Введите URL изображения"), {
      target: {
        value: "https://example.com/image.jpg",
      },
    });

    fireEvent.change(
      screen.getByPlaceholderText("Введите описание изображения"),
      {
        target: {
          value: "Тестовая статья",
        },
      },
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "category-1" },
    });

    fireEvent.change(screen.getByTestId("markdown-editor"), {
      target: {
        value: "# Тестовая статья",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /Создать статью/i,
      }),
    );

    const errorText = await screen.findByText(errorMessage);

    expect(errorText).toBeInTheDocument();
  });

  it("Snapshot", () => {
    const { container } = render(
      <AdminArticleForm categories={mockCategories} tags={mockTags} />,
    );

    expect(container).toMatchSnapshot();
  });
});
