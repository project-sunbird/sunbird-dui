/*
Copyright (c) 2012-2017 "JUSPAY Technologies"
JUSPAY Technologies Pvt. Ltd. [https://www.juspay.in]

This file is part of JUSPAY Platform.

JUSPAY Platform is free software: you can redistribute it and/or modify
it for only educational purposes under the terms of the GNU Affero General
Public License (GNU AGPL) as published by the Free Software Foundation,
either version 3 of the License, or (at your option) any later version.
For Enterprise/Commerical licenses, contact <info@juspay.in>.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  The end user will
be liable for all damages without limitation, which is caused by the
ABUSE of the LICENSED SOFTWARE and shall INDEMNIFY JUSPAY for such
damages, claims, cost, including reasonable attorney fee claimed on Juspay.
The end user has NO right to claim any indemnification based on its use
of Licensed Software. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/agpl.html>.


*/

var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var Space = require('@juspay/mystique-backend').androidViews.Space;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
window.R = require("ramda");
class SearchResult extends View {
  constructor(props, children) {
    super(props, children);
    console.log(this.props.data);
    
  }
  getData = () => {
    var answerLayout = this.props.data.map((item, index) => {
      var appIcon = item.hasOwnProperty("appIcon") ? item.appIcon : "ic_launcher" ;
     return (<LinearLayout
            width="match_parent"
            height="wrap_content"
            orientation="vertical"
            margin = "16,0,16,0"
            onClick = {()=>{this.handleItemClick(item)}}
            >
              <LinearLayout
                width = "match_parent"
                height = "wrap_content"
              >

              <ImageView
                width="32"
                height="32"
                margin = "10,12,0,12"
                scaleType="fixXY"
                gravity="center"
                circularImageUrl={"0,"+ appIcon }/>

              <LinearLayout
                width = "wrap_content"
                height = "wrap_content"
                orientation = "vertical">
                <LinearLayout
                height = "wrap_content"
                >
                  <TextView
                      height="wrap_content"
                      padding = "10,10,0,0"
                      text= {item.name}
                      style={window.__TextStyle.textStyle.CARD.HEADING}/>
                      <ViewWidget
                          weight="1"
                          height="0"/>
                    <TextView
                      height="wrap_content"
                      padding = "0,10,10,0"
                      text= { item.hasOwnProperty("size") ? this.formatBytes(item.size) : " "}
                      style={window.__TextStyle.textStyle.HINT.SEMI}/>
                </LinearLayout>
                  <TextView
                      height="wrap_content"
                      padding = "10,3,10,10"
                      width = "wrap_content"
                      text= {item.contentType}
                      style={window.__TextStyle.textStyle.HINT.SEMI}/>



              </LinearLayout>

            </LinearLayout>
          <LinearLayout
             width ="match_parent"
             height = "1"
             background = {window.__Colors.DARK_GRAY_44} />
        </LinearLayout>)
    })

    return answerLayout;
  }

  formatBytes = (bytes)=> {
    if(bytes < 1024) return bytes + " Bytes";
    else if(bytes < 1048576) return(bytes / 1024).toFixed(2) + " KB";
    else if(bytes < 1073741824) return(bytes / 1048576).toFixed(2) + " MB";
    else return(bytes / 1073741824).toFixed(3) + " GB";
};



  handleItemClick = (item) =>{
    console.log("clicked item<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<",item);

    var itemDetails = JSON.stringify(item);

    if(item.contentType != "Course" && item.contentType != "Collection"){
     
      var headFooterTitle = item.contentType + (item.hasOwnProperty("size") ? " ["+this.formatBytes(item.size)+"]" : "");      
      var resDetails = {};
      resDetails['imageUrl'] = item.appIcon;
      resDetails['title'] = item.name;
      resDetails['description'] = item.description;
      resDetails['headFooterTitle'] = headFooterTitle;
      resDetails['identifier'] = item.identifier;
      window.__runDuiCallback({tag:"ResourceDetailFlow",contents:{resourceDetails:JSON.stringify(resDetails)}});

    }
    else
    {
      window.__runDuiCallback({tag:"CourseDetailFlow",contents:{courseDetails:itemDetails}});
    }

  }

  

  render() {


    this.layout = (

      <LinearLayout
			width="match_parent"
			height="wrap_content"
			orientation="vertical"
			>
      <ScrollView
          height="match_parent"
          width="match_parent"
          fillViewPort="true">
          <LinearLayout
            height="match_parent"
            width="match_parent"
            orientation="vertical">

                {this.getData()}

          </LinearLayout>
      </ScrollView>

       </LinearLayout>


    )

    return this.layout.render();
  }
}
module.exports = SearchResult;
