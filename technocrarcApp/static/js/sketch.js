
/*
    FIXME: temporary testing
 */
var sound;

// To call from console to play the sound
function playSound()
{
    sound.play();
}

// Test form at /p5
document.querySelector('#test-form').addEventListener('submit', (evt) =>
{
    evt.preventDefault();
    let effect = parseEffectForm(evt.target);
    setEffect(sound, effect);

    // Call playSound() from console
});
/*
    END temporary testing
 */

function preload()
{
    //FIXME: temporary testing
    sound = loadSound('static/media/Chiquitita.wav');
}

function setup()
{
    noCanvas()
    //fetchEffect(1)
}

// Sets the effect to the sound
function setEffect(sound, effect)
{
    // TODO : manage error

    let func;

    // Instantiates a new p5 effect class
    if (effect.class != null)
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

// Parses the given form in order to create a sound effect
function parseEffectForm(form)
{
    let _class = form.getAttribute('data-class');
    let method = form.getAttribute('data-method');

    let timestamp = form.querySelector('input.timestamp').value;

    let argumentsInputs = form.querySelectorAll('input.argument');
    let arguments = [];
    // Number of arguments is variable
    for (let i = 0; i < argumentsInputs.length; i++)
    {
        let val = argumentsInputs[i].value;
        arguments.push(val);
    }

    return {
        class: _class,
        method: method,
        arguments: arguments,
        timestamp: timestamp,
    };
}
