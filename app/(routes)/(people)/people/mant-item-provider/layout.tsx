import React from "react";

export default function LayoutMantItemsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
