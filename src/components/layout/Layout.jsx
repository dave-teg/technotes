import { Outlet } from "react-router-dom";
import backgroundImage from "../../assets/background.jpg"

const Layout = () => {
  return (
    <div className="bg-top-right bg-cover bg-primaryClr bg-blend-overlay text-white font-nunito"
    style={{backgroundImage: `url(${backgroundImage})`}}
    >
      <Outlet />
    </div>
  );
};

export default Layout;
