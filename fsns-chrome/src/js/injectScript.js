var s = document.createElement('script');
s.src = chrome.extension.getURL("src/js/addFeature.js");
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(s);

//<link rel="stylesheet" href="//familysearch.org/hf/hf.css">
var l = document.createElement('link');
l.href = chrome.extension.getURL("src/js/addFeature.css");
l.rel = "stylesheet";
l.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(l);
