import AdminProfileForm from "../../_components/AdminProfileForm/AdminProfileForm";
import { PROFILE_FORM_INPUTS } from "../../_constants/profileForm.constant";
import { IProfileResponse, IUser } from "../../_interfaces/interfaces";
import { updateUser } from "../../_utils/client/userApi";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("../../_utils/client/userApi", () => ({
  updateUser: jest.fn(),
}));

describe("Admin Profile Form component", () => {
  const mockUser: IUser = {
    name: "Максим",
    email: "max@mail.ru",
    avatarLink: "https://example.com/avatar.jpg",
    telegram: "https://t.me/max",
    vk: "https://vk.com/max",
    gitHub: "https://github.com/max",
    linkedin: "https://linkedin.com/in/max",
    mySite: "https://example.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Рендер всех полей", () => {
    render(<AdminProfileForm user={mockUser} />);

    PROFILE_FORM_INPUTS.forEach((input) => {
      const field = screen.getByPlaceholderText(input.placeholder as string);

      expect(field).toBeInTheDocument();
    });
  });

  it("Начальные данные пользователя отображаются", () => {
    render(<AdminProfileForm user={mockUser} />);

    expect(screen.getByPlaceholderText("Иван")).toHaveValue("Максим");

    expect(screen.getByPlaceholderText("ivan@mail.ru")).toHaveValue(
      "max@mail.ru",
    );

    expect(
      screen.getByPlaceholderText("https://example.com/avatar.jpg"),
    ).toHaveValue("https://example.com/avatar.jpg");
    expect(screen.getByPlaceholderText("https://t.me/username")).toHaveValue(
      "https://t.me/max",
    );
    expect(screen.getByPlaceholderText("https://vk.com/username")).toHaveValue(
      "https://vk.com/max",
    );
    expect(
      screen.getByPlaceholderText("https://github.com/username"),
    ).toHaveValue("https://github.com/max");
    expect(
      screen.getByPlaceholderText("https://linkedin.com/in/username"),
    ).toHaveValue("https://linkedin.com/in/max");
    expect(screen.getByPlaceholderText("https://example.com")).toHaveValue(
      "https://example.com",
    );
  });

  it("Ввод данных работает", () => {
    render(<AdminProfileForm user={mockUser} />);

    const input = screen.getByPlaceholderText("https://example.com/avatar.jpg");

    fireEvent.change(input, {
      target: { value: "https://test.com/avatar.jpg" },
    });

    expect(input).toHaveValue("https://test.com/avatar.jpg");
  });

  it("Ошибка при слишком коротком имени", async () => {
    render(<AdminProfileForm user={mockUser} />);

    const input = screen.getByPlaceholderText("Иван");

    fireEvent.change(input, {
      target: { value: "А" },
    });

    fireEvent.click(screen.getByText("Изменить профиль"));

    await waitFor(() => {
      expect(
        screen.getByText("Имя должно быть не короче 2 символов"),
      ).toBeInTheDocument();
    });
    expect(updateUser).not.toHaveBeenCalled();
  });

  it("Ошибка при некорректном email", async () => {
    render(<AdminProfileForm user={mockUser} />);

    const input = screen.getByPlaceholderText("ivan@mail.ru");

    fireEvent.change(input, {
      target: { value: "invalid-email" },
    });

    fireEvent.click(screen.getByText("Изменить профиль"));

    await waitFor(() => {
      expect(screen.getByText("Введите корректный email")).toBeInTheDocument();
    });
    expect(updateUser).not.toHaveBeenCalled();
  });

  it("Ошибка при некорректной ссылке", async () => {
    render(<AdminProfileForm user={mockUser} />);

    const input = screen.getByPlaceholderText("https://example.com/avatar.jpg");

    fireEvent.change(input, {
      target: { value: "invalid-url" },
    });

    fireEvent.click(screen.getByText("Изменить профиль"));

    await waitFor(() => {
      expect(screen.getByText("Введите корректную ссылку")).toBeInTheDocument();
    });
    expect(updateUser).not.toHaveBeenCalled();
  });

  it("Успешное изменение профиля", async () => {
    render(<AdminProfileForm user={mockUser} />);

    const response: IProfileResponse = {
      name: "Новое имя",
      email: "new@mail.ru",
      avatarLink: "https://example.com/avatar.jpg",
      telegram: "https://t.me/max",
      vk: "https://vk.com/max",
      gitHub: "https://github.com/max",
      linkedin: "https://linkedin.com/in/max",
      mySite: "https://example.com",
    };

    (updateUser as jest.Mock).mockResolvedValueOnce(response);

    fireEvent.change(screen.getByPlaceholderText("Иван"), {
      target: { value: "Новое имя" },
    });

    fireEvent.change(screen.getByPlaceholderText("ivan@mail.ru"), {
      target: { value: "new@mail.ru" },
    });

    fireEvent.change(
      screen.getByPlaceholderText("https://example.com/avatar.jpg"),
      {
        target: { value: "https://example.com/avatar.jpg" },
      },
    );

    fireEvent.click(screen.getByText("Изменить профиль"));

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith({
        name: "Новое имя",
        email: "new@mail.ru",
        avatarLink: "https://example.com/avatar.jpg",
        telegram: "https://t.me/max",
        vk: "https://vk.com/max",
        gitHub: "https://github.com/max",
        linkedin: "https://linkedin.com/in/max",
        mySite: "https://example.com",
      });
    });
    expect(screen.getByPlaceholderText("Иван")).toHaveValue("Новое имя");
    expect(screen.getByPlaceholderText("ivan@mail.ru")).toHaveValue(
      "new@mail.ru",
    );
  });

  it("Ошибка сервера отображается", async () => {
    render(<AdminProfileForm user={mockUser} />);

    const errorMessage = "Ошибка сервера";

    (updateUser as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    fireEvent.click(screen.getByText("Изменить профиль"));

    const errorText = await screen.findByText(errorMessage);

    expect(errorText).toBeInTheDocument();
  });

  it("Snapshot", () => {
    const { container } = render(<AdminProfileForm user={mockUser} />);

    expect(container).toMatchSnapshot();
  });
});
