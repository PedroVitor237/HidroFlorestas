// components/ui/content-box.tsx

import { ReactNode } from "react";

interface ContentBoxProps {
  children: ReactNode;
  className?: string;
}

export default function WhiteBox({
  children,
  className,
}: ContentBoxProps) {
  return (
    <div
      className="w-full rounded-2xl bg-white p-5 shadow-sm"
    >
      {children}
    </div>
  );
}