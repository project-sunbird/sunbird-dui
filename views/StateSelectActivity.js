var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var debounce = require("debounce");
var objectAssign = require('object-assign');


var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var EditText = require("@juspay/mystique-backend/src/android_views/EditText");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ListView = require("@juspay/mystique-backend/src/android_views/ListView");

var Styles = require("../res/Styles");
const Str = require("../res/Strings") ;


class StateSelectActivity extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
      "listView",
    ]);
    this.shouldCacheScreen = false;
    this.screenName = "StateSelectActivity";
    this.jsonArray=[];
    this.stateList = [
      {
      "name" : "Andhra Pradesh",
      "language" : "en_US"
    },
    {
      "name" : "Maharashtra",
      "language" : "hi_IN"
    },
    {
      "name" : "Tamil Nadu",
      "language" : "ta_IN"
    },
  ];
}
  goToUserActivity=(index)=>{ 
     if(this.stateList.length>index&&this.stateList[index].hasOwnProperty("language")){
       this.handleChangeLang(this.stateList[index].language);
      }
      var whatToSend = []
      var event = { tag: "OPEN_UserActivityFromStateSelection", contents: whatToSend}
      window.__runDuiCallback(event);
  }
  handleChangeLang = (lang) => {
    if(lang==undefined||lang==""){
      lang="en_US"
    }
    console.log("handleChangeLang");
    window.__LoaderDialog.show()
     window.setLanguage(lang);
     window.__S = Str.strings();
     window.__LanguagePopup.hide();
    //  window.__renderBNavBar(4);
     window.__reRender();
  }
  handleBackClick=()=>{
    var whatToSend = []
    var event = { tag: "BACK_StateSelectActivity", contents: whatToSend}
    window.__runDuiCallback(event);
  }
  getHeader=()=>{
    return(
      <LinearLayout
       height="wrap_content"
       width="match_parent"
       padding="0,0,0,2"
       background={window.__Colors.PRIMARY_BLACK_22}>
        <LinearLayout
          width="match_parent"
          height="wrap_content"
          alignParentTop="true,-1"
          background={window.__Colors.WHITE}>
          <ImageView
            margin="0,0,10,0"
            style={Styles.Params.IconStyle}
            onClick={this.handleBackClick}
            allowMultipleClicks="true"
            imageUrl = {"ic_action_arrow_left"}/>
       </LinearLayout>
      </LinearLayout>
    );
  }

  getStateList = () =>{
    this.jsonArray=[];
    var layout="";
    try{
      this.stateList.map((item,index)=>{
      layout = (
      <LinearLayout
      width="match_parent"
      height="wrap_content"
      onClick={()=>this.goToUserActivity(index)}
      orientation="horizontal"
      padding="10,10,10,10">
      <ImageView
        width="50"
        height="50"
        circularImageUrl={"0,"+"ic_launcher"}/>
      <TextView
        width="wrap_content"
        height="match_parent"
        padding="10,5,0,5"
        gravity="center_vertical"
        text={item.name}/>
      </LinearLayout>
      );
        this.jsonArray.push({ view: this.getView(layout.render()),value:"",viewType:0});
      });
      JBridge.listViewAdapter(
        this.idSet.listView,
        JSON.stringify(this.jsonArray),
        1000,
        null,
        "",
        "",
        2
      );
    }catch(e){
      console.log("State list rendering failed  due to + :"+e);
    }
  }

  afterRender = () => {
    console.log("after render in state select activity");
    this.getStateList();
  }

  render(){
    this.layout=(
    <LinearLayout
    root="true"
    clickable="true"
    width="match_parent"
    height="match_parent"
    background={window.__Colors.WHITE}
    orientation="vertical">
    {this.getHeader()}
    <ListView
    width="match_parent"
    height="wrap_content"
    id={this.idSet.listView}/>
  </LinearLayout>
  );
  return this.layout.render();  
      
  }
}

module.exports = Connector(StateSelectActivity);


