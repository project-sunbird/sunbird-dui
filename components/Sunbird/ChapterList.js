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
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;

class ChapterItem extends View {
  constructor(props, children) {
    super(props, children);
    this.setUpUI();

  }

  setUpUI = () => {
    switch (this.props.item.type) {
      case "PLAY":
        this.imageIcon = "ic_action_video"
        break;
      case "QUIZ":
        this.imageIcon = "ic_action_quiz"
        break;
      case "ASSIGNMENT":
        this.imageIcon = "ic_action_assignment"
        break;
      default:
        this.imageIcon = "ic_action_video"
        break;
    }

    this.showExtraContent = this.props.enrolledStatus != undefined ? this.props.enrolledStatus : false;
    this.showResumeContent = false;
    this.color = window.__Colors.DARK_GRAY;

    if (this.showExtraContent) {
      switch (this.props.item.status) {

        case "DONE":
          this.imageIcon = "ic_action_completed"
          this.color = window.__Colors.SUCCESS_GREEN;
          break;
        case "PROGRESS":
          this.imageIcon += "_resume"
          this.color = window.__Colors.ORANGE;
          this.showResumeContent = true;
          break;
        case "PENDING":
          this.color = window.__Colors.DARK_GRAY;
          break;

        default:
          this.color = window.__Colors.DARK_GRAY;
          break;
      }
    }

  }
  handleResume = () => {
    this.props._onClick();
  }

  render() {

    this.layout = (

      <LinearLayout
       height="match_parent"
       width="match_parent">


       <LinearLayout
         orientation="vertical"
         gravity="center"
         height="match_parent"
         width="24">
         <ViewWidget 
            width="2"
            height="24"
            background={this.color} />
           <ImageView
            width="24"
            height="24"
            imageUrl={this.imageIcon}
            margin="0,0,0,5"/>
       </LinearLayout>
        
        <TextView
          text={this.props.item.name}
          margin="24,24,0,0"
          width="0"
          weight="1"
          style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>

          <TextView
            visibility={this.showResumeContent?"visible":"gone"}
            text="RESUME"
            margin="24,24,0,0"
            onClick={this.handleResume}
            style={window.__TextStyle.textStyle.TABBAR.SELECTED}/>

        

       </LinearLayout>

    )
    return this.layout.render();
  }

}

class ChapterList extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "chapter_list"
    this.enrolledStatus = this.props.enrolledStatus == undefined ? false : this.props.enrolledStatus;

  }

  getChapterContent = () => {

    var items = this.props.item.chapterContent.map((item) => {
      return (<ChapterItem height="wrap_content"
                width="match_parent"
                _onClick={this.props._onClick}
                enrolledStatus={this.enrolledStatus}
                item={item}/>)
    })



    return (
      <LinearLayout
        height="wrap_content"
        width="match_parent"
        orientation="vertical">
        {items}
      </LinearLayout>);
  }

  render() {
    var chapterName = this.props.item.chapterName;
    chapterName += (this.enrolledStatus ? (" (" + this.props.item.chapterFinished + "/" + this.props.item.chapterContent.length + ")") : " ")

    this.layout = (

      <LinearLayout
       height="match_parent"
       orientation="vertical"
       width="match_parent">
        <TextView
          text={chapterName}
          margin="0,24,0,0"
          style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

          {this.getChapterContent()}  

        

       </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = ChapterList;
