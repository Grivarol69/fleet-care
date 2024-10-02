export type CalendarSelectorProps = React.AllHTMLAttributes<HTMLDivElement> & {
  setDateSelected: React.Dispatch<
    React.SetStateAction<{ from: Date | undefined; to: Date | undefined }>
  >;
  carPriceDay: string;
};
