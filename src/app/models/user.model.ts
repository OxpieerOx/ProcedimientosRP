export class User {
    username: string;
    password: string;
    token: string;

    constructor(options?: Partial<User>) {
        this.username = options?.username || '';
        this.password = options?.password || '';
        this.token = options?.token || '';
    }
}