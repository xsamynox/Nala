import React, { ChangeEvent } from "react";

type SelectProps = {
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  months: string[];
};

const MonthFilter = ({ handleChange, months }: SelectProps) => {
  return (
    <div className="w-max">
      <h6 className="mt-0 text-base font-medium leading-tight text-primary mb-5">
        Puedes filtrar por:
      </h6>
      <select onChange={handleChange} data-te-select-init>
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
      <label data-te-select-label-ref>Meses</label>
    </div>
  );
};

export default MonthFilter;
