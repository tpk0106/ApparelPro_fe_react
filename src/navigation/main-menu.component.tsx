import { Outlet } from "react-router-dom";
import Header from "./header.component";
import Footer from "./footer.component";

const MainMenu = () => {
  return (
    <>
      <div className="flex w-full flex-cols-2  m-auto border1-4 border1-green-500 min-h-[100h] h-full overflow-hidden border-2 border1-gray-900">
        <div className="hidden w1-[-10px] w-[10%] min1-h-[100h] h1-[100%] min-h-screen overflow-hidden z-9">
          sidebar
        </div>
        <div className="flex w-[90%] border1-4 border1-purple-500 min1-h-[100h] min-h-screen overflow-hidden border-2 border1-gray-900">
          <div className="flex flex-col p-5 w-[100%]">
            <div className="flex w-[100%] h-[13%] justify-center min1-h-[13%] bg1-blue-200 bg1-black py-3 border-2 border-gray-900 bg-gradient-to-r from-gray-500 via-gray-700 to-gray-900">
              <Header />
            </div>
            <div className="overflow-auto">
              <Outlet />
            </div>
            <div className="flex flex-col w-full h-[12%] border-2 border-gray-600 justify-center bg1-gray-500 bg-black text-blue-500 mb-0 m-auto">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainMenu;
