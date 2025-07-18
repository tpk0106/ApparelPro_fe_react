import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { PaginationData } from "../../defs/defs";
import {
  selectAllCountries,
  isLoading,
} from "../../sagaStore/country/country.selector";

import CountryTable from "./country.table";
import { loadAllCountriesStart } from "../../sagaStore/country/country.action";

const Country = () => {
  const countryPaginationAPIModel = useSelector(selectAllCountries);
  const isGridLoading = useSelector(isLoading);

  // const [banksData, setBankData] = useState<PaginationAPIModel<Bank> | null>();
  // const [loading, setLoading] = useState(true);

  //const dispatch = useDispatch();

  // const pagination = useMemo(() => {
  //   const pagination: PaginationData = {
  //     pageNumber: 0,
  //     pageSize: 20,
  //     sortColumn: null,
  //     sortOrder: null,
  //     filterColumn: null,
  //     filterQuery: null,
  //   };
  //   return pagination;
  // }, []);

  // useEffect(() => {
  //   console.log("executing effect : ");
  //   dispatch(loadAllCountriesStart(pagination));
  //   console.log("end executing loadAllCountriesStart : ");

  //   return () => {
  //     console.log("dismounting");
  //     //  setBankData(null);
  //   };
  // }, [pagination, dispatch]);

  return (
    <>
      <div className="border-2 border-gray-900 max-h-[700px] min-h-[650px]">
        <h1 className="text-center tracking-[0.4em] font-semibold p-4">
          Countries
        </h1>
        {/* {loading && <div>{loader}</div>} */}
        {isGridLoading && <div>loading</div>}
        <div className="flex justify-around">
          <CountryTable />
        </div>
      </div>
    </>
  );
};

export default Country;
