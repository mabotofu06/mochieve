import { createElement } from "react";

type Props = {
  className?: string;
  size?: number;
  up?: boolean;
}

export const AtomsIconVerticalArrow = (props: Props) => {
  const size = props.size ?? 10;

  return (
    <span
      className={props.className}
      style={{
        display: "inline-block",
        transition: "transform 0.3s",
        transform: props.up ? "rotate(0deg)" : "rotate(180deg)",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
        width={size}
        height={size}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 15.75 7.5-7.5 7.5 7.5"
        />
      </svg>
    </span>
  );
}