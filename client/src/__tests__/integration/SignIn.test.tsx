import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SignIn from "@/app/signin/page";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/service/auth/auth";
import { useRouter } from "next/navigation";

const pushMock = jest.fn();
const loginMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/service/auth/auth", () => ({
  authService: {
    signIn: jest.fn(),
  },
}));

describe("SignIn", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: loginMock,
      logout: jest.fn(),
    });
  });

  test("deve fazer login e redirecionar para a página principal", async () => {
    (authService.signIn as jest.Mock).mockResolvedValue({
      id: 1,
      email: "aluno@email.com",
    });

    render(<SignIn />);

    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "aluno@email.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "Senha@123" },
    });

    const botoesEntrar = screen.getAllByRole("button", { name: "Entrar" });
    fireEvent.click(botoesEntrar[1]);

    await waitFor(() => {
      expect(authService.signIn).toHaveBeenCalledWith({
        email: "aluno@email.com",
        password: "Senha@123",
      });
    });

    expect(loginMock).toHaveBeenCalledWith({
      id: 1,
      email: "aluno@email.com",
    });

    expect(pushMock).toHaveBeenCalledWith("/");
  });
});