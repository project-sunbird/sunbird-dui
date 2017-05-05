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
var ListComponent = require('../../components/Sunbird/ListComponent');
var Space = require('@juspay/mystique-backend').androidViews.Space;
var ImageView = require('@juspay/mystique-backend').androidViews.ImageView;

class ClassSubjectsScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
    this.screenName = "CLASS_SUBJECTS_SCREEN"

    this.menuData={
      url:[
      {imageUrl: "ic_action_search",title: "hello"}
      ]
    }

    

    this.SubscribedData={
      type: "Subjects",
      values:[
      {imageUrl: "ic_action_search", subject: "Physics", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Chemistry", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", comment: "CBSE Standard vill", logo: "ic_action_completed"},
      ]
    }

    this.AllData={
      values:[
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Chemistry", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Chemistry", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Chemistry", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Chemistry", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Chemistry", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Chemistry", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Chemistry", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Chemistry", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Chemistry", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Chemistry", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Chemistry", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Chemistry", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Chemistry", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Chemistry", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Chemistry", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Chemistry", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Chemistry", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Chemistry", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Chemistry", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Moral Sciences", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Chemistry", logo: "ic_action_close"},
      {imageUrl: "ic_action_search", subject: "Geography", logo: "ic_action_close"},
      ]
    }
  }
  
  onHandleBackPress = () => {
      
  }

  getHeadContent = () =>{

    var layout = (<LinearLayout
            height="45"
            width="match_parent"
            padding="12,12,12,12"
            background={window.__Colors.LIGHT_BLUE_22}>

                <TextView
                  text={"Sunscribed (" + Object.keys(this.SubscribedData.values).length + ")"}
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
                  text={"All Subjects (" + Object.keys(this.AllData.values).length + ")"}
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
            title="Subjects"
            width="match_parent"
            showMenu="true"
            invert="true"
            menuData={this.menuData}
            
            />



            {this.getHeadContent()}

            <ScrollView 
              height="0"
              weight="1"
              width="match_parent">

              <LinearLayout
                height="match_parent"
                width="match_parent"
                orientation="vertical">

              
            <ListComponent
              data={this.SubscribedData}
            />

              </LinearLayout>

            </ScrollView>

            {this.getSubjectsContent()}

            <ScrollView 
              height="0"
              weight="1"
              width="match_parent">

              <LinearLayout
                height="match_parent"
                width="match_parent"
                orientation="vertical">

                

            <ListComponent
              data={this.AllData}
            />

              </LinearLayout>

            </ScrollView>


      
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(ClassSubjectsScreen);
