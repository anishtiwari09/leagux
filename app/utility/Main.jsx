"use client";
import React, { useEffect } from "react";

export default function Main() {
  useEffect(() => {
    if (window && "serviceWorker" in window.navigator) {
      window.navigator.serviceWorker.register("/sw.js");
    }
  }, []);
  return <></>;
}
