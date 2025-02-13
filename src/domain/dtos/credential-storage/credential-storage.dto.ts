export class CredentialStorageDto {
    constructor(
        public readonly account: string,
        public readonly password: string,
        public readonly description: string,
        public readonly code_1: string,
        public readonly code_2: string,
        public readonly securityBoxId: string
    ) {}

    static execute(object: { [key: string]: any }): [string?, CredentialStorageDto?] {
        const { account, password, description, code_1, code_2, securityBoxId } = object;

        if (!account || typeof account !== "string")
            return ["Account is required and must be a string", undefined];
        if (!password || typeof password !== "string")
            return ["Password is required and must be a string", undefined];
        if (!description || typeof description !== "string")
            return ["Description is required and must be a string", undefined];
        if (!code_1 || typeof code_1 !== "string")
            return ["Code 1 is required and must be a string", undefined];
        if (!code_2 || typeof code_2 !== "string")
            return ["Code 2 is required and must be a string", undefined];
        if (!securityBoxId || typeof securityBoxId !== "string")
            return ["Security Box ID is required and must be a string", undefined];

        return [
            undefined,
            new CredentialStorageDto(account, password, description, code_1, code_2, securityBoxId),
        ];
    }
}
