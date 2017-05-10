var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require('@juspay/mystique-backend').androidViews.ImageView;
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;
var ViewWidget = require('@juspay/mystique-backend').androidViews.ViewWidget;
var ModulesContainer = require('../../components/Sunbird/ModulesContainer');
var VideoCard = require('../../components/Sunbird/VideoCard');

var objectAssign = require('object-assign');

window.R = require("ramda");


class ClassRoomHomeComponent extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;

    this.dummyData = [{
      moduleData: "Assignments",
      imageUrls: "ic_assignment_module"
    }, {
      moduleData: "Refference Chapters",
      imageUrls: "ic_reference"
    }, {
      moduleData: "Quiz",
      imageUrls: "ic_action_completed"
    }, {
      moduleData: "Tutorial",
      imageUrls: "ic_action_close"
    }, {
      moduleData: "TextView",
      imageUrls: "ic_action_overflow"
    }, {
      moduleData: "EditText",
      imageUrls: "ic_action_close"
    }, {
      moduleData: "ImageView",
      imageUrls: "ic_action_completed"
    }]


  }


  getScreenHead = () => {

    return (<LinearLayout
      height="222"
      background="#F5515F"
      width="match_parent"
      padding="16,22,16,22"
      orientation="vertical">
        <LinearLayout
          weight="1"
          width="match_parent">
          <ViewWidget
            weight="1"/>
          <ImageView
            height="24"
            width="24"
            imageUrls={"ic_subject"}/>
          <TextView
            width="wrap_content"
            text="Subjects"
            textStyle={window.__TextStyle.textStyle.CARD.ACTION.LIGHT}/>
        </LinearLayout>

        <ImageView
              height="48"
              width="48"
              margin="0,0,0,16"
              imageUrls="ic_flask"/>

        <TextView
          text="Organic Chemistry"
          textStyle={window.__TextStyle.textStyle.HEADING.LIGHT} />

     </LinearLayout>)

  }

  handleModuleClick = (index) => {
    console.log("IN INDEX ",index)
    this.state = R.merge(this.state, { event: 'showClassroomContet' })
    window.__runDuiCallback({ action: "showClassroomContet" });
  }



  getModuleContent = () => {




    return (<LinearLayout
        width = "match_parent"
        height = "wrap_content"
        orientation = "vertical">

           <ModulesContainer
           onClick={this.handleModuleClick}
           item={this.dummyData}/>
       </LinearLayout>)
  }


  getVideosContentHead = () => {
    return (<LinearLayout
       width = "match_parent"
       height = "wrap_content"
       >

       <TextView
        text = "Videos"
        style={window.__TextStyle.textStyle.CARD.TITLE.DARK}
        margin = "0,0,0,0"
        />

        <ViewWidget
        height = "1"
        width = "0"
        weight = "1"/>

       <TextView
        text = "View All"
        style={window.__TextStyle.textStyle.CARD.TITLE.DARK}
        margin = "0,0,0,0"
        />
       </LinearLayout>)
  }

  getVideosContent = () => {

    var cards = this.dummyData.map((item) => {
      return (<VideoCard
                height="wrap_content"
                item={item}
                width="match_parent"/>)
    })


    return (<LinearLayout
        height="match_parent"
        orientation="vertical"
        padding="16,0,16,0"
        width="match_parent">

        {
          this.getVideosContentHead()
        }

        {
          cards
        }

        </LinearLayout>)
  }



  render() {
    this.layout = (
      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        height="match_parent">

        <ScrollView
          height="match_parent"
          width="match_parent"
          fillViewPort="true">

            <LinearLayout
              height="match_parent"
              width="match_parent"
              orientation="vertical">
              {
                this.getScreenHead()
              }

              {
                this.getModuleContent()
              }


              {
                this.getVideosContent()
              }

            </LinearLayout>

        </ScrollView>

      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = ClassRoomHomeComponent;
