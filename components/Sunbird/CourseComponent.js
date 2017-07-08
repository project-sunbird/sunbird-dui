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
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var Space = require('@juspay/mystique-backend').androidViews.Space;

var SearchToolbar = require('../Sunbird/core/SearchToolbar');
var SimpleToolbar = require('../Sunbird/core/SimpleToolbar');

var CourseContainer = require('../Sunbird/CourseContainer');
var _this;
class CourseComponent extends View {
  constructor(props, children) {
    super(props, children);

    this.props.appendText = this.props.appendText || "";
    this.setIds([
      "parentContainer",
      "infoContainer",
      "viewallContainer"
    ]);
    _this = this;

    this.myCommunitySelected = "";
    this.popularCommunitySelected = "";
    this.recommendedCommunitySelected = "";

    this.menuData = {
      url: [
        { imageUrl: "ic_notification_red" },
        { imageUrl: "ic_action_search" }
      ]
    }



    this.progressData = [{
      imageUrl: "https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg",
      type: "COURSE",
      title: "Organic Chemistry",
      footerTitle: "30% done",
      footerSubTitle: "(1350) votes",
      actionText: "RESUME",
      isProgress: "true",
    }, {
      imageUrl: "https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg",
      type: "COURSE",
      title: "Chemical Chemistry",
      footerTitle: "60% done",
      footerSubTitle: "(2350) votes",
      actionText: "RESUME",
      isProgress: "true",
    }];

    this.data = [{
      imageUrl: "https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg",
      type: "COURSE",
      title: "Organic Chemistry for Std VII",
      footerSubTitle: "(2350) votes",
      stars: "4",
      actionText: "OPEN",
    }, {
      imageUrl: "https://www.arborday.org/images/hero/medium/hero-green-leaves-in-sunlight.jpg",
      type: "COURSE",
      title: "Physics",
      stars: "4",
      footerSubTitle: "Saved on 10 May ‘17",
      actionText: "OPEN"
    }];


    if (this.props.response) {
      this.details = this.props.response.result.response;
      console.log("SERVER TOLD : ", this.details)
      this.details.sections.map((item) => {
        if (item.index == 2) {
          this.data = [];
          item.contents.map((subContents) => {
            console.log("SERVER TOLD : ", subContents)

            var tmp = {
              imageUrl: subContents.appIcon,
              type: subContents.name,
              title: subContents.description,
              footerSubTitle: "(2350) votes",
              stars: "4",
              actionText: subContents.status,
            }
            this.data.push(tmp)
          })

        }
      })
    } else {
      console.log("SERVER TOLD NOthing ")
    }

  }


  handleCourseClick = (content, type) => {
    //console.log("content is", content);
    //console.log("type is", type);
    //console.log("data is", tmp);

    var tmp = JSON.stringify(content)
    var eventAction = { tag: 'StartCourseInfoFlow', contents: { "course": tmp } }
      //var eventAction = { tag: 'StartEnrolledCourseFlow', contents: { "course": tmp } }


    window.__runDuiCallback(eventAction);


  }


  getBody = () => {
    return (
      <LinearLayout
        orientation="vertical"
        width="match_parent"
        id={this.idSet.parentContainer}
        height="match_parent">

          <SimpleToolbar
            title=""
            width="match_parent"
            showMenu="true"
            invert="true" 
            hideBack="true" 
            menuData={this.menuData}
            onMenuItemClick={this.handleMenuClick}/>


            <ScrollView
              height="0"
              weight="1"
              width="match_parent">

                <LinearLayout
                  height="match_parent"
                  width="match_parent"
                  background={window.__Colors.WHITE}
                  orientation="vertical">

                  
                  <CourseContainer
                    transparent="true"
                    isViewAllExist="true"
                    title="Courses In Progress"
                    onCourseClick={this.handleCourseClick}
                    data = {this.progressData} />
                   

                  {this.getSpaceSeparator()}

                  <CourseContainer
                    title="Popular"
                    data = {this.data}
                    onCourseClick={this.handleCourseClick}/>
                    

                  {this.getSpaceSeparator()}

                  <CourseContainer
                    title="Recommended"
                    data = {this.data}
                    onCourseClick={this.handleCourseClick}/>

                </LinearLayout>

           </ScrollView>
           </LinearLayout>
    )
  }

  handleMenuClick = (url) => {
    console.log("url clicked", url);
    if (url == "ic_notification_red") {
      window.__runDuiCallback({ tag: "StartNotificationFlow", contents: [] });
    }
    if(url=="ic_action_search"){
        var searchDetails = {filterDetails: "",searchType: "Course"}
      window.__runDuiCallback({tag:"StartSearchFlow",contents:{filterDetails:JSON.stringify(searchDetails)}});
        // window.__runDuiCallback({tag:"StartSearchFlow",contents:{filterDetails:""}});

    }
  }

  handleSearch = (data) => {
    console.log("searched", data);
  }




  getSpaceSeparator = () => {
    return (<LinearLayout
             height="6"
             orientation="vertical"
             width="match_parent"
             background={window.__Colors.WHITE_F2}/>)
  }

  afterRender() {}


  render() {
    this.layout = (

      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        afterRender={this.afterRender}
        height="match_parent">

        {this.getBody()}
        

        </LinearLayout>
    )

    return this.layout.render();
  }
}



module.exports = CourseComponent;
