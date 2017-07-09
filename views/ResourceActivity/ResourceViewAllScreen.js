
var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;
var objectAssign = require('object-assign');
window.R = require("ramda");
var SimpleToolbar = require('../../components/Sunbird/core/SimpleToolbar');
var CropParagraph = require('../../components/Sunbird/CropParagraph');
var ProgressButton = require('../../components/Sunbird/core/ProgressButton');
var ResourceViewAllCard = require('../../components/Sunbird/ResourceViewAllCard');
var utils = require('../../utils/GenericFunctions');



class ResourceViewAllScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
    ]);
    this.state = state;
    this.screenName = "ResourceViewAllScreen";
      this.menuData = {
      url: [
        { imageUrl: "ic_action_overflow"}
      ]
      }
    this.shouldCacheScreen = false;
    console.log("state in view all",state);
    this.details = JSON.parse(state.data.value0.resourceDetails);
    console.log("this.details",this.details)
    console.log("type",typeof(this.details))
    console.log("data in view all",JSON.parse(this.details));
    this.details = JSON.parse(this.details);
    this.size;
    this.fileImageUrl;
    this.cType;
    this.name;
    this.time;
  }

  

getRows = () =>{

    var rows = this.details.map((item,i) => {

      if(item.contentType != "course"){
              
                if(item.hasOwnProperty("contentData")){
                  this.size = " [" + utils.formatBytes(item.contentData.size) + "]";
                  this.fileImageUrl = "file://"+item.basePath + "/" +item.contentData.appIcon;
                  this.cType = item.contentData.contentType
                  this.name = item.contentData.name;
                  this.time = utils.prettifyDate(item.lastUpdatedTime);
                }
                else{
                   this.size = " [" + utils.formatBytes(item.size) + "]"; 
                   this.fileImageUrl = item.appIcon;
                   this.cType = item.contentType
                   this.name = item.name;
                   var d =  new Date(item.createdOn);
                   this.time = d.getDay() + "-" + d.getMonth()+ "-" + d.getUTCFullYear();
                }




                var temp = {};
                temp['imageUrl'] = this.fileImageUrl;
                temp['name'] = this.name;
                temp['progress'];
                temp['footerTitle'] = this.time;
                temp['actionText'] = "OPEN";
                temp["footerSubTitle"] = this.cType + this.size;

         return (<ResourceViewAllCard 
                 data={temp}
                 content={item}
                 onResourceClick = {this.handleResourceClick}/>)

     }
     else {
         return  (<LinearLayout
                  width ="0"
                  height = "0"/>)
    }

    });

    var layout = (<LinearLayout
                    width="match_parent"
                    height="wrap_content"
                    orientation = "vertical"
                    >

                    {rows}

                  </LinearLayout>);
    return layout;
                    
  }


    handleResourceClick = (item)=>{

      var headFooterTitle = this.cType + (item.hasOwnProperty("size") ? " ["+utils.formatBytes(item.size)+"]" : "");   
      var resDetails = {};
      resDetails['imageUrl'] = this.fileImageUrl;
      resDetails['title'] = this.name;
      resDetails['description'] = item.hasOwnProperty("description") ? item.description : item.contentData.description;
      resDetails['headFooterTitle'] = headFooterTitle;
      resDetails['identifier'] = item.identifier;

      window.__runDuiCallback({tag:"StartResourceInfoFlow",contents:{resourceDetails:JSON.stringify(resDetails)}});

        
    }

  

  
  onPop = () => {
    Android.runInUI(
      this.animateView(),
      null
    );
  }

  afterRender = () => {
   
  }


  getLineSeperator = () =>{
    return (<LinearLayout
            width="match_parent"
            height="1"
            margin="0,16,0,0"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  handleBackPress = () => {
    window.__changePureScriptFlow();
    window.__runDuiCallback({ action: "showMainFlow" });
  }

  render() {
    var buttonList = ["ENROLL FOR THIS COURSE"];
    this.layout = (
      <LinearLayout
        root = "true"
        background={window.__Colors.WHITE}
        orientation="vertical"
        width="match_parent"
        height="match_parent">
        <SimpleToolbar
          afterRender={this.afterRender}
          width="match_parent"
          menuData={this.menuData}
          onBackPress={this.handleBackPress}
          showMenu="true"
          invert="true"
          title= "Saved Resources"/>
          

              <ScrollView
                height="0"
                weight="1"
                width="match_parent"
                fillViewport="true"
                >

                <LinearLayout
                  height="match_parent"
                  width="match_parent"
                  orientation="vertical">

                    {this.getRows()}


                </LinearLayout>

                </ScrollView>

               
       
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(ResourceViewAllScreen);