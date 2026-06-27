import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Button from "@/components/Button";

describe("Button", () => {
  test("deve mostrar texto de carregamento e ficar desabilitado", () => {
    render(<Button isLoading>Salvar</Button>);

    const button = screen.getByRole("button", { name: /carregando/i });

    expect(button).toBeDisabled();
  });
});