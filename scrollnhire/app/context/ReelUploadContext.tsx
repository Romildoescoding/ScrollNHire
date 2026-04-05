"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type UploadContextType = {
  uploadProgress: number;
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>;
};

const ReelUploadContext = createContext<UploadContextType | null>(null);

export function ReelUploadProvider({ children }: { children: ReactNode }) {
  const [uploadProgress, setUploadProgress] = useState(-1);

  return (
    <ReelUploadContext.Provider value={{ uploadProgress, setUploadProgress }}>
      {children}
    </ReelUploadContext.Provider>
  );
}

export function useUploadProgress() {
  const context = useContext(ReelUploadContext);

  if (!context) {
    throw new Error(
      "useUploadProgress must be used inside UploadProgressProvider",
    );
  }

  return context;
}
