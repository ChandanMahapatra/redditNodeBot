var Snoocore = require('snoocore');

// Our new instance associated with a single account.
// It takes in various configuration options.
var reddit = new Snoocore({
  userAgent: '/u/username myApp@3.0.0', // unique string identifying the app
  oauth: {
    type: 'script',
    key: '',
    secret: '',
    username: '',
    password: '',
    // The OAuth scopes that we need to make the calls that we
    // want. The reddit documentation will specify which scope
    // is needed for evey call
    scope: [ 'identity', 'read', 'vote' ]
  }
});

reddit('/api/v1/me').get().then(function(result) {
  console.log('/u/' + result.name);
  // get a promise for a listing of /r/askreddit
  return reddit('/r/askreddit/hot').listing();
}).then(function(slice) {
  // Get a promise for the next slice in this
  // listing (the second page!)
  return slice.next();
}).then(function(slice) {
  // This is the second page of /r/askreddit
  console.log(slice);
  var firstSubmission = slice.children[0];

  console.log('upvoting post:');
  console.log(firstSubmission.data.title);
  console.log(firstSubmission.data.url);

  // Let's upvote the first thing on the second page:
  return reddit('/api/vote').post({
    dir: 1, // upvote!
    id: firstSubmission.kind + '_' + firstSubmission.data.id // e.g. t3_345jur
  });
}).then(function() {
  console.log('done! checkout the link to see that it is really upvoted.');
});