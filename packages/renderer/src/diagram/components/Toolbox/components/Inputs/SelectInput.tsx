import type { ToolboxInputProps } from './Input';
import ToolboxInput from './Input';

type SelectInputProps<T extends string | number> = ToolboxInputProps<T> & {
    options: ReadonlyArray<T>;
};

function SelectInput<T extends string | number>(props: SelectInputProps<T>) {
    return (
        <ToolboxInput label={props.label}>
            <select
                value={props.value}
                onChange={(e) => props.onChange(e.target.value as T)}
            >
                {props.options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </ToolboxInput>
    );
}

export default SelectInput;
