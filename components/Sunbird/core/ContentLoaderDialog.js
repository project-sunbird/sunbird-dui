var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;
var ProgressBar = require("@juspay/mystique-backend").androidViews.ProgressBar;
var ViewWidget = require("@juspay/mystique-backend").androidViews.ViewWidget;


class ContentLoaderDialog extends View {
  constructor(props, children, state) {
    super(props, children, state);

    this.setIds([
      'progressContainer',
      "parentContainer"
    ]);

    this.state = state;
    window.__ContentLoaderDialog = this;

    this.isVisible=false;

}

  afterRender = () => {

  }

    show = () => {
      if(!this.isVisible){
            Android.runInUI(
                  this.set({
                    id : this.idSet.parentContainer,
                    visibility :"visible"}),
                  null
                );
          }
        this.updateProgressBar(0);
        this.isVisible=true;
    }

    hide = () => {
      if(!this.isVisible){
      Android.runInUI(
            this.set({
              id : this.idSet.parentContainer,
              visibility :"gone"}),
            null
          );
    }
        this.isVisible=false;

    }

    getVisible = () => {
      return this.isVisible;
    }

   updateProgressBar = (pStatus) => {

    this.replaceChild(this.idSet.progressContainer, this.getProgressBar(pStatus).render(), 0)
  }


  getProgressBar = (pStatus) => {

    var completedProgress = pStatus;
    var remainingProgress = (100 - parseInt(pStatus))+"";


    return(<LinearLayout
             width="250"
             root="true"
             height="20">

              <ViewWidget
                width="0"
                height="10"
                background={window.__Colors.LIGHT_BLUE}
                weight={completedProgress}/>

               <ViewWidget
                 width="0"
                 background={window.__Colors.PRIMARY_BLACK_22}
                 height="10"
                 weight={remainingProgress}/>

             </LinearLayout>)
  }


  render() {
    this.layout = (
      <LinearLayout
        width="match_parent"
        height="match_parent"
        root = "true"
        orientation="vertical"
        visibility="gone"
        clickable="true"
        id={this.idSet.parentContainer}
        margin="0,0,0,0"
        background={window.__Colors.WHITE}
        gravity="center">

          <TextView
           width="wrap_content"
           height="wrap_content"
           margin="0,0,0,32"
           text="Loading your Content.."/>

          <LinearLayout
            height="wrap_content"
            width="match_parent"
            gravity="center"
            orientation="vertical"
            id={this.idSet.progressContainer}>


             {this.getProgressBar(0)}


          </LinearLayout>


      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = ContentLoaderDialog;
