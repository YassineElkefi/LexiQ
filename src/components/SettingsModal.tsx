'use client';

import React from 'react';

interface SettingsModalProps {
  onClose: () => void;
  isHardMode: boolean;
  onToggleHardMode: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  gameStarted: boolean;
}

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

function Toggle({ checked, onChange, disabled }: ToggleProps) {
  return (
    <button
      onClick={!disabled ? onChange : undefined}
      disabled={disabled}
      className="relative inline-flex items-center w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none"
      style={{
        background: checked ? '#22c55e' : 'var(--border-color)',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      aria-checked={checked}
      role="switch"
    >
      <span
        className="inline-block w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200"
        style={{ transform: checked ? 'translateX(26px)' : 'translateX(2px)' }}
      />
    </button>
  );
}

interface SettingRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
      <div className="pr-4">
        <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{label}</div>
        {description && (
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{description}</div>
        )}
      </div>
      {children}
    </div>
  );
}

export default function SettingsModal({
  onClose, isHardMode, onToggleHardMode, isDark, onToggleDark, gameStarted
}: SettingsModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-enter relative w-full max-w-md rounded-2xl p-6 shadow-2xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full opacity-50 hover:opacity-100 transition-opacity text-xl"
          style={{ color: 'var(--text-primary)' }}
        >
          ✕
        </button>

        <h2
          className="text-3xl font-bold text-center mb-6 tracking-wider"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          SETTINGS
        </h2>

        <div>
          <SettingRow
            label="Hard Mode"
            description={
              gameStarted
                ? "Hard mode can only be changed before the game starts"
                : "Green and yellow letters must be used in subsequent guesses"
            }
          >
            <Toggle
              checked={isHardMode}
              onChange={onToggleHardMode}
              disabled={gameStarted}
            />
          </SettingRow>

          <SettingRow
            label="Dark Theme"
            description="Switch between light and dark appearance"
          >
            <Toggle checked={isDark} onChange={onToggleDark} />
          </SettingRow>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-xl font-bold text-sm tracking-wider text-white transition-transform hover:scale-[1.01] active:scale-[0.99]"
          style={{ background: '#22c55e' }}
        >
          DONE
        </button>
      </div>
    </div>
  );
}