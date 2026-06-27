import { test, expect, type APIRequestContext } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://localhost:8080';
const PASSWORD = 'Senha@123';

function uniqueEmail(prefix: string) {
  return `${prefix}.${Date.now()}.${Math.floor(Math.random() * 10000)}@teste.com`;
}

async function createUser(request: APIRequestContext, email: string, password = PASSWORD) {
  const response = await request.post(`${API_URL}/auth/signup`, {
    data: {
      email,
      password,
    },
  });

  expect(response.status()).toBe(200);

  return response.json();
}

test('API 1: deve cadastrar usuário com dados válidos', async ({ request }) => {
  const email = uniqueEmail('cadastro');

  const response = await request.post(`${API_URL}/auth/signup`, {
    data: {
      email,
      password: PASSWORD,
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.id).toBeDefined();
  expect(body.email).toBe(email);
});

test('API 2: deve bloquear cadastro com e-mail duplicado', async ({ request }) => {
  const email = uniqueEmail('duplicado');

  await createUser(request, email);

  const response = await request.post(`${API_URL}/auth/signup`, {
    data: {
      email,
      password: PASSWORD,
    },
  });

  expect(response.status()).toBe(409);

  const body = await response.json();

  expect(body.message).toBe('E-mail já cadastrado');
  expect(body.status).toBe(409);
});

test('API 3: deve fazer login com usuário existente', async ({ request }) => {
  const email = uniqueEmail('login');

  await createUser(request, email);

  const response = await request.post(`${API_URL}/auth/signin`, {
    data: {
      email,
      password: PASSWORD,
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.id).toBeDefined();
  expect(body.email).toBe(email);
});

test('API 4: deve bloquear login com senha incorreta', async ({ request }) => {
  const email = uniqueEmail('senha-errada');

  await createUser(request, email);

  const response = await request.post(`${API_URL}/auth/signin`, {
    data: {
      email,
      password: 'SenhaErrada@123',
    },
  });

  expect(response.status()).toBe(401);

  const body = await response.json();

  expect(body.message).toBe('Credenciais inválidas');
  expect(body.status).toBe(401);
});