import React, { useState, useEffect } from "react";
import { Container, Form } from "react-bootstrap";
import { Agency, agency_filters } from "@/app/util/agency_util";

import {
	buildGroupTree,
	GroupTreeNode,
	Group,
} from "@/app/components/request/AgencyBox/agency_group";

import AgencyFilter from "@/app/components/request/AgencyBox/agency_filter";

import { FilterOption, FilterSelectionOptions } from "@/app/util/agency_util";

import {
	buildGroupSearchTree,
	SearchTreeNode,
} from "@/app/components/request/AgencyBox/agency_search";
import { colors, fonts } from "@/app/lib/theme";

interface AgencySearchBoxProps {
	agencies: Agency[];
	height?: string | number;
	selectedAgencies: Agency[];
	setSelectedAgencies: React.Dispatch<React.SetStateAction<Agency[]>>;
}

const CheckboxList: React.FC<AgencySearchBoxProps> = ({
	agencies,
	height = "300px",
	selectedAgencies,
	setSelectedAgencies,
}) => {
	const [search, setSearch] = useState("");
	const [root, setRoot] = useState<Group>(
		buildGroupTree(agencies, ["system", "state"])
	);
	const [searchTree, setSearchTree] = useState<Group>(
		buildGroupSearchTree(agencies)
	);

	const [filteredAgencies, setFilteredAgencies] = useState<Agency[]>([]);
	const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
	const [filterSelections, setFilterSelections] = useState<
		FilterSelectionOptions[]
	>([]);

	useEffect(() => {
		setFilterOptions(agency_filters);
	}, []);

	useEffect(() => {
		setFilterSelections(
			filterOptions.map((option) => ({
				is_selected: false,
				selected_option: option.default_option,
			}))
		);
	}, [filterOptions]);

	useEffect(() => {
		if (filterOptions.length !== filterSelections.length) return;

		let filtered = agencies;

		for (let i = 0; i < filterOptions.length; i++) {
			const filter = filterOptions[i];
			const selection = filterSelections[i];

			if (selection.is_selected && selection.selected_option) {
				const prop = filter.property as keyof Agency;

				// Check if the property is boolean on first item (if exists)
				const sampleAgency = filtered[0];
				const isBooleanProp =
					sampleAgency && typeof sampleAgency[prop] === "boolean";

				// Convert selected_option string to boolean if needed
				const selectedValue = isBooleanProp
					? selection.selected_option.toLowerCase() === "true"
					: selection.selected_option;

				filtered = filtered.filter(
					(agency) => agency[prop] === selectedValue
				);
			}
		}

		setFilteredAgencies(filtered);
	}, [agencies, filterSelections, filterOptions]);

	useEffect(() => {
		setRoot(buildGroupTree(filteredAgencies, ["system", "state"]));
		setSearchTree(buildGroupSearchTree(filteredAgencies));
	}, [filteredAgencies]);

	const isSelected = (group: Group): boolean => {
		if (group.children.length === 0) {
			const name = group.agency?.full_name;
			if (group.agency) {
				return selectedAgencies.some((a) => a.full_name === name);
			}
			return false;
		} else {
			return group.children.every((child) => isSelected(child));
		}
	};

	const setIsSelected = (group: Group, value: boolean) => {
		if (group.children.length === 0) {
			if (group.agency) {
				if (value) {
					setSelectedAgencies((prev) => [...prev, group.agency!]);
				} else {
					setSelectedAgencies((prev) =>
						prev.filter(
							(a) => a.full_name !== group.agency?.full_name
						)
					);
				}
			}
		} else {
			for (const child of group.children) {
				setIsSelected(child, value);
			}
		}
	};

	const toggleSelection = (group: Group) => {
		// Check if leaf
		if (group.children.length === 0) {
			if (isSelected(group)) {
				setSelectedAgencies((prev) =>
					prev.filter((a) => a.full_name !== group.agency?.full_name)
				);
			} else {
				if (group.agency) {
					setSelectedAgencies((prev) => [...prev, group.agency!]);
				}
			}
		} else {
			for (const child of group.children) {
				setIsSelected(child, !isSelected(group));
			}
		}
	};

	return (
		<Container style={{ maxWidth: "400px" }}>
			<div
				style={{
					width: "100%",
					height: height,
					overflowY: "auto",
					color: colors.light,
					fontFamily: fonts.primary,
					borderRadius: "0.25rem",
					backgroundColor: colors.light,
				}}
			>
				<div
					style={{
						padding: "0.75rem",
						backgroundColor: colors.dark,
					}}
				>
					<Form.Control
						type="text"
						placeholder="Search agencies..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<div
						className="d-flex justify-content-between align-items-center mt-2"
						style={{
							fontSize: "0.9rem",
						}}
					>
						<div>{selectedAgencies.length} selected</div>
						<AgencyFilter
							filters={filterOptions}
							selectedFilters={filterSelections}
							setSelectedFilters={setFilterSelections}
						/>
					</div>
				</div>
				<div
					style={{
						backgroundColor: colors.light,
					}}
				>
					{search === "" && (
						<GroupTreeNode
							key={root.name}
							parentCollapsed={true}
							group={root}
							isSelected={isSelected}
							toggleSelection={toggleSelection}
						/>
					)}
					{search !== "" && (
						<SearchTreeNode
							group={searchTree}
							searchText={search}
							isSelected={isSelected}
							toggleSelection={toggleSelection}
						/>
					)}
				</div>
			</div>
		</Container>
	);
};

export default CheckboxList;
