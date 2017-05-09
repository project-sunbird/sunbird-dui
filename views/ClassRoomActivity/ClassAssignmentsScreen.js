var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ListView = require('@juspay/mystique-backend').androidViews.ListView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;
var objectAssign = require('object-assign');

window.R = require("ramda");


var SimpleToolbar = require('../../components/Sunbird/SimpleToolbar');
var ClassListItem = require('../../components/Sunbird/ClassListItem');
var Space = require('@juspay/mystique-backend').androidViews.Space;
var ImageView = require('@juspay/mystique-backend').androidViews.ImageView;

class ClassAssignmentsScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
    this.screenName = "CLASS_ASSIGNMENTS_SCREEN"

    this.menuData={
      url:[
      {title: "hello"}
      ]
    }

    

    this.SubscribedData={
      type: "Subjects",
      values:[
      {color: "#10D50000", imageUrl: "ic_action_search", subject: "Dot Structure", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#F0E9FD",imageUrl: "ic_account", subject: "Hybridization", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#10E3C31C",imageUrl: "ic_action_search", subject: "Bond Line Structure", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#10FF9F00",imageUrl: "ic_action_search", subject: "Counting Electrons", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#10D50000",imageUrl: "ic_action_search", subject: "Dot Structure", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#F0E9FD",imageUrl: "ic_account", subject: "Hybridization", logo1: "ic_action_completed", logo2: "ic_action_share"},
       {color: "#10E3C31C",imageUrl: "ic_action_search", subject: "Dot Structure", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#10FF9F00",imageUrl: "ic_account", subject: "Hybridization", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#10FF9F00",imageUrl: "ic_action_search", subject: "Bond Line Structure", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#F0E9FD",imageUrl: "ic_action_search", subject: "Counting Electrons", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#10D50000",imageUrl: "ic_action_search", subject: "Dot Structure", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#10FF9F00",imageUrl: "ic_account", subject: "Hybridization", logo1: "ic_action_completed", logo2: "ic_action_share"},
     
      ]
    }
    this.AllData={
      type: "Subjects",
      values:[
      {color: "#10D50000",imageUrl: "ic_action_search", subject: "Dot Structure", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#F0E9FD",imageUrl: "ic_account", subject: "Hybridization", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#10E3C31C",imageUrl: "ic_action_search", subject: "Bond Line Structure", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#10E3C31C",imageUrl: "ic_action_search", subject: "Counting Electrons", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#10D50000",imageUrl: "ic_action_search", subject: "Dot Structure", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#F0E9FD",imageUrl: "ic_account", subject: "Hybridization", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#10E3C31C",imageUrl: "ic_action_search", subject: "Dot Structure", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#10E3C31C",imageUrl: "ic_account", subject: "Hybridization", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#10D50000",imageUrl: "ic_action_search", subject: "Bond Line Structure", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#F0E9FD",imageUrl: "ic_action_search", subject: "Counting Electrons", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#10E3C31C",imageUrl: "ic_action_search", subject: "Dot Structure", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#10E3C31C",imageUrl: "ic_account", subject: "Hybridization", logo1: "ic_action_completed", logo2: "ic_action_share"},{imageUrl: "ic_action_search", subject: "Dot Structure", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#10D50000",imageUrl: "ic_account", subject: "Hybridization", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#F0E9FD",imageUrl: "ic_action_search", subject: "Bond Line Structure", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#10E3C31C",imageUrl: "ic_action_search", subject: "Counting Electrons", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#10E3C31C",imageUrl: "ic_action_search", subject: "Dot Structure", logo1: "ic_action_completed", logo2: "ic_action_share"},
      {color: "#F0E9FD",imageUrl: "ic_account", subject: "Hybridization", logo1: "ic_action_completed", logo2: "ic_action_share"},
      ]
    }
    
  }
  
  onHandleBackPress = () => {
      
  }

  onHandleMenuClick = () =>{
    console.log("hello");
  }

  onHandleShareClick = () => {
    console.log("share clicked");
    
  }

  getHeadContent = () =>{

    var layout = (<LinearLayout
            height="45"
            width="match_parent"
            padding="12,12,12,12"
            background={window.__Colors.LIGHT_BLUE_22}>

                <TextView
                  text={"Open (" + Object.keys(this.SubscribedData.values).length + ")"}
                  height="wrap_content"
                  style={window.__TextStyle.textStyle.HINT.DARK}/>            
                <Space
                  width ="0"
                  weight="1"/>

                <TextView
                  text="View All"
                  height="wrap_content"
                  style={window.__TextStyle.textStyle.HINT.BLUE}/>  

            </LinearLayout>)
    return layout;
  }

  getSubjectsContent = () =>{

    var layout = (<LinearLayout
            height="45"
            width="match_parent"
            padding="12,12,12,12"
            background={window.__Colors.LIGHT_BLUE_22}>

                <TextView
                  text={"Downloaded (" + Object.keys(this.AllData.values).length + ")"}
                  height="wrap_content"
                  style={window.__TextStyle.textStyle.HINT.DARK}/>            
                <Space
                  width ="0"
                  weight="1"/>

                <TextView
                  text="View All"
                  height="wrap_content"
                  style={window.__TextStyle.textStyle.HINT.BLUE}/>  

            </LinearLayout>)
    return layout;
  }

  getListContent = (data) =>{
    var layout = (
      <ScrollView 
              height="0"
              weight="1"
              width="match_parent">

              <LinearLayout
                height="match_parent"
                width="match_parent"
                orientation="vertical">

              
            <ClassListItem
              data={data}
              onShareClick={this.onHandleShareClick}
            />

              </LinearLayout>

            </ScrollView>)
    return layout;
  }

  afterRender = () => {

  }


  render() {
    this.layout = (
      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        height="match_parent">
          
          <SimpleToolbar
            title="Assignemnts"
            width="match_parent"
            showMenu="true"
            invert="true"
            menuData={this.menuData}
            onMenuItemClick={this.onHandleMenuClick}
            />

            {this.getHeadContent()}

            {this.getListContent(this.SubscribedData)}

            {this.getSubjectsContent()}

            {this.getListContent(this.AllData)}


      
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(ClassAssignmentsScreen);
