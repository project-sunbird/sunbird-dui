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



class ResourceContainer extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([]);

  }


  getRows = () => {
      this.data = this.props.data;
      if(this.data==undefined)
          this.data=[];
      var rows = this.data.map((item, i) => {

      var size = item.hasOwnProperty("size") ? " ["+ utils.formatBytes(item.size)+"]" : "";
      var footerTitle = item.contentType + size;


      var temp = {};
      temp['imageUrl'] = item.hasOwnProperty("appIcon")?item.appIcon:"ic_action_resource";
      temp['title'] = item.name;
      temp['footerTitle'] = footerTitle;
      temp['footerSubTitle'] = item.contentType;
      temp['actionText'] = "OPEN";

      return (<CardComponent 
                 data={temp}
                 content={item}
                 onCardClick = {this.handleCardClick}/>)
    });


    var layout = (<LinearLayout
                    width="match_parent"
                    root="true"
                    height="wrap_content">

                    {rows}

                  </LinearLayout>);
    return layout;

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
            weight="1"
            height="0"/>

            <TextView
            width="wrap_content"
            height="wrap_content"
            text="VIEW ALL"
            padding="8,8,8,8"
            onClick={()=>{this.handleViewAllClick()}}
            style={window.__TextStyle.textStyle.TABBAR.SELECTED}/>


            </LinearLayout>)
  }


  handleCourseClick = (courseName) => {
    this.props.onCourseOpenClick(courseName);
  }

  handleCardClick = (item, type) => {

      
       if(item.contentType.toLowerCase() == "course" || item.contentType.toLowerCase() == "collection" || item.contentType.toLowerCase() == "TextBook"){
        
        window.__runDuiCallback({tag:"ResourceCourseInfoFlow",contents:{course:JSON.stringify(item)}});
      }
      else
      {
        var headFooterTitle = item.contentType + (item.hasOwnProperty("size") ? " ["+utils.formatBytes(item.size)+"]" : "");      
        var resDetails = {};
        console.log("ITEM NAME",item.name)
        resDetails['imageUrl'] = item.appIcon;
        resDetails['title'] = item.name;
        resDetails['description'] = item.description;
        resDetails['headFooterTitle'] = headFooterTitle;
        resDetails['identifier'] = item.identifier;
        resDetails['content'] = item;
        window.__runDuiCallback({tag:"StartResourceDetailFlow",contents:{resourceDetails:JSON.stringify(resDetails)}}); 
      }
  }

  handleViewAllClick() {
    this.props.onViewAllClick(this.data,this.props.title);
  }

  render() {
    this.layout = (
      <LinearLayout
          height="match_parent"
          width="match_parent"
          orientation="vertical">

          {this.getHeader()}

          <HorizontalScrollView
           width = "wrap_content"
           height = "wrap_content"
           scrollBarX="false"
           fillViewport="true">

           <LinearLayout
                    padding="0,0,16,0"
                    width="match_parent"
                    height="wrap_content">

           {this.getRows()}

         </LinearLayout>



          </HorizontalScrollView>

         </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = ResourceContainer;
