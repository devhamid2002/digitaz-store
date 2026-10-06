"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/context/store";

type Props = {
  children: React.ReactNode;
};

export default function StoreProvider({ children }: Props) {
  // Lazily create one store per client tree without reading a ref during render
  const [store] = useState(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}
