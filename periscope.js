/*
	 * © Copyright IBM Corp. 2017, 2018
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at:
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
	 * implied. See the License for the specific language governing
	 * permissions and limitations under the License.
*/
function periscope(){
  //Instead of adding in code, all we need to change is the mapping object
  //which tells the function which stylesheet should be applied onto which
  //page.
  var mappings = {
    //global is special case where the empty array applies to all the pages.
    "global":[],
    "files":["/files/"],
    "meetings":["/meetings/"],
    "profiles":["/profiles/",
                "/mycontacts/",
                "/contacts/"],
    "search":["/search/"],
//    "blogs":["/blogs/"],
//    "activities":["/activities/"],
//    "communities":["/communities/"],
//    "homepage":["/homepage/"],
//   "wikis":["/wikis/"],
    "settings":["/manage/account/user/",
                "/news/web/",
                "/manage/subscribers/showInviteGuestDialog/"]
  };
  //This is the function that applies the style
  var addStyle;
  //We need to determine "how" we will be applying the style.
  if (typeof GM_addStyle == 'undefined' &&
      typeof GM_getResourceText == 'undefined'){
    if(typeof chrome != 'undefined' && chrome.extension){
    //We are in the Chrome Extension so lets use their API.
      console.log('Periscope: using Chrome extension method.');
      addStyle = function(filename){
        var link = document.createElement("link");
        link.href = chrome.extension.getURL('./css/' + filename + '.css');
        link.id = "periscope-"+filename;
        link.type = "text/css";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        return;
      }
    }
    else{
      // We are using Muse so lets do find the relative path to our files.
      console.log('Periscope: using Customizer method.');
      addStyle = function(filename){
        var link = document.createElement("link");
        path = "/files/customizer/css/";
        link.href = path+filename+".css?repoName=periscope";
        link.type = "text/css";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        return;
      }
    }
  }
  else{
    //We are in TM so lets use TamperMonkey API.
    addStyle = function(filename){
      console.log('Periscope: using TamperMonkey method.');
      console.log(filename);
      GM_addStyle(GM_getResourceText(filename));
      return;
    }
  }
  console.log("Periscope: Launching Periscope Styling...");
  Object.keys(mappings).map(function(filename){
    // make sure it's not an error page or a log-in page:
    if ( (!document.URL.includes("error")) && (document.querySelector('#joinBox') == null)) {
      //checking for the empty url matches
      urls = mappings[filename];
      if (!urls.length){
        addStyle(filename);
      }
      //applying the styling to all urls
      else{
        urls.map(function(url){
          if(document.URL.includes(url)){
            console.log(document.URL);
            addStyle(filename);
          }
        });
      }
    }
  });
}
if (!String.prototype.includes) {
  String.prototype.includes = function() {
    'use strict';
    return String.prototype.indexOf.apply(this, arguments) !== -1;
  };
}
console.log('Periscope: periscope.js loaded.');
periscope();
