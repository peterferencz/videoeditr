import { easeQuad, lerp } from '../core/Math'
import { Scene, SceneGenerator } from '../core/Scene'
import { Vector2 } from '../core/Vector2'
import { Arrow } from '../core/views/Arrow'
import { Box } from '../core/views/Box'
import { Circle } from '../core/views/Circle'
import { Container } from '../core/views/Container'
import { Line } from '../core/views/Line'
import { setup } from '../front/main'
import { Text } from '../core/views/Text'
import { waitFrames, sequence, waitSeconds, all } from '../core/Time' 
import { Color } from '../core/Color'
import { slideoutLeftTransition, slideoutRightTransition, slideoutUpTransition, slideoutDownTransition, zoomInTransition } from '../core/Transition'

const resolution:[number,number] = [1920, 1080]

setup({
    resolution: resolution,
    fps:30,
    scenes: [scene1, scene2, scene3],
    background: '#141414',
})

function* scene1(scene:Scene){
    const box = new Box(new Vector2(100, 100), new Vector2(0,0), Color.Aqua)
    scene.addViews(box)
    yield* box.dimension.ease(resolution[0]-200, 100, .5)
    yield* box.dimension.ease(resolution[0]-200, resolution[1]-200, .5)
    yield* all(
        box.position.ease(0,0, .5),
        box.dimension.ease(resolution[0], resolution[1], .5)
    )

    yield zoomInTransition(.5)
}
function* scene2(scene:Scene){
    const box = new Box(new Vector2(0,0), new Vector2(resolution[0], resolution[1]), Color.Peru)
    const text = new Text(new Vector2(resolution[0]/2, resolution[1]/2), 'VideoeditR', {align:'center',family:'roboto',size:100,emphasis:'bold'}, Color.AntiqueWhite)
    scene.addViews(box, text)

    yield* text.typeIn(1)
    yield* waitSeconds(3)
    yield* text.typeOut(1)

    // yield slideoutLeftTransition(.25)
}
function* scene3(scene:Scene){
    const box = new Box(new Vector2(0,0), new Vector2(resolution[0], resolution[1]), Color.PaleGreen)
    const text = new Text(new Vector2(resolution[0]/2, resolution[1]/2), 'Out now', {align:'center',family:'roboto',size:100,emphasis:'bold'}, Color.DeepPink)
    scene.addViews(box, text)
    
    yield* text.typeIn(1)
    yield* waitSeconds(3)
    yield* text.typeOut(1)
}