var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var RelativeLayout = require("@juspay/mystique-backend/src/android_views/RelativeLayout");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
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
    window.__ContentLoadingComponent = this;
  }

  getContent = () => {
    return (<LinearLayout
              height="match_parent"
              width="match_parent"
              root="true"
              gravity="center"
              orientation="vertical">

                <TextView
                  text={window.__S.ERROR_LAYOUT_NOT_PASSED}
                  textSize="30"
                  width="match_parent"/>

            </LinearLayout>)
  }

  hideLoader = () => {
    Android.runInUI(this.set({
      id: this.idSet.loaderComponent,
      visibility : "gone"
    }),0);
  }

  startRendering = () => {
    if(this.isRendering)
        return;
    
    var  layout = (<LinearLayout
                      height="match_parent"
                      width="match_parent"
                      root="true"
                      gravity="center"
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
       width="match_parent"
       orientation="vertical"
       gravity="center"
       root="true"
       afterRender={this.startRendering}>
          
          <LinearLayout
            id={this.idSet.loaderComponent} 
            height="match_parent"
            width="match_parent"
            gravity="center"
            background={window.__Colors.WHITE}/>
                 
  
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
