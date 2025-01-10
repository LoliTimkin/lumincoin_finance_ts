export type FormFieldType = {
    name: string,
    id: string,
    element: HTMLElement | null,
    regex: RegExp,
    valid: boolean,
}