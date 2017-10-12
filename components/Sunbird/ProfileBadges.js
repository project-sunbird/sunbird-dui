
var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var ViewWidget = require("@juspay/mystique-backend/src/android_views/ViewWidget");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");

class ProfileBadges extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([
      "badgeContainer",
      "viewAll"
    ]);

    this.showMore = false;

    this.data = [ {
      badgeName: "First finisher in 20 courses",

    }, {
      badgeName: "Created 20 courses",

    }]

  }

  getRows = (input) => {
    var rows = this.data.map((item, i) => {
      if (i > 1 && !this.showMore)
        return (<LinearLayout
              width="0"
              height="0"/>);

      return (<LinearLayout
              width="wrap_content"
              height="wrap_content"
              margin="0,0,0,8">

              <ImageView
              width="48"
              height="48"
              padding="12,12,12,12"
              imageUrl="ic_profile_badge"
              />

              <TextView
              width="0"
              weight="1"
              height="match_parent"
              gravity="center"
              text={item.badgeName}
              style={window.__TextStyle.textStyle.CARD.HEADING}/>

              </LinearLayout>)
    });

    var dummyRow = (<LinearLayout
        height="wrap_content"
        width="match_parent"
        orientation="vertical">

        {rows}

        </LinearLayout>)
    return dummyRow;
  }

  getBody() {
    return (<LinearLayout
            width="wrap_content"
            height="wrap_content"
            margin="0,16,0,0"
            root="true"
            layoutTransition="true"
            id={this.idSet.badgeContainer}
            orientation="vertical">

            {this.getRows()}

            </LinearLayout>)
  }

  handleViewAllClick = () => {
    this.showMore = !this.showMore;
    this.replaceChild(this.idSet.badgeContainer, this.getRows().render(), 0);

    var cmd = "";
    if (this.showMore) {
      cmd = this.set({
        id: this.idSet.viewAll,
        text: "Show Less"
      })
    } else {
      cmd = this.set({
        id: this.idSet.viewAll,
        text: "Show More"
      })
    }

    Android.runInUI(cmd, 0);

  }


  getViewAll = () => {

    if (this.data.length <= 1)
      return (<TextView
              width="0"
              height="0"/>)

    return (<TextView
              width="wrap_content"
              height="wrap_content"
              text={window.__S.VIEW_ALL}
              id={this.idSet.viewAll}
              onClick={this.handleViewAllClick}
              style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>)

  }

  getHeader() {
    return (<LinearLayout
              width="wrap_content"
              height="wrap_content">

              <TextView
              width="wrap_content"
              height="wrap_content"
              text={window.__S.BADGES}
              style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

              <ViewWidget
              height="0"
              weight="1"/>

              
              {this.getViewAll()}

              </LinearLayout>)
  }

  getLineSeperator() {
    return (<LinearLayout
            width="match_parent"
            height="1"
            margin="0,0,0,24"
            background={window.__Colors.PRIMARY_BLACK_22}/>)
  }

  render() {
    this.layout = (
      <LinearLayout
                width="wrap_content"
                height="wrap_content"
                margin="0,16,0,0"
                layoutTransition="true"
                orientation="vertical">

                {this.getLineSeperator()}

                {this.getHeader()}

                {this.getBody()}

              </LinearLayout>
    )
    return this.layout.render();
  }
}



module.exports = ProfileBadges;
