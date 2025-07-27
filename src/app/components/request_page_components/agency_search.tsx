import { Agency } from "@/app/util/agency_util";

import { AgencyOption } from "@/app/components/request_page_components/agency_option";

export interface Group {
	parent: Group | null;
	children: Group[];
	name: string;
	agency?: Agency;
}

function buildGroupSearchTree(agencies: Agency[]): Group {
	const current_groups: Group[] = [];
	for (const agency of agencies) {
		current_groups.push({
			parent: null,
			children: [],
			name: agency.full_name,
			agency: agency,
		});
	}

	const root: Group = {
		parent: null,
		children: current_groups,
		name: "All Agencies",
	};

	for (const group of current_groups) {
		group.parent = root;
	}

	return root;
}

const SearchTreeNode: React.FC<{
	group: Group;
	searchText: string;
	isSelected: (group: Group) => boolean;
	toggleSelection: (group: Group) => void;
}> = ({ group, searchText, isSelected, toggleSelection }) => {
	const isLeaf = group.children.length === 0;

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

	const children_to_render = group.children.filter((child) =>
		child.name.toLowerCase().includes(searchText.toLowerCase())
	);

	return (
		<div>
			{children_to_render.map((child) => (
				<SearchTreeNode
					key={child.name}
					group={child}
					searchText={searchText}
					isSelected={isSelected}
					toggleSelection={toggleSelection}
				/>
			))}
		</div>
	);
};

export { buildGroupSearchTree, SearchTreeNode };
