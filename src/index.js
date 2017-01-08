var Alexa = require('alexa-sdk');
var http = require('http');

var states = {
    SEARCHMODE: '_SEARCHMODE',
    TOPFIVE: '_TOPFIVE',
};

var location = "Las Vegas";

var numberOfResults = 3;

var APIKey = "4844d21f760b47359945751b9f875877";

var welcomeMessage = location + " Guide. You can ask me for an attraction, the local news, or  say help. What will it be?";

var welcomeRepromt = "You can ask me for an attraction, the local news, or  say help. What will it be?";

var locationOverview = "Las Vegas is a West Coast seaport city and the  seat of King County. With an estimated 684,451 residents as of 2015, Las Vegas is the largest city in both the state of Washington and the Pacific Northwest region of North America.";

var HelpMessage = "Here are some things you  can say: Give me an attraction. Tell me about " + location + ". Tell me the top five things to do. Tell me the local news.  What would you like to do?";

var moreInformation = "See your  Alexa app for  more  information."

var tryAgainMessage = "please try again."

var noAttractionErrorMessage = "There was an error finding this attraction, " + tryAgainMessage;

var topFiveMoreInfo = " You can tell me a number for more information. For example open number one.";

var getMoreInfoRepromtMessage = "What number attraction would you like to hear about?";

var getMoreInfoMessage = "OK, " + getMoreInfoRepromtMessage;

var goodbyeMessage = "OK, have a nice time in " + location + ".";

var newsIntroMessage = "These are the " + numberOfResults + " most recent " + location + " headlines, you can read more on your Alexa app. ";

var hearMoreMessage = "Would you like to hear about another top thing that you can do in " + location +"?";

var newline = "\n";

var output = "";

var alexa;

var attractions = [
    { name: "Bellagio and the Fountains", content: "located just 10 minutes north of downtown Las Vegas. The zoo's 92-acres and award-winning exhibits are home to more than 1,000 animals representing 300 species from around the world.", location: "Bellagio is a resort, luxury hotel and casino. One of its most notable features is an 8-acre (3.2 ha) lake between the building and the Strip, which houses the Fountains of Bellagio, a large dancing water fountain synchronized to music.", location: "3600 S Las Vegas Blvd, Las Vegas, NV 89109", contact: "888 987 6667" },
    { name: "Mirage and the Secret Garden", content: "The Mirage is a 3,044 room Polynesian-themed resort and casino resort located on the Las Vegas Strip in Paradise, Nevada, United States. The original marquee sign in front of the Mirage is the largest free standing marquee in the world.", location: "3400 S Las Vegas Blvd, Las Vegas, NV 89109", contact: "702 791 7111" },
    { name: "Red Rock National Conservation Area", content:  "Red Rock Canyon National Conservation Area is an area managed by the Bureau of Land Management and protected as a National Conservation Area. It is located about 15 miles (24 km) west of Las Vegas, and is easily seen from the Las Vegas Strip.", location: "1000 Scenic Loop Dr, Las Vegas, NV 89161", contact: "702 515-5350" },
    { name: "Caesar's Palace", content: "Caesar's Palace is one of the most prestigious casino hotels in the world and one of Las Vegas's largest and best known landmarks. It contains many statues, and columns including a 20-foot (6.1 m) statue of Julius Caesar near the entrance.", location: "3570 S Las Vegas Blvd, Las Vegas, NV 89109", contact: "866 227-5938" },
    { name: "Freemont Street Experience", content: "The Freemont Street Eperience is a pedestrian mall and attraction in Downtown Las Vegas, Nevada. The FSE occupies the westernmost five blocks of Fremont Street, including the area known for years as Glitter Gulch, and portions of some other adjacent streets.", location: "Fremont St, Las Vegas, NV 89101", contact: "702 678 5600" }
];

var topFive = [
    { number: "1", caption: "Visit the Bellagio and see the Fountains of Bellagio.", more: "Bellagio is a resort, luxury hotel and casino. One of its most notable features is an 8-acre (3.2 ha) lake between the building and the Strip, which houses the Fountains of Bellagio, a large dancing water fountain synchronized to music.", location: "3600 S Las Vegas Blvd, Las Vegas, NV 89109", contact: "888 987 6667" },
    { number: "2", caption: "Visit the Mirage and see the Secret Garden and Dolphin Habitat.", more: "The Mirage is a 3,044 room Polynesian-themed resort and casino resort located on the Las Vegas Strip in Paradise, Nevada, United States. The original marquee sign in front of the Mirage is the largest free standing marquee in the world.", location: "3400 S Las Vegas Blvd, Las Vegas, NV 89109", contact: "702 791 7111" },
    { number: "3", caption: "Visit Red Rock National Conservation Area and see the Natural Wonder.", more: "Red Rock Canyon National Conservation Area is an area managed by the Bureau of Land Management and protected as a National Conservation Area. It is located about 15 miles (24 km) west of Las Vegas, and is easily seen from the Las Vegas Strip.", location: "1000 Scenic Loop Dr, Las Vegas, NV 89161", contact: "702 515-5350" },
    { number: "4", caption: "Visit Caesar's Palace and experience life in Roman times .", more: "Caesar's Palace is one of the most prestigious casino hotels in the world and one of Las Vegas's largest and best known landmarks. It contains many statues, and columns including a 20-foot (6.1 m) statue of Julius Caesar near the entrance.", location: "3570 S Las Vegas Blvd, Las Vegas, NV 89109", contact: "866 227-5938" },
    { number: "5", caption: "Visit the Freemont Street Experience and see a free concert.", more: "The Freemont Street Eperience is a pedestrian mall and attraction in Downtown Las Vegas, Nevada. The FSE occupies the westernmost five blocks of Fremont Street, including the area known for years as Glitter Gulch, and portions of some other adjacent streets.", location: "Fremont St, Las Vegas, NV 89101", contact: "702 678 5600" }
];

var topFiveIntro = "Here are the top five things to  do in " + location + ".";

var newSessionHandlers = {
    'LaunchRequest': function () {
        this.handler.state = states.SEARCHMODE;

        output = welcomeMessage;

        this.emit(':ask', output, welcomeRepromt);
    },
    'getAttractionIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getAttractionIntent');
    },
    'getTopFiveIntent': function(){
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getTopFiveIntent');
    },
    'getNewsIntent': function(){
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getNewsIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    }
};

var startSearchHandlers = Alexa.CreateStateHandler(states.SEARCHMODE, {
    'AMAZON.HelpIntent': function () {

        output = HelpMessage;

        this.emit(':ask', output, HelpMessage);
    },

    'getOverview': function () {

        output = locationOverview;

        this.emit(':tellWithCard', output, location, locationOverview);
    },

    'getAttractionIntent': function () {

        var cardTitle = location;
        var cardContent = "";

        var attraction = attractions[Math.floor(Math.random() * attractions.length)];
        if (attraction) {
            output = attraction.name + " " + attraction.content + newline + moreInformation;
            cardTitle = attraction.name;
            cardContent = attraction.content + newline + attraction.contact;

            this.emit(':tellWithCard', output, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage, tryAgainMessage);
        }
    },

    'getTopFiveIntent': function () {

        output = topFiveIntro;

        var cardTitle = "";

        for (var counter = topFive.length - 1; counter >= 0; counter--) {
            output += " Number " + topFive[counter].number + ": " + topFive[counter].caption + newline;
        }

        output += topFiveMoreInfo;

        this.handler.state = states.TOPFIVE;
        this.emit(':askWithCard', output, topFiveMoreInfo, cardTitle, output);
    },

    'AMAZON.YesIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },

    'AMAZON.NoIntent': function () {
        output = HelpMessage;
        this.emit(':ask', HelpMessage, HelpMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'getNewsIntent': function () {
        httpGet(location, function (response) {

            // Parse the response into a JSON object ready to be formatted.
            var responseData = JSON.parse(response);
            var cardContent = "Data provided by New York Times\n\n";

            // Check if we have correct data, If not create an error speech out to try again.
            if (responseData == null) {
                output = "There was a problem with getting data please try again";
            }
            else {
                output = newsIntroMessage;

                // If we have data.
                for (var i = 0; i < responseData.response.docs.length; i++) {

                    if (i < numberOfResults) {
                        // Get the name and description JSON structure.
                        var headline = responseData.response.docs[i].headline.main;
                        var index = i + 1;

                        output += " Headline " + index + ": " + headline + ";";

                        cardContent += " Headline " + index + ".\n";
                        cardContent += headline + ".\n\n";
                    }
                }

                output += " See your Alexa app for more information.";
            }

            var cardTitle = location + " News";

            alexa.emit(':tellWithCard', output, cardTitle, cardContent);
        });
    },

    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },

    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },

    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

var topFiveHandlers = Alexa.CreateStateHandler(states.TOPFIVE, {
    'AMAZON.HelpIntent': function () {

        output = HelpMessage;

        this.emit(':ask', output, HelpMessage);
    },

    'getMoreInfoIntent': function () {
        var slotValue = this.event.request.intent.slots.attraction.value;
        var index = parseInt(slotValue) - 1;

        var selectedAttraction = topFive[index];
        if (selectedAttraction) {

            output = selectedAttraction.caption + ". " + selectedAttraction.more + ". " + hearMoreMessage;
            var cardTitle = selectedAttraction.name;
            var cardContent = selectedAttraction.caption + newline + newline + selectedAttraction.more + newline + newline + selectedAttraction.location + newline + newline + selectedAttraction.contact;

            this.emit(':askWithCard', output, hearMoreMessage, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage);
        }
    },

    'AMAZON.YesIntent': function () {
        output = getMoreInfoMessage;
        alexa.emit(':ask', output, getMoreInfoRepromtMessage);
    },

    'AMAZON.NoIntent': function () {
        output = goodbyeMessage;
        alexa.emit(':tell', output);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'getNewsIntent': function(){
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getNewsIntent');
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
    },

    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

exports.handler = function (event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, startSearchHandlers, topFiveHandlers);
    alexa.execute();
};

// Create a web request and handle the response.
function httpGet(query, callback) {
  console.log("/n QUERY: "+query);

    var options = {
      //http://api.nytimes.com/svc/search/v2/articlesearch.json?q=Las Vegas&sort=newest&api-key=
        host: 'api.nytimes.com',
        path: '/svc/search/v2/articlesearch.json?q=' + encodeURI(query) + '&sort=newest&api-key=' + APIKey,
        method: 'GET'
    };

    var req = http.request(options, (res) => {

        var body = '';

        res.on('data', (d) => {
            body += d;
        });

        res.on('end', function () {
            callback(body);
        });

    });
    req.end();

    req.on('error', (e) => {
        console.error(e);
    });
}

String.prototype.trunc =
      function (n) {
          return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
      };
