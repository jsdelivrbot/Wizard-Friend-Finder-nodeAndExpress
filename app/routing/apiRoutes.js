// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

var friends = require('../data/friends.js');

module.exports = function (app) {
    //api path to get the friends data, responds with a json object (an array of friends). Activated on both html pages with blue API Link
    app.get('/api/friends', function (req, res) {
        res.json(friends);
    });

    //updates an array of friends
    app.post('/api/friends', function (req, res) {
        //new friend is user that filled survey
        var newFriend = req.body;

        //best match computed
        var bestMatch = {};

        for (i in newFriend.scores[i]) {
            if (newFriend.scores[i] == '1 (Strongly Disagree)') {
                newFriend.scores[i] = 1;
            }
            else if (newFriend.scores[i] == '5 (Strongly Agree)') {
                newFriend.scores[i] = 5;
            }
            else {
                newFriend.scores[i] = parseInt(newFriend.scores[i]);
            }
        }

        //comparison of scores with friend database to find the smallest difference

        //no difference would be the best match
        var bestMatchIndex = 0;
        //greatest score difference for a question is 4, therefore greatest difference is 4 times # of questions in survey
        var bestMatchDifference = 40;

        for (var i = 0; i < friends.length; i++) {
            var totalDifference = 0;

            for (var index = 0; index < friends[i].scores.length; index++) {
                var differenceOneScore = Math.abs(friends[i].scores[index] - newFriend.scores[index]);
                totalDifference += differenceOneScore;
            }

            // if the totalDifference in scores is less than the best match so far
            // save that index and difference
            if (totalDifference < bestMatchDifference) {
                bestMatchIndex = i;
                bestMatchDifference = totalDifference;
            }
        }

        // the best match index is used to get the best match data from the friends index 
        bestMatch = friends[bestMatchIndex];

        // Put new friend from survey in "database" array
        friends.push(newFriend);

        // return the best match friend
        res.json(bestMatch);
    });
}