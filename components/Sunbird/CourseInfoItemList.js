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
var ProgressBar = require("@juspay/mystique-backend").androidViews.ProgressBar;

var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

class CourseInfoItem extends View {
  constructor(props, children, state) {
    super(props, children);
  }

  handleItemClick = () => {
    this.props.onItemClick(this.props.item);
  }


  getProgressStatus = () => {
    return (<LinearLayout
            width="match_parent">
                <TextView
                  style={window.__TextStyle.textStyle.HINT.SEMI}
                  text={"Your Progress: "}/>
                <TextView
                  style={window.__TextStyle.textStyle.HINT.SEMI}
                  text={this.props.item.competedCount}/>
                <TextView
                  style={window.__TextStyle.textStyle.HINT.SEMI}
                  text={" / "}/>  
                 <TextView
                  style={window.__TextStyle.textStyle.HINT.SEMI}
                  text={this.props.item.totalCount}/> 
          </LinearLayout>)
  }

  getRemainingStatus = () => {
    if (parseInt(this.props.item.remainingTime) > 60) {
      return (parseInt(parseInt(this.props.item.remainingTime) / 60) + " hours of coursework remainig")
    } else {
      return (this.props.item.remainingTime + " more minutes and you’re done!")
    }
  }


  getCardContent = () => {
    var timeRemainingStatus = this.getRemainingStatus();

    return (<LinearLayout
              height="match_parent"
              width="0"
              weight="1"
              padding="16,16,32,16"
              orientation="vertical">
              <TextView
                  width="match_parent"
                  style={window.__TextStyle.textStyle.CARD.HEADING}
                  text={this.props.item.courseName}/>
              
              {this.getProgressStatus()} 

               <ViewWidget
                width="1"
                height="0"
                weight="1"/>

             
              <TextView
                  width="match_parent"
                  style={window.__TextStyle.textStyle.HINT.BLUE}
                  text={timeRemainingStatus}/>  


           </LinearLayout>)
  }


  render() {
    var cardContent = this.getCardContent();

    this.layout = (
      <LinearLayout
      width="match_parent"
      cornerRadius="2"
      height="100"
      margin="0,8,0,8"
      background={window.__Colors.WHITE}>
        <LinearLayout
          height="match_parent"
          width="match_parent"
          onClick={this.handleItemClick}>

          <LinearLayout
            width="100"
            height="100"
            background = {this.props.item.courseBackground? this.props.item.courseBackground : "#229012FE" }
            orientation="vertical"
            gravity="center">
                  <ImageView
                    height="50"
                    width="50"
                    imageUrl={this.props.item.courseImage ? this.props.item.courseImage : "ic_account"}/> 
           </LinearLayout>

           {cardContent}

         </LinearLayout>
       </LinearLayout>
    )

    return this.layout.render();
  }
}

class CourseInfoItemList extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      "courseContainer",
    ]);


  }


  afterRender = () => {
    var dataList = [];

    this.props.data.map((item) => {
      console.log("------>", item)

      var dumData
      dumData = {
        courseName: item.name,
        competedCount: item.progress,
        courseDesc: item.description,
        courseId: item.courseId,
        totalCount: "150",
        courseBackground: "#229012FE",
        remainingTime: "120",
        courseImage: "ic_percent_black"
      }

      dataList.push(dumData);
    })


    // for (var i = 0; i < 15; i++) {
    //   var dumData
    //   if (i % 3 == 0) {
    //     dumData = {
    //       courseName: "Advanced Level Arithmetic",
    //       competedCount: "124",
    //       totalCount: "150",
    //       courseBackground: "#229012FE",
    //       remainingTime: "120",
    //       courseImage: "ic_percent_black"
    //     }
    //   } else if (i % 3 == 1) {
    //     dumData = {
    //       courseName: "Introduction to Magnetism",
    //       competedCount: "76",
    //       totalCount: "90",
    //       courseBackground: "#22FF9F00",
    //       remainingTime: "24",
    //       courseImage: "ic_magnet_black"
    //     }
    //   } else {
    //     dumData = {
    //       courseName: "Deep-diving in Nuclear Physics",
    //       competedCount: "76",
    //       totalCount: "90",
    //       courseBackground: "#227ED321",
    //       courseImage: "ic_nucleus_black"
    //     }
    //   }

    //   dataList.push(dumData);
    // }
    var cards = dataList.map((item) => {
      return (<CourseInfoItem
            width="match_parent"
            height="match_parent"
            onItemClick={this.handleCourseItemClick}
            item={item}/>)
    })
    if (this.props.data == undefined || this.props.data == "TESTING") {
      cards = (<ProgressBar
            height="70"
            width="70"/>);
    }

    var cardLayout = (
      <LinearLayout
          orientation="vertical"
          height="match_parent"
          root="true"
          width="match_parent">
          
            {cards}
          
          </LinearLayout>
    )
    this.replaceChild(this.idSet.courseContainer, cardLayout.render(), 0);

  }


  handleCourseItemClick = (data) => {
    this.props.onItemSelected(data);
  }


  render() {


    this.layout = (
      <LinearLayout
      width="match_parent"
      height="match_parent"
      afterRender={this.afterRender}
      id={this.idSet.courseContainer}
      />
    )

    return this.layout.render();
  }
}

module.exports = CourseInfoItemList;
