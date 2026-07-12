import { useLocation } from "react-router-dom";
import Navbar from '../Navbar/Navbar';
import { Outlet } from "react-router-dom";

export default function Root() {
  const location = useLocation();

  // pages where Navbar + Footer should be hidden
  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/";

  return (
    <div className="px-24">
      {!hideLayout && <Navbar />}
      <Outlet />
    </div>
  );
}
