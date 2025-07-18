import { MenuItem, Select, Typography } from "@mui/material";
import { Currency } from "../../models/references/Currency";
import { useState } from "react";

interface Currencies {
  // currencies: Currency[] | undefined;
  currencies: string[] | undefined;
  selected: any;
}

const DropDownList = ({ currencies, selected }: Currencies) => {
  const [selectedCurr, setSelectedCurr] = useState(selected);

  const handleChange = (event: MouseEvent<HTMLSelectElement>) => {
    //  console.log("select change....", value);
    const ele = event.target;
    setSelectedCurr(ele.value);
    console.log("selected : ", selectedCurr);
  };

  return (
    <>
      <div className="flex flex-col gap-6 w-[50%] pb-3 mr-3">
        <div>
          <Select
            variant="outlined"
            label="Select Country"
            name="country"
            value={selectedCurr}
            onChange={handleChange}
            className="sm:w-[60%] md:w1-[100%] text-red-300 bg-yellow-200 "
          >
            {currencies!.map((currency: string) => {
              return (
                <MenuItem value={currency} className="bg-black, text-blue-700">
                  {currency}
                </MenuItem>
              );
            })}
          </Select>
        </div>
      </div>
    </>
  );
};

export default DropDownList;
