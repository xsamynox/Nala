import { useEffect, useState, ChangeEvent } from "react";
import { Icon } from "@iconify/react";
import { Tree, TreeNode } from "react-organizational-chart";
import { Select, initTE, Alert } from "tw-elements";
import { isEmpty } from "lodash";

import NalaLogo from "./../images/nala.png";
import { parseMonth } from "../helpers/helpers";
import MonthFilter from "./monthFilter";

type ChartProps = {
  dataset: Array<any>;
};

const buildOrganizationalChart = (
  allPeople: any[],
  collaborators: any[] = allPeople,
  assignedPeople = []
) => {
  return collaborators
    .map((person) => {
      if (assignedPeople.includes(person.id)) return;

      const childCollaborators = allPeople.filter((collaborator) => {
        return collaborator.idLider === person.id;
      });

      assignedPeople.push(person.id);
      return {
        ...person,
        collaborators: isEmpty(childCollaborators)
          ? []
          : buildOrganizationalChart(
              allPeople,
              childCollaborators,
              assignedPeople
            ),
      };
    })
    .filter(Boolean);
};

const Chart = ({ dataset }: ChartProps) => {
  initTE({ Select });
  initTE({ Alert });

  const months = Array.from(new Set(dataset.map((d) => parseMonth(d.mes))));

  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [people, setPeople] = useState([]);
  const [previousPeople, setPreviousPeople] = useState([]);

  const totalPaid = () => {
    let total = 0;
    people.map((person) => {
      total += person.sueldoBruto;
    });
    return total;
  };

  const organizationChart = buildOrganizationalChart(people);

  const filterByMonth = (record: { mes: Date }) => {
    return parseMonth(record.mes) === selectedMonth;
  };

  const filterByPreviousMonth = (record: { mes: Date }) => {
    const selectedMonthIndex = months.indexOf(selectedMonth);
    const previousMonth = months[selectedMonthIndex + 1];

    return parseMonth(record.mes) === previousMonth;
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  const handleImage = (personId: number) => (e: { target: { files: any } }) => {
    if (e.target.files && e.target.files[0]) {
      const personIndex = people.findIndex((p) => p.id === personId);

      people[personIndex].image = URL.createObjectURL(e.target.files[0]);
      setPeople([...people]);
    }
  };

  const renderOrganizationChart = (people: any[]) => {
    if (!people.length) return null;

    return people.map((person) => {
      const prevPerson = previousPeople.find((p) => p.id === person.id);
      const prevSalary = prevPerson?.sueldoBruto;

      const hasIncrease = prevSalary && prevSalary < person.sueldoBruto;

      return (
        <TreeNode
          className="flex flex-col items-center"
          key={person.id}
          label={
            <div className="flex justify-center items-center flex-col bg-white border rounded-lg border-gray-800 p-2 w-52 h-auto">
              {!person.image ? (
                <div className="flex justify-center items-center border border-gray-500 rounded w-max mb-2">
                  <label className=" flex items-center justify-center cursor-pointer p-1">
                    <input
                      className="hidden"
                      type="file"
                      onChange={handleImage(person.id)}
                      accept="image/*"
                    />
                    <Icon
                      icon="material-symbols:add-circle-outline-rounded"
                      width="24"
                      height="24"
                    />
                    <p className="text-sm">Add image</p>
                  </label>
                </div>
              ) : (
                <img
                  src={person.image}
                  className="rounded-full w-14 h-14 object-cover"
                  alt={person.image}
                />
              )}

              <strong className="text-blue-400 text-sm">
                {!prevPerson ? "New hire!" : ""}
              </strong>
              <p className="text-slate-950 font-bold">{person.nombre}</p>
              <p className="text-slate-800 text-sm">
                <strong>Nivel jerarquico: </strong>
                {person.nivelJerarquico}
              </p>
              <p className="text-slate-800 text-sm">
                <strong>Area: </strong>
                {person.area}
              </p>
              <p className="text-slate-800 text-sm">
                <strong>Subarea: </strong>
                {person.subarea}
              </p>
              <p className="text-slate-800 text-sm">
                <strong>Salario bruto: </strong>
                <span
                  className={`font-semibold ${hasIncrease && "text-green-500"}`}
                >
                  ${person.sueldoBruto}
                </span>
              </p>
            </div>
          }
        >
          {renderOrganizationChart(person.collaborators)}
        </TreeNode>
      );
    });
  };

  useEffect(() => {
    setPeople(dataset.filter(filterByMonth));
  }, [selectedMonth]);

  useEffect(() => {
    setPreviousPeople(dataset.filter(filterByPreviousMonth));
  }, [selectedMonth]);

  useEffect(() => {
    if (months[0]) setSelectedMonth(months[0]);
  }, [months[0]]);

  return (
    <div className="p-10">
      <h6 className="mt-0 text-base font-medium leading-tight text-primary mb-5">
        Puedes filtrar por:
      </h6>
      <div className="flex gap-x-7 w-max items-center">
        {!!months.length && (
          <MonthFilter
            handleChange={handleChange}
            months={months}
          ></MonthFilter>
        )}

        <div
          className="alert-dismissible hidden w-max items-center rounded-lg bg-blue-400 py-2 px-6 text-base text-white data-[te-alert-show]:inline-flex"
          role="alert"
          data-te-alert-init
          data-te-alert-show
        >
          <p>
            El total pagado de este mes fue de:
            <strong className="mr-1">{` $${totalPaid()}`}</strong>
          </p>
        </div>

        <div
          className="alert-dismissible hidden w-max items-center rounded-lg bg-gray-200 py-2 px-6 text-base text-black data-[te-alert-show]:inline-flex"
          role="alert"
          data-te-alert-init
          data-te-alert-show
        >
          <p>
            Puedes encontrar los aumentos de sueldo en color{" "}
            <strong className="text-green-500">verde</strong>
          </p>
        </div>
      </div>

      {!!organizationChart.length && (
        <div className="flex justify-center w-full p-11">
          <Tree
            lineWidth={"1px"}
            lineHeight="50px"
            lineColor={"black"}
            lineBorderRadius={"20px"}
            nodePadding={"150px"}
            label={
              <div className="w-full justify-center flex">
                <div className="w-max flex bg-white border rounded-lg border-gray-800 p-4">
                  <img
                    src={NalaLogo.src}
                    alt="Nala Logo"
                    className="w-20 h-auto"
                  />
                </div>
              </div>
            }
          >
            {renderOrganizationChart(organizationChart)}
          </Tree>
        </div>
      )}
    </div>
  );
};

export default Chart;
