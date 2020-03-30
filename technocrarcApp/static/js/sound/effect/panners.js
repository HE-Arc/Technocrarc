// TODO : check setter

export class PannerOption {

    constructor(coneOuterGain, coneOuterAngle, coneInnerAngle, position, orientation) {
        this.coneOuterGain = coneOuterGain
        this.coneOuterAngle = coneOuterAngle
        this.coneInnerAngle = coneInnerAngle
        this.position = position
        this.orientation = orientation
    }

    static get options() {
        // TODO : position, orientation
        return {
            coneOuterGain: {
                type: 'number',
                range: [0, 1]
            },
            coneOuterAngle: {
                type: 'number',
                range: [0, 360]
            },
            coneInnerAngle: {
                type: 'number',
                range: [0, 360]
            }
        }
    }

    get coneOuterGain() {
        return this._coneOuterGain
    }

    get coneOuterAngle() {
        return this._coneOuterAngle
    }

    get coneInnerAngle() {
        return this._coneInnerAngle
    }

    get orientation() {
        return this._orientation
    }

    get position() {
        return this._position
    }

    set coneOuterGain(coneOuterGain) {
        this._coneOuterGain = coneOuterGain
    }

    set coneOuterAngle(coneOuterAngle) {
        this._coneOuterAngle = coneOuterAngle
    }

    set coneInnerAngle(coneInnerAngle) {
        this._coneInnerAngle = coneInnerAngle
    }

    set position(position) {
        this._position = position
    }

    set orientation(orientation) {
        this._orientation = orientation
    }

}

export class Position{

    constructor(x, y, z){
        this.x = x
        this.y = y
        this.z = y
    }

    get x(){
        return this._x
    }

    get y(){
        return this._y
    }

    get z(){
        return this._z
    }

    set x(x){
        this._x = x
    }

    set y(y){
        this._y = y
    }

    set z(z){
        this._z = z
    }

}

export class Orientation extends Position{

    get x(){
        return this._x
    }

    get y(){
        return this._y
    }

    get z(){
        return this._z
    }

    set x(x){
        this._x = Math.cos(x)
    }

    set y(y){
        this._y = -Math.sin(y)
    }

    set z(z){
        this._z = 1 // TODO : find formula
    }

}