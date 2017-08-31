var dom = require("@juspay/mystique-backend").doms.android;
var Connector = require("@juspay/mystique-backend").connector;
var View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var HorizontalScrollView = require("@juspay/mystique-backend").androidViews.HorizontalScrollView;
var Spinner = require('./core/Spinner');
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;

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
          width="wrap_content"
          height="wrap_content"
          background="#66D8D8D8"
          margin="4, 4, 4, 4"
          cornerRadius="8, 8, 8, 8">
          <LinearLayout
            width="wrap_content"
            height="wrap_content"
            orientation="horizontal"
            padding="2, 2, 2, 2">

            <TextView
              width="wrap_content"
              height="24"
              gravity="center"
              padding="6, 0, 0, 0"
              textStyle={window.__TextStyle.textStyle.CARD.BODY.DARK.REGULAR_BLACK}
              text={item} />

            <LinearLayout
              width="24"
              height="24"
              padding="6, 6, 6, 6"
              gravity="center"
              onClick={()=>{this.handleRemoveClick(item)}}>
              <ImageView
                width="18"
                height="18"
                imageUrl="ic_action_close" />
            </LinearLayout>

          </LinearLayout>
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
        stroke={"2,"+window.__Colors.PRIMARY_BLACK_66}>

        <Spinner
          id={this.idSet.spinner}
          width="match_parent"
          height="wrap_content"
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

  getUi() {
    return (
      <LinearLayout
        width="match_parent"
        height="wrap_content"
        orientation="vertical">
        {this.getSpinnerComponent()}
        {this.getSelectedView()}
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
