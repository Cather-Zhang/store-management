export class GPS {
    longitude: number;
    latitude: number;

    constructor(longitude: number, latitude: number) {
        this.longitude = longitude;
        this.latitude = latitude;
    }

    copy() {
        return new GPS(this.longitude, this.latitude);
    }
}