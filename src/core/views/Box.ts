import { Vector2 } from '../Vector2'
import { view } from '../view'

export class Box implements view{
    position: Vector2
    dimension: Vector2
    foreground:string
    
    constructor(position:Vector2, dimension:Vector2, foreground:string){
        this.position = position
        this.dimension = dimension
        this.foreground = foreground
    }
    
    draw(ctx:CanvasRenderingContext2D): void {
        ctx.fillStyle = this.foreground
        ctx.fillRect(this.position.x, this.position.y, this.dimension.x, this.dimension.y)
    }
    
}