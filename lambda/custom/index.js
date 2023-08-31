const Alexa = require('ask-sdk-core');

// setting the array with colours
let colours = [
        "red",
        "blue",
        "green",
        "brown",
        "white",
        "azure",
        "orange",
        "yellow",
        "grey",
        "purple",
        "lightblue",
        "fuchsia",
        "maroon",
        "pink",
        "beige",
        "violet",
        "lightgreen",
        "silver",
        "gold",
        "lime",
        "wheat",
        "salmon",
        "chocolate",
        "turquoise",
        "aqua",
        "crimson",
        "navy",
        "orchid",
        "teal"
        ]

// setting the array range
let min = 0
let max = colours.length

// Welcome message string
let welcomeMessage = "Hello and welcome to the lucky colour of the day. "

// Random phrases for the ExtractAgainIntent
let phrases = [
        "That's ok! The next lucky colour is ",
        "OK, I will draw another one. The lucky colour is ",
        "No problem, I have now extracted the colour  ",
        "Here's another one, colour ",
        "Sure, the next colour is "
        ]
        
// Generic function to check interface availability on calling device
function supportsInterface(handlerInput, interfaceName){
    const interfaces = ((((
        handlerInput.requestEnvelope.context || {})
        .System || {})
        .device || {})
        .supportedInterfaces || {});
    return interfaces[interfaceName] !== null && interfaces[interfaceName] !== undefined;
}

// Check for APL Interface availability on calling device
function supportsAPL(handlerInput) {
    return supportsInterface(handlerInput, 'Alexa.Presentation.APL')
}

function getRandomInt(min, max) {
    //The maximum is exclusive and the minimum is inclusive
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; 
  
}

function getRandomExtractionPhrase(extractedNumber, colours) {
    
    let randomPhraseIndex = getRandomInt(0,phrases.length)
    return phrases[randomPhraseIndex] + colours[extractedNumber]
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        
        let speakOutput;
        if (supportsAPL(handlerInput))
        {
            let randomNumber = getRandomInt(min,max)
            speakOutput = welcomeMessage + 'The lucky colour is ' + colours[randomNumber];
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .addDirective({
            type:'Alexa.Presentation.APL.RenderDocument',
            token :'documentToken',
            document: require ('./extraction.json'),
            datasources: {
                    "data": {
                        "colour": colours[randomNumber]
                    }
                },
            })
            .getResponse();
    }

    else

    {
        let randomNumber = getRandomInt(min,max)
        speakOutput = welcomeMessage + 'The lucky colour is ' + colours[randomNumber];
        return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    }

    }
};

const ExtractAgainIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ExtractAgainIntent';
    },
    handle(handlerInput) {
        
        if (supportsAPL(handlerInput))
        {
            let randomNumber = getRandomInt(min,max)
            const speakOutput = getRandomExtractionPhrase(randomNumber, colours);
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .addDirective({
            type:'Alexa.Presentation.APL.RenderDocument',
            token :'documentToken',
            document: require ('./extraction.json'),
            datasources: {
                    "data": {
                        "colour": colours[randomNumber]
                    }
                },
            })
            .getResponse();
    }

    else
    {
        const speakOutput = "Sorry, this skill currently only supports devices with screen"
        return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    }


    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = `Hello, the skill will extract a lucky colour. If you want to extract another colour, say: try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You have just invoked ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, an error occurred. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ExtractAgainIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
