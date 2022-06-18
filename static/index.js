import observableEventSource from 'observable-event-source';

var url = 'https://stream.wikimedia.org/v2/stream/recentchange';

const o = observableEventSource({
  url: url,
  json: true
})

var searchUsers = []
var client = new MongoClient('mongodb://localhost:27017');
console.log('recently changed npm packages...')
const search = document.getElementById('search')

var updateBuffer = makeDisplayBuffer(16);

filter(o).subscribe(response => {
  console.log(response);
  if (searchUsers.includes(response.user)) {
    var node = document.createTextNode(response.title + '-' + response.user + '\n\n');
    result.prepend(node);
    updateBuffer(node);
  }
})

search.addEventListener('change', (event) => {
  searchUsers = search.value.split('|')
  console.log(searchUsers)
});

function filter(o) {
  o.map(function (response) {
    return response
  })

  return o;
}

function makeDisplayBuffer(size) {
  var buffer = [];
  return function (element) {
    buffer.push(element);
    if (buffer.length > size) {
      var popped = buffer.shift();
      popped.parentNode.removeChild(popped);
    }
  }
}