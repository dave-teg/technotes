import { Outlet } from "react-router-dom";
import DashHeader from "./DashHeader";
import DashFooter from "./DashFooter";

const DashLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <DashHeader />
      <div className="grow pt-3 pb-2 px-8">
        <Outlet />
      </div>
      <DashFooter />
    </div>
  );
};

export default DashLayout;
