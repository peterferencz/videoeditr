import { Color } from '../Color'
import { Vector2 } from '../Vector2'
import { View } from '../View'

export class Box implements View{
    position: Vector2
    dimension: Vector2
    foreground:Color
    
    constructor(position:Vector2, dimension:Vector2, foreground:Color){
        this.position = position
        this.dimension = dimension
        this.foreground = foreground
    }
    
    draw(ctx:CanvasRenderingContext2D): void {
        ctx.fillStyle = this.foreground.toString()
        ctx.fillRect(this.position.x, this.position.y, this.dimension.x, this.dimension.y)
    }
    
}