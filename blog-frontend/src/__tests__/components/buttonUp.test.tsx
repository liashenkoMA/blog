import ButtonUp from "@/_components/ButtonUp/ButtonUp";
import { fireEvent, render, screen } from "@testing-library/react";

describe("ButtonUp", () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  it("изначально скрыта", () => {
    render(<ButtonUp />);

    expect(screen.getByRole("button")).toHaveClass(
      "buttonUp__button_type_hide",
    );
  });

  it("показывается после скролла", () => {
    render(<ButtonUp />);

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 700,
    });

    fireEvent.scroll(window);

    expect(screen.getByRole("button")).not.toHaveClass(
      "buttonUp__button_type_hide",
    );
  });

  it("при клике прокручивает страницу наверх", () => {
    render(<ButtonUp />);

    fireEvent.click(screen.getByRole("button"));

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
