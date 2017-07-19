
var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var SimpleToolbar = require('../Sunbird/core/SimpleToolbar');
var ChooseItem = require('../Sunbird/ChooseItem');
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var Space = require('@juspay/mystique-backend').androidViews.Space;

var _this;
class CommunityDescription extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([
      'filterCount'
    ]);
    _this=this;

    this.adminData=[
      {
        "title":"Member List",
        "status":"4 pending approval",
      },
      {
        "title":"Calendar",
        "status":"14 events",
      },
      {
        "title":"Resources / Files",
        "status":"12 files",
      },
      {
        "title":"Course drafts",
        "status":"2 drafts"
      }
    ]
    this.joinData=[
      {
        "title":"Member List",
        "status":"4 members",
      },
      {
        "title":"Calendar",
        "status":"14 events",
      },
      {
        "title":"Resources / Files",
        "status":"12 files",
      },
      {
        "title":"Course drafts",
        "status":"2 drafts"
      }
    ]
  }



  getOptions(){
    var data = this.props.type == "join" ?this.joinData:this.adminData;
    var layout = data.map((item, index) => {
                      return(
                        <LinearLayout
                        width="match_parent"
                        height="wrap_content"
                        orientation="vertical">
                        <LinearLayout
                              width="match_parent"
                              height="wrap_content"
                              padding="0,16,0,0"
                              gravity="center_vertical"
                              orientation="horizontal">

                             <TextView
                              width="wrap_content"
                              height="wrap_content"
                              text={item.title}
                              gravity="center_vertical"
                              style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

                              <ViewWidget
                              height = "1"
                              width = "0"
                              weight = "1"/>

                              <TextView
                              width="wrap_content"
                              height="wrap_content"
                              text={item.status}
                              gravity="center_vertical"
                              style={window.__TextStyle.textStyle.HINT.REGULAR}/>

                              <ImageView
                              gravity="center_vertical"
                              margin="5,0,0,0"
                              width="24"
                              height="24"
                              imageUrl="ic_chevron_right"/>
                              </LinearLayout>
                              <LinearLayout
                              margin="0,16,0,0"
                              width="match_parent"
                              height="2"
                              background={window.__Colors.PRIMARY_BLACK_22}/>

                        </LinearLayout>)

                      })
    return layout;
  }


  render() {
    this.layout = (
                <LinearLayout
                width="match_parent"
                height="wrap_content"
                padding="16,0,16,0"
                background={window.__Colors.WHITE}
                orientation="vertical">

                <TextView
                width="match_parent"
                margin="0,7,0,7"
                height="wrap_content"
                text="Link - sunbird.com/community/all-MH-Teachers"
                style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>

                <TextView
                width="match_parent"
                height="wrap_content"
                text="Description"
                style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>

                <TextView
                width="match_parent"
                height="wrap_content"
                margin="0,8,0,0"
                text="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text… "
                style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>

                <LinearLayout
                margin="0,16,0,0"
                width="match_parent"
                height="2"
                background={window.__Colors.PRIMARY_BLACK_22}/>


                {this.getOptions()}

              </LinearLayout>

    )
    return this.layout.render();
  }
}

module.exports = CommunityDescription;
