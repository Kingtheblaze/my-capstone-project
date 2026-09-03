import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SettingsForm } from '../SettingsForm';

describe('SettingsForm Component', () => {
  it('(a) handles valid submission and sanitizes input whitespace', async () => {
    const handleSave = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 50)));
    const user = userEvent.setup();

    render(<SettingsForm onSave={handleSave} />);

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const digestSelect = screen.getByLabelText(/email digest frequency/i);
    const marketingCheckbox = screen.getByLabelText(/receive product update announcements/i);
    const submitButton = screen.getByRole('button', { name: /save changes/i });

    // Initial state: button disabled because form is pristine
    expect(submitButton).toBeDisabled();

    // Fill form with valid input (including leading/trailing whitespace to test sanitization)
    await user.type(usernameInput, '  valid-user-123  ');
    await user.type(emailInput, '  user@example.com  ');
    await user.selectOptions(digestSelect, 'weekly');
    await user.click(marketingCheckbox);

    expect(submitButton).not.toBeDisabled();
    await user.click(submitButton);

    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledTimes(1);
      expect(handleSave).toHaveBeenCalledWith({
        username: 'valid-user-123',
        email: 'user@example.com',
        notifyDigest: 'weekly',
        marketingOptIn: true,
      });
    });

    expect(await screen.findByText(/settings updated successfully!/i)).toBeInTheDocument();
  });

  it('(b) triggers validation error on invalid username characters', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    const usernameInput = screen.getByLabelText(/username/i);
    const submitButton = screen.getByRole('button', { name: /save changes/i });

    // Type invalid username with special characters (@#$)
    await user.type(usernameInput, 'invalid_user!');
    
    // Fill valid email to make form dirty
    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, 'test@example.com');

    await user.click(submitButton);

    const errorMessage = await screen.findByText(
      /username can only contain alphanumeric characters and hyphens/i
    );
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveAttribute('role', 'alert');
  });

  it('(c) enforces screen reader accessibility boundaries (aria-invalid & aria-describedby)', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /save changes/i });

    // Type short username (<3 chars) and invalid email
    await user.type(usernameInput, 'ab');
    await user.type(emailInput, 'invalid-email');

    // Submit to trigger validation
    await user.click(submitButton);

    // Wait for username error element
    const usernameError = await screen.findByText(/username must be at least 3 characters/i);
    expect(usernameError).toHaveAttribute('role', 'alert');
    expect(usernameError).toHaveAttribute('id', 'username-error');

    // Verify aria attributes on username input
    expect(usernameInput).toHaveAttribute('aria-invalid', 'true');
    expect(usernameInput).toHaveAttribute('aria-describedby', 'username-error');

    // Verify email error accessibility attributes
    const emailError = await screen.findByText(/please enter a valid rfc 5322 email address/i);
    expect(emailError).toHaveAttribute('role', 'alert');
    expect(emailError).toHaveAttribute('id', 'email-error');
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    expect(emailInput).toHaveAttribute('aria-describedby', 'email-error');
  });

  it('(d) disables submit button when form is pristine and during active submission', async () => {
    let resolveSubmit: () => void;
    const handleSave = vi.fn().mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        })
    );

    const user = userEvent.setup();
    render(<SettingsForm onSave={handleSave} />);

    const submitButton = screen.getByRole('button', { name: /save changes/i });

    // 1. Pristine state: button must be disabled
    expect(submitButton).toBeDisabled();

    // Make form dirty with valid inputs
    await user.type(screen.getByLabelText(/username/i), 'valid-user');
    await user.type(screen.getByLabelText(/email address/i), 'valid@example.com');

    // Button should now be enabled
    expect(submitButton).not.toBeDisabled();

    // Click submit
    await user.click(submitButton);

    // 2. Submitting state: button must show loading text and be disabled
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText(/saving settings.../i)).toBeInTheDocument();

    // Finish submit promise
    resolveSubmit!();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /save changes/i })).toBeDisabled();
    });
  });
});
