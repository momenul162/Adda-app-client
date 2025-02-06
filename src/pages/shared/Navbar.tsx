import { Search, Home, MonitorPlay, Settings, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { TooltipComp } from "@/components/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { RootState } from "@/store";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleRefresh = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-2 flex items-center justify-around h-16 relative">
        {/* Left Section: Logo and Hamburger Menu */}
        <div className="hidden md:block">
          {/* Logo */}
          <NavLink to={"/"}>
            <span
              onClick={handleRefresh}
              className="text-xl font-bold cursor-pointer text-blue-600"
            >
              ADDA
            </span>
          </NavLink>
        </div>

        {/* Center Section: Menu Links (Hidden on Mobile) */}
        <div className={`bg-white flex items-center gap-1 sm:gap-2 md:gap-4`}>
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              `${isActive ? "rounded-lg shadow-lg shadow-[#94acea]" : ""}`
            }
            onClick={handleRefresh}
          >
            <TooltipComp
              variant={"outline"}
              style={"text-blue-500"}
              button={<Home strokeWidth={3} size={48} color="#255ad4" />}
              hover={"Home"}
            />
          </NavLink>
          <NavLink
            to={"/videos"}
            className={({ isActive }) =>
              `${isActive ? " rounded-lg shadow-lg shadow-[#94acea]" : ""}`
            }
            onClick={handleRefresh}
          >
            <TooltipComp
              variant={"outline"}
              style={"text-blue-500"}
              button={<MonitorPlay strokeWidth={3} size={48} color="#255ad4" />}
              hover={"Video"}
            />
          </NavLink>
          <NavLink
            to={"/profile"}
            className={({ isActive }) =>
              `${isActive ? "rounded-lg shadow-lg shadow-[#94acea]" : ""}`
            }
          >
            <TooltipComp
              variant={"outline"}
              style={"text-blue-500"}
              button={<User strokeWidth={3} size={48} color="#255ad4" />}
              hover={"Profile"}
            />
          </NavLink>
          {/* <a
            href="/contact"
            className="block px-4 py-2 text-gray-700 hover:text-blue-600 md:inline-block"
          >
            Contact
          </a> */}
        </div>

        {/* Search */}
        <div className="flex relative">
          <Input type="text" placeholder="Search..." className="pl-10 py-1 md:py-2 rounded-full" />
          <Search className="absolute left-3 top-2.5 w-5 h-4 md:h-5 text-gray-400" />
        </div>

        {/* Right Section: Search, Notifications, Profile */}
        <div className="flex items-center">
          {/* Notifications */}
          {/* <Button variant="ghost" size="icon">
            <Bell strokeWidth={3} size={48} color="#255ad4" />
          </Button> */}

          {/* Profile */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <img
                    src={user?.photo}
                    alt="Post Image"
                    style={{ objectFit: "cover" }}
                    className="rounded-full w-11 h-11 border hover:border-blue-500"
                  />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-30 bg-white">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings /> Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel
                  onClick={handleLogout}
                  className="flex items-center gap-2 cursor-default"
                >
                  Log out <LogOut strokeWidth={2} size={16} />
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to={"register"}>
              <Button variant="outline">Create</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
