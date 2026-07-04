"use client"

import {useCallback, useEffect, useRef, useState} from "react";
import type {Key} from "react";
import {Button, Input, Select, SelectItem} from "@heroui/react";
import {ChevronUp, GripVertical, Plus, Trash2} from "lucide-react";

export type FilterOption = {
	value: string;
	label: string;
};

export type FilterOperator = {
	value: string;
	label: string;
	valueComponent: "text" | "single_select" | "multi_select" | "date_range" | "number";
	placeholder?: string;
	valueSource?: string | null;
};

export type FilterSubField = {
	value: string;
	label: string;
	dataType: "string" | "date" | "enum" | "number" | "money";
	operators: FilterOperator[];
	placeholder?: string;
	defaultOperator?: string;
};

export type FilterField = {
	value: string;
	label: string;
	dataType?: "string" | "date" | "enum" | "number" | "money";
	operators?: FilterOperator[];
	placeholder?: string;
	defaultOperator?: string;
	subFields?: FilterSubField[];
	defaultSubField?: string;
};

export type FilterConditionValue =
	| string
	| string[]
	| {
		from: string;
		to: string;
	};

export type FilterCondition = {
	id: number;
	field: string;
	subField?: string;
	operator: string;
	value: FilterConditionValue;
};

export type FilterGroup = {
	id: number;
	conditions: FilterCondition[];
};

export type LoadOptionsArgs = {
	valueSource: string;
	search?: string;
	page?: number;
};

export type LoadOptionsResult = {
	options: FilterOption[];
	hasMore?: boolean;
	nextPage?: number | null;
};

type AdvancedFilterBuilderProps = {
	open: boolean;
	title?: string;
	description?: string;
	searchButtonLabel?: string;
	fields?: FilterField[];
	initialGroups: FilterGroup[];
	resetKey?: number;
	onClose: () => void;
	onSearch?: (groups: FilterGroup[]) => void;
	onActiveFilterCountChange?: (count: number) => void;
	onLoadOptions?: (args: LoadOptionsArgs) => Promise<LoadOptionsResult>;
};

type ConditionUpdate = Partial<FilterCondition>;

type ActiveFilterConfig = FilterField | FilterSubField;

const filterControlClassNames = {
	trigger: "h-12 rounded-[8px] border border-[#dbe3ef] bg-white px-3 shadow-none data-[hover=true]:border-[#b8c6d8]",
	label: "text-[12px] font-semibold text-[#334155]",
	value: "text-[14px] text-[#17233a]",
};

const filterInputClassNames = {
	inputWrapper: "h-12 rounded-[8px] border border-[#dbe3ef] bg-white px-3 shadow-none data-[hover=true]:border-[#b8c6d8]",
	label: "text-[12px] font-semibold text-[#334155]",
	input: "text-[14px] text-[#17233a] placeholder:text-[#8a97aa]",
};

const cloneConditionValue = (value: FilterConditionValue): FilterConditionValue => {
	if (Array.isArray(value)) {
		return [...value];
	}

	if (typeof value === "object" && value !== null) {
		return {...value};
	}

	return value;
};

const cloneGroups = (groups: FilterGroup[]) => groups.map((group) => ({
	...group,
	conditions: group.conditions.map((condition) => ({
		...condition,
		value: cloneConditionValue(condition.value),
	})),
}));

const getSelectedKeySet = (value?: string) => value ? new Set([value]) : new Set<string>();

const getSelectedKeySetFromArray = (value: FilterConditionValue) => {
	return Array.isArray(value) ? new Set(value) : new Set<string>();
};

const getSelectedKey = (keys: "all" | Set<Key>) => {
	if (keys === "all") {
		return "";
	}

	const selectedKey = Array.from(keys)[0];

	return selectedKey ? String(selectedKey) : "";
};

const getSelectedKeys = (keys: "all" | Set<Key>, options: FilterOption[]) => {
	if (keys === "all") {
		return options.map((option) => option.value);
	}

	return Array.from(keys).map((key) => String(key));
};

const isDateRangeValue = (value: FilterConditionValue): value is {from: string; to: string} => {
	return typeof value === "object" && value !== null && !Array.isArray(value) && "from" in value && "to" in value;
};

const getEmptyValueForComponent = (valueComponent?: FilterOperator["valueComponent"]): FilterConditionValue => {
	if (valueComponent === "multi_select") {
		return [];
	}

	if (valueComponent === "date_range") {
		return {
			from: "",
			to: "",
		};
	}

	return "";
};

const createEmptyCondition = (id: number): FilterCondition => {
	return {
		id,
		field: "",
		subField: "",
		operator: "",
		value: "",
	};
};

const getNextConditionId = (groups: FilterGroup[]) => {
	const conditionIds = groups.flatMap((group) => group.conditions.map((condition) => condition.id));

	return conditionIds.length ? Math.max(...conditionIds) + 1 : 1;
};

const getNextGroupId = (groups: FilterGroup[]) => {
	const groupIds = groups.map((group) => group.id);

	return groupIds.length ? Math.max(...groupIds) + 1 : 1;
};

const findField = (fields: FilterField[], value: string) => {
	return fields.find((field) => field.value === value);
};

const findSubField = (field: FilterField | undefined, subFieldValue?: string) => {
	if (!field?.subFields?.length) {
		return undefined;
	}

	return field.subFields.find((subField) => subField.value === subFieldValue);
};

const findOperator = (operators: FilterOperator[] | undefined, operatorValue: string) => {
	return operators?.find((operator) => operator.value === operatorValue);
};

const getDefaultSubField = (field: FilterField | undefined) => {
	if (!field?.subFields?.length) {
		return undefined;
	}

	return field.subFields.find((subField) => subField.value === field.defaultSubField) ?? field.subFields[0];
};

const getDefaultOperator = (config: ActiveFilterConfig | undefined) => {
	if (!config?.operators?.length) {
		return undefined;
	}

	return config.operators.find((operator) => operator.value === config.defaultOperator) ?? config.operators[0];
};

const getActiveFilterConfig = (field: FilterField | undefined, subFieldValue?: string): ActiveFilterConfig | undefined => {
	if (!field) {
		return undefined;
	}

	if (field.subFields?.length) {
		return findSubField(field, subFieldValue);
	}

	return field;
};

const getDefaultValuesForField = (field: FilterField | undefined): Pick<FilterCondition, "subField" | "operator" | "value"> => {
	if (!field) {
		return {
			subField: "",
			operator: "",
			value: "",
		};
	}

	if (field.subFields?.length) {
		const subField = getDefaultSubField(field);
		const operator = getDefaultOperator(subField);

		return {
			subField: subField?.value ?? "",
			operator: operator?.value ?? "",
			value: getEmptyValueForComponent(operator?.valueComponent),
		};
	}

	const operator = getDefaultOperator(field);

	return {
		subField: "",
		operator: operator?.value ?? "",
		value: getEmptyValueForComponent(operator?.valueComponent),
	};
};

const getDefaultValuesForSubField = (field: FilterField | undefined, subFieldValue: string): Pick<FilterCondition, "operator" | "value"> => {
	const subField = findSubField(field, subFieldValue);
	const operator = getDefaultOperator(subField);

	return {
		operator: operator?.value ?? "",
		value: getEmptyValueForComponent(operator?.valueComponent),
	};
};

const getDefaultValueForOperator = (config: ActiveFilterConfig | undefined, operatorValue: string) => {
	const operator = findOperator(config?.operators, operatorValue);

	return getEmptyValueForComponent(operator?.valueComponent);
};

const isValueComplete = (value: FilterConditionValue, valueComponent: FilterOperator["valueComponent"]) => {
	if (valueComponent === "multi_select") {
		return Array.isArray(value) && value.length > 0;
	}

	if (valueComponent === "date_range") {
		return isDateRangeValue(value) && value.from.trim() !== "" && value.to.trim() !== "";
	}

	return typeof value === "string" && value.trim() !== "";
};

const isConditionComplete = (condition: FilterCondition, fields: FilterField[]) => {
	const field = findField(fields, condition.field);

	if (!field) {
		return false;
	}

	if (field.subFields?.length && !condition.subField) {
		return false;
	}

	const activeConfig = getActiveFilterConfig(field, condition.subField);
	const operator = findOperator(activeConfig?.operators, condition.operator);

	if (!activeConfig || !operator) {
		return false;
	}

	return isValueComplete(condition.value, operator.valueComponent);
};

const getCompletedConditionCount = (groups: FilterGroup[], fields: FilterField[]) => {
	return groups.reduce((total, group) => {
		return total + group.conditions.filter((condition) => isConditionComplete(condition, fields)).length;
	}, 0);
};

const areGroupsComplete = (groups: FilterGroup[], fields: FilterField[]) => {
	return groups.length > 0 && groups.every((group) => {
		return group.conditions.length > 0 && group.conditions.every((condition) => isConditionComplete(condition, fields));
	});
};

export default function AdvancedFilterBuilder({
	open,
	title = "Advanced Filters",
	description = "Build advanced queries to find exactly what you need.",
	searchButtonLabel = "Search",
	fields = [],
	initialGroups,
	resetKey = 0,
	onClose,
	onSearch,
	onActiveFilterCountChange,
	onLoadOptions,
}: AdvancedFilterBuilderProps) {
	const [groups, setGroups] = useState<FilterGroup[]>(() => cloneGroups(initialGroups));
	const [optionsCache, setOptionsCache] = useState<Record<string, LoadOptionsResult>>({});
	const [loadingOptionSources, setLoadingOptionSources] = useState<Record<string, boolean>>({});
	const initialGroupsRef = useRef(initialGroups);
	const loadingOptionSourcesRef = useRef(new Set<string>());
	const canSearch = areGroupsComplete(groups, fields);

	const loadOptionsForSource = useCallback(async (valueSource: string) => {
		if (!onLoadOptions || optionsCache[valueSource] || loadingOptionSourcesRef.current.has(valueSource)) {
			return;
		}

		loadingOptionSourcesRef.current.add(valueSource);
		setLoadingOptionSources((currentSources) => ({
			...currentSources,
			[valueSource]: true,
		}));

		try {
			const result = await onLoadOptions({
				valueSource,
				search: "",
				page: 1,
			});

			setOptionsCache((currentCache) => ({
				...currentCache,
				[valueSource]: {
					options: result.options ?? [],
					hasMore: result.hasMore ?? false,
					nextPage: result.nextPage ?? null,
				},
			}));
		} catch {
			setOptionsCache((currentCache) => ({
				...currentCache,
				[valueSource]: {
					options: [],
					hasMore: false,
					nextPage: null,
				},
			}));
		} finally {
			loadingOptionSourcesRef.current.delete(valueSource);
			setLoadingOptionSources((currentSources) => ({
				...currentSources,
				[valueSource]: false,
			}));
		}
	}, [onLoadOptions, optionsCache]);

	useEffect(() => {
		initialGroupsRef.current = initialGroups;
	}, [initialGroups]);

	useEffect(() => {
		setGroups(cloneGroups(initialGroupsRef.current));
	}, [resetKey]);

	useEffect(() => {
		onActiveFilterCountChange?.(getCompletedConditionCount(groups, fields));
	}, [fields, groups, onActiveFilterCountChange]);

	if (!open) {
		return null;
	}

	const updateCondition = (groupId: number, conditionId: number, updates: ConditionUpdate) => {
		setGroups((currentGroups) => currentGroups.map((group) => {
			if (group.id !== groupId) {
				return group;
			}

			return {
				...group,
				conditions: group.conditions.map((condition) => {
					if (condition.id !== conditionId) {
						return condition;
					}

					return {
						...condition,
						...updates,
					};
				}),
			};
		}));
	};

	const handleFieldChange = (groupId: number, conditionId: number, fieldValue: string) => {
		updateCondition(groupId, conditionId, {
			field: fieldValue,
			...getDefaultValuesForField(findField(fields, fieldValue)),
		});
	};

	const handleSubFieldChange = (groupId: number, conditionId: number, fieldValue: string, subField: string) => {
		updateCondition(groupId, conditionId, {
			subField,
			...getDefaultValuesForSubField(findField(fields, fieldValue), subField),
		});
	};

	const handleOperatorChange = (groupId: number, conditionId: number, condition: FilterCondition, operator: string) => {
		const field = findField(fields, condition.field);
		const activeConfig = getActiveFilterConfig(field, condition.subField);

		updateCondition(groupId, conditionId, {
			operator,
			value: getDefaultValueForOperator(activeConfig, operator),
		});
	};

	const addCondition = (groupId: number) => {
		setGroups((currentGroups) => {
			const nextConditionId = getNextConditionId(currentGroups);

			return currentGroups.map((group) => {
				if (group.id !== groupId) {
					return group;
				}

				return {
					...group,
					conditions: [
						...group.conditions,
						createEmptyCondition(nextConditionId),
					],
				};
			});
		});
	};

	const addGroup = () => {
		setGroups((currentGroups) => {
			const nextGroupId = getNextGroupId(currentGroups);
			const nextConditionId = getNextConditionId(currentGroups);

			return [
				...currentGroups,
				{
					id: nextGroupId,
					conditions: [
						createEmptyCondition(nextConditionId),
					],
				},
			];
		});
	};

	const removeCondition = (groupId: number, conditionId: number) => {
		setGroups((currentGroups) => currentGroups.reduce<FilterGroup[]>((updatedGroups, group) => {
			if (group.id !== groupId) {
				return [...updatedGroups, group];
			}

			const conditions = group.conditions.filter((condition) => condition.id !== conditionId);

			if (!conditions.length) {
				return updatedGroups;
			}

			return [
				...updatedGroups,
				{
					...group,
					conditions,
				},
			];
		}, []));
	};

	const removeGroup = (groupId: number) => {
		setGroups((currentGroups) => currentGroups.filter((group) => group.id !== groupId));
	};

	const handleSearch = () => {
		if (!canSearch) {
			return;
		}

		onSearch?.(cloneGroups(groups));
	};

	return (
		<div className="mb-5 overflow-hidden rounded-[12px] border border-[#dbe3ef] bg-white shadow-[0_22px_48px_-42px_rgba(20,43,72,0.5)]">
			<div className="flex flex-col gap-3 border-b border-[#e8eef6] px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-5">
				<div>
					<h2 className="text-base font-bold leading-6 text-[#07142c]">{title}</h2>
					<p className="mt-1 text-sm font-normal leading-5 text-[#66738a]">{description}</p>
				</div>
				<Button
					className="h-9 self-start rounded-[8px] border border-[#dbe3ef] bg-white px-3 text-sm font-semibold text-[#075de8] shadow-none hover:border-[#b9d3ff] hover:bg-[#f3f8ff]"
					variant="bordered"
					onPress={onClose}
				>
					Close
					<ChevronUp className="size-4" strokeWidth={2}/>
				</Button>
			</div>

			<div className="px-4 py-4 sm:px-5">
				{groups.length === 0 && (
					<div className="rounded-[10px] border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-4 py-6 text-center text-sm font-medium text-[#64748b]">
						No filter groups added.
					</div>
				)}

				{groups.map((group, groupIndex) => (
					<div key={group.id}>
						{groupIndex > 0 && (
							<div className="my-4 flex items-center gap-3">
								<div className="h-px flex-1 bg-[#e5ebf3]"/>
								<span className="rounded-full border border-[#d7e3f5] bg-[#f6f9ff] px-3 py-1 text-[11px] font-bold uppercase tracking-normal text-[#075de8]">OR</span>
								<div className="h-px flex-1 bg-[#e5ebf3]"/>
							</div>
						)}

						<div className="rounded-[12px] border border-[#e3e9f2] bg-[#fbfdff] p-3 sm:p-4">
							<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<div className="flex flex-wrap items-center gap-3">
									<span className="inline-flex h-8 items-center rounded-[7px] bg-[#075de8] px-3 text-xs font-bold text-white shadow-[0_12px_20px_-16px_rgba(7,93,232,0.9)]">
										Group {groupIndex + 1}
									</span>
									<span className="text-xs font-semibold text-[#64748b]">
										{group.conditions.length} {group.conditions.length === 1 ? "condition" : "conditions"}
									</span>
								</div>
								<Button
									className="h-9 self-start rounded-[8px] border border-[#ffd4d8] bg-white px-3 text-xs font-bold text-[#f3123c] shadow-none hover:border-[#ff9fa8] hover:bg-[#fff7f7] sm:self-auto"
									variant="bordered"
									onPress={() => removeGroup(group.id)}
								>
									<Trash2 className="size-4" strokeWidth={2}/>
									Delete Group
								</Button>
							</div>

							<div className="space-y-3">
								{group.conditions.map((condition, conditionIndex) => (
									<div key={condition.id}>
										{conditionIndex > 0 && (
											<div className="mb-3 flex items-center gap-3 pl-0 sm:pl-8">
												<div className="h-px flex-1 bg-[#e5ebf3]"/>
												<span className="rounded-full border border-[#dfe7f2] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-normal text-[#475569]">AND</span>
												<div className="h-px flex-1 bg-[#e5ebf3]"/>
											</div>
										)}

											<FilterConditionRow
												condition={condition}
												fields={fields}
												groupId={group.id}
												loadingOptionSources={loadingOptionSources}
												onFieldChange={handleFieldChange}
												onLoadOptions={loadOptionsForSource}
												onOperatorChange={handleOperatorChange}
												onRemoveCondition={removeCondition}
												onSubFieldChange={handleSubFieldChange}
												onUpdateCondition={updateCondition}
												optionsCache={optionsCache}
											/>
									</div>
								))}
							</div>

							<div className="mt-4 flex justify-end">
								<Button
									className="h-10 rounded-[8px] border border-[#c9d8ee] bg-white px-4 text-sm font-bold text-[#075de8] shadow-none hover:border-[#9ec1f7] hover:bg-[#f4f8ff]"
									variant="bordered"
									onPress={() => addCondition(group.id)}
								>
									<Plus className="size-4" strokeWidth={2}/>
									Add AND
								</Button>
							</div>
						</div>
					</div>
				))}

				<div className="mt-5 flex flex-col gap-3 border-t border-[#e8eef6] pt-5 sm:flex-row sm:items-center sm:justify-between">
					<Button
						className="h-11 rounded-[8px] border border-[#c9d8ee] bg-white px-4 text-sm font-bold text-[#075de8] shadow-none hover:border-[#9ec1f7] hover:bg-[#f4f8ff]"
						variant="bordered"
						onPress={addGroup}
					>
						<Plus className="size-4" strokeWidth={2}/>
						Add Group
					</Button>
					<Button
						className="h-11 rounded-[8px] bg-[#075de8] px-5 text-sm font-bold text-white shadow-[0_14px_24px_-18px_rgba(7,93,232,0.85)] hover:bg-[#034fc9] disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[170px]"
						isDisabled={!canSearch}
						onPress={handleSearch}
					>
						{searchButtonLabel}
					</Button>
				</div>
			</div>
		</div>
	);
}

type FilterConditionRowProps = {
	fields: FilterField[];
	condition: FilterCondition;
	groupId: number;
	loadingOptionSources: Record<string, boolean>;
	onFieldChange: (groupId: number, conditionId: number, fieldValue: string) => void;
	onLoadOptions: (valueSource: string) => Promise<void>;
	onOperatorChange: (groupId: number, conditionId: number, condition: FilterCondition, operator: string) => void;
	onRemoveCondition: (groupId: number, conditionId: number) => void;
	onSubFieldChange: (groupId: number, conditionId: number, fieldValue: string, subField: string) => void;
	onUpdateCondition: (groupId: number, conditionId: number, updates: ConditionUpdate) => void;
	optionsCache: Record<string, LoadOptionsResult>;
};

function FilterConditionRow({
	fields,
	condition,
	groupId,
	loadingOptionSources,
	onFieldChange,
	onLoadOptions,
	onOperatorChange,
	onRemoveCondition,
	onSubFieldChange,
	onUpdateCondition,
	optionsCache,
}: FilterConditionRowProps) {
	const field = findField(fields, condition.field);
	const showSubField = Boolean(field?.subFields?.length);
	const activeConfig = getActiveFilterConfig(field, condition.subField);
	const operators = activeConfig?.operators ?? [];
	const operator = findOperator(operators, condition.operator);
	const valueColumnClass = showSubField ? "xl:col-span-5" : "xl:col-span-7";

	return (
		<div className="relative rounded-[10px] border border-[#e8eef6] bg-white p-3 xl:pl-10">
			<div className="absolute bottom-3 left-3 hidden h-12 items-center justify-center xl:flex">
				<GripVertical className="size-4 text-[#9aa7bb]" strokeWidth={2}/>
			</div>
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-12 xl:items-end">
				<div className="xl:col-span-2">
					<FilterSelectControl
						label="Field"
						placeholder="Choose field"
						options={fields}
						value={condition.field}
						onChange={(fieldValue) => onFieldChange(groupId, condition.id, fieldValue)}
					/>
				</div>

				{showSubField && (
					<div className="xl:col-span-2">
						<FilterSelectControl
							label="Filter By"
							placeholder="Choose field"
							options={field?.subFields ?? []}
							value={condition.subField ?? ""}
							onChange={(subField) => onSubFieldChange(groupId, condition.id, condition.field, subField)}
						/>
					</div>
				)}

				<div className="xl:col-span-2">
					<FilterSelectControl
						label="Operator"
						placeholder="Choose operator"
						options={operators}
						value={condition.operator}
						onChange={(selectedOperator) => onOperatorChange(groupId, condition.id, condition, selectedOperator)}
					/>
				</div>

				<div className={valueColumnClass}>
						<FilterValueControl
							config={activeConfig}
							isLoadingOptions={operator?.valueSource ? Boolean(loadingOptionSources[operator.valueSource]) : false}
							loadedOptions={operator?.valueSource ? optionsCache[operator.valueSource]?.options ?? [] : []}
							onLoadOptions={onLoadOptions}
							operator={operator}
							value={condition.value}
							onChange={(value) => onUpdateCondition(groupId, condition.id, {value})}
						/>
				</div>

				<div className="flex justify-end xl:col-span-1">
					<Button
						isIconOnly
						aria-label="Remove condition"
						className="h-12 w-12 min-w-12 rounded-[8px] border border-[#ffd4d8] bg-white text-[#f3123c] shadow-none hover:border-[#ff9fa8] hover:bg-[#fff7f7]"
						variant="bordered"
						onPress={() => onRemoveCondition(groupId, condition.id)}
					>
						<Trash2 className="size-4" strokeWidth={2}/>
					</Button>
				</div>
			</div>
		</div>
	);
}

type FilterSelectControlProps = {
	label: string;
	placeholder: string;
	options: FilterOption[];
	isLoading?: boolean;
	value?: string;
	onChange: (value: string) => void;
};

function FilterSelectControl({label, placeholder, options, isLoading = false, value, onChange}: FilterSelectControlProps) {
	return (
		<Select
			className="w-full"
			classNames={filterControlClassNames}
			isLoading={isLoading}
			label={label}
			labelPlacement="outside"
			placeholder={placeholder}
			radius="sm"
			selectedKeys={getSelectedKeySet(value)}
			selectionMode="single"
			variant="bordered"
			onSelectionChange={(keys) => onChange(getSelectedKey(keys))}
		>
			{options.map((option) => (
				<SelectItem key={option.value}>{option.label}</SelectItem>
			))}
		</Select>
	);
}

type FilterMultiSelectControlProps = {
	label: string;
	placeholder: string;
	options: FilterOption[];
	isLoading?: boolean;
	value: FilterConditionValue;
	onChange: (value: string[]) => void;
};

function FilterMultiSelectControl({label, placeholder, options, isLoading = false, value, onChange}: FilterMultiSelectControlProps) {
	return (
		<Select
			className="w-full"
			classNames={filterControlClassNames}
			isLoading={isLoading}
			label={label}
			labelPlacement="outside"
			placeholder={placeholder}
			radius="sm"
			selectedKeys={getSelectedKeySetFromArray(value)}
			selectionMode="multiple"
			variant="bordered"
			onSelectionChange={(keys) => onChange(getSelectedKeys(keys, options))}
		>
			{options.map((option) => (
				<SelectItem key={option.value}>{option.label}</SelectItem>
			))}
		</Select>
	);
}

type FilterValueControlProps = {
	config?: ActiveFilterConfig;
	isLoadingOptions?: boolean;
	loadedOptions?: FilterOption[];
	operator?: FilterOperator;
	value: FilterConditionValue;
	onChange: (value: FilterConditionValue) => void;
	onLoadOptions?: (valueSource: string) => Promise<void>;
};

function FilterValueControl({
	config,
	isLoadingOptions = false,
	loadedOptions = [],
	operator,
	value,
	onChange,
	onLoadOptions,
}: FilterValueControlProps) {
	const valueSource = operator?.valueSource ?? "";
	const usesLoadedOptions = Boolean(valueSource)
		&& (operator?.valueComponent === "single_select" || operator?.valueComponent === "multi_select");

	useEffect(() => {
		if (usesLoadedOptions && valueSource) {
			onLoadOptions?.(valueSource);
		}
	}, [onLoadOptions, usesLoadedOptions, valueSource]);

	if (!operator) {
		return (
			<Input
				className="w-full"
				classNames={filterInputClassNames}
				isDisabled
				label="Value"
				labelPlacement="outside"
				placeholder="Choose operator"
				radius="sm"
				value=""
				variant="bordered"
			/>
		);
	}

	const options = usesLoadedOptions ? loadedOptions : [];
	const placeholder = operator.placeholder ?? config?.placeholder ?? "Enter value";

	if (operator.valueComponent === "single_select") {
		return (
			<FilterSelectControl
				label="Value"
				placeholder={placeholder || "Choose value"}
				isLoading={isLoadingOptions}
				options={options}
				value={typeof value === "string" ? value : ""}
				onChange={onChange}
			/>
		);
	}

	if (operator.valueComponent === "multi_select") {
		return (
			<FilterMultiSelectControl
				label="Value"
				placeholder={placeholder || "Choose values"}
				isLoading={isLoadingOptions}
				options={options}
				value={value}
				onChange={onChange}
			/>
		);
	}

	if (operator.valueComponent === "date_range") {
		const dateRangeValue = isDateRangeValue(value) ? value : {from: "", to: ""};

		return (
			<div className="w-full">
				<label className="mb-1 block text-[12px] font-semibold text-[#334155]">Value</label>
				<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
					<Input
						aria-label="Date range start"
						className="w-full"
						classNames={filterInputClassNames}
						placeholder="From"
						radius="sm"
						type="date"
						value={dateRangeValue.from}
						variant="bordered"
						onValueChange={(from) => onChange({...dateRangeValue, from})}
					/>
					<Input
						aria-label="Date range end"
						className="w-full"
						classNames={filterInputClassNames}
						placeholder="To"
						radius="sm"
						type="date"
						value={dateRangeValue.to}
						variant="bordered"
						onValueChange={(to) => onChange({...dateRangeValue, to})}
					/>
				</div>
			</div>
		);
	}

	return (
		<Input
			className="w-full"
			classNames={filterInputClassNames}
			label="Value"
			labelPlacement="outside"
			placeholder={placeholder}
			radius="sm"
			type={operator.valueComponent === "number" ? "number" : "text"}
			value={typeof value === "string" ? value : ""}
			variant="bordered"
			onValueChange={onChange}
		/>
	);
}
