chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getPageLinks") {
    pageLinks = request.pageLinks;
    buildTable(pageLinks, linkTable);
    message.innerHTML = "<h3>Colected " + pageLinks.length + " links</h3>";
  }
});


function onWindowLoad() {
  var pageLinks = [];
  var message = document.querySelector('#message');
  var linkTable = document.querySelector('#linkTable');
  document.querySelector('#exportBtn').addEventListener('click', exportTable);

  chrome.tabs.executeScript(null, {
    file: "collectLinks.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error with script : \n' + chrome.runtime.lastError.message;
    }
  });
}

function buildTable(links, t) {
  links.forEach(function(link){
    //console.log(link);
    var row = t.insertRow(0);
    var cell = row.insertCell(0);
    cell.innerHTML = link;
  });
}

function exportTable() {
  var csvFile;
  var downloadLink;
  var filename = 'pagelinks.csv';
  csvFile = new Blob([pageLinks.join("\n")], {type: "text/csv"});
  downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
}

window.onload = onWindowLoad;
