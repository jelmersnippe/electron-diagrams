import type { ToolboxInputProps } from './Input';
import ToolboxInput from './Input';

type NumberInputProps = ToolboxInputProps<number> & {
    min: number;
    max: number;
    step: number;
};
function NumberInput(props: NumberInputProps) {
    return (
        <ToolboxInput label={props.label}>
            <input
                type="number"
                value={props.value}
                min={props.min}
                max={props.max}
                step={props.step}
                onChange={(e) => props.onChange(parseFloat(e.target.value))}
            />
        </ToolboxInput>
    );
}

export default NumberInput;
