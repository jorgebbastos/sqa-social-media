import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import PostCard from "@/components/PostCard";

const post = {
  id: 1,
  title: "Título do post",
  body: "Conteúdo do post",
  liked: false,
  reactions: {
    likes: 10,
    dislikes: 2,
  },
};

describe("PostCard", () => {
  test("deve mostrar likes e dislikes do post", () => {
    const onLikeMock = jest.fn();

    render(
      <PostCard post={post} isAuthenticated={false} onLike={onLikeMock} />
    );

    expect(screen.getByText("Likes: 10")).toBeInTheDocument();
    expect(screen.getByText("Dislikes: 2")).toBeInTheDocument();
  });

  test("deve mostrar alerta quando usuário deslogado tenta curtir", () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    const onLikeMock = jest.fn();

    render(
      <PostCard post={post} isAuthenticated={false} onLike={onLikeMock} />
    );

    fireEvent.click(screen.getByRole("button", { name: /curtir/i }));

    expect(alertMock).toHaveBeenCalledWith(
      "Você precisa estar autenticado para curtir posts!"
    );
    expect(onLikeMock).not.toHaveBeenCalled();

    alertMock.mockRestore();
  });
});