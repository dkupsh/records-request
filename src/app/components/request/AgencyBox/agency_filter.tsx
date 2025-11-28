"use client";

import React from "react";
import { Dropdown } from "react-bootstrap";
import { FilterOption, FilterSelectionOptions } from "@/app/util/agency_util";

import FilterNode from "@/app/components/request/AgencyBox/filter_node";

import { colors, fonts } from "@/app/lib/theme";

interface AgencyFilterProps {
	filters: FilterOption[];
	selectedFilters: FilterSelectionOptions[];
	setSelectedFilters: React.Dispatch<
		React.SetStateAction<FilterSelectionOptions[]>
	>;
}

// Main component without search
const AgencyFilter: React.FC<AgencyFilterProps> = ({
	filters,
	selectedFilters,
	setSelectedFilters,
}) => {
	const getFilterIndex = (filter: FilterOption): number => {
		return filters.findIndex((f) => f.property === filter.property);
	};

	const getSelectionForFilter = (
		filter: FilterOption
	): FilterSelectionOptions => {
		const index = getFilterIndex(filter);
		return selectedFilters[index];
	};

	const isFilterSelected = (filter: FilterOption): boolean => {
		const selection = getSelectionForFilter(filter);
		if (!selection) return false;
		return selection.is_selected;
	};

	const filterValue = (filter: FilterOption): string => {
		const selection = getSelectionForFilter(filter);
		if (!selection) return "";
		return selection.selected_option || filter.default_option || "";
	};

	const setFilterValue = (filter: FilterOption, value: string) => {
		const i = getFilterIndex(filter);
		setSelectedFilters((prev) => {
			const updated = [...prev]; // shallow copy to preserve order
			updated[i] = {
				...updated[i], // preserve other fields
				selected_option: value, // update is_selected
			};
			return updated;
		});
	};

	const toggleFilter = (filter: FilterOption) => {
		const i = getFilterIndex(filter);
		setSelectedFilters((prev) => {
			const updated = [...prev]; // shallow copy to preserve order
			updated[i] = {
				...updated[i], // preserve other fields
				is_selected: !updated[i].is_selected, // update is_selected
			};
			return updated;
		});
	};

	return (
		<Dropdown align="end">
			{/* Dropdown toggle button */}
			<Dropdown.Toggle
				variant="outline-secondary"
				style={{
					backgroundColor: colors.dark,
					color: colors.light,
					fontFamily: fonts.primary,
					borderColor: colors.white,
					outline: "none",
					boxShadow: "none",
				}}
			>
				<i className="bi bi-funnel"></i>
			</Dropdown.Toggle>

			{/* Dropdown menu */}
			<Dropdown.Menu
				style={{
					backgroundColor: colors.dark,
					color: colors.light,
					fontFamily: fonts.primary,
					padding: "0.5rem 1rem",
					minWidth: "250px",
					border: `1px solid ${colors.white}`,
					boxShadow: "none",
					fontSize: "0.75rem",
				}}
			>
				{filters.map((filter) => (
					<FilterNode
						key={filter.property}
						filter={filter}
						checked={isFilterSelected(filter)}
						value={filterValue(filter)}
						setValue={setFilterValue}
						onChange={toggleFilter}
					/>
				))}
			</Dropdown.Menu>
		</Dropdown>
	);
};

export default AgencyFilter;
