
var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;

var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var _this;

class AnnouncementCard extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds([

    ]);

    _this = this;

  }

  afterRender(){
  }

  getLabel(){
    return(<LinearLayout
            width="wrap_content"
            height="wrap_content"
            gravity="center_vertical"
            >
                <TextView
                width="match_parent"
                height="wrap_content"
                margin="0,0,3,0"
                gravity="center_vertical"
                text={this.props.params.labelText}
                style={window.__TextStyle.textStyle.HINT.REGULAR}/>

                <ImageView
                width="15"
                height="12"
                imageUrl={this.props.params.labelIcon}/>

                <ViewWidget
                height="0"
                weight="1"/>
                <TextView
                width="match_parent"
                height="wrap_content"
                margin="8,0,0,0"
                gravity="center_vertical"
                text={this.props.params.date}
                style={window.__TextStyle.textStyle.HINT.REGULAR}/>

            </LinearLayout>
          )
  }

  getBody(){
        return (<LinearLayout
                width="match_parent"
                height="wrap_content"
                orientation="horizontal"
                margin="0,12,0,0"
                >
                  <ImageView
                  width="23"
                  height="27"
                  imageUrl={this.props.params.bodyIcon}
                  />

                  <LinearLayout
                    width="wrap_content"
                    height="wrap_content"
                    orientation="vertical"
                    padding="12,0,0,0">
                     <TextView
                      width="wrap_content"
                      height="wrap_content"
                      text={this.props.params.bodyHeading}
                      style={window.__TextStyle.textStyle.CARD.TITLE.DARK}/>


                          <TextView
                          width="wrap_content"
                          height="wrap_content"
                          text={this.props.params.bodyContent}
                          gravity="center_vertical"
                          style={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR}/>

                  </LinearLayout>

              </LinearLayout>);

  }

  getFooter(){

      return (<LinearLayout
              width="match_parent"
              height="wrap_content"
              orientation="horizontal"
              margin="0,12,0,0"
              >

              <ViewWidget
              weight="1"
              height="0"/>
              <TextView
              width="wrap_content"
              height="wrap_content"
              text={this.props.params.footerTitle}
              gravity="center_vertical"
              style={window.__TextStyle.textStyle.CLICKABLE.BLUE_SEMI}/>

            </LinearLayout>
            )
  }



  render() {

    this.layout = (
      <LinearLayout
        width="match_parent"
        height="wrap_content"
        margin="5,0,0,5"
        padding="16,16,16,16"
        root="true"
        orientation="vertical"
        background={window.__Colors.WHITE}
        >

        {this.getLabel()}
        {this.getBody()}
        {this.getFooter()}



     </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = AnnouncementCard;
