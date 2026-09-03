import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsSchema, SettingsFormData, defaultSettings } from '../../types/settings';

export interface SettingsFormProps {
  initialValues?: Partial<SettingsFormData>;
  onSave?: (data: SettingsFormData) => Promise<void> | void;
}

export function SettingsForm({ initialValues, onSave }: SettingsFormProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      ...defaultSettings,
      ...initialValues,
    },
    mode: 'onTouched',
  });

  const onSubmit = async (data: SettingsFormData) => {
    setSuccessMessage(null);
    setSubmitError(null);
    try {
      if (onSave) {
        await onSave(data);
      } else {
        // Simulate async operation if no handler provided
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      setSuccessMessage('Settings updated successfully!');
      reset(data);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900 text-slate-100 p-8 rounded-2xl shadow-2xl border border-slate-800 backdrop-blur-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-white">Profile & Notification Settings</h2>
        <p className="text-sm text-slate-400 mt-1">Manage your account credentials and notification preferences.</p>
      </div>

      {successMessage && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium animate-fadeIn"
        >
          {successMessage}
        </div>
      )}

      {submitError && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-medium animate-fadeIn"
        >
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* Username Field */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
            Username
          </label>
          <input
            id="username"
            type="text"
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? 'username-error' : undefined}
            className={`w-full px-4 py-2.5 bg-slate-800/80 border rounded-xl text-slate-100 placeholder-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 ${
              errors.username
                ? 'border-rose-500 focus:ring-rose-500/50'
                : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/30'
            }`}
            placeholder="e.g. alex-developer"
            {...register('username')}
          />
          {errors.username && (
            <p id="username-error" role="alert" className="mt-1.5 text-xs text-rose-400 font-medium">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={`w-full px-4 py-2.5 bg-slate-800/80 border rounded-xl text-slate-100 placeholder-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 ${
              errors.email
                ? 'border-rose-500 focus:ring-rose-500/50'
                : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/30'
            }`}
            placeholder="alex@example.com"
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1.5 text-xs text-rose-400 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Notification Digest Field */}
        <div>
          <label htmlFor="notifyDigest" className="block text-sm font-medium text-slate-300 mb-2">
            Email Digest Frequency
          </label>
          <select
            id="notifyDigest"
            aria-invalid={Boolean(errors.notifyDigest)}
            aria-describedby={errors.notifyDigest ? 'notifyDigest-error' : undefined}
            className={`w-full px-4 py-2.5 bg-slate-800/80 border rounded-xl text-slate-100 transition-all duration-200 focus:outline-none focus:ring-2 ${
              errors.notifyDigest
                ? 'border-rose-500 focus:ring-rose-500/50'
                : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/30'
            }`}
            {...register('notifyDigest')}
          >
            <option value="daily">Daily Digest</option>
            <option value="weekly">Weekly Summary</option>
            <option value="never">Never Send</option>
          </select>
          {errors.notifyDigest && (
            <p id="notifyDigest-error" role="alert" className="mt-1.5 text-xs text-rose-400 font-medium">
              {errors.notifyDigest.message}
            </p>
          )}
        </div>

        {/* Marketing Opt-In Checkbox */}
        <div className="flex items-center space-x-3 pt-2">
          <input
            id="marketingOptIn"
            type="checkbox"
            className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500/40 focus:ring-offset-slate-900"
            {...register('marketingOptIn')}
          />
          <label htmlFor="marketingOptIn" className="text-sm font-medium text-slate-300 cursor-pointer select-none">
            Receive product update announcements & marketing tips
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={!isDirty || isSubmitting}
            className={`w-full py-3 px-6 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
              !isDirty || isSubmitting
                ? 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] focus:ring-2 focus:ring-indigo-500/50'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Saving Settings...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
