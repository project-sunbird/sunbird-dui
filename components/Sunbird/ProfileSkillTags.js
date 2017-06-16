var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

var _this;
class ProfileSkillTags extends View {
  constructor(props, children) {
    super(props, children);

    this.setIds([

    ]);
    _this = this;

    this.data = [{
      "name": "Leadership",
      "tagCount": "+24"
    }, {
      "name": "Mentor",
      "tagCount": "+4"
    }, {
      "name": "Advanced Chemistry",
      "tagCount": "+12"
    }, {
      "name": "Mastery in Organic  Chemistry",
      "tagCount": "+14"
    }]

  }


  getHeader() {
    return (<LinearLayout
              width="wrap_content"
              height="wrap_content">

              <TextView
              width="wrap_content"
              height="wrap_content"
              text="Skill Tags"
              style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

              <ViewWidget
              height="0"
              weight="1"/>

              <TextView
              width="wrap_content"
              height="wrap_content"
              text="Add"
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


  getRows(input) {
    return (<LinearLayout
              width="wrap_content"
              height="wrap_content"
              gravity="center_vertical"
              >

              <TextView
              width="wrap_content"
              height="wrap_content"
              text={input.name}
              padding="12,2,12,2"
              background={window.__Colors.WHITE_F4}
              cornerRadius="15"
              style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>

              <TextView
              width="wrap_content"
              height="wrap_content"
              text={input.tagCount}
              margin="8,0,0,0"
              style={window.__TextStyle.textStyle.HINT.REGULAR}/>

              <ViewWidget
              height="0"
              weight="1"/>

              <TextView
              width="wrap_content"
              height="wrap_content"
              text="Endorse"
              margin="0,0,5,0"
              style={window.__TextStyle.textStyle.HINT.REGULAR}/>

              <ImageView
              width="24"
              height="24"
              imageUrl="ic_action_add_rounded"/>

              </LinearLayout>)
  }


  skillTagBody() {

    var rows = this.data.map((item, i) => {
      return (<LinearLayout
                width="wrap_content"
                height="wrap_content"
                orientation="vertical"
                margin="0,24,0,0"
                >
                {this.getRows(item)}

                </LinearLayout>)
    });

    return rows;

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

                {this.skillTagBody()}

              </LinearLayout>
    )
    return this.layout.render();
  }
}



module.exports = ProfileSkillTags;
