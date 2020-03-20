var sound;

function setUpAllEffects(effects) {
    // TODO : manage error
    for(let effect of effects){
        let func;

        if(effect.hasOwnProperty("class"))
        {
            let obj = new p5[effect.class]()
            func = () => obj[effect.method](sound, ...effect.arguments)
        }
        else
        {
            func = () => sound[effect.method](...effect.arguments)
        }

        sound.addCue(effect.timestamp, func)
    }
}

function fetchEffect(effectId){

    // fetch(`effect/${effectId}`).then((response) => {
    //     response.json().then((json) => {
    //         setUpAllEffects(json.effects)
    //         sound.play()
    //     })
    // })
}

function preload(){
    // TODO : change sound_id

    //sound = loadSound('download/36');
}

function setup() {
    noCanvas()
    fetchEffect(1)
}
