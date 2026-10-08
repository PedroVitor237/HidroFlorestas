"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { accountInputClass } from "./account-shell";

export function PasswordField({ id, label, value, onChange, current = false, describedBy, disabled }: {
  id: string; label: string; value: string; onChange: (value: string) => void; current?: boolean; describedBy?: string; disabled?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return <div>
    <label htmlFor={id} className="font-semibold text-gray-900">{label}</label>
    <div className="relative">
      <input id={id} name={id} required disabled={disabled} type={visible ? "text" : "password"} value={value} onChange={event => onChange(event.target.value)} autoComplete={current ? "current-password" : "new-password"} aria-describedby={describedBy} className={`${accountInputClass} pr-14`} />
      <button type="button" disabled={disabled} aria-label={`${visible ? "Ocultar" : "Mostrar"} ${label.toLowerCase()}`} aria-pressed={visible} onClick={() => setVisible(value => !value)} className="absolute right-3 top-5 rounded p-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-700">
        {visible ? <EyeOff aria-hidden="true" size={22} /> : <Eye aria-hidden="true" size={22} />}
      </button>
    </div>
  </div>;
}
