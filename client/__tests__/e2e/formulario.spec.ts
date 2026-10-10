import { test, expect } from '@playwright/test';

test('El formulario registra los datos y reacciona al envío', async ({ page }) => {
  await page.goto('http://localhost:4321/');

  await page.locator('input[name="nombre"]').fill('Eric Luna');
  await page.locator('input[name="email"]').fill('eric@ejemplo.com');
  await page.locator('textarea[name="mensaje"]').fill('Hola, necesito un presupuesto para un desarrollo web.');

  await expect(page.locator('input[name="nombre"]')).toHaveValue('Eric Luna');
  await expect(page.locator('input[name="email"]')).toHaveValue('eric@ejemplo.com');

  await page.locator('button[type="submit"]').click();
  
  // La validación de éxito o reseteo de campos la sumaremos al integrar la Fase 5
});