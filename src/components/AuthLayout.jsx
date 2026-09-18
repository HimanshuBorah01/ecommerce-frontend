import React from "react";

export default function AuthLayout({
  icon: Icon,
  title,
  subtitle,
  footer,
  children,
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FF5A1F] mb-4">
            <Icon
              className="w-7 h-7 text-white"
              aria-hidden="true"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111827]" style={{ fontFamily: "Poppins, Inter, ui-sans-serif, system-ui, sans-serif" }}>
            {title}
          </h1>
          {subtitle && <p className="text-[#6B7280] mt-2">{subtitle}</p>}
        </div>
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            {footer}
          </p>
        )}
      </div>
    </div>
  );
}
