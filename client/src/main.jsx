import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import "./index.css";
import Root from "./Components/Root/Root.jsx";
import { UserProvider } from "./Provider/UserProvider.jsx";
import ProtectedRoute from "./Provider/ProtectedRoute.jsx";
import Login from "./Components/Auth/Login.jsx";
import Register from "./Components/Auth/Register.jsx";
import Feed from "./Pages/NewsFeed/Feed.jsx";

const router = createBrowserRouter([
  // ----------------------------
  // PUBLIC ROUTES
  // ----------------------------
  {
    path: "/",
    element: <Login />, // root shows login page
  },
  {
    path: "/register",
    element: <Register />,
  },

  // ----------------------------
  // MAIN LAYOUT ROUTE (Navbar + Footer)
  // ----------------------------
  {
    path: "/feed",
    element: <Root />, // contains navbar + footer
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute><Feed></Feed></ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
          </ProtectedRoute>
        ),
      },

    {
      path: "profile",
      element: (
        <ProtectedRoute>
        </ProtectedRoute>
      ),
    },
    ],
  },

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);
