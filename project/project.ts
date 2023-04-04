import { Scene} from '../src/core/Scene'
import { Vector2 } from '../src/core/Vector2'
import { Box } from '../src/core/views/Box'
import { setup } from '../src/front/main'
import { Text } from '../src/core/views/Text'
import { waitSeconds, all, sequence } from '../src/core/Time' 
import { Color } from '../src/core/Color'
import { zoomInTransition } from '../src/core/Transition'
import { title } from '../premade/screens/title'
import { Line } from '../src/core/views/Line'
import AgaveFont from './agave.ttf'
import { FontLoader } from '../src/core/FontLoader'
import { paletteManager } from '../src/core/Palettemanager'

const resolution:[number,number] = [1920, 1080]
FontLoader.loadFont('agave', AgaveFont)

setup({
    resolution: resolution,
    fps: 30,
    scenes: [title({title:'Hello world!', subtitle:'subtitle'}) , scene1],
    background: '#141414',
})

function* scene1(scene:Scene){
    const heading1 = new Text(new Vector2(100, 150), 'Heading 1', Color.Beige, {size: 1, align: 'left'})
    const heading2 = new Text(new Vector2(100, 250), 'Heading 2', Color.Beige, {size: 2, align: 'left'})
    const heading3 = new Text(new Vector2(100, 350), 'Heading 3', Color.Beige, {size: 3, align: 'left'})
    const heading4 = new Text(new Vector2(100, 450), 'Heading 4', Color.Beige, {size: 4, align: 'left'})
    const heading5 = new Text(new Vector2(100, 550), 'Heading 5', Color.Beige, {size: 5, align: 'left'})
    const heading6 = new Text(new Vector2(100, 650), 'Heading 6', Color.Beige, {size: 6, align: 'left'})
    const paragraph= new Text(new Vector2(100, 750), 'paragraph', Color.Beige, {size: 0, align: 'left'})
    yield* heading1.typeOut(0)
    yield* heading2.typeOut(0)
    yield* heading3.typeOut(0)
    yield* heading4.typeOut(0)
    yield* heading5.typeOut(0)
    yield* heading6.typeOut(0)
    yield* paragraph.typeOut(0)
    scene.addViews(heading1, heading2, heading3, heading4, heading5, heading6, paragraph)

    yield* sequence(
        heading1.typeIn(.5),
        heading2.typeIn(.5),
        heading3.typeIn(.5),
        heading4.typeIn(.5),
        heading5.typeIn(.5),
        heading6.typeIn(.5),
        paragraph.typeIn(.5),
    )
    yield* waitSeconds(2)

    // yield zoomInTransition(.5)
}
// function* scene2(scene:Scene){
//     const line = new Line(new Vector2(resolution[0]/2,0), new Vector2(resolution[0]/2, resolution[1]), 10, Color.Peru)
//     const text = new Text(new Vector2(resolution[0]/2, resolution[1]/2), 'VideoeditR', Color.AntiqueWhite, {align:'right',family:'roboto',size:100,emphasis:'bold'})
//     scene.addViews(text, line)

//     yield* text.typeIn(1)
//     yield* waitSeconds(3)
//     yield* text.typeOut(1)

//     // yield slideoutLeftTransition(.25)
// }
// function* scene3(scene:Scene){
//     const box = new Box(new Vector2(0,0), new Vector2(resolution[0], resolution[1]), Color.PaleGreen)
//     const text = new Text(new Vector2(resolution[0]/2, resolution[1]/2), 'Out now', Color.DeepPink, {align:'center',family:'roboto',size:100,emphasis:'bold'})
//     scene.addViews(box, text)
    
//     yield* text.typeIn(1)
//     yield* waitSeconds(3)
//     yield* text.typeOut(1)
// }