export class PinDto {
    constructor(
        public code: string,
        public userId: string
    ) {}

    static execute(object: { [key: string]: any }): [string?, PinDto?] {
        const { code, userId } = object;

        if (!code || typeof code !== "string") {
            return ["Code is required and must be a string", undefined];
        }
        if (!userId || typeof userId !== "string") {
            return ["User ID is required and must be a string", undefined];
        }

        return [undefined, new PinDto(code, userId)];
    }
}
