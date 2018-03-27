var dom = require("@juspay/mystique-backend/src/doms/android");
var Connector = require("@juspay/mystique-backend/src/connectors/screen_connector");
var View = require("@juspay/mystique-backend/src/base_views/AndroidBaseView");
var LinearLayout = require("@juspay/mystique-backend/src/android_views/LinearLayout");
var HorizontalScrollView = require("@juspay/mystique-backend/src/android_views/HorizontalScrollView");
var Spinner = require('./core/Spinner');
var TextView = require("@juspay/mystique-backend/src/android_views/TextView");
var ImageView = require("@juspay/mystique-backend/src/android_views/ImageView");

class MultiSelectSpinner extends View {

  constructor(props, children) {
    super(props, children);

    this.setIds([
      "spinnerContainer",
      "spinner",
      "horizontalScrollContainer",
      "selectedValueContainer"
    ]);

    this.hint = props.hint;
    this.data = props.data;
    this.selectedData = props.selectedData ? props.selectedData : new Array();
    this.addLayout=props.addLayout;

    if (this.selectedData.length > 0) {
      this.selectedData.map((value) => {
          this.data.splice(this.data.indexOf(value), 1);
      });
    }

    this.onItemChange = props.onItemChange;
  }


  handleItemClick = (...params) => {
    if(parseInt(params[2]) > 0) {
      var selectedValue = this.data[parseInt(params[2])];
      this.data.splice(this.data.indexOf(selectedValue), 1);
      this.selectedData.push(selectedValue);

      this.replaceChild(this.idSet.spinnerContainer, this.getUi().render(), 0);
      this.onItemChange(this.selectedData);
    }
  }

  handleRemoveClick = (item) => {
    this.selectedData.splice(this.selectedData.indexOf(item), 1);
    this.data.push(item);

    this.replaceChild(this.idSet.spinnerContainer, this.getUi().render(), 0);
    this.onItemChange(this.selectedData);
  }


  getSelectedItemListView() {
    if (this.selectedData.length == 0) {
      return (
        <LinearLayout
          width="wrap_content"
          height="wrap_content" />
      )
    }

    var itemListView = this.selectedData.map((item) => {
      return (
        <LinearLayout
           height="wrap_content"
           width="wrap_content"
           padding="12,4,12,4"
           margin="0,0,10,0"
           cornerRadius="16,16,16,16"
           background={window.__Colors.DARK_GRAY_44}
           gravity="center">

            <TextView
              height="wrap_content"
              width="wrap_content"
              text={item}
              margin="0,0,4,0"
              textStyle={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}/>

            <ImageView
              height="15"
              width="15"
              imageUrl="ic_action_close"
              margin="0,1,0,0"
              onClick={()=>{this.handleRemoveClick(item)}}
              />
         </LinearLayout>

      )
    });

    return itemListView;
  }


  getSpinnerComponent() {
    var spinnerItem = this.data.join(", ");
    return (
      <LinearLayout
        width="match_parent"
        height="wrap_content"
        cornerRadius="4"
        padding="0,8,8,8"
        margin={this.props.spinnerComponentMargin || "4,0,4,0"}
        stroke={"2,"+window.__Colors.PRIMARY_BLACK_66}>

        <Spinner
          id={this.idSet.spinner}
          width="match_parent"
          height="24"
          margin="0,0,5,6"
          values={spinnerItem}
          onItemClick={this.handleItemClick}
          />

      </LinearLayout>

    );
  }

  getSelectedView() {
    var itemList = this.getSelectedItemListView();

    return (
      <HorizontalScrollView
          id={this.idSet.horizontalScrollContainer}
          height="wrap_content"
          width="match_parent"
          margin="4, 4, 4, 4">
          <LinearLayout
              id = {this.idSet.selectedValueContainer}
              height="match_parent"
              width="match_parent"
              orientation="horizontal">
               { itemList }
          </LinearLayout>
      </HorizontalScrollView>
    );
  }

  getExtraLayout=()=>{
    if(this.props.addLayout!=undefined&&this.props.addLayout!="")
      {
        return (this.props.addLayout);
      }
      return (
        <LinearLayout/>
      );
  }
  getUi() {
    return (
      <LinearLayout
      width="match_parent"
      height="wrap_content"
      orientation="horizontal">
      <LinearLayout
        weight="1"
        height="wrap_content"
        orientation="vertical">
        {this.getSpinnerComponent()}
        {this.getSelectedView()}
      </LinearLayout>
      {this.getExtraLayout()}
      </LinearLayout>
    );
  }

  render() {
    this.layout = (
      <LinearLayout
        id={this.idSet.spinnerContainer}
        width="match_parent"
        height="wrap_content"
        orientation="vertical">

        { this.getUi() }

      </LinearLayout>
    );

    return this.layout.render();
  }
}

module.exports = MultiSelectSpinner;
