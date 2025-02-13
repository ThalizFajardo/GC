export class SecurityBoxDto {
    constructor(
        public name: string,
        public icon: string,
        public favorite: boolean
    ) {}

    static execute(object: { [key: string]: any }): [string?, SecurityBoxDto?] {
        const { name, icon, favorite } = object;

        if (!name || typeof name !== "string")
            return ["Name is required and must be a string", undefined];
        if (!icon || typeof icon !== "string")
            return ["Icon is required and must be a string", undefined];
        if (!favorite || typeof favorite !== "boolean")
            return ["Favorite is required and must be a boolean", undefined];

        return [undefined, new SecurityBoxDto(name, icon, favorite)];
    }
}
