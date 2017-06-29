var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ProgressBar = require("@juspay/mystique-backend").androidViews.ProgressBar;

class ContentLoadingComponent extends View {
  constructor(props, children) {
    super(props, children);

    this.displayName = "content_loading_component"

    this.setIds([
      "holder"
    ])
    this.contentLayout = this.props.contentLayout == undefined ? this.getContent() : this.props.contentLayout;
  }

  getContent = () => {
    return (<LinearLayout
              height="match_parent"
              width="match_parent"
              root="true"
              gravity="center"
              orientation="vertical">

                <TextView
                  text="Layout Not Passed"
                  textSize="30"
                  width="match_parent"
                  />

            </LinearLayout>)
  }

  showContent = () => {
    console.log("Starting Rendering Content to holder")
    setTimeout(() => {
      console.log("Rendering Content to holder")
      this.replaceChild(this.idSet.holder, this.contentLayout.render(), 0);
    }, 1000);
  }


  render() {
    this.layout = (

      <LinearLayout
       height="match_parent"
       orientation="vertical"
       gravity="center"
       root="true"
       afterRender={this.showContent}
       id={this.idSet.holder}
       width="match_parent">
          <ProgressBar
            height="70"
            width="70"/>
       </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = ContentLoadingComponent;
