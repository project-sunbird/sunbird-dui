var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

class ProfileBadges extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([

    ]);

    this.data = [{
      badgeName: "First finisher in 4 courses",

    }, {
      badgeName: "Created 5 courses",

    }, {
      badgeName: "First finisher in 10 courses",

    }, {
      badgeName: "Created 10 courses",

    }, {
      badgeName: "First finisher in 20 courses",

    }, {
      badgeName: "Created 20 courses",

    }]

  }

  getRows(input) {
    var rows = this.data.map((item, i) => {
      if (i > 1)
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

    return rows;
  }

  getBody() {
    return (<LinearLayout
            width="wrap_content"
            height="wrap_content"
            margin="0,24,0,0"
            orientation="vertical">

            {this.getRows()}

            </LinearLayout>)
  }


  getViewAll = () => {

    if (this.data.length <= 1)
      return (<TextView
              width="0"
              height="0"/>)

    return (<TextView
              width="wrap_content"
              height="wrap_content"
              text="View All"
              style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>)

  }

  getHeader() {
    return (<LinearLayout
              width="wrap_content"
              height="wrap_content">

              <TextView
              width="wrap_content"
              height="wrap_content"
              text="Accomplishments"
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
