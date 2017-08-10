
var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

var _this;
class ProfileAccomplishments extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([

    ]);
    _this = this;
    this.isEditable = this.props.editable;
    this.data = [{
      name: "Teacher of the year",
      date: "June 2016"
    }, {
      name: "Best even organizer- Team Blue",
      date: "March 2008"
    }]

  }

  getRows(input) {
    var rows = this.data.map((item, i) => {
      return (<LinearLayout
              width="wrap_content"
              height="wrap_content"
              margin="0,0,0,16">

              <TextView
              width="wrap_content"
              height="wrap_content"
              text={item.name}
              style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>

              <ViewWidget
              height="0"
              weight="1"/>

              <TextView
              width="wrap_content"
              height="wrap_content"
              text={item.date}
              style={window.__TextStyle.textStyle.HINT.REGULAR}/>

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

              <TextView
              width="wrap_content"
              height="wrap_content"
              text="Add"
              visibility = {(this.isEditable == "true") ? "visible" : "gone"}
              style={window.__TextStyle.textStyle.CARD.ACTION.BLUE}/>

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



module.exports = ProfileAccomplishments;
