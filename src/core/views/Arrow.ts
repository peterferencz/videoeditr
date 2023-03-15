import { Color } from '../Color'
import { Vector2 } from '../Vector2'
import { View } from '../View'

export class Arrow implements View{
    from: Vector2
    to: Vector2
    thickness:number
    headsize:number
    headangle:number
    color:Color
    

    
    constructor(from: Vector2, to: Vector2, thickness:number, headsize:number, headangle:number, color:Color){
        this.from = from
        this.to = to
        this.thickness = thickness
        this.headsize = headsize
        this.headangle = headangle
        this.color = color
    }
    
    draw(ctx:CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color.toString()
        ctx.strokeStyle = this.color.toString()
        ctx.lineWidth = this.thickness
  
        // line
        ctx.beginPath()
        ctx.moveTo(this.from.x, this.from.y)
        ctx.lineTo(this.to.x, this.to.y)
        ctx.stroke()
  
        // triangle
        const normal = new Vector2(this.from.y - this.to.y, this.to.x - this.from.x).normalize()
        const adj = this.headsize / Math.tan(this.headangle/2)
        ctx.beginPath()
        ctx.moveTo(this.to.x + normal.x*this.headsize, this.to.y + normal.y*this.headsize)
        ctx.lineTo(this.to.x - normal.x*this.headsize, this.to.y - normal.y*this.headsize)
        ctx.lineTo(this.to.x + normal.y * adj, this.to.y - normal.x * adj)
        ctx.fill()
    }
    
}