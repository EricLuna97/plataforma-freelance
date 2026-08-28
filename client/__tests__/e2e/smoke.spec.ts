import { test, expect } from '@playwright/test';

test('Prueba de humo: La página principal carga correctamente', async ({ page }) => {
  await page.goto('http://localhost:4321');

  const heading = page.getByRole('heading', { name: 'Laboratorio Jamstack Listo' });
  await expect(heading).toBeVisible();
});