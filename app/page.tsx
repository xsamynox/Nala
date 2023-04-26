"use client";
import { camelCase } from "lodash";
import { useState } from "react";
import readXlsxFile from "read-excel-file";
import Chart from "../components/chart";

const Home = () => {
  const [data, setData] = useState([]);

  const handleFile = async (file: File) => {
    const rows = await readXlsxFile(file);
    const headers = rows.splice(0, 1)[0];

    const dataset = [];

    for (const row of rows) {
      const obj = {};

      for (let i = 0; i < headers.length; i++) {
        obj[camelCase(headers[i] as string)] = row[i];
      }

      dataset.push(obj);
      setData(dataset);
    }
  };

  return (
    <>
      <header className="mt-0 shadow-md shadow-blue-500/5 dark:shadow-black/30">
        <h1 className="mt-0 text-5xl font-medium leading-tight text-primary text-center p-3 text-blue-700">
          Desafio técnico Nala
        </h1>
      </header>

      <main>
        {data.length === 0 ? (
          <form>
            <div className="w-full p-10">
              <p className="text-slate-950 text-lg">
                Para comenzar por favor sube aqui tu archivo:{" "}
              </p>

              <div>
                <label>
                  <input
                    type="file"
                    accept=".xls, .csv, .xlsx"
                    onChange={(e) => {
                      handleFile(e.target.files[0]);
                    }}
                  />
                </label>
              </div>
            </div>
          </form>
        ) : (
          <Chart dataset={data}></Chart>
        )}
      </main>
    </>
  );
};

export default Home;
