import { isEmailValid } from "@/utils/email";

describe("Validação de e-mail", () => {
  test("deve aceitar um e-mail em formato válido", () => {
    const resultado = isEmailValid("aluno@email.com");

    expect(resultado).toBe(true);
  });
});