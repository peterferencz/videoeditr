import { Scene } from './Scene'
import { getConfig } from '../front/main'
import { easeQuadGen } from './Math'
import { getFrames } from './Time'

export type Transition = (from:Scene, to:Scene, ctx:CanvasRenderingContext2D) => Generator<void,unknown>

export function slideoutLeftTransition(time:number):Transition {
    const frames = getFrames(time)
    return function* (from:Scene, to:Scene, ctx:CanvasRenderingContext2D){
        const gen = easeQuadGen(0, -getConfig().resolution[0], frames)
        for(let i = 0; i < frames; i++){
            const val = gen.next().value
            ctx.save()
            ctx.setTransform({e: <number>val})
            from.drawViews(ctx)
            ctx.setTransform({e: <number>val + getConfig().resolution[0]})
            to.drawViews(ctx)
            ctx.restore()
            yield
        }
    }
}
export function slideoutRightTransition(time:number):Transition {
    const frames = getFrames(time)
    return function* (from:Scene, to:Scene, ctx:CanvasRenderingContext2D){
        const gen = easeQuadGen(0, getConfig().resolution[0], frames)
        for(let i = 0; i < frames; i++){
            const val = gen.next().value
            ctx.save()
            ctx.setTransform({e: <number>val})
            from.drawViews(ctx)
            ctx.setTransform({e: <number>val - getConfig().resolution[0]})
            to.drawViews(ctx)
            ctx.restore()
            yield
        }
    }
}
export function slideoutUpTransition(time:number):Transition {
    const frames = getFrames(time)
    return function* (from:Scene, to:Scene, ctx:CanvasRenderingContext2D){
        const gen = easeQuadGen(0, -getConfig().resolution[1], frames)
        for(let i = 0; i < frames; i++){
            const val = gen.next().value
            ctx.save()
            ctx.setTransform({f: <number>val})
            from.drawViews(ctx)
            ctx.setTransform({f: <number>val + getConfig().resolution[1]})
            to.drawViews(ctx)
            ctx.restore()
            yield
        }
    }
}
export function slideoutDownTransition(time:number):Transition {
    const frames = getFrames(time)
    return function* (from:Scene, to:Scene, ctx:CanvasRenderingContext2D){
        const gen = easeQuadGen(0, getConfig().resolution[1], frames)
        for(let i = 0; i < frames; i++){
            const val = gen.next().value
            ctx.save()
            ctx.setTransform({f: <number>val})
            from.drawViews(ctx)
            ctx.setTransform({f: <number>val - getConfig().resolution[1]})
            to.drawViews(ctx)
            ctx.restore()
            yield
        }
    }
}

export function zoomInTransition(time:number):Transition {
    const frames = getFrames(time)
    const w = getConfig().resolution[0]
    const h = getConfig().resolution[1]
    return function* (from:Scene, to:Scene, ctx:CanvasRenderingContext2D){
        const gen = easeQuadGen(0, 1, frames)
        
        for(let i = 0; i < frames; i++){
            const val = gen.next().value
            ctx.save()
            from.drawViews(ctx)
            ctx.setTransform({e: w/2 - <number>val*w/2, f: h/2 - <number>val*h/2, a: <number>val, d: <number>val})
            to.drawViews(ctx)
            ctx.restore()
            yield
        }
    }

}