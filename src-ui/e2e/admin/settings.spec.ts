import { test, expect } from '@playwright/test'

const REQUESTS_HAR = 'e2e/admin/requests/api-settings.har'

test('should activate / deactivate save button when settings change', async ({
  page,
}) => {
  await page.routeFromHAR(REQUESTS_HAR, { notFound: 'fallback' })
  await page.goto('/settings')
  await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled()
  await page.getByLabel('Use system setting').click()
  await page.getByRole('button', { name: 'Save' }).scrollIntoViewIfNeeded()
  await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled()
})

test('should warn on unsaved changes', async ({ page }) => {
  await page.routeFromHAR(REQUESTS_HAR, { notFound: 'fallback' })
  await page.goto('/settings')
  await page.getByLabel('Use system setting').click()
  await page.getByRole('link', { name: 'Dashboard' }).click()
  await expect(page.getByRole('dialog')).toHaveText(/unsaved changes/)
  await page.getByRole('button', { name: 'Cancel' }).click()
  await page.getByLabel('Use system setting').click()
  await page.getByRole('link', { name: 'Dashboard' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('should apply appearance changes when set', async ({ page }) => {
  await page.routeFromHAR(REQUESTS_HAR, { notFound: 'fallback' })
  await page.goto('/settings')
  await expect(page.locator('html')).toHaveAttribute('data-bs-theme', /auto/)
  await page.getByLabel('Use system setting').click()
  await page.getByLabel('Enable dark mode').click()
  await expect(page.locator('html')).toHaveAttribute('data-bs-theme', /dark/)
})
