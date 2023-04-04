import { Color } from '../../src/core/Color'
import { paletteManager } from '../../src/core/Palettemanager'
import { Scene, SceneGenerator } from '../../src/core/Scene'
import { all, sequence, waitSeconds } from '../../src/core/Time'
import { Transition } from '../../src/core/Transition'
import { Vector2 } from '../../src/core/Vector2'
import { View } from '../../src/core/View'
import { Line } from '../../src/core/views/Line'
import { Text } from '../../src/core/views/Text'
import { getConfig } from '../../src/front/main'

export type titleOptions = {
    title:string,
    subtitle?:string,
    color?:{
        title?:Color,
        subtitle?:Color
        background?:Color,
        line?:Color
    }
    duration?:{
        outline?: number,
        title?: number,
        subtitle?: number,
        wait?: number
    },
    transition?: ()=>Transition
}
export function title(options:titleOptions):SceneGenerator {
    return function* (scene:Scene) {
        const resolution = getConfig().resolution
        const inset = resolution[1]/20
        const tl = new Vector2(inset, inset)
        const tr = new Vector2(resolution[0] - inset, inset)
        const bl = new Vector2(inset, resolution[1] - inset)
        const br = new Vector2(resolution[0] - inset, resolution[1] - inset)
        const palette = paletteManager.getCurrentPalette()

        const lineTop = new Line(tl.copy(), tl.copy(), 2, options.color?.line || palette.primary)
        const lineLeft = new Line(tl.copy(), tl.copy(), 2, options.color?.line || palette.primary)
        const lineBottom = new Line(bl.copy(), bl.copy(), 2, options.color?.line || palette.primary)
        const lineRight = new Line(tr.copy(), tr.copy(), 2, options.color?.line || palette.primary)
        scene.addViews(lineTop, lineLeft, lineBottom, lineRight)

        yield* all(
            lineTop.to.ease(tr.x, tr.y, (options.duration?.outline || 1)/2),
            lineLeft.to.ease(bl.x, bl.y, (options.duration?.outline || 1)/2),
        )
        yield* all(
            lineBottom.to.ease(br.x, br.y, (options.duration?.outline || 1)/2),
            lineRight.to.ease(br.x, br.y, (options.duration?.outline || 1)/2),
        )

        const title = new Text(new Vector2(resolution[0]/2, resolution[1]/2 - (options.subtitle ? palette.text.size_h3/2 : 0)), options.title, options.color?.title || palette.text.color, {
            size: 1,
            align: 'center',
            family: 'Roboto',
        })
        scene.addViews(title)
        yield* title.typeIn(options.duration?.title || 1)
        
        let subtitle:Text
        if(options.subtitle){
            yield* waitSeconds(.5)
            subtitle = new Text(new Vector2(resolution[0]/2, resolution[1]/2 + 50), options.subtitle, options.color?.title || palette.text.color, {
                size: 3,
                align: 'center',
                family: 'Roboto',
            })
            scene.addViews(subtitle)
            yield* subtitle.typeIn(options.duration?.title || 1)
        }
        yield* waitSeconds(options.duration?.wait || 3)

        yield* all(
            lineTop.from.ease(tr.x, tr.y, (options.duration?.outline || 1)/2),
            lineLeft.from.ease(bl.x, bl.y, (options.duration?.outline || 1)/2),
        )
        if(options.subtitle){
            yield* all(
                title.typeOut((options.duration?.title || 2)/2),
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                subtitle!.typeOut((options.duration?.subtitle || 2)/2),
                sequence(
                    waitSeconds(.3),
                    all(
                        lineBottom.from.ease(br.x, br.y, (options.duration?.outline || 1)/2),
                        lineRight.from.ease(br.x, br.y, (options.duration?.outline || 1)/2),
                    )
                )
            )
        }else{
            yield* all(
                title.typeOut((options.duration?.title || 2)/2),
                sequence(
                    waitSeconds(.3),
                    all(
                        lineBottom.from.ease(br.x, br.y, (options.duration?.outline || 1)/2),
                        lineRight.from.ease(br.x, br.y, (options.duration?.outline || 1)/2),
                    )
                )
            )

        }
        if(options.transition){
            yield options.transition()
        }
    }
}