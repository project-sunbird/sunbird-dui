const objectAssign = require('object-assign');
const stringsRes = {
  "en_US" : {
    SIGN_IN : "SIGN IN",
    WELCOME_M1 : "Welcome to Sunbird",
    WELCOME_M2 : "Structured education for the educators"

    
  }
}

var decideString = function(){
  var val = window.__CurrentLanguage;
  var merged = {};
  return objectAssign({},merged,stringsRes["en_US"],stringsRes[val]);
}


var setLanguage = function(lang){
  window.__CurrentLanguage = lang;
  JBridge.setKey("languagePref",lang);
}


exports.setLanguage = setLanguage;
exports.strings = decideString;
