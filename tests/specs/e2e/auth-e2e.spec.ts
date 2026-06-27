import { test, expect, type APIRequestContext } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://localhost:8080';
const PASSWORD = 'Senha@123';

function uniqueEmail(prefix: string) {
  return `${prefix}.${Date.now()}.${Math.floor(Math.random() * 10000)}@teste.com`;
}

async function createUser(request: APIRequestContext, email: string) {
  const response = await request.post(`${API_URL}/auth/signup`, {
    data: {
      email,
      password: PASSWORD,
    },
  });

  expect(response.status()).toBe(200);
}

test('E2E 1: usuário cria conta e acessa o feed', async ({ page }) => {
  const email = uniqueEmail('e2e-cadastro');

  await page.goto('/signup');

  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').nth(0).fill(PASSWORD);
  await page.locator('input[type="password"]').nth(1).fill(PASSWORD);

  await page.locator('form').getByRole('button', { name: 'Criar Conta' }).click();

  await expect(page.getByRole('heading', { name: 'Feed de Posts' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Posts Curtidos' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
});

test('E2E 2: usuário faz login, curte um post e acessa posts curtidos', async ({ page, request }) => {
  const email = uniqueEmail('e2e-like');

  await createUser(request, email);

  await page.goto('/signin');

  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(PASSWORD);

  await page.locator('form').getByRole('button', { name: 'Entrar' }).click();

  await expect(page.getByRole('heading', { name: 'Feed de Posts' })).toBeVisible();

  const firstPost = page.getByRole('listitem').first();

  await expect(firstPost).toBeVisible();

  await firstPost.getByRole('button', { name: /Curtir/ }).click();

  await expect(firstPost.getByRole('button', { name: /Curtido/ })).toBeVisible();

  await page.getByRole('button', { name: 'Posts Curtidos' }).click();

  await expect(page.getByRole('heading', { name: 'Posts Curtidos' })).toBeVisible();
  await expect(page.getByRole('listitem').first()).toBeVisible();
});