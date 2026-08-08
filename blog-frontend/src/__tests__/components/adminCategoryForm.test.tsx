import AdminCategoryForm from "@/_components/AdminCategoryForm/AdminCategoryForm";
import { CATEGORY_FORM_INPUTS } from "@/_constants/category.constant";
import { createCategory } from "../../_utils/client/categoryApi";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("../../_utils/client/categoryApi", () => ({
  createCategory: jest.fn(),
}));

describe("Admin Category Form component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Рендер всех полей", () => {
    render(<AdminCategoryForm />);

    CATEGORY_FORM_INPUTS.forEach((input) => {
      const field = screen.getByPlaceholderText(input.placeholder as string);

      expect(field).toBeInTheDocument();
    });
  });

  it("Ввод данных работает", () => {
    render(<AdminCategoryForm />);

    const input = screen.getByPlaceholderText("Введите slug");

    fireEvent.change(input, {
      target: { value: "test" },
    });

    expect(input).toHaveValue("test");
  });

  it("Кнопка submit заблокирована при пустых данных", async () => {
    render(<AdminCategoryForm />);

    const button = screen.getByRole("button", {
      name: /Создать категорию/i,
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });

  it("Ошибки валидации отображаются", () => {
    render(<AdminCategoryForm />);

    const button = screen.getByRole("button", {
      name: /Создать категорию/i,
    });

    fireEvent.click(button);

    expect(
      screen.getByText("Slug должен быть не короче 2 символов"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Название должно быть не короче 2 символов"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Alt должен быть не короче 2 символов"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Title должен быть не короче 2 символов"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Description должна быть не короче 2 символов"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Введите корректную ссылку на изображение"),
    ).toBeInTheDocument();
  });

  it("Ошибка валидации исчезает после изменения поля", async () => {
    render(<AdminCategoryForm />);

    const button = screen.getByRole("button", {
      name: /Создать категорию/i,
    });

    fireEvent.click(button);

    expect(
      screen.getByText("Slug должен быть не короче 2 символов"),
    ).toBeInTheDocument();

    const slugInput = screen.getByPlaceholderText("Введите slug");

    fireEvent.change(slugInput, {
      target: { value: "test" },
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Slug должен быть не короче 2 символов"),
      ).not.toBeInTheDocument();
    });
  });

  it("Успешное создание категории", async () => {
    render(<AdminCategoryForm />);

    (createCategory as jest.Mock).mockResolvedValueOnce({
      createCategory: {
        _id: "123456",
        slug: "test-category",
        name: "Тестовая категория",
        image: "https://example.com/image.jpg",
        imageAlt: "Тестовая категория",
        title: "Тестовая категория",
        description: "Описание тестовой категории",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Введите slug"), {
      target: { value: "test-category" },
    });

    fireEvent.change(
      screen.getByPlaceholderText("Введите название категории"),
      {
        target: { value: "Тестовая категория" },
      },
    );

    fireEvent.change(screen.getByPlaceholderText("Введите URL изображения"), {
      target: { value: "https://example.com/image.jpg" },
    });

    fireEvent.change(
      screen.getByPlaceholderText("Введите описание изображения"),
      {
        target: { value: "Тестовая категория" },
      },
    );

    fireEvent.change(screen.getByPlaceholderText("Введите title"), {
      target: { value: "Тестовая категория" },
    });

    fireEvent.change(screen.getByPlaceholderText("Введите description"), {
      target: { value: "Описание тестовой категории" },
    });

    const button = screen.getByRole("button", {
      name: /Создать категорию/i,
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(createCategory).toHaveBeenCalledTimes(1);
    });
    expect(createCategory).toHaveBeenCalledWith({
      slug: "test-category",
      name: "Тестовая категория",
      image: "https://example.com/image.jpg",
      imageAlt: "Тестовая категория",
      title: "Тестовая категория",
      description: "Описание тестовой категории",
    });
  });

  it("Ошибка сервера отображается", async () => {
    render(<AdminCategoryForm />);

    const errorMessage = "Ошибка сервера";

    (createCategory as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage),
    );

    fireEvent.change(screen.getByPlaceholderText("Введите slug"), {
      target: { value: "test-category" },
    });

    fireEvent.change(
      screen.getByPlaceholderText("Введите название категории"),
      {
        target: { value: "Тестовая категория" },
      },
    );

    fireEvent.change(screen.getByPlaceholderText("Введите URL изображения"), {
      target: { value: "https://example.com/image.jpg" },
    });

    fireEvent.change(
      screen.getByPlaceholderText("Введите описание изображения"),
      {
        target: { value: "Тестовая категория" },
      },
    );

    fireEvent.change(screen.getByPlaceholderText("Введите title"), {
      target: { value: "Тестовая категория" },
    });

    fireEvent.change(screen.getByPlaceholderText("Введите description"), {
      target: { value: "Описание тестовой категории" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /Создать категорию/i,
      }),
    );

    const errorText = await screen.findByText(errorMessage);

    expect(errorText).toBeInTheDocument();
  });

  it("Snapshot", () => {
    const { container } = render(<AdminCategoryForm />);

    expect(container).toMatchSnapshot();
  });
});
