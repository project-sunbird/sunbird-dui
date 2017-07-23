

var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;

var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var Space = require('@juspay/mystique-backend').androidViews.Space;

var SearchToolbar = require('../components/Sunbird/core/SearchToolbar');


class CommunityViewAllActivity extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      'filterCount'
    ]);
    this.screenName="CommunityViewAllActivity"

    this.menuData = {
      url: [
        { imageUrl: "ic_action_plus" },
        { imageUrl: "ic_action_filter" },
        { imageUrl: "ic_action_search" }
      ]
    }

    this.data = [
      { imageUrl: "http://chinookspirit.org/wp/wp-content/uploads/2015/09/Community-Tree-e1441813462468.jpg", name: "All-India Teachers Association", members: "(250 members)", logo: [] },
      { imageUrl: "http://www.abundantcommunity.com/files/images/stories/ICMA_Tree_Logo.png", name: "Maharashtra Teachers Association", members: "(250 members)", logo: [] },
      { imageUrl: "http://www.cbt.stellarbluehosting.com/images/CBT%20TREE_COLOR2.jpg", name: "Maharashtra Chemistry Teachers Only", members: "(250 members)", logo: [] },
      { imageUrl: "https://thumbs.dreamstime.com/m/tree-as-symbol-23289732.jpg", name: "Maharashtra Chemistry Teachers Only", members: "(250 members)", logo: [] },
    ]

  }


  getRows = () => {
    var layout = this.data.map((item, index) => {
      return (<LinearLayout
            width="match_parent"
            height="wrap_content"
            orientation="vertical">
                <LinearLayout
                width="match_parent"
                height="wrap_content"
                gravity="center_vertical"
                margin="16,17,16,17">

                <ImageView
                  height="50"
                  width="50"
                  gravity="center_vertical"
                  imageFromUrl= {item.imageUrl} />

                <LinearLayout
                  height="wrap_content"
                  width="0"
                  weight="1"
                  padding="16,0,0,0"
                  gravity="center_vertical"
                  orientation="vertical">

                      <TextView
                        onClick={item.onMenuItemClick}
                        text={item.name}
                        height="wrap_content"
                        style={window.__TextStyle.textStyle.CARD.HEADING}/>

                      <TextView
                        text={item.members}
                        height="wrap_content"
                        singleLine="true"
                        style={window.__TextStyle.textStyle.HINT.REGULAR}/>

                </LinearLayout>

                <ImageView
                  gravity="center_vertical"
                  height="24"
                  width="24"
                  imageUrl= "ic_chevron_right"
                  />

              </LinearLayout>

              <LinearLayout
                width="match_parent"
                background={window.__Colors.PRIMARY_BLACK_22}
                height="1"/>

        </LinearLayout>)
    })

    return layout;
  }


  getLabel = () => {
    return (<LinearLayout
            width="match_parent"
            height="wrap_content"
            gravity="center_vertical"
            background={window.__Colors.WHITE_F2}>

            <TextView
            width="wrap_content"
            height="wrap_content"
            padding="16,6,0,6"
            gravity="center_vertical"
            background={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}
            text="Viewing all communities you’re a part of"/>

            <ViewWidget
            height="0"
            weight="1"/>

            <ImageView
            width="12"
            height="12"
            margin="0,0,20,0"
            gravity="center_vertical"
            imageUrl="ic_action_arrow_down"/>

            </LinearLayout>)
  }


  handleMenuClick = (url) => {
    console.log("url clicked", url);
  }

  handleSearch = (data) => {
    console.log("searched", data);
  }


  onBackPressed = () => {
    var whatToSend = []
    var event = { tag: 'BACK_CommunityViewAllActivity', contents: whatToSend };
    window.__runDuiCallback(ecent);
  }



  onPop = () => {
    Android.runInUI(
      this.animateView(),
      null
    );
  }



  render() {
    this.layout = (
      <LinearLayout
        root="true"
        orientation="vertical"
        width="match_parent"
        background={window.__Colors.WHITE_F7}
        height="match_parent">

          <SearchToolbar
            hint="Enter your search"
            invert="true"
            title="Communities"
            onMenuItemClick={this.handleMenuClick}
            onBackPress={this.onBackPressed}
            menuData={this.menuData}
            onSearch={this.handleSearch}/>


            <ScrollView
              height="0"
              weight="1"
              width="match_parent">

                <LinearLayout
                  height="match_parent"
                  width="match_parent"
                  orientation="vertical">

                  {this.getLabel()}
                  {this.getRows()}

                </LinearLayout>

           </ScrollView>
      </LinearLayout>


    )
    return this.layout.render();
  }
}

module.exports = Connector(CommunityViewAllActivity);
