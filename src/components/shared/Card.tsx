import type { ReactNode } from "react";

interface CardProps {
  rounded?: string;
  children: ReactNode;
}

export const Card = ({ rounded = "rounded-2xl", children }: CardProps) => {
  return (
    <div
      className={`dark:bg-slate-800/60 backdrop-blur-md bg-[#FAFAFA] ${rounded} border border-white/30 shadow-sm p-8 mb-10`}
    >
      {children}
    </div>
  );
};
