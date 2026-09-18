import PlusIcon from "../../assets/Whiteplus.svg?react";

interface FloatingAddButtonProps {
  onClick: () => void;
}

export function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Add new project"
      className="fixed bottom-20 right-4 z-20 flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-white shadow-lg md:hidden"
    >
      <PlusIcon className="h-6 w-6" />
    </button>
  );
}