var dom = require("@juspay/mystique-backend").doms.android;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var RelativeLayout = require("@juspay/mystique-backend").androidViews.RelativeLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var CheckBox = require('@juspay/mystique-backend').androidViews.CheckBox;
var ScrollView = require('@juspay/mystique-backend').androidViews.ScrollView;
var Button = require('./Button');
var objectAssign = require('object-assign');
const TextStyle = require("../../res/TextStyle");

class FilterBottomSheet extends View {
  constructor(props, children) {
    super(props, children);
    this.setIds(['filterModal', 'dimmer']);

    this.state = {
      filterState: {
        pastHour: null,
        today: null,
        timeRange: null
      }
    };
    
    window.Filter = {
      show: this.show,
      hide: this.hide
    };
  }

  // Call to open the modal
  show = () => {
    if(this.isOpen) {
      return this.currentPromise.instance;
    }
    
    this.isOpen = true;
    
    let str = this.set({
      id: this.idSet.filterModal,
      a_duration: "400",
      a_translationY: "0"
    });

    let astr = this.set({
      id: this.idSet.dimmer,
      a_duration: '600',
      a_alpha: '0.9'
    });
    
    Android.runInUI(str, null);

    setTimeout(() => {
      Android.runInUI(astr, null);
    }, 500);

    let q = new Promise((resolve, reject) => {
      this.currentPromise = {resolve, reject};
    });

    this.currentPromise.instance = q;
    
    return q;
  }


  hide = () => {
    this.isOpen = false;
    
    this.currentPromise.reject();
    this.currentPromise = null;
    
    let str = this.set({
      id: this.idSet.filterModal,
      a_duration: "400",
      a_translationY: "2000"
    });

    let astr = this.set({
      id: this.idSet.dimmer,
      a_duration: '600',
      a_alpha: '0'
    });
    
    Android.runInUI(astr, null);

    setTimeout(() => {
      Android.runInUI(str, null);
    }, 500);
  }

  clearFilter = () => {
    this.currentPromise.resolve({reset: true});
    this.hide();
  }

  applyFilter = () => {
    console.log(this.state);
    this.currentPromise.resolve(this.state.filterState);
    this.hide();
  }

  selectFilter = (filter, status) => {
    this.state = objectAssign(
      {},
      this.state,
      {
        filterState : {
          [filter]: status
        }
      });

    console.log(this.state);
  }
  
  render() {
    this.layout = (
      <LinearLayout
         clickable="true"
         translationY={2000}
         id={this.idSet.filterModal}
         orientation="vertical"
         width="match_parent"
         height="match_parent">
        <LinearLayout
           id={this.idSet.dimmer}
           alpha="0.0"
           background="#121212"
           width="match_parent"
           weight="0.3"
           height="0">
        </LinearLayout>

        <LinearLayout
           weight="0.7"
           height="0"
           orientation="vertical"
           background="#ffffff"
           width="match_parent">
          <LinearLayout
             padding="5,10,5,10"
             orientation="horizontal"
             height="wrap_content"
             width="match_parent">
            <ImageView
              clickable="true"
              onClick={() => this.hide()}
              height="match_parent"
              imageUrl="ic_cancel"
              width="48"
              height="48"
              padding="12,12,12,12" />

            <TextView
               gravity="center"
               fontStyle="SourceSansPro-Bold"
               color="#000000"
               textSize="32"
               height="match_parent"
               text="Filter" />
          </LinearLayout>

          <LinearLayout orientation="horizontal" width="match_parent" height="2" background="#d4d4d4" />
          
          <LinearLayout
             weight="1"
             height="0"
             padding="20,20,20,0"
             width="match_parent"
             orientation="vertical">
            <LinearLayout
               height="wrap_content"
               width="match_parent"
               padding="10,10,10,10">
              <CheckBox
                onCheckedChange={(isChecked) => this.selectFilter('pastHour', isChecked)}
                text="Past Hour"
                textSize="20"
                padding="20,10,10,10"
                fontStyle="SourceSansPro-Regular" />
            </LinearLayout>
            
            <LinearLayout margin="15,0,15,0" orientation="horizontal" width="match_parent" height="1" background="#d4d4d4" />
            
            <LinearLayout
               height="wrap_content"
               width="match_parent"
               padding="10,10,10,10">
              <CheckBox
                 onCheckedChange={(isChecked) => this.selectFilter('today', isChecked)}
                 text="Today"
                 textSize="20"
                 padding="20,10,10,10"
                 fontStyle="SourceSansPro-Regular" />
            </LinearLayout>
            
            <LinearLayout margin="15,0,15,0" orientation="horizontal" width="match_parent" height="1" background="#d4d4d4" />
            
            <LinearLayout
               height="wrap_content"
               width="match_parent"
               padding="10,10,10,10">
              <CheckBox
                 onCheckedChange={(isChecked) => this.selectFilter('timeRange', isChecked)}
                 text="Time Range"
                 textSize="20"
                 padding="20,10,10,10"
                 fontStyle="SourceSansPro-Regular" />
            </LinearLayout>
          </LinearLayout>
          

          <LinearLayout orientation="horizontal" width="match_parent" height="2" background="#d4d4d4" />
          <LinearLayout
             padding="10,10,10,10"
             orientation="horizontal"
             width="match_parent"
             height="wrap_content">
            <Button
               onCheck={this.clearFilter}
               margin="10,10,10,10"
               type="BigButton_Primary_DB"
               weight="1"
               width="0"
               text="RESET" />
            <Button
               onClick={this.applyFilter}
               margin="10,10,10,10"
               type="BigButton_Primary_WB"
               weight="1"
               width="0"
               text="APPLY" />
          </LinearLayout>
        </LinearLayout>
      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = FilterBottomSheet;
