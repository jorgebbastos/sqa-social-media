import { isPasswordValid } from "@/utils/password";

describe("Validação de senha", () => {
  test("BUG: deve aceitar senha forte com exatamente 8 caracteres", () => {
    const resultado = isPasswordValid("Senha@12");

    expect(resultado).toBe(true);
  });
});