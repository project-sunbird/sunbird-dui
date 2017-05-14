var dom = require("@juspay/mystique-backend").doms.android;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;

var Button = require('../Sunbird/Button');

class PageOption extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "PageOption";
    //buttonItems : list of buttons
    // onButtonClick : function that
    // hideDivider : pass true to hide, otherwise no need to define 
  }

  handleClick = (data) => {
    this.props.onButtonClick(data);
  }

  getButtons = () => {
    var buttons
    if (this.props.buttonItems.length > 1) {
      buttons = this.props.buttonItems.map((item, i) => {
        var type = "BigButton_Primary_WB";
        if (parseInt(i) % 2 == 0) {
          type = "BigButton_Primary_DB";
        }
        return (<Button 
                      type={type}
                      text={item}
                      margin="10,0,10,0"
                      weight="1"
                      onClick={this.handleClick}/>)

      });
    } else {
      return (<Button type="BigButton_Primary_WB"
            weight="1"
            margin="10,0,10,0"
            text={this.props.buttonItems[0]}
            onClick={this.handleClick}/>)
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
          height="1"
          alpha="0.33"
          visibility={this.props.hideDivider?"gone":"visible"}
          width="match_parent"
          background={window.__Colors.PRIMARY_BLACK}/>
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
