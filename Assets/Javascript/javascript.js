var config = {
    apiKey: "AIzaSyDuXRnY49fHBbzj7r-MLE3FXr3R5CtRGd4",
    authDomain: "trains-a95e0.firebaseapp.com",
    databaseURL: "https://trains-a95e0.firebaseio.com",
    projectId: "trains-a95e0",
    storageBucket: "trains-a95e0.appspot.com",
    messagingSenderId: "268893686428"
};

firebase.initializeApp(config);

var database = firebase.database();
var trainDb = database.ref('trains');

$(document).on('click', '#add-train-btn', function (event) {
    event.preventDefault();

    var trainName = $('#train-name-input').val().trim();
    var trainDest = $('#dest-input').val().trim();
    var startTime = moment($("#start-input").val().trim(), "HH:mm").format('HH:mm');
    var trainFreq = $("#freq-input").val().trim();

    var newTrain = {
        name: trainName,
        dest: trainDest,
        start: startTime,
        freq: trainFreq
    };

    trainDb.push(newTrain);

    console.log(newTrain.name);
    console.log(newTrain.dest);
    console.log(newTrain.start);
    console.log(newTrain.freq);

    $('#train-name-input').val('');
    $('#dest-input').val('');
    $("#start-input").val('');
    $("#freq-input").val('');
});

trainDb.on('child_added', function (snap) {

    console.log(snap.val());

    var trainName = snap.val().name;
    var trainDest = snap.val().dest;
    var startTime = snap.val().start;
    var trainFreq = snap.val().freq;
    var times = calculateNextTime(startTime, trainFreq);

    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(trainFreq),
        $("<td>").text(getTimeFromMins(times[0])),
        $("<td>").text(times[1])
    );

    $("#train-table > tbody").append(newRow);
});

function calculateNextTime(startTime, freq) {
    var currTime = moment().format('HH:mm');
    currTime = moment.duration(currTime).asMinutes();
    var startMins = moment.duration(startTime).asMinutes();
    var freqConverted = parseInt(freq);

    if (freqConverted <= 1440) {
        var timeTable = [];

        //fills array with arrival dates
        while (startMins <= 1440) {
            timeTable.push(startMins);
            startMins += parseInt(freq);
        }

        //finds time closest to current time
        var min = 1000000;
        var minIndex = 0;
        for (let i = 0; i < timeTable.length; i++) {
            var val = parseInt(timeTable[i]) - parseInt(currTime);
            if ((min > (val)) && val >= 0) {
                min = val;
                minIndex = i;
            }
        }
        return [timeTable[minIndex], min];
    } else { //find next arrival time

        var toReturn = startMins + freqConverted - parseInt(currTime)

        var temp = startMins + freqConverted;
        while (temp > 1440) {
            temp -= 1440;
        }

        return [temp, toReturn];
    }
}

function getTimeFromMins(mins) {
    // do not include the first validation check if you want, for example,
    // getTimeFromMins(1530) to equal getTimeFromMins(90) (i.e. mins rollover)
    if (mins >= 24 * 60 || mins < 0) {
        throw new RangeError("Valid input should be greater than or equal to 0 and less than 1440.");
    }
    var h = mins / 60 | 0,
        m = mins % 60 | 0;
    return moment.utc().hours(h).minutes(m).format("hh:mm A");
}