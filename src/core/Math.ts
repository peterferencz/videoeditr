export function lerp(from:number,to:number,time:number){
    return from + time * (to - from)
}
export function* lerpGen(from:number,to:number,frames:number):Generator<number,void>{
    for (let i = 0; i < frames+1; i++) {
        yield from +  i / frames * (to-from)
    }
    yield to
}

export function easeQuad(from:number, to:number, time: number): number {
    return from + (time < 0.5 ? 2 * time * time : 1 - Math.pow(-2 * time + 2, 2) / 2) * (to-from)
}
export function* easeQuadGen(from:number, to:number, frames: number) {
    for (let i = 0; i < frames+1; i++) {
        const time = i / frames
        yield from + (time < 0.5 ? 2 * time * time : 1 - Math.pow(-2 * time + 2, 2) / 2) * (to-from)
    }
    yield to
}