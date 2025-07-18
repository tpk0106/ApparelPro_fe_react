const formatDate = () => new Date().toLocaleDateString();
const Footer = () => {
  return (
    <>
      <div className="flex flex-col w-[100%] mt-2">
        <div className="flex flex-col w-[100%]">
          <div className="flex justify-around w-[60%] m-auto md:tracking-[0.4em]">
            Broadsword Apparel Pvt Ltd
          </div>
          <div className="flex justify-around">
            {formatDate()} All rights reserved
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
