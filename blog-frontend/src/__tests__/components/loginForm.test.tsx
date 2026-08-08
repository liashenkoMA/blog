import LoginForm from "../../_components/LoginForm/LoginForm";
import { LOGIN_FORM_INPUTS } from "../../_constants/loginForm.constant";
import { login } from "../../_utils/server/authApi";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../_utils/server/authApi", () => ({
  login: jest.fn(),
}));

const pushMock = jest.fn();

describe("Login Form component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it("Рендер всех полей", () => {
    render(<LoginForm />);

    LOGIN_FORM_INPUTS.forEach((input) => {
      const field = screen.getByPlaceholderText(input.placeholder as string);

      expect(field).toBeInTheDocument();
    });
  });

  it("Ввод данных работает", () => {
    render(<LoginForm />);

    const input = screen.getByPlaceholderText("Введите пароль");

    fireEvent.change(input, {
      target: { value: "123" },
    });

    expect(input).toHaveValue("123");
  });

  it("Кнопка submit заблокирована при пустых данных", async () => {
    render(<LoginForm />);

    const button = screen.getByRole("button", { name: /Войти/i });

    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });

  it("Ошибка при несовпадении паролей", () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText(/Введите пароль/i), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Повторите пароль/i), {
      target: { value: "456" },
    });

    expect(screen.getByText("Пароли не совпадают.")).toBeInTheDocument();
  });

  it("Нет ошибки если пароли совпадают", () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText(/Введите пароль/i), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Повторите пароль/i), {
      target: { value: "123" },
    });

    expect(screen.queryByText("Пароли не совпадают.")).not.toBeInTheDocument();
  });

  it("Успешный логин → редирект", async () => {
    render(<LoginForm />);

    const user = {
      message: "Добро пожаловать!",
    };

    (login as jest.Mock).mockResolvedValueOnce(user);

    fireEvent.change(screen.getByPlaceholderText("ivan@mail.ru"), {
      target: { value: "ivan@mail.ru" },
    });

    fireEvent.change(screen.getByPlaceholderText("Введите пароль"), {
      target: { value: "123456" },
    });

    fireEvent.change(screen.getByPlaceholderText("Повторите пароль"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByText("Войти"));

    await waitFor(() => {
      expect(login).toHaveBeenCalled();
    });
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });

  it("Ошибка сервера отображается", async () => {
    render(<LoginForm />);

    const errorMessage = "Ошибка сервера";

    (login as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    fireEvent.change(screen.getByPlaceholderText("ivan@mail.ru"), {
      target: { value: "ivan@mail.ru" },
    });
    fireEvent.change(screen.getByPlaceholderText("Введите пароль"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("Повторите пароль"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByText("Войти"));

    const errorText = await screen.findByText(errorMessage);

    expect(errorText).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("Snapshot", () => {
    const { container } = render(<LoginForm />);

    expect(container).toMatchSnapshot();
  });
});
