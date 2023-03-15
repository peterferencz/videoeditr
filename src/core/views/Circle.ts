import { Vector2 } from '../Vector2'
import { View } from '../View'
import { lerp, easeQuad } from '../Math'
import { Color } from '../Color'

export class Circle implements View{
    position: Vector2
    radius:number
    color:Color
    
    constructor(position: Vector2, radius:number, color:Color){
        this.position = position
        this.radius = radius
        this.color = color
    }
    
    draw(ctx:CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color.toString()
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI)
        ctx.fill()
    }
    
}