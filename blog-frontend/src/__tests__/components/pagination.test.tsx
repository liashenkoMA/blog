import Pagination from "@/_components/Pagination/Pagination";
import { render, screen } from "@testing-library/react";
import { useSearchParams } from "next/navigation";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

describe("Pagination Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useSearchParams as jest.Mock).mockReturnValue({
      get: () => null,
    });
  });

  it("Не рендерится при page < 1", () => {
    const { container } = render(<Pagination totalCount={6} slug="/article" />);

    expect(container.firstChild).toBeNull();
  });

  it("Рендерится при page > 1", () => {
    render(<Pagination totalCount={12} slug="/article" />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("Кпнока влево заблокирована на первой странице", () => {
    render(<Pagination totalCount={12} slug="/article" />);

    const button = screen.getByRole("button", {
      name: "Предыдущая страница",
    });

    expect(button).toBeDisabled();
  });

  it("Кнопка вправо доступна на первой странице", () => {
    render(<Pagination totalCount={12} slug="/article" />);

    const link = screen.getByRole("link", {
      name: "Следующая страница",
    });

    expect(link).toBeInTheDocument();
    expect(link).not.toBeDisabled();
  });

  it("Отображает все страницы если их не больше пяти", () => {
    render(<Pagination totalCount={30} slug="/article" />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("Кнопка вправо заблокирована на последней странице", () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: () => "3",
    });

    render(<Pagination totalCount={18} slug="/articles" />);

    const button = screen.getByRole("button", {
      name: "Следующая страница",
    });

    expect(button).toBeDisabled();
  });

  it("Кнопка влево разблокирована не на первой странице", () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: () => "3",
    });

    render(<Pagination totalCount={12} slug="/article" />);

    const link = screen.getByRole("link", {
      name: "Предыдущая страница",
    });

    expect(link).toBeInTheDocument();
    expect(link).not.toBeDisabled();
  });

  it("Показывает многоточия при большом количестве страниц", () => {
    render(<Pagination totalCount={60} slug="/articles" />);

    expect(screen.getByText(". . .")).toBeInTheDocument();
  });

  it("Правильно создает ссылки на страницы", () => {
    render(<Pagination totalCount={18} slug="/articles" />);

    expect(screen.getByText("1")).toHaveAttribute("href", "/articles");
    expect(screen.getByText("2")).toHaveAttribute("href", "/articles?page=2");
    expect(screen.getByText("3")).toHaveAttribute("href", "/articles?page=3");
  });

  it("Текущая страница имеет класс type_active", () => {
    render(<Pagination totalCount={18} slug="/articles" />);

    const link = screen.getByRole("link", {
      name: "1",
    });

    expect(link).toHaveClass("pagination__button_type_active");
  });

  it("Snapshot", () => {
    const { container } = render(
      <Pagination totalCount={30} slug="/articles" />,
    );

    expect(container).toMatchSnapshot();
  });
});
