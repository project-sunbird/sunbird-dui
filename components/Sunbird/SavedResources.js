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
var SimpleToolbar = require('../../components/Sunbird/SimpleToolbar');
var objectAssign = require('object-assign');
var TabHead = require("../../components/Sunbird/TabHead")
var ViewPager = require('@juspay/mystique-backend').androidViews.ViewPager;
var ClassListItem = require('../../components/Sunbird/ClassListItem');
var ProfileAboutComponent = require("../../components/Sunbird/ProfileAboutComponent")
var ProfileCertificationComponent = require("../../components/Sunbird/ProfileCertificationComponent")
var ProfileNetworkComponent = require("../../components/Sunbird/ProfileNetworkComponent")
window.R = require("ramda");


class SavedResources extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;

    this.menuData = {
      url: [
        { imageUrl: "ic_action_search" }
      ]
    }

    this.setIds([
      "savedResourceViewpager"
    ])


     this.textData = {
      type: "Subjects",
      values: [
        { color: "#10D50000", imageUrl: "ic_action_search", subject: "Dot Structure", logo:["ic_action_completed","ic_action_share"]},
        { color: "#F0E9FD", imageUrl: "ic_account", subject: "Hybridization", logo:["ic_action_completed","ic_action_share"] },
        { color: "#10E3C31C", imageUrl: "ic_action_search", subject: "Bond Line Structure", logo:["ic_action_completed","ic_action_share"] },
        { color: "#10FF9F00", imageUrl: "ic_action_search", subject: "Counting Electrons", logo:["ic_action_completed","ic_action_share"] },
        { color: "#10D50000", imageUrl: "ic_action_search", subject: "Dot Structure", logo:["ic_action_completed","ic_action_share"] },
        { color: "#F0E9FD", imageUrl: "ic_account", subject: "Hybridization", logo:["ic_action_completed","ic_action_share"] },
        { color: "#10E3C31C", imageUrl: "ic_action_search", subject: "Dot Structure", logo:["ic_action_completed","ic_action_share"] },
        { color: "#10FF9F00", imageUrl: "ic_account", subject: "Hybridization", logo:["ic_action_completed","ic_action_share"] },
      ]
    }
    this.tabValues = [{
        name: "TEXTBOOKS",
        select: "1"
      }, {
        name: "QUIZZES",
        select: "0"
      }, {
        name: "VIDEOS",
        select: "0"
      }

    ]
  }


  afterRender = () => {

    var tabData = [];
    var jso = [];
    var tmp;
    var tabItems = this.tabValues.map((item, index) => {
      switch (index) {
        case 0:
          tmp = (<ClassListItem
                    data={this.textData}
                    itemClick={this.handleItemClick}
                    lineSeparator="true"/>          
                  )
          break;
        case 1:
          tmp = (<ProfileCertificationComponent
                    height="match_parent"
                    width="match_parent"/>)
          break;
        case 2:
          tmp = (<ProfileAboutComponent 
                    height="match_parent"
                    width="match_parent"/>)
          break;

      }

      jso.push({ view: this.getView(tmp.render()), value: "", viewType: 0 });
      tabData.push({ value: item })
    });

    var callback = callbackMapper.map((params) => {
      this.handleViewPagerAction([params[0]])

    });

    JBridge.viewPagerAdapter(this.idSet.savedResourceViewpager, JSON.stringify(jso), JSON.stringify(tabData), callback);

  }

   handleViewPagerAction = (index) => {
    this.tabBar.handleNavigationChange(index);
  }

  handleTabHeadAction = (index) => {
    JBridge.switchToViewPagerIndex(index + "");
  }

  getTabHead = () => {

    this.tabBar = (<TabHead
                    margin="0,12,0,0"
                    tabItems = {this.tabValues}
                    _onClick = {this.handleTabHeadAction} />);

    return this.tabBar;
  }

  handleItemClick = (itemNo,logoNo) =>{
    console.log(itemNo+" itemNo")
    console.log(logoNo+" logoNo")
  }


  render() {
    this.layout = (
      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        afterRender={this.afterRender}
        height="match_parent">


        <SimpleToolbar
          title="Resources"
          width="match_parent"
          showMenu="true"
          invert="true"
          hideBack="true"
          menuData={this.menuData}
          onMenuItemClick={this.handleMenuClick}/>

            {this.getTabHead()}

            <ViewPager
              height="0"
              weight="1"
              id={this.idSet.savedResourceViewpager}
              width="match_parent" />


      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = SavedResources;
