class AuthorizedUser{
    role: string;
    userID: string;
    password: string;

    constructor(role: string, userID: string, password: string){
        this.role = role;
        this.userID = userID;
        this.password = password;
    }
}