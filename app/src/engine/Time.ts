export class Time {
    lastTime = 0;
    accumulator = 0;

    constructor(public step: number, public maxDt: number) { }

    update(currentTime: number): number {
        let dt = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        if (dt > this.maxDt) dt = this.maxDt;

        this.accumulator += dt;
        // return number of steps to take?
        // Actually simpler to just expose accumulator and let Engine consume it
        return dt;
    }
}
