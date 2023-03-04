import { view } from './view'

type Gen = Generator<void|null|Gen>
export type SceneGenerator = (scene:Scene)=>Generator<void|null|Gen,void>

export type SceneType = {
    generator: SceneGenerator
}

export class Scene {
    duration:number
    views:view[]
    
    constructor(fun:SceneGenerator){
        this.duration = 0
        this.views = []

        const generator = fun(this)
        while(!generator.next().done){
            this.duration++
        }
    }

    clearViews(){
        this.views = []
    }

    addView(view:view){
        this.views.push(view)
    }
}