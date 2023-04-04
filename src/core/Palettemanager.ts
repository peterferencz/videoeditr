import { Color } from './Color'

export type Palette = {
    text:{
        font:string,
        color:Color,
        align:'left'|'center'|'right',
        size_h1:number,
        size_h2:number,
        size_h3:number,
        size_h4:number,
        size_h5:number,
        size_h6:number,
        size_p:number
    }
    background:Color,
    primary:Color
}

const defaultPalette:Palette = {
    text: {
        color: Color.White,
        font: 'agave',
        align: 'center',
        size_h1:100,
        size_h2:90,
        size_h3:80,
        size_h4:70,
        size_h5:60,
        size_h6:50,
        size_p:30
    },
    background: new Color(20,20,20,1),
    primary: Color.LightGreen
}

class PaletteManager{
    currentPalette:Palette = defaultPalette

    getCurrentPalette(){
        return this.currentPalette
    }

    setCurrentPalette(palette:Palette){
        this.currentPalette = palette
    }
}

const paletteManager = new PaletteManager()
paletteManager.setCurrentPalette(defaultPalette)
export { paletteManager }