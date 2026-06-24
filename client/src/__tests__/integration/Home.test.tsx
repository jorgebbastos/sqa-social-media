import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/page";
import { useAuth } from "@/contexts/AuthContext";
import { postsService } from "@/service/posts/posts";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/service/posts/posts", () => ({
  postsService: {
    getPosts: jest.fn(),
    toggleLikePost: jest.fn(),
  },
}));

describe("Home", () => {
  test("deve carregar e exibir os posts vindos da API", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      logout: jest.fn(),
    });

    (postsService.getPosts as jest.Mock).mockResolvedValue({
      posts: [
        {
          id: 1,
          title: "Meu primeiro post",
          body: "Texto do primeiro post",
          liked: false,
        },
      ],
      total: 1,
      skip: 0,
      limit: 10,
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Meu primeiro post")).toBeInTheDocument();
    });

    expect(screen.getByText("Texto do primeiro post")).toBeInTheDocument();
    expect(postsService.getPosts).toHaveBeenCalledWith({
      skip: 0,
      limit: 10,
      userId: undefined,
    });
  });
});