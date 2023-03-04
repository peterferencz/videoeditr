/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Scene, SceneGenerator } from '../core/Scene'
import './style.scss'
import TimeLine from './timeline'

let currentframe = 0
let totalframes = 0
export let fps = 0

export type setupConfig = {
    resolution: [number,number],
    fps:number,
    scenes:SceneGenerator[],
    background: `#${number}`|'transparent'
}

export function setup(config:setupConfig){
    fps = config.fps
    let _currentframe = 0
    const scenes:(Scene&{from:number,to:number})[] = config.scenes.map(e => {
        const scene:Scene&{from?:number,to?:number} = new Scene(e)
        scene.from = _currentframe
        _currentframe += scene.duration
        scene.to = _currentframe
        return <Scene&{from:number,to:number}>scene
    })
    totalframes = scenes[scenes.length-1].to//scenes.reduce((prev, curr) => prev + curr.duration, 0)

    //#region timeline
    const timeLineElement = document.getElementById('timeline')!
    const timeLineHoverElement = document.getElementById('timelinehover')!
    let _currenttime = 0
    const timeline = new TimeLine(timeLineElement, 
        scenes.map((e, i) => {
            _currenttime += e.duration
            return {from: _currenttime - e.duration, to: _currenttime, text: `Scene ${i+1}`}
        })
        , {
            start:0,
            end:totalframes,
            view:0,
            backgroundTickCount: 10,
            canModifyView:true,
            // minview?:number,
            // maxview?:number
            canModifyOffset:true,
            // minOffset?:number,
            // maxOffset?:number
            showCurrentTime: true,
            currentTime:0,
            // scaleText: (i)=>i,
            onClick: (e)=>{
                const t = Math.round(e.time)
                currentframe = t
                timeline.setTime(t)
                updateToolbar()
            },
        // onViewChange: (val)=>val,
        // onOffsetChange: (val)=>val,
        })
    timeLineElement.addEventListener('mousemove', (e) => {
        timeLineHoverElement.style.left = `${e.clientX}px`
    })
    timeLineElement.addEventListener('mouseenter', () => {
        timeLineHoverElement.style.display = 'block'
    })
    timeLineElement.addEventListener('mouseleave', () => {
        timeLineHoverElement.style.display = 'none'
    })
    //#endregion


    window.addEventListener('keydown', e => {
        console.log(e.key)
        switch (e.key) {
        case 'ArrowLeft':
            currentframe = Math.max(0, currentframe-1)
            break
        case 'ArrowRight':
            currentframe = Math.min(totalframes, currentframe+1)
            break
        default:
            break
        }
        timeline.setTime(currentframe)
        updateToolbar()
    })

    updateToolbar()


}

//#region toolbar
const currentTimeText = document.getElementById('currentTime')!
const currentFrameText = document.getElementById('currentFrame')!
const totalTimeText = document.getElementById('totalTime')!
const totalFrameText = document.getElementById('totalFrame')!
function updateToolbar() {
    currentFrameText.textContent = `[${currentframe}]`
    currentTimeText.textContent = Math.floor(currentframe / fps).toString() //TODO format time 00:00
    totalFrameText.textContent = `[${totalframes}]`
    totalTimeText.textContent = Math.floor(totalframes / fps).toString() //TODO format time 00:00
}
//#endregion