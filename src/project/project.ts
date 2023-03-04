import { Scene, SceneGenerator } from '../core/Scene'
import { Vector2 } from '../core/Vector2'
import { Box } from '../core/views/Box'
import { setup } from '../front/main'
import { waitFrames, waitSeconds } from '../utils/time'

setup({
    resolution: [1920, 1080],
    fps:24,
    scenes: [scene1, scene2],
    background: '#242424'
})

function* scene1(scene:Scene){
    console.log('Frame 1')
    yield
    console.log('Frame 2')
    yield null
    console.log('Frame 2')
    yield
}
function* scene2(scene:Scene){
    const box = new Box(new Vector2(0,0), new Vector2(100,100), 'red')
    scene.addView(box)
    yield* waitFrames(10)
    box.position.move(100, 100)
    yield* waitSeconds(1)
}