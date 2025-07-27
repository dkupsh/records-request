import { Agency } from "@/app/util/agency_util";

import {
	GroupOption,
	AgencyOption,
	SelectAll,
} from "@/app/components/request_page_components/agency_option";
import { useEffect, useState } from "react";

export interface Group {
	parent: Group | null;
	children: Group[];
	name: string;
	agency?: Agency;
}

function buildGroupTree(agencies: Agency[], keys: (keyof Agency)[]): Group {
	let current_groups: Group[] = [];
	for (const agency of agencies) {
		if (agency) {
			current_groups.push({
				parent: null,
				children: [],
				name: agency.full_name,
				agency: agency,
			});
		}
	}

	for (const key of keys) {
		const groupMap: Record<string, Group> = {};
		const unGrouped = [];
		for (const group of current_groups) {
			const groupKey = group.agency?.[key] as string;
			if (
				groupKey === "" ||
				groupKey === undefined ||
				groupKey === null
			) {
				unGrouped.push(group);
			} else {
				if (groupKey in groupMap) {
					groupMap[groupKey].children.push(group);
				} else {
					groupMap[groupKey] = {
						parent: null,
						children: [group],
						name: groupKey,
						agency: group.agency,
					};
					/* todo: add validation that rest of keys are the same */
				}
				group.parent = groupMap[groupKey];
			}
		}
		current_groups = [...Object.values(groupMap), ...unGrouped];
	}

	const root: Group = {
		parent: null,
		children: current_groups,
		name: "Select All",
	};

	for (const group of current_groups) {
		group.parent = root;
	}

	return root;
}

const GroupTreeNode: React.FC<{
	group: Group;
	parentCollapsed: boolean;
	isSelected: (group: Group) => boolean;
	toggleSelection: (group: Group) => void;
}> = ({ group, parentCollapsed, isSelected, toggleSelection }) => {
	const isLeaf = group.children.length === 0;
	const isRoot = group.parent === null;

	const [isCollapsed, setCollapsed] = useState(true);

	useEffect(() => {
		if (parentCollapsed) {
			setCollapsed(true);
		}
	}, [parentCollapsed]);

	if (isLeaf && group.agency) {
		return (
			<AgencyOption
				agency={group.agency}
				checked={isSelected(group)}
				onChange={() => {
					toggleSelection(group);
				}}
			/>
		);
	}

	if (isRoot) {
		return (
			<div>
				<SelectAll
					key={group.name}
					name={group.name}
					checked={isSelected(group)}
					onChange={() => {
						toggleSelection(group);
					}}
				/>
				{group.children.map((child) => (
					<GroupTreeNode
						key={child.name}
						group={child}
						parentCollapsed={isCollapsed}
						isSelected={isSelected}
						toggleSelection={toggleSelection}
					/>
				))}
			</div>
		);
	}

	return (
		<div>
			<GroupOption
				name={group.name}
				checked={isSelected(group)}
				onChange={() => {
					toggleSelection(group);
				}}
				caretOpen={!isCollapsed}
				onCaretClick={() => setCollapsed(!isCollapsed)}
			/>
			{!isCollapsed && (
				<div style={{ paddingLeft: "1rem" }}>
					{group.children.map((child) => (
						<GroupTreeNode
							key={child.name}
							group={child}
							parentCollapsed={isCollapsed}
							isSelected={isSelected}
							toggleSelection={toggleSelection}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export { buildGroupTree, GroupTreeNode };
