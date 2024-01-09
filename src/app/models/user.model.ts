export class User {
    userName: string;
    password: string;
    token: string;

    constructor(options?: Partial<User>) {
        this.userName = options?.userName || '';
        this.password = options?.password || '';
        this.token = options?.token || '';
    }
}