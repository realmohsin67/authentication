export default function DarkModeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: "rotate(40deg)" }}
    >
      <mask id="mask">
        <rect x="0" y="0" width="100%" height="100%" fill="white" />
        <circle cx="12" cy="4" r="9" fill="black" />
      </mask>
      <circle fill="black" cx="12" cy="12" r="9" mask="url(#mask)" />
    </svg>
  );
}
