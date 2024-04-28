/* eslint-disable @typescript-eslint/no-explicit-any */
import Fuse from "fuse.js";
import {
  ArrowDownNarrowWide,
  ArrowDownWideNarrow,
  Rainbow,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { Tooltip } from "react-tooltip";
import { fetchRap, mapRapItems, sortRapItems } from "./lib/actions";
import { Category, MappedRapItem, MappedRapItems } from "./lib/types";
import { cn, formatValue } from "./lib/utils";

export default function App() {
  const [selectedTab, setSelectedTab] = useState<Category>("Booth");
  const [rapItems, setRapItems] = useState<MappedRapItems>(
    {} as MappedRapItems
  );

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchRap();
      const sortedData = sortRapItems(data, "asc");
      const categorizedData = sortRapItems(sortedData, "category");
      const mappedData = mapRapItems(categorizedData);
      setRapItems(mappedData);
    };

    fetchData();
  }, []);

  return (
    <div className="w-screen flex justify-center items-center px-4 lg:px-20 pb-2">
      <Tabs
        selectedTabClassName="border-b-2 border-white"
        className="mt-4 w-full"
        onSelect={(index) =>
          setSelectedTab(Object.keys(rapItems)[index] as Category)
        }
      >
        <TabList className="flex space-x-2 bg-slate-800 w-full justify-start rounded-md mb-3 max-w-full overflow-x-auto light-scrollbar pb-1">
          {Object.keys(rapItems).map((category) => (
            <Tab
              key={category}
              className="p-2 cursor-pointer outline-none w-full text-center"
            >
              {category}
            </Tab>
          ))}
        </TabList>

        <Tooltip id="main-tooltip" place="top" className="z-[2000]" />
        {Object.entries(rapItems).map(([category, items]) => (
          <TabPanel key={category}>
            {selectedTab === category && (
              <CategoryTab category={category as Category} items={items} />
            )}
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
}

function CategoryTab({
  category,
  items,
}: {
  category: Category;
  items: MappedRapItem<Category>[];
}) {
  const [search, setSearch] = useState("");
  const [shownItems, setFilteredRapItems] =
    useState<MappedRapItem<Category>[]>(items);

  const [filters, setFilters] = useState<{
    golden: boolean;
    rainbow: boolean;
    shiny: boolean;
    huge: boolean;
    titanic: boolean;
    normal: boolean;
    tier: number | "all";
  }>({
    golden: false,
    rainbow: false,
    shiny: false,
    huge: false,
    titanic: false,
    normal: false,
    tier: "all",
  });
  const [sort, setSort] = useState<"asc" | "desc">("asc");

  const filterRapItems = (search: string) => {
    if (search !== "") {
      const options = {
        keys: ["id"],
        includeScore: true,
        threshold: 0.3,
      };
      const fuse = new Fuse(items, options);
      const result = fuse.search(search);
      setFilteredRapItems(result.map(({ item }) => item));
    } else {
      setFilteredRapItems(items);
    }
  };

  const handleFilterChange = (
    filter: "golden" | "rainbow" | "shiny" | "huge" | "titanic" | "normal"
  ) => {
    setFilters((prev) => {
      let newFilters = { ...prev };
      switch (filter) {
        case "golden":
          newFilters = {
            ...prev,
            golden: !prev.golden,
            rainbow: false,
          };
          break;
        case "rainbow":
          newFilters = {
            ...prev,
            rainbow: !prev.rainbow,
            golden: false,
          };
          break;
        case "shiny":
          newFilters = {
            ...prev,
            shiny: !prev.shiny,
          };
          break;
        case "huge":
          newFilters = {
            ...prev,
            huge: !prev.huge,
            titanic: false,
            normal: false,
          };
          break;
        case "titanic":
          newFilters = {
            ...prev,
            titanic: !prev.titanic,
            huge: false,
            normal: false,
          };
          break;
        case "normal":
          newFilters = {
            ...prev,
            normal: !prev.normal,
            huge: false,
            titanic: false,
          };
          break;
        default:
          break;
      }

      return newFilters;
    });
  };

  useEffect(() => {
    let filteredItems = [...items];

    if (search !== "") {
      const options = {
        keys: ["id"],
        includeScore: true,
        threshold: 0.3,
      };
      const fuse = new Fuse(filteredItems, options);
      const result = fuse.search(search);
      filteredItems = result.map(({ item }) => item);
    }

    filteredItems = filteredItems.sort((a, b) => {
      if (sort === "asc") {
        return a.value - b.value;
      } else {
        return b.value - a.value;
      }
    });

    if (filters.golden && filters.shiny) {
      filteredItems = filteredItems.filter((item) => item.golden && item.shiny);
    } else if (filters.rainbow && filters.shiny) {
      filteredItems = filteredItems.filter(
        (item) => item.rainbow && item.shiny
      );
    } else if (filters.golden) {
      filteredItems = filteredItems.filter((item) => item.golden);
    } else if (filters.rainbow) {
      filteredItems = filteredItems.filter((item) => item.rainbow);
    } else if (filters.shiny) {
      filteredItems = filteredItems.filter((item) => item.shiny);
    }

    if (category === "Potion") {
      if (filters.tier !== "all") {
        filteredItems = filteredItems.filter(
          (item) => item.tier === filters.tier
        );
      } else {
        filteredItems = filteredItems.filter((item) => item.tier !== undefined);
      }
    }

    if (filters.huge) {
      filteredItems = filteredItems.filter((item) =>
        item.id.toLowerCase().includes("huge")
      );
    } else if (filters.titanic) {
      filteredItems = filteredItems.filter((item) =>
        item.id.toLowerCase().includes("titanic")
      );
    } else if (filters.normal) {
      filteredItems = filteredItems.filter(
        (item) =>
          !item.id.toLowerCase().includes("huge") &&
          !item.id.toLowerCase().includes("titanic")
      );
    }

    setFilteredRapItems(filteredItems);
  }, [filters, items, search, sort, category]);

  const Items = useMemo(() => {
    return shownItems.map((item, idx) => (
      <ItemCard key={`${item.id}-${idx}-${category}`} item={item} />
    ));
  }, [shownItems, category]);

  return (
    <div>
      <div className="justify-center items-center space-x-2 gap-4">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 w-full">
          {category === "Pet" && (
            <div className="w-fit flex justify-center items-center space-x-2">
              <FilterButton
                onClick={() => handleFilterChange("huge")}
                active={filters.huge}
                type="huge"
                disabled={category !== "Pet"}
                tooltipContent="Only show huge items"
              >
                Huge
              </FilterButton>
              <FilterButton
                onClick={() => handleFilterChange("titanic")}
                active={filters.titanic}
                type="titanic"
                disabled={category !== "Pet"}
                tooltipContent="Only show titanic pets"
              >
                Titanic
              </FilterButton>
              <FilterButton
                onClick={() => handleFilterChange("normal")}
                active={filters.normal}
                type="normal"
                disabled={category !== "Pet"}
                tooltipContent="Only show normal pets"
              >
                Normal
              </FilterButton>
            </div>
          )}
          <div className="w-fit flex justify-center items-center space-x-2">
            <FilterButton
              onClick={() => handleFilterChange("golden")}
              active={filters.golden}
              type="golden"
              disabled={category !== "Pet"}
              tooltipContent="Only show golden pets"
            >
              <img src="/gold.svg" alt="Golden" className="w-6 h-6" />
            </FilterButton>
            <FilterButton
              onClick={() => handleFilterChange("rainbow")}
              active={filters.rainbow}
              type="rainbow"
              disabled={category !== "Pet"}
              tooltipContent="Only show rainbow pets"
            >
              <Rainbow />
            </FilterButton>
            <FilterButton
              onClick={() => handleFilterChange("shiny")}
              active={filters.shiny}
              type="shiny"
              disabled={category !== "Pet" && category !== "Hoverboard"}
              tooltipContent="Only show shiny pets/hoverboards"
            >
              <Sparkles />
            </FilterButton>
            <FilterButton
              onClick={() => setSort("asc")}
              active={sort === "asc"}
              type="asc"
              tooltipContent="Sort by ascending value"
            >
              <ArrowDownNarrowWide />
            </FilterButton>
            <FilterButton
              onClick={() => setSort("desc")}
              active={sort === "desc"}
              type="desc"
              tooltipContent="Sort by descending value"
            >
              <ArrowDownWideNarrow />
            </FilterButton>
            {category === "Potion" && (
              <FilterSelect
                options={[
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "10",
                  "All",
                ]}
                tooltipContent="Filter by potion tier"
                value={filters.tier === "all" ? "All" : filters.tier.toString()}
                disabled={category !== "Potion"}
                onChange={(value) => {
                  if (value[0] === "All") {
                    setFilters((prev) => ({ ...prev, tier: "all" }));
                  } else {
                    setFilters((prev) => ({
                      ...prev,
                      tier: parseInt(value[0]),
                    }));
                  }
                }}
              />
            )}
          </div>
          <input
            type="text"
            className="w-full p-2 bg-gray-800 outline-none rounded-md"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              filterRapItems(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full max-h-[600px] w-full overflow-y-auto mt-4 pr-2">
        {Items}
      </div>
    </div>
  );
}

function FilterSelect({
  options,
  value,
  onChange,
  disabled,
  tooltipContent,
}: {
  options: string[];
  value: string;
  onChange: (value: string[]) => void;
  disabled?: boolean;
  tooltipContent?: string;
}) {
  return (
    <select
      data-tooltip-id="main-tooltip"
      data-tooltip-content={tooltipContent}
      disabled={disabled}
      value={value}
      onChange={(e) => {
        const selectedOptions = Array.from(
          e.target.selectedOptions,
          (option) => option.value
        );
        onChange(selectedOptions);
      }}
      className={cn(
        "w-20 p-2 bg-gray-800 text-white rounded-md outline-none",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      {options.map((option) => (
        <option key={option} value={option} className="bg-gray-700 text-white">
          {option}
        </option>
      ))}
    </select>
  );
}

function FilterButton({
  onClick,
  disabled,
  children,
  active,
  type,
  tooltipContent,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  active: boolean;
  type:
    | "golden"
    | "rainbow"
    | "shiny"
    | "asc"
    | "desc"
    | "huge"
    | "titanic"
    | "normal";
  tooltipContent?: string;
}) {
  return (
    <button
      data-tooltip-id="main-tooltip"
      data-tooltip-content={tooltipContent}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "p-2 bg-gray-800 rounded-md relative overflow-hidden",
        disabled && "opacity-50 pointer-events-none",
        active
          ? type === "golden"
            ? "bg-gradient-to-t from-yellow-500 via-yellow-400 to-yellow-300"
            : type === "rainbow"
            ? "bg-gradient-to-t from-red-500 via-orange-500 to-yellow-500"
            : "bg-gradient-to-t from-blue-500 via-purple-500 to-pink-500"
          : "bg-gray-800"
      )}
    >
      {children}
    </button>
  );
}

function ItemCard({ item }: { item: MappedRapItem<Category> }) {
  const [copied, setCopied] = useState(false);

  return (
    <Card>
      <div className="flex justify-between items-center">
        <div>
          <button
            data-tooltip-content={copied ? "Copied!" : "Copy Item Name"}
            data-tooltip-id="main-tooltip"
            onClick={() => {
              setCopied(true);
              navigator.clipboard.writeText(item.id);

              setTimeout(() => {
                setCopied(false);
              }, 2000);
            }}
          >
            <h3 className="text-xl">{item.id}</h3>
          </button>
          <p>
            {item.golden && "Golden "}
            {item.rainbow && "Rainbow "}
            {item.shiny && "Shiny "}
            {item.tier && `Tier ${item.tier} `}
            {!item.golden &&
              !item.rainbow &&
              !item.shiny &&
              !item.tier &&
              "Normal"}
          </p>
        </div>
        <p
          className="text-xl"
          data-tooltip-id="main-tooltip"
          data-tooltip-content={formatValue(item.value, "long")}
        >
          {formatValue(item.value)}
        </p>
      </div>
    </Card>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-800 rounded-md p-4 shadow-md backdrop-blur-md">
      {children}
    </div>
  );
}
