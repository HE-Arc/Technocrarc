
var sound;

function preload()
{
    sound = loadSound('static/media/Chiquitita.wav');
}

function test()
{
    let reverb = {
        class: 'Reverb',
        method: 'process',
        arguments: [3, 2],
        timestamp: 0,
    };

    setEffect(sound, reverb);
}

function playSound()
{
    sound.play();
}

function setup() {
    noCanvas()
    //fetchEffect(1)
}

// Sets the effect to the sound
function setEffect(sound, effect)
{
    // TODO : manage error
    //

    let func;

    // Instantiates a new p5 effect class
    if (effect.hasOwnProperty('class'))
    {
        let obj = new p5[effect.class]();
        func = () => obj[effect.method](sound, ...effect.arguments);
    }
    // No p5 effect class
    else
    {
        func = () => sound[effect.method](...effect.arguments);
    }

    // Adds the effect to the sound at the specific timestamp
    sound.addCue(effect.timestamp, func);
}

function setUpAllEffects(sound, effects)
{
    for (let effect of effects)
    {
        setEffect(sound, effect);
    }
}

function fetchEffect(effectId)
{
    // fetch(`effect/${effectId}`).then((response) => {
    //     response.json().then((json) => {
    //         setUpAllEffects(json.effects)
    //         sound.play()
    //     })
    // })
}
