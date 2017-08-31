var dom = require("@juspay/mystique-backend").doms.android;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;

var Button = require('../../Sunbird/Button');

class PageOption extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "PageOption";
    //buttonItems : list of buttons
    // onButtonClick : function that
    // hideDivider : pass true to hide, otherwise no need to define
    console.log("PageOption", props.buttonItems);
  }

  handleClick = (data) => {
    this.props.onButtonClick(data);
  }

  getButtons = () => {

    var buttons;
    if (this.props.buttonItems.length > 1) {
      buttons = this.props.buttonItems.map((item, i) => {
        var type = "BigButton_Primary_WB";
        if (parseInt(i) % 2 == 0) {
          type = "BigButton_Primary_DB_Stroke";
        }
        return (
          <LinearLayout
            width = "0"
            height = "wrap_content"
            weight="1"
            id = {item.id}
            clickable = {item.isClickable ? item.isClickable : "true"}
            alpha = {item.alpha ? item.alpha : "1"}
            visibility = {item.visibility ? item.visibility : "visible"}>
              <Button
                type = {item.type ? item.type : type}
                text={item.text}
                margin="10,0,10,0"
                onClick={item.onClick}/>
          </LinearLayout>
        );
      });
    } else {
      return (
        <LinearLayout
          width = "0"
          height = "wrap_content"
          weight="1"
          id = {item.id}
          clickable = {item.isClickable ? item.isClickable : "true"}
          alpha = {item.alpha ? item.alpha : "1"}
          visibility = {item.visibility ? item.visibility : "visible"}>
          <Button
            type="BigButton_Primary_WB"
            margin="10,0,10,0"
            text={this.props.buttonItems[0].text}
            onClick={item.onClick}/>
        </LinearLayout>
      )
    }

    return buttons;
  }



  render() {
    var text = this.props.text;


    this.layout = (
      <LinearLayout
        height="wrap_content"
        orientation="vertical"
        width="match_parent"
        background={window.__Colors.WHITE}>

        <LinearLayout
          height="2"
          visibility={this.props.hideDivider?"gone":"visible"}
          width="match_parent"
          background={window.__Colors.PRIMARY_BLACK_22}/>

        <LinearLayout
          height="match_parent"
          width="match_parent"
          margin="10,20,10,20">

            {this.getButtons()}

         </LinearLayout>

      </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = PageOption;
