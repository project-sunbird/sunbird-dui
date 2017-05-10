var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ListView = require('@juspay/mystique-backend').androidViews.ListView;
var ViewPager = require('@juspay/mystique-backend').androidViews.ViewPager;

var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;
var ImageView = require('@juspay/mystique-backend').androidViews.ImageView;
var SimpleToolbar = require('../../components/Sunbird/SimpleToolbar');
var TabHead = require("../../components/Sunbird/TabHead")

//TAB CONTENT
var ProfileAboutComponent = require("../../components/Sunbird/ProfileAboutComponent")
var ProfileCertificationComponent = require("../../components/Sunbird/ProfileCertificationComponent")
var ProfileNetworkComponent = require("../../components/Sunbird/ProfileNetworkComponent")




var objectAssign = require('object-assign');

window.R = require("ramda");

class ProfileActivityScreen extends View {
  constructor(props, children, state) {
    super(props, children, state);
    this.state = state;
    this.screenName = "PROFILE_ACTIVITY_SCREEN"

    this.setIds([
      "viewPagerContainer"
    ])
    this.data = {
      imageUrl: "https://scontent.fblr2-1.fna.fbcdn.net/v/t1.0-9/13769588_1245932445418368_674580350644222458_n.jpg?oh=fc71eee966da710a61253c0f9e5ac9e3&oe=59778955",
      connectionUrl: "https://image.freepik.com/free-icon/multiple-users-silhouette_318-49546.jpg",
      certifiedUrl: "https://camo.githubusercontent.com/eed0343c9cbfb1b5371e9d113694ad2ebba8a907/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313633393035362f313036333733372f36396662613637342d313265322d313165332d393930642d3463313134353663373462612e706e67",
      headingName: "",
      profileName: "Harish Bookwalla",
      cityName: "Bhimavaram, Andhra Pradesh"
    };

    this.NetworkData = [
      { image: "ic_account", name: "Samit Kumar Ganguli", description: "National School for Children, Pune" },
      { image: "ic_account", name: "Indhuja Pillay", description: "Pune Vidyalaya, Pune" },
      { image: "ic_account", name: "Samit Kumar Ganguli", description: "National School for Children, Pune" },
      { image: "ic_account", name: "Indhuja Pillay", description: "Pune Vidyalaya, Pune" },
      { image: "ic_account", name: "Samit Kumar Ganguli", description: "National School for Children, Pune" },
      { image: "ic_account", name: "Samit Kumar Ganguli", description: "National School for Children, Pune" },
      { image: "ic_account", name: "Indhuja Pillay", description: "Pune Vidyalaya, Pune" },
      { image: "ic_account", name: "Samit Kumar Ganguli", description: "National School for Children, Pune" },
      { image: "ic_account", name: "Indhuja Pillay", description: "Pune Vidyalaya, Pune" },
      { image: "ic_account", name: "Samit Kumar Ganguli", description: "National School for Children, Pune" },

    ]

    this.tabValues = [{
        name: "NETWORK",
        select: "1",
        icon: "ic_home"
      }, {
        name: "CERTIFICATION",
        select: "0",
        icon: "ic_courses"
      }, {
        name: "ABOUT",
        select: "0",
        icon: "ic_notebook"
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
          tmp = (<ProfileNetworkComponent
                    height="match_parent"
                    width="match_parent"
                    data={this.NetworkData}/>)
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

    JBridge.viewPagerAdapter(this.idSet.viewPagerContainer, JSON.stringify(jso), JSON.stringify(tabData), callback);

  }

  getConnections = () => {
    return (<LinearLayout
          margin = "0,10,0,0"
          width="match_parent"
          height="wrap_content"
          >

              <ImageView
              imageUrl = {"ic_connections_blue"}
              height = "20"
              width = "20"/>

              <TextView
              text = "340 Connections"
              width = "wrap_content"
              height = "wrap_content"
              margin = "10,0,0,0"
              style = {window.__TextStyle.textStyle.HINT.SEMI}
              />

          </LinearLayout>)
  }

  getCertifications = () => {
    return (<LinearLayout
              margin = "0,10,0,0"
              width="match_parent"
              height="wrap_content">
                  <ImageView
                  imageUrl = {"ic_certificate_blue"}
                  height = "20"
                  width = "20"/>

                  <TextView
                  text = "Certified in Organic Chemistry, Human Be.."
                  enableEllipse="true"
                  width = "wrap_content"
                  height = "wrap_content"
                  margin = "10,0,0,0"
                  style = {window.__TextStyle.textStyle.HINT.SEMI}
                  />

              </LinearLayout>)
  }



  getHead = () => {

    var layout = (
      <LinearLayout
        orientation= "vertical"
        margin = "16,0,16,0"
        width="match_parent"
        height= "wrap_content">

        <LinearLayout
            orientation= "vertical"
            margin = "0,16,0,0"
            width="match_parent"
            height= "wrap_content">
        
              <ImageView
                imageFromUrl = {this.data.imageUrl}
                height = "80"
                width = "80"/>  

              <TextView
                text = {this.data.profileName}
                width = "wrap_content"
                height = "wrap_content"
                style={window.__TextStyle.textStyle.HEADING.DARK}/>
              <TextView
                text = {this.data.cityName}
                width = "wrap_content"
                height = "wrap_content"
                style={window.__TextStyle.textStyle.CARD.HEADING}/>

              {
                this.getConnections()
              }

              {
                this.getCertifications()
              }

            </LinearLayout>
          </LinearLayout>
    )

    return layout;
  }

  getTabHead = () => {

    this.tabBar = (<TabHead
                    margin="0,12,0,0"
                    tabItems = {this.tabValues}
                    _onClick = {this.handleTabHeadAction} />);

    return this.tabBar;
  }

  handleViewPagerAction = (index) => {
    this.tabBar.handleNavigationChange(index);
  }

  handleTabHeadAction = (index) => {
    JBridge.switchToViewPagerIndex(index + "");
  }

  render() {
    this.layout = (
      <LinearLayout
        root = "true"
        background={window.__Colors.WHITE}
        orientation="vertical"
        width="match_parent"
        height="match_parent">
        <SimpleToolbar
          title={this.data.headingName}
          afterRender={this.afterRender}
          width="match_parent"
          invert="true"/>



            {this.getHead()}

            {this.getTabHead()}

            <ViewPager
              height="0"
              weight="1"
              id={this.idSet.viewPagerContainer}
              width="match_parent" />
       
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = Connector(ProfileActivityScreen);
