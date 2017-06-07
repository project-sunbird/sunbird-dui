const dom = require("@juspay/mystique-backend").doms.android;
const View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var Space = require("@juspay/mystique-backend").androidViews.Space;
var ClassListItem = require('./ClassListItem');

var debounce = require("debounce");

var Styles = require("../../res/Styles");
// TODO : NEED TO FIX THIS
//let IconStyle =  window.__Styles.Params.IconStyle;
let IconStyle = Styles.Params.IconStyle;
var _this;

class SearchToolbar extends View {
  constructor(props, children) {
    super(props, children);
    this.displayName = "SearchToolbar";
    this.setIds(["titleTextHolder",
      "searchHolder",
      "searchIconHolder",
      "searchCloseHolder",
      "menuContainer",
      "backIcon",
      "searchBackIcon",
      "searchListContainer"
    ])

    _this = this;

    this.searchText = debounce(this.searchText, 200);
    this.isSearchEnabled = this.props.startWithSearch ? this.props.startWithSearch : false;
    this.textData = {
          type: "Subjects",
          values: [
            { color: "#10D50000", imageUrl: "ic_action_search", subject: "Dot Structure",comment:"Assignment", logo:["ic_action_completed","ic_action_share"]},
            { color: "#F0E9FD", imageUrl: "ic_account", subject: "Hybridization",comment:"How to use bond-line structures to perf…", logo:["ic_action_completed","ic_action_share"] },
            { color: "#10E3C31C", imageUrl: "ic_action_search", subject: "Bond Line Structure",comment:"Quiz", logo:["ic_action_completed","ic_action_share"] },
            { color: "#10FF9F00", imageUrl: "ic_action_search", subject: "Counting Electrons",comment:"(250 members)", logo:["ic_action_completed","ic_action_share"] },
            { color: "#10D50000", imageUrl: "ic_action_search", subject: "Dot Structure",comment:"Jawahar Vidya Mandir, Pune", logo:["ic_action_completed","ic_action_share"] },
          ]
        }

    window.__SearchToolbar = this;
  }

  searchText = (dataSearch) => {
    this.props.onSearch(dataSearch)
  }

  handleSearchClick = () => {
    var cmd = ""
    this.isSearchEnabled=true;
    JBridge.showKeyboard();

    cmd += this.set({
      id: this.idSet.titleTextHolder,
      visibility: "gone"
    })
    cmd += this.set({
      id: this.idSet.searchIconHolder,
      visibility: "gone"
    })
    cmd += this.set({
      id: this.idSet.menuContainer,
      visibility: "gone"
    })
    cmd += this.set({
      id: this.idSet.backIcon,
      visibility: "gone"
    })
    cmd += this.set({
      id: this.idSet.searchBackIcon,
      visibility: "visible"
    })
    cmd += this.set({
      id: this.idSet.searchCloseHolder,
      visibility: "visible"
    })
    cmd += this.set({
      id: this.idSet.searchListContainer,
      visibility: "visible"
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
    this.isSearchEnabled=false;
    JBridge.hideKeyboard();
    cmd += this.set({
      id: this.idSet.searchHolder,
      text: "",
      focusOut: "true",
      visibility: "gone"
    })
    cmd += this.set({
      id: this.idSet.searchCloseHolder,
      visibility: "gone"
    })
    cmd += this.set({
      id: this.idSet.searchBackIcon,
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
    cmd += this.set({
      id: this.idSet.menuContainer,
      visibility: "visible"
    })
    cmd += this.set({
      id: this.idSet.searchListContainer,
      visibility: "gone"
    })

    if(!this.props.hideBack){
      cmd += this.set({
      id: this.idSet.backIcon,
      visibility: "visible"
    })
    }

    Android.runInUI(cmd, 0);
  }


   handleItemClick = (itemNo,logoNo) =>{
    console.log(itemNo + " itemNo")
    console.log(logoNo + " logoNo")
  }


  getSearchIcon() {
    return (<LinearLayout
            height="match_parent"
            gravity="center_vertical">
              <ImageView  
                id={this.idSet.searchIconHolder}
                style = {IconStyle}
                onClick = {this.handleSearchClick}
                visibility={this.isSearchEnabled?"gone":"visible"}
                imageUrl = {"ic_action_search"}/>

              <ImageView  
                id={this.idSet.searchCloseHolder}
                style = {IconStyle}
                onClick = {this.clearSearch}
                visibility={this.isSearchEnabled?"visible":"gone"}
                imageUrl = {"ic_action_close"}/>  

            </LinearLayout>)

  }

  getBack() {
    return (
      <ImageView
      margin="0,0,10,0"
      id={this.idSet.backIcon}
      style={IconStyle}
      visibility={this.props.hideBack?"gone":"visible"}
      onClick={this.handleBackPress}
      imageUrl = {"ic_action_arrow_left"}/>)
  }

  getSearchBack(){
    return (<ImageView
            margin="0,0,0,0"
            style={IconStyle}
            id={this.idSet.searchBackIcon}
            visibility={this.isSearchEnabled?"visible":"gone"}
            onClick={this.handleSearchBackPress}
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
            margin="10,0,0,0"
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
            background="#ffffff"
            onChange = {data=>_this.getSearchList(data)}
            id={this.idSet.searchHolder}
            style={window.__TextStyle.textStyle.TOOLBAR.HEADING}/>  


          </LinearLayout>)

  }


  

  getMenu = () => {
    if (!this.props.menuData)
      return <Space width="0"/>

    var menu = this.props.menuData.url.map((item, index) => {
      return (<ImageView  
        onClick={() => {this.handleMenuClick(item.imageUrl)}}
        style = {IconStyle}
        imageUrl = {item.imageUrl}/>)
    });

    return (<LinearLayout
             width="wrap_content"
             height="wrap_content"
             id={this.idSet.menuContainer}>
             {menu}
             </LinearLayout>
           )
  }

  handleMenuClick = (url) => {
    this.props.onMenuItemClick(url);
  }

  handleBackPress = () =>{
    this.props.onBackPress();
  }

  handleSearchBackPress=()=>{
    this.clearSearch();
  }


  getSearchList(searchText){
    
    var listData = [];
    var data = this.textData.values;

      if(searchText.length != 0){
          for(var i = 0;i<data.length;i++){
            if(data[i].subject.toLowerCase().includes(searchText)||data[i].comment.toLowerCase().includes(searchText)){
              listData.push(data[i]);
            }
          }

          var totalJson = {};
          totalJson["type"] = this.textData.type;
          totalJson["values"] = listData;

          var layout = (<LinearLayout
                         width="match_parent"
                         height="wrap_content"
                         orientation="vertical">
                           <ClassListItem
                            data={totalJson}
                            itemClick={this.handleItemClick}
                            lineSeparator="true"/> 
                        </LinearLayout>);
          _this.replaceChild(_this.idSet.searchListContainer,layout.render(),0);

      }
    
  }

  

  render() {
    let searchIcon = this.getSearchIcon();
    let back = this.getBack();
    let title = this.getTitle();
    let menu = this.getMenu();
    let searchBack = this.getSearchBack();

    this.layout = (

      <LinearLayout
       width="match_parent"
       height="wrap_content"
       orientation="vertical"
       root="true">

      <LinearLayout 
        height="56"
        padding="0,0,0,2"
        gravity="center_vertical"
        background={window.__Colors.PRIMARY_BLACK_22}
        width="match_parent" >
      <LinearLayout 
        height="56"
        padding="0,0,0,0"
        gravity="center_vertical"
        root="true" 
        background={this.props.invert?window.__Colors.WHITE:window.__Colors.LIGHT_VIOLET}
        width="match_parent" >

         
          {back}
          {searchBack}
          
          {title}
           
          <Space width="0" weight="1"/>
          {menu}
          {searchIcon}
             
       </LinearLayout>
       </LinearLayout>

       <LinearLayout
           width="match_parent"
           height="wrap_content"
           id = {this.idSet.searchListContainer}
           orientation="vertical"/>

       </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = SearchToolbar;
