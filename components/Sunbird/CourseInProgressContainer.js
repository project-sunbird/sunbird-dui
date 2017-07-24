var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var ProgressBar = require("@juspay/mystique-backend").androidViews.ProgressBar;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var Button = require('../Sunbird/Button');
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var Space = require('@juspay/mystique-backend').androidViews.Space;
var _this;
var CardComponent = require('../Sunbird/core/CardComponent');


class CourseInProgressContainer extends View {
  constructor(props, children) {
    super(props, children);
    _this = this;

    this.setIds([
      "parentContainer",
      "progressContainer",
      "viewAllContainer",
    ]);
    this.displayName = "course_in_progress_container";
    window.__UpdateUserCourses = this.renderContent;

    this.appendAtPosition=0;

  }


  fetchFromServer = () => {
    var whatToSend = {"user_token":window.__userToken,"api_token": window.__apiToken} 
    var event ={ "tag": "API_UserEnrolledCourse", contents: whatToSend};
    window.__runDuiCallback(event);
  }


  renderContent = (data) => {


    var emptyBody =(<LinearLayout
                      height="match_parent"
                      width="match_parent"/>)

    this.replaceChild(this.idSet.parentContainer, emptyBody.render(), 0)

    this.data = data;

    //this.removeAllChildren(this.idSet.parentContainer);

    console.log("GOT DATA-->", data);

     var rows="";

    if(this.data == "" || this.data == undefined){
      rows= (<TextView
              width="match_parent"
              height="50"
              gravity="center"
              text={"No offline resource yet"}
              style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>)

    }else{
       rows = this.data.map((item, index) => {
      //this.appendChild(this.idSet.parentContainer,this.getCardLayouy(item).render(),index)
       return this.getCardLayout(item);
      });

    }
   

       var layout=(<LinearLayout
                    height="wrap_content"
                    width="match_parent">

                    {rows}

                  </LinearLayout>)

    //this.appendChild(this.idSet.parentContainer,this.getHeader().render(),0);
    this.replaceChild(this.idSet.parentContainer,layout.render(),0)

      var cmd = this.set({
        id: this.idSet.viewAllContainer,
        visibility : "gone"
      })
      cmd += this.set({
        id: this.idSet.parentContainer,
        gravity : "center"
      })

      if(this.data == "" || this.data == undefined){
        Android.runInUI(cmd, 0);
      }
      


  }

  formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + " Bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB";
    else return (bytes / 1073741824).toFixed(3) + " GB";
  };

  getCardLayout =(item) => {
     var temp = {
        imageUrl: (item.courseLogoUrl ? item.courseLogoUrl : "file://storage/emulated/0/SunbirdTest/content/domain_8808-64dd60d5-94cd-4896-a60e-11897bf69fd6/domain_8808/1461668536884adb212cfde_1465896981928.jpg"),
        title: item.courseName,
        actionText: "RESUME",
        footerTitle:"60% done",
        footerSubTitle: "20 hrs remaining",
        isProgress : "true"
      };

      return (<CardComponent
                 data={temp}
                 content={item}
                 onCardClick={this.handleCardClick}/>)
  }


  getHeader() {
    return (<LinearLayout
            width="match_parent"
            height="wrap_content"
            margin="16,16,16,16"
            orientation="horizontal">

            <TextView
            width="wrap_content"
            height="wrap_content"
            text={this.props.title}
            style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

            <ViewWidget
            width="0"
            height="0"
            weight="1"/>

            <TextView
            width="wrap_content"
            height="wrap_content"
            text="VIEW ALL"
            id={this.idSet.viewAllContainer}
            onClick={this.handleViewAllClick}
            style={window.__TextStyle.textStyle.TABBAR.SELECTED}/>


            </LinearLayout>)
  }



  handleCardClick = (content, type) => {
    this.props.onCourseClick(content, type);
  }

  handleViewAllClick = () =>{

      var courseListDetails = {
                               "title" : "Courses In Progress",
                               "courseListDetails" : this.data
                              }
      var whatToSend = {"courseListDetails": JSON.stringify(courseListDetails)}
      var event = { tag: "OPEN_CourseViewAllActivity", contents: whatToSend};
      window.__runDuiCallback(event);

  }




  render() {
    this.layout = (
      <LinearLayout
          height="match_parent"
          width="match_parent"
          afterRender={this.fetchFromServer}
          background={this.props.transparent?window.__Colors.WHITE_F2:window.__Colors.WHITE}
          orientation="vertical">

          {this.getHeader()}

          <HorizontalScrollView
           width = "match_parent"
           height = "match_parent"
           scrollBarX="false"
           fillViewport="true">

           <LinearLayout
                    padding="0,0,20,0"
                    id={this.idSet.parentContainer}
                    width="match_parent"
                    root="true"
                    gravity="center"
                    height="match_parent">

         </LinearLayout>

          </HorizontalScrollView>

         </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = CourseInProgressContainer;
