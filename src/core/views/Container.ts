import { Color } from '../Color'
import { Vector2 } from '../Vector2'
import { View } from '../View'

export class Container implements View{
    position: Vector2
    dimension: Vector2
    background:Color
    #views:View[]
    
    constructor(position:Vector2, dimension:Vector2, background:Color, ...views:View[]){
        this.position = position
        this.dimension = dimension
        this.background = background
        this.#views = views
    }

    addView(view:View){
        this.#views.push(view)
    }

    clearViews(){
        this.#views = []
    }
    
    draw(ctx:CanvasRenderingContext2D): void {
        ctx.fillStyle = this.background.toString()
        ctx.fillRect(this.position.x, this.position.y, this.dimension.x, this.dimension.y)
        ctx.save()
        ctx.translate(this.position.x, this.position.y)
        for (let i = 0; i < this.#views.length; i++) {
            const view = this.#views[i]
            view.draw(ctx)
        }

        ctx.restore()
    }
    
}