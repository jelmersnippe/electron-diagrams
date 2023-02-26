import type { ToolboxInputProps } from '../../Input';
import ToolboxInput from '../../Input';

type ColorInputProps = ToolboxInputProps<string>;
function ColorInput(props: ColorInputProps) {
    return (
        <ToolboxInput label={props.label}>
            <input
                type="color"
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
            />
        </ToolboxInput>
    );
}

export default ColorInput;
