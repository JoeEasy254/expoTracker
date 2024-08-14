import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./input.css";
import { ThemeProvider } from "@/components/theme-provider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./routes/sign-in.jsx";
import { LoaderProvider } from "./context/LoaderContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
    path: "/sign-in",
    element: <SignIn />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LoaderProvider>
        <RouterProvider router={router} />
      </LoaderProvider>
    </ThemeProvider>
  </React.StrictMode>
);
