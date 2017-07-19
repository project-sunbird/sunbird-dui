

var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ProgressBar = require("@juspay/mystique-backend").androidViews.ProgressBar;

class ContentLoadingComponent extends View {
  constructor(props, children) {
    super(props, children);

    this.displayName = "content_loading_component"

    this.setIds([
      "holder",
      "loaderComponent"
    ])
    this.contentLayout = this.props.contentLayout == undefined ? this.getContent() : this.props.contentLayout;
    this.isRendering=false;
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

  hideLoader = () => {
    Android.runInUI(this.set({
      id : this.idSet.loaderComponent,
      visibility : "gone"
    }),0);
  }

  startRendering = () => {
    if(this.isRendering)
        return;
    console.log("Starting Rendering Content to holder")
    var  layout = (<LinearLayout
                      height="match_parent"
                      width="match_parent"
                      root="true"
                      gravity="center"
                      afterRender={this.hideLoader}
                      orientation="vertical">

                          {this.contentLayout}

                    </LinearLayout>
                )

      this.replaceChild(this.idSet.holder, layout.render(), 0);
      this.isRendering=true;
  }


  render() {
    this.layout = (

      <LinearLayout
       height="match_parent"
       orientation="vertical"
       gravity="center"
       root="true"
       afterRender={this.startRendering}

       width="match_parent">
          <LinearLayout 
            height="match_parent"
            width="match_parent"
            gravity="center"
            id={this.idSet.loaderComponent}
            background={window.__Colors.WHITE}>
                  <ProgressBar
                      height="70"
                      width="70"/>
          </LinearLayout>  
          <LinearLayout 
            height="match_parent"
            width="match_parent"
            background={window.__Colors.WHITE}
            id={this.idSet.holder}/>
                   
       </LinearLayout>

    )

    return this.layout.render();
  }
}

module.exports = ContentLoadingComponent;
