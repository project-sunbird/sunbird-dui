const dom = require("@juspay/mystique-backend").doms.android;
const View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var Space = require("@juspay/mystique-backend").androidViews.Space;

var debounce = require("debounce");

var Styles = require("../../res/Styles");
// TODO : NEED TO FIX THIS
//let IconStyle =  window.__Styles.Params.IconStyle;
let IconStyle = Styles.Params.IconStyle;

class SearchToolbar extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "SearchToolbar";
    this.setIds(["titleTextHolder",
      "searchHolder",
      "searchIconHolder",
    ])

    this.searchText = debounce(this.searchText, 200);
    this.isSearchEnabled = this.props.startWithSearch ? this.props.startWithSearch : false;

    window.__SearchToolbar = this;
  }




  searchText = (dataSearch) => {
    console.log("HI, you searched [component]", dataSearch);
    if (dataSearch === "close")
      this.clearSearch();

    this.props.onSerach(dataSearch)

  }




  handleSearchClick = () => {
    var cmd = ""

    cmd += this.set({
      id: this.idSet.titleTextHolder,
      visibility: "gone"
    })
    cmd += this.set({
      id: this.idSet.searchIconHolder,
      visibility: "gone"
    })
    cmd += this.set({
      id: this.idSet.searchHolder,
      text: "",
      focus: "true",
      visibility: "visible"
    })

    Android.runInUI(cmd, 0);
  }


  clearSearch = () => {
    var cmd = "";
    cmd += this.set({
      id: this.idSet.searchHolder,
      text: "",
      focusOut: "true",
      visibility: "gone"
    })
    cmd += this.set({
      id: this.idSet.searchIconHolder,
      visibility: "visible"
    })
    cmd += this.set({
      id: this.idSet.titleTextHolder,
      visibility: "visible"
    })

    Android.runInUI(cmd, 0);
  }


  getSearchIcon() {
    return (<ImageView  
            id={this.idSet.searchIconHolder}
            style = {IconStyle}
            onClick = {this.handleSearchClick}
            imageUrl = {"ic_action_search"}/>)

  }

  getBack() {
    return (
      <ImageView
      margin="0,0,10,0"
      style={IconStyle}
      onClick={this.props.onBackPress}
      imageUrl = {"ic_action_arrow_left"}/>)
  }

  getTitle() {
    return (<LinearLayout
        height="match_parent"
        orientation="vertical"
        layoutTransition="true"
        weight="1">

          <TextView 
            height="match_parent"
            width="match_parent"
            gravity="center_vertical"
            layoutTransition="true"
            visibility={this.isSearchEnabled?"gone":"visible"}
            id={this.idSet.titleTextHolder}
            style={window.__TextStyle.textStyle.TOOLBAR.HEADING} 
            text={this.props.title}/>

           <EditText 
            height="match_parent"
            width="match_parent"
            maxLines="1"
            hint={this.props.hint}
            layoutTransition="true"
            gravity="center_vertical"
            onChange = {this.searchText}
            id={this.idSet.searchHolder}
            style={window.__TextStyle.textStyle.TOOLBAR.HEADING}/>  


          </LinearLayout>)

  }


  render() {
    let searchIcon = this.getSearchIcon();
    let back = this.getBack();
    let title = this.getTitle();

    this.layout = (
      <LinearLayout 
        height="56"
        padding="8,0,8,0"
        gravity="center_vertical"
        root="true" 
        background={this.props.invert?window.__Colors.WHITE:window.__Colors.LIGHT_VIOLET}
        width="match_parent" >
         
          {back}
          
          {title}
           
          <Space width="0" weight="1"/>
          {searchIcon}
             
       </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = SearchToolbar;
