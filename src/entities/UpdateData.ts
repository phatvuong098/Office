
export class UpdateData {
    public username: string = "";
    public x: number = 0;
    public y: number = 0;

    constructor(username: string, x: number, y: number) {
        this.username = username;
        this.x = x;
        this.y = y;
    }
}