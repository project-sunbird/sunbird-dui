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

    console.log("data in view all",JSON.parse(this.details));
    this.details = JSON.parse(this.details);

  }

  
formatBytes = (bytes)=> {
    if(bytes < 1024) return bytes + " Bytes";
    else if(bytes < 1048576) return(bytes / 1024).toFixed(2) + " KB";
    else if(bytes < 1073741824) return(bytes / 1048576).toFixed(2) + " MB";
    else return(bytes / 1073741824).toFixed(3) + " GB";
};

getRows = () =>{

    var rows = this.details.map((item,i) => {

                
                console.log("item data in getrows",item);

                var temp = {};
                temp['imageUrl'] = item.contentData.appIcon;
                temp['name'] = item.contentData.name;
                temp['progress'];
                temp['footerTitle'] = "20% done";
                temp['actionText'] = "RESUME";
                temp["footerSubTitle"] = item.contentData.contentType + " [" + this.formatBytes(item.contentData.size) + "]";

               
     
         return (<ResourceViewAllCard 
                 data={temp}
                 content={item.contentData}
                 onResourceClick = {this.handleResourceClick}/>)
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
    formatBytes = (bytes)=> {
    if(bytes < 1024) return bytes + " Bytes";
    else if(bytes < 1048576) return(bytes / 1024).toFixed(2) + " KB";
    else if(bytes < 1073741824) return(bytes / 1048576).toFixed(2) + " MB";
    else return(bytes / 1073741824).toFixed(3) + " GB";
};

    handleResourceClick = (content)=>{
      console.log("content -------------->",content);
      window.__runDuiCallback({tag:"StartResourceInfoFlow",contents:{resourceDetails:JSON.stringify(content)}});
        
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
