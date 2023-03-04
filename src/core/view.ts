import { Vector2 } from './Vector2'

export interface view {
    position:Vector2
    dimension:Vector2
    draw(ctx:CanvasRenderingContext2D):void
}