// import { role } from "@/lib/data";
import { SIDEBAR_SETTINGS_MENU } from "@/constants/menus";
import Link from "next/link";



const Menu = () => {
  return (
    <div className="mt-4 pl-5 text-md">
      {SIDEBAR_SETTINGS_MENU.map((i) => (
        <div className="flex flex-col gap-2" key={i.path}>
     
                <Link
                  href={i.path}
                  key={i.label}
                  className="flex is-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                >
                  {i.icon}
                  <span className="hidden lg:block">{i.label}</span>
                </Link>
               
          
        </div>
      ))}
       
            
    </div>
  );
};

export default Menu;