import { useEffect, useState, ChangeEvent } from "react";
import { Icon } from "@iconify/react";
import { Tree, TreeNode } from "react-organizational-chart";
import { Select, initTE } from "tw-elements";
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
  const months = Array.from(new Set(dataset.map((d) => parseMonth(d.mes))));

  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [people, setPeople] = useState([]);

  const organizationChart = buildOrganizationalChart(people);

  const filterByMonth = (record: { mes: Date }) => {
    return parseMonth(record.mes) === selectedMonth;
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

    return people.map((person) => (
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

            <p className="text-slate-950 font-bold">{person.nombre}</p>
            <p className="text-slate-800 text-sm">{person.nivelJerarquico}</p>
            <p className="text-slate-800 text-sm">{person.area}</p>
            <p className="text-slate-800 text-sm">{person.subarea}</p>
            <p className="text-slate-800 text-sm">
              <span className="font-semibold">${person.sueldoBruto}</span>
            </p>
          </div>
        }
      >
        {renderOrganizationChart(person.collaborators)}
      </TreeNode>
    ));
  };

  useEffect(() => {
    setPeople(dataset.filter(filterByMonth));
  }, [selectedMonth]);

  useEffect(() => {
    if (months[0]) setSelectedMonth(months[0]);
  }, [months[0]]);

  return (
    <div className="p-10">
      {!!months.length && (
        <MonthFilter handleChange={handleChange} months={months}></MonthFilter>
      )}

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
