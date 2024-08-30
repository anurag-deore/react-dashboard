import clsx from "clsx";

interface IconButtonProps {
  icon?: React.ReactNode;
  title: string;
  onClick: () => void;
  className?: string;
}

const IconButton = ({ icon, title, onClick, className }: IconButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        className,
        "flex items-center gap-2 rounded text-md font-medium text-textLight dark:text-textDark hover:text-secondary"
      )}
    >
      {icon && <span className="h-5 w-5 shrink-0">{icon}</span>}
      <span className="text-md leading-none">{title}</span>
    </button>
  );
};

export default IconButton;
