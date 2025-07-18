import { SLASH } from "../defs/defs";

type iconPath = {
  iconUrl: string;
  subpath: string;
  alt: string;
};

const Icon = ({ iconUrl, subpath, alt }: iconPath) => {
  const index = iconUrl?.lastIndexOf(SLASH);
  const file = iconUrl?.substring(index + 1);

  return (
    <>
      <div className="">
        <img
          src={require("../assets" + subpath + file)}
          alt={alt}
          className="w-[10%] text-white rounded-sm m1-1 mr1-1 border-12 border1-amber-300 bg-blue-100"
        />
      </div>
    </>
  );
};

export default Icon;
