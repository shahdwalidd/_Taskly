
import { Link } from "react-router-dom";
import ArrowLeftIcon from "@/assets/Arrowlogin.svg?react";

export function BackToLoginLink() {
  return (
    <Link
      to="/login"
      className="flex items-center justify-center gap-2 text-boy-sm font-medium text-primary hover:opacity-80"
    >
      <ArrowLeftIcon className="h-4 w-4" />
      Back to log in
    </Link>
  );
}