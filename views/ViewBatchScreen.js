var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var callbackMapper = require("@juspay/mystique-backend").helpers.android.callbackMapper;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
window.R = require("ramda");


var LinearLayout  = require("@juspay/mystique-backend").androidViews.LinearLayout ;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;

//Components
var SimpleToolbar = require('../components/Sunbird/core/SimpleToolbar');


/*******************************
*    ScreenCode is defined here
*******************************/
var _this;
class ViewBatchScreen extends View {
    constructor(props, children, state) {
        super(props, children);
        this.state = state;

        this.setIds([
          "chooserPopup",
          "batchTypeTextView"
        ]);

        _this = this;
        this.screenName = "ViewBatchScreen"

        //set false to disable caching
        this.shouldCacheScreen = "true"

        setTimeout(() => {
            Android.runInUI(
                _this.animateView(),
                null
            );
        });

        this.showChooser=true;
    }

    onPop = (type) => {
        Android.runInUI(
            _this.animateView(),
            null
        );
    }

    onBackPressed = () => {
      return;

      var whatToSend = []
      var event = { tag: 'BACK_ViewBatchScreen', contents: whatToSend }
      window.__runDuiCallback(event);
    }

    handleShowBachType = (showChooser) => {
     if(showChooser==undefined)
        showChooser= this.showChooser;

      Android.runInUI(this.set({
        id : this.idSet.chooserPopup,
        visibility :showChooser?"visible":"gone"
      }),0);

    }


    handleTypeChange = (type)=> {

      this.handleShowBachType(false);
      Android.runInUI(this.set({
        id : this.idSet.batchTypeTextView,
        text : type
      }),0)
    }

    getBatchTypeHead = () => {
      return (
        <LinearLayout
        height="wrap_content"
        onClick={this.handleShowBachType}
        width="match_parent">

            <TextView
              id={this.idSet.batchTypeTextView}
              height="wrap_content"
              width="match_parent"
              background={window.__Colors.LIGHT_GRAY}
              text="CHOOSE ME"/>

      </LinearLayout>)
    }

    getBatchTypeChoser = () => {
      var list= [
       "Type 1",
       "Type 2",
       "Type 3",
      ]



      var cards = list.map((item)=>{
        return (<LinearLayout
          height="wrap_content"
          width="match_parent"
          onClick={()=>{this.handleTypeChange(item)}}>

              <TextView
                height="wrap_content"
                width="match_parent"
                background={window.__Colors.LIGHT_GRAY}
                text={item}/>

        </LinearLayout>)
      })

      return (<LinearLayout
                id={this.idSet.chooserPopup}
                height="wrap_content"
                layouTransition="true"
                width="match_parent"
                visibility="gone"
                orientation="vertical">


              { cards }


      </LinearLayout>)
    }

    render() {
      this.layout = (
          <LinearLayout
              width="match_parent"
              height="match_parent"
              background="#ffff00"
              orientation="vertical"
              root="true"
              layouTransition="true"
              clickable="true">

              <SimpleToolbar
                title={window.__S.FILTER}
                onBackPress={this.onBackPressed}
                invert="true"
                width="match_parent"/>


              {this.getBatchTypeHead()}

              {this.getBatchTypeChoser()}



          </LinearLayout>
    );
    return this.layout.render();
    }



}

module.exports = Connector(ViewBatchScreen)
