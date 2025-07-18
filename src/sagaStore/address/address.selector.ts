import { createSelector } from "reselect";
import { Country } from "../../models/references/Country";
import { useSelector } from "react-redux";
import { useCountries } from "../../data/custom.hooks.ts/apparel-pro.repository.hooks";
import { PaginationData } from "../../defs/defs";

export function SelectCountries(paginate: PaginationData) {
  useCountries(paginate);

  const selectAllCountries = createSelector(
    (state: { country: { paginationAPIResult: { items: Country[] } } }) =>
      state.country.paginationAPIResult?.items,
    (items) => items?.map((country: Country) => country.code)
  );

  const countries = useSelector(selectAllCountries);
  return countries;
}
