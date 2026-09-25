import Successcheck from "@/assets/Successcheck.svg?react";

interface ResendSuccessBannerProps {
  formatted: string;
  canResend: boolean;
  hasReachedMaxAttempts: boolean;
  attemptsLeft: number;
  onResend: () => void;
}

export function ResendSuccessBanner({
  formatted,
  canResend,
  hasReachedMaxAttempts,
  attemptsLeft,
  onResend,
}: ResendSuccessBannerProps) {
  return (
    <div className="rounded-sm bg-success/30 p-4">
      <div className="flex items-start gap-3">
        <Successcheck className="h-3.5 w-3.5" />

        <p className="text-span-sm font-medium text-darkgreen">
          If an account exists with this email, we&apos;ve sent a password reset link.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-darkgreen/10 pt-3">
        <div className="flex items-center justify-between">
        <span className="text-darkgreen/60 text-label-sm uppercase">Didn't receive email?</span>

          <button
            onClick={onResend}
            disabled={!canResend}
            className="text-label-sm text-primary uppercase underline disabled:no-underline disabled:text-primary/40"
          >
            {hasReachedMaxAttempts
              ? "No attempts left"
              : canResend
                ? "Resend"
                : `Resend in ${formatted}`}
          </button>
        </div>

        {!hasReachedMaxAttempts && (
          <span className="text-label-sm text-darkgreen/60">
            {attemptsLeft} resend {attemptsLeft === 1 ? "attempt" : "attempts"} remaining
          </span>
        )}
      </div>
    </div>
  );
}