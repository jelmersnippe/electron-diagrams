import type { PropsWithChildren } from 'react';
export type ToolboxInputProps<T> = {
    label: string;
    value: T;
};
function ToolboxInput({label, children}: PropsWithChildren<{label: string}>) {
    return (
        <div>
            <label>{label}</label>
            <div>{children}</div>
        </div>
    );
}
export default ToolboxInput;
