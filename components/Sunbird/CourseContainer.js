var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var Button = require('../Sunbird/Button');
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var Space = require('@juspay/mystique-backend').androidViews.Space;
var _this;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var CardComponent = require('../Sunbird/core/CardComponent');
var utils = require('../../utils/GenericFunctions');


class CourseContainer extends View {
  constructor(props, children) {
    super(props, children);
    _this = this;

    this.setIds([
      "courseContainer",
      "parentContainer"]);
  }


  afterRender = () => {
    this.data= this.props.data;
    if(this.data==undefined)
          this.data=[];
        
    var rows = this.data.map((item, i) => {
      return this.geCardLayout(item);

    });

    var layout=(<LinearLayout
        height="wrap_content"
        width="match_parent">

          {rows}

        </LinearLayout>)

    this.appendChild(this.idSet.parentContainer,this.getHeader().render(),0);
    this.replaceChild(this.idSet.courseContainer,layout.render(),0)

    

  


  }

  geCardLayout = (item) => {
    var size = item.hasOwnProperty("size") ? window.__S.FILE_SIZE.format(utils.formatBytes(item.size)) : "";

    var temp = {
        imageUrl: (item.appIcon ? item.appIcon : "ic_action_course"),
        title: item.name,
        actionText: window.__S.OPEN,
        footerTitle : "",
        stars : item.hasOwnProperty("me_averageRating")? item.me_averageRating+ "" : "0",
        footerSubTitle: size,
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
              padding="16,16,16,16"
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
                visibility={this.props.isViewAllExist?"visible":"gone"}
                text={window.__S.VIEW_ALL}
                style={window.__TextStyle.textStyle.TABBAR.SELECTED}/>
            

            </LinearLayout>)
  }



  handleCardClick = (content, type) => {


    var callback = callbackMapper.map(function(data) {

      if (data == "android.permission.WRITE_EXTERNAL_STORAGE") {
        JBridge.setKey("isPermissionSetWriteExternalStorage", "true");
        _this.props.onCourseClick(content, type);

      }
      if(data == "DeniedPermanently"){
        console.log("DENIED DeniedPermanently");
        window.__PermissionDeniedDialog.show("ic_flag_warning","Cannot download content since permission is denied");
      }

    });

    JBridge.setPermissions(callback,"android.permission.WRITE_EXTERNAL_STORAGE");
    
  }


  



  render() {
    this.layout = (
      <LinearLayout
        id={this.idSet.parentContainer}
        height="match_parent"
        width="match_parent"
        background={this.props.transparent?window.__Colors.WHITE_F2:window.__Colors.WHITE}
        root="true"
        orientation="vertical">

      

          <HorizontalScrollView
           width = "wrap_content"
           height = "wrap_content"
           scrollBarX="false"
           fillViewport="true">

           <LinearLayout
            id={this.idSet.courseContainer}
            padding="0,0,16,0"
            height="wrap_content"
            width="match_parent"
            afterRender={this.afterRender}/>
      
          </HorizontalScrollView>

         </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = CourseContainer;
