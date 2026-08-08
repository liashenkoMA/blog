import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdminTagForm from "../../_components/AdminTagForm/AdminTagForm";
import { TAG_FORM_INPUTS } from "../../_constants/tagForm.constant";
import { createTag } from "../../_utils/client/tagApi";

jest.mock("../../_utils/client/tagApi", () => ({
  createTag: jest.fn(),
}));

describe("Admin Tag Form component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Рендер всех полей", () => {
    render(<AdminTagForm />);

    TAG_FORM_INPUTS.forEach((input) => {
      const field = screen.getByPlaceholderText(input.placeholder as string);

      expect(field).toBeInTheDocument();
    });
  });

  it("Ввод данных работает", () => {
    render(<AdminTagForm />);

    const input = screen.getByPlaceholderText("Введите slug");

    fireEvent.change(input, {
      target: { value: "test" },
    });

    expect(input).toHaveValue("test");
  });

  it("Кнопка submit заблокирована при пустых данных", async () => {
    render(<AdminTagForm />);

    const button = screen.getByRole("button", {
      name: /Создать тег/i,
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });

  it("Ошибки валидации отображаются", () => {
    render(<AdminTagForm />);

    const button = screen.getByRole("button", {
      name: /Создать тег/i,
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
    render(<AdminTagForm />);

    const button = screen.getByRole("button", {
      name: /Создать тег/i,
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

  it("Успешное создание тега", async () => {
    render(<AdminTagForm />);

    (createTag as jest.Mock).mockResolvedValueOnce({
      createTag: {
        _id: "123456",
        slug: "test-tag",
        name: "Тестовый тег",
        image: "https://example.com/image.jpg",
        imageAlt: "Тестовый тег",
        title: "Тестовый тег",
        description: "Описание тестового тега",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Введите slug"), {
      target: { value: "test-tag" },
    });

    fireEvent.change(screen.getByPlaceholderText("Введите название тега"), {
      target: { value: "Тестовый тег" },
    });

    fireEvent.change(screen.getByPlaceholderText("Введите URL изображения"), {
      target: { value: "https://example.com/image.jpg" },
    });

    fireEvent.change(
      screen.getByPlaceholderText("Введите описание изображения"),
      {
        target: { value: "Тестовый тег" },
      },
    );

    fireEvent.change(screen.getByPlaceholderText("Введите title"), {
      target: { value: "Тестовый тег" },
    });

    fireEvent.change(screen.getByPlaceholderText("Введите description"), {
      target: { value: "Описание тестового тега" },
    });

    const button = screen.getByRole("button", {
      name: /Создать тег/i,
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(createTag).toHaveBeenCalledTimes(1);
    });

    expect(createTag).toHaveBeenCalledWith({
      slug: "test-tag",
      name: "Тестовый тег",
      image: "https://example.com/image.jpg",
      imageAlt: "Тестовый тег",
      title: "Тестовый тег",
      description: "Описание тестового тега",
    });
  });

  it("Ошибка сервера отображается", async () => {
    render(<AdminTagForm />);

    const errorMessage = "Ошибка сервера";

    (createTag as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    fireEvent.change(screen.getByPlaceholderText("Введите slug"), {
      target: { value: "test-tag" },
    });

    fireEvent.change(screen.getByPlaceholderText("Введите название тега"), {
      target: { value: "Тестовый тег" },
    });

    fireEvent.change(screen.getByPlaceholderText("Введите URL изображения"), {
      target: { value: "https://example.com/image.jpg" },
    });

    fireEvent.change(
      screen.getByPlaceholderText("Введите описание изображения"),
      {
        target: { value: "Тестовый тег" },
      },
    );

    fireEvent.change(screen.getByPlaceholderText("Введите title"), {
      target: { value: "Тестовый тег" },
    });

    fireEvent.change(screen.getByPlaceholderText("Введите description"), {
      target: { value: "Описание тестового тега" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /Создать тег/i,
      }),
    );

    const errorText = await screen.findByText(errorMessage);

    expect(errorText).toBeInTheDocument();
  });

  it("Snapshot", () => {
    const { container } = render(<AdminTagForm />);

    expect(container).toMatchSnapshot();
  });
});
