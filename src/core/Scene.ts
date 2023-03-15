import { Transition } from './Transition'
import { View } from './View'

export type Gen = Generator<void|null|Gen>
export type SceneGenerator = (scene:Scene)=>Generator<void|Transition,void>
export type TransitionGenerator = (from: Scene, to: Scene)=> Generator<undefined, void>

export type SceneType = {
    generator: SceneGenerator
}

export class Scene {
    #views:View[]
    generator:SceneGenerator
    
    constructor(fun:SceneGenerator){
        this.#views = []
        this.generator = fun
    }

    clearViews(){
        this.#views = []
    }

    addViews(...view:View[]){
        this.#views.push(...view)
    }

    drawViews(ctx:CanvasRenderingContext2D){
        this.#views.forEach(view => {
            view.draw(ctx)
        })
    }
}

export class WorkingScene{
    from:number
    to:number
    duration:number
    scene:Scene
    transition?:Transition
    transitionDuration?:number

    constructor(scene:Scene, from:number, to:number, transition?:Transition, transitionDuration?:number){
        this.scene = scene
        this.from = from
        this.to = to
        this.duration = to - from
        this.transition = transition
        this.transitionDuration = transitionDuration
    }
}