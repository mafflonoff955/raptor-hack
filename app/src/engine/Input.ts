import { Vec2 } from '../math/Vec2';

export class Input {
    private keys = new Set<string>();

    constructor() {
        if (typeof window !== 'undefined') {
            window.addEventListener('keydown', (e) => this.keys.add(e.code));
            window.addEventListener('keyup', (e) => this.keys.delete(e.code));
        }
    }

    getRawDir(): Vec2 {
        let x = 0;
        let y = 0;
        if (this.keys.has('ArrowUp') || this.keys.has('KeyW')) y -= 1;
        if (this.keys.has('ArrowDown') || this.keys.has('KeyS')) y += 1;
        if (this.keys.has('ArrowLeft') || this.keys.has('KeyA')) x -= 1;
        if (this.keys.has('ArrowRight') || this.keys.has('KeyD')) x += 1;

        const v = new Vec2(x, y);
        return v.mag() > 0 ? v.normalize() : v;
    }
}
