import styles from "./button.module.css";

export default function Button({
  children,
  isLoading = false,
  ...props
}: {
  children: React.ReactNode;
  isLoading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> & {
    ref?: React.RefObject<HTMLButtonElement | null>;
  }) {
  return (
    <button
      className={`${styles.button} ${isLoading ? styles.loading : ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
