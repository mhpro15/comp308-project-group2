import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  HeartPulse,
  Ambulance,
  PenBox,
  User,
  Lightbulb,
  BarChart,
  Menu,
  X,
} from "lucide-react";

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="md:flex h-screen bg-gray-100 w-screen">
      <aside
        className={`fixed flex-1/3 md:relative h-full max-w-[400px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex-2/3 flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className=" rounded-lg">
              <HeartPulse size={24} className="text-blue-500" />
            </div>
            <p className="ml-3 text-xl font-bold text-gray-800">Nurse Portal</p>
          </div>
          <X
            size={25}
            onClick={closeSidebar}
            className="text-gray-600 font-light border-1 rounded-full md:hidden"
          />
        </div>
        <nav className="mt-6">
          <ul className="space-y-4 px-2">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center px-6 py-4 rounded-lg text-base font-semibold ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-500"
                  }`
                }
                onClick={closeSidebar}
              >
                <Home className="mr-4 text-lg" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/patients"
                className={({ isActive }) =>
                  `flex items-center px-6 py-4 rounded-lg text-base font-semibold ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-500"
                  }`
                }
                onClick={closeSidebar}
              >
                <User className="mr-4 text-lg" />
                Patients
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/vitals"
                className={({ isActive }) =>
                  `flex items-center px-6 py-4 rounded-lg text-base font-semibold ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-500"
                  }`
                }
                onClick={closeSidebar}
              >
                <HeartPulse className="mr-4 text-lg" />
                Vitals
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/symptoms"
                className={({ isActive }) =>
                  `flex items-center px-6 py-4 rounded-lg text-base font-semibold ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-500"
                  }`
                }
                onClick={closeSidebar}
              >
                <PenBox className="mr-4 text-lg" />
                Symptoms
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/emergency"
                className={({ isActive }) =>
                  `flex items-center px-6 py-4 rounded-lg text-base font-semibold ${
                    isActive
                      ? "bg-red-50 text-red-600 border-l-4 border-red-500"
                      : "text-gray-700 hover:bg-red-100 hover:text-red-500"
                  }`
                }
                onClick={closeSidebar}
              >
                <Ambulance className="mr-4 text-lg" />
                Emergency
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/motivational-tips"
                className={({ isActive }) =>
                  `flex items-center px-6 py-4 rounded-lg text-base font-semibold ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-500"
                  }`
                }
                onClick={closeSidebar}
              >
                <Lightbulb className="mr-4 text-lg" />
                Motivational Tips
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/analyze"
                className={({ isActive }) =>
                  `flex items-center px-6 py-4 rounded-lg text-base font-semibold ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-500"
                  }`
                }
                onClick={closeSidebar}
              >
                <BarChart className="mr-4 text-lg" />
                Analyze
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="w-full text-gray-600">
        <header className="bg-white w-full shadow-md p-4 flex items-center justify-between md:hidden">
          <Menu
            size={30}
            className="bg-white rounded-lg"
            onClick={toggleSidebar}
          />
        </header>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
