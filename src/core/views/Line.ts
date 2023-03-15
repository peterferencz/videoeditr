import { Vector2 } from '../Vector2'
import { View } from '../View'
import { Color } from '../Color'

export class Line implements View{
    from: Vector2
    to: Vector2
    width:number
    color:Color
    
    constructor(from:Vector2, to:Vector2, width:number, color:Color){
        this.from = from
        this.to = to
        this.width = width
        this.color = color
    }
    
    draw(ctx:CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.color.toString()
        ctx.lineWidth = this.width
        ctx.beginPath()
        ctx.moveTo(this.from.x, this.from.y)
        ctx.lineTo(this.to.x, this.to.y)
        ctx.stroke()
    }
    
}