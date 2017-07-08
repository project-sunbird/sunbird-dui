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
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;


var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;



class CourseProgress extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "completedTextView"
    ]);
    this.displayName = "course_progress"

    var curValue = this.props.content.competedCount;
    var totalValue = this.props.content.totalCount;

    this.percentVal = parseFloat(curValue / totalValue);
    this.percentVal *= 100;

  }

  getProgressStatus = () => {
    return (<LinearLayout
            width="match_parent"
            margin="0,0,0,12">
                <TextView
                  style={window.__TextStyle.textStyle.HINT.REGULAR}
                  text={"Your Progress: "}/>
                <TextView
                  style={window.__TextStyle.textStyle.HINT.REGULAR}
                  id ={this.idSet.completedTextView}
                  text={this.percentVal.toFixed(2)}/>
                <TextView
                  style={window.__TextStyle.textStyle.HINT.REGULAR}
                  text={" %"}/> 
          </LinearLayout>)
  }

  updateProgress = (pStatus) => {
    this.competedCount = pStatus
    var cmd = this.set({
      id: this.idSet.completedTextView,
      text: pStatus
    })
    Android.runInUI(cmd, 0);

  }

  handleResumeClick = () => {
    this.props.onResumeClick();
  }


  getResumeButton = () => {
    return (<LinearLayout
          width="wrap_content"
          height="wrap_content"
          background={window.__Colors.PRIMARY_ACCENT}
          cornerRadius="2"
          gravity="center">
          <TextView 
            width="wrap_content"
            height="wrap_content"
            text="RESUME"
            gravity="center"
            onClick={this.handleResumeClick}
            style={window.__TextStyle.textStyle.TABBAR.WHITE}/>

        </LinearLayout>)
  }



  render() {


    this.layout = (
      <LinearLayout
      width="match_parent"
      gravity="center"
      height="match_parent">

        <LinearLayout
          width="0"
          weight="1"
          height="match_parent"
          orientation="vertical">
            <TextView
              text = {this.props.title||"Course Progress"}
              style= {window.__TextStyle.textStyle.HEADING.DARK}
              margin="0,0,0,8"/>

            {this.getProgressStatus()}

           
         
        </LinearLayout>
        <LinearLayout
          height="match_parent"
          margin="24,0,0,0"
          window="wrap_content"
          gravity="center"> 
           {this.getResumeButton()}
         </LinearLayout>
      </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = CourseProgress;
