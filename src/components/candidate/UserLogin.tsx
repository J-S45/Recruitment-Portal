import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SIDEBAR_CONSTANTS_GUEST, SIDEBAR_CONSTANTS_LOGOUT } from "@/utils/constants";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const UserLogin = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); 

  return (
    <div className="flex min-h-screen">

      
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

     
      <div className={cn(
        "fixed top-0 left-0 h-screen bg-[#222d32] flex flex-col justify-between p-4 z-50 transition-transform duration-300",
        "w-[280px]",
        isOpen ? "translate-x-0" : "-translate-x-full", 
        "lg:translate-x-0" 
      )}>
        <div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo-5.jpg" alt="Calbank logo" className="h-9 w-9 rounded-sm" />
              <span className="text-white font-semibold text-base">Recruitment Portal</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-white p-1 cursor-pointer" 
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <span className="text-white text-sm font-medium mt-8 block">MENU</span>

          <div className="ml-2 mt-4 flex flex-col gap-3">
            {SIDEBAR_CONSTANTS_GUEST.map((item) => {
              const { icon: Icon, title, id } = item;
              const itemSelectedClass = id === pathname ? "bg-amber-400 border-amber-400" : "";
              return (
                <NavLink
                  to={id}
                  key={id}
                  onClick={() => setIsOpen(false)} 
                  className={cn(
                    "flex gap-2 cursor-pointer py-2 px-3 rounded-md w-[95%] border border-transparent",
                    itemSelectedClass
                  )}
                >
                  <Icon className="w-5 h-5 text-white" />
                  <span className="text-sm text-white">{title}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        
        {SIDEBAR_CONSTANTS_LOGOUT.map((item) => {
          const { icon: Icon, title, id } = item;
          return (
            <button
              key={id}
              onClick={() => {
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");
                navigate("/login", { replace: true });
              }}
              className="flex gap-3 cursor-pointer bg-transparent border-none mb-4"
            >
              <Icon className="w-5 h-5 text-white" />
              <span className="text-sm text-white">{title}</span>
            </button>
          );
        })}
      </div>

      
      <main className="flex-1 flex flex-col min-h-screen bg-white lg:ml-[280px]"> 

        
        <div className="lg:hidden h-14 bg-amber-400 flex items-center px-4 sticky top-0 z-30 shadow-sm">
          <button
            onClick={() => setIsOpen(true)} 
            className="text-black cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-3 font-semibold text-black text-base">Recruitment Portal</span>
        </div>

        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>

      </main>
    </div>
  );
};

export default UserLogin;
