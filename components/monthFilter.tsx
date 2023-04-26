import React, { ChangeEvent } from "react";

type SelectProps = {
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  months: string[];
};

const MonthFilter = ({ handleChange, months }: SelectProps) => {
  return (
    <>
      <select onChange={handleChange} data-te-select-init>
        {months.map((month) => (
          <option key={month} value={month}>
            {month.charAt(0).toUpperCase() + month.slice(1)}
          </option>
        ))}
      </select>
      <label data-te-select-label-ref>Mes:</label>
    </>
  );
};

export default MonthFilter;
