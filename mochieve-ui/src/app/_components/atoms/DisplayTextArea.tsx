type Props = {
  className?: string;
  value: string;
  rows?: number;
}

export const AtomsDisplayTextArea = (props: Props) => {
  return (
    <textarea
      className={`resize-none outline-none focus:outline-none focus:ring-0 focus:border-transparent ${props.className}`}
      name="display-textArea"
      rows={props.rows || 3}
      value={props.value}
      readOnly
    />
  );
};
