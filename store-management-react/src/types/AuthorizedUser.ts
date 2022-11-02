export class AuthorizedUser {
    isManager: boolean;
    userID: string;
    password: string;

    constructor(isManager: boolean, userID: string, password: string) {
        this.isManager = isManager;
        this.userID = userID;
        this.password = password;
    }

    copy() {
        return new AuthorizedUser(this.isManager, this.userID, this.password);
    }
}