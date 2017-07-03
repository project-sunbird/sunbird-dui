const dom = require("@juspay/mystique-backend").doms.android;
const View = require("@juspay/mystique-backend").baseViews.AndroidBaseView;
var LinearLayout = require("@juspay/mystique-backend").androidViews.LinearLayout;
var ImageView = require("@juspay/mystique-backend").androidViews.ImageView;
var ScrollView = require("@juspay/mystique-backend").androidViews.ScrollView;
var TextView = require("@juspay/mystique-backend").androidViews.TextView;
var EditText = require("@juspay/mystique-backend").androidViews.EditText;
var Space = require("@juspay/mystique-backend").androidViews.Space;
var ClassListItem = require('../ClassListItem');
var SearchResult = require('../SearchResult');
var debounce = require("debounce");
var Styles = require("../../../res/Styles");
var callbackMapper = require("@juspay/mystique-backend/").helpers.android.callbackMapper;
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
  this.getSearchList = debounce(this.getSearchList, 200);
    _this = this;

    this.searchText = debounce(this.searchText, 200);
    this.isSearchEnabled = this.props.startWithSearch ? this.props.startWithSearch : false;
    this.textData = {
          type: "Subjects",
          values: [
            { color: "#10D50000", imageUrl: "ic_action_search", subject: "Dot Structure",comment:"Assignment",logo:[]},
            { color: "#F0E9FD", imageUrl: "ic_account", subject: "Hybridization",comment:"How to use bond-line structures to perf…", logo:[] },
            { color: "#10E3C31C", imageUrl: "ic_action_search", subject: "Bond Line Structure",comment:"Quiz", logo:[] },
            { color: "#10FF9F00", imageUrl: "ic_action_search", subject: "Counting Electrons",comment:"(250 members)", logo:[] },
            { color: "#10D50000", imageUrl: "ic_action_search", subject: "Dot Structure",comment:"Jawahar Vidya Mandir, Pune", logo:[] },
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


  handleCloseClick = () => {
    var cmd = "";
    this.isSearchEnabled=false;
    JBridge.hideKeyboard();

    cmd += this.set({
      id: this.idSet.searchCloseHolder,
      visibility: "gone"
    })
    cmd += this.set({
      id: this.idSet.searchBackIcon,
      visibility: "gone"
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
    cmd += _this.set({
      id: _this.idSet.searchHolder,
      text: "",
      focusOut:"true",
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


  clearSearch(){
    var cmd = "";
    cmd += _this.set({
      id: _this.idSet.searchHolder,
      text: "",
      visibility: "visible"
    })
    Android.runInUI(cmd, 0);

  }


  getSearchIcon() {
    return (<LinearLayout
            height="match_parent"
            gravity="center_vertical">

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
            width="wrap_content"
            gravity="center_vertical"
            maxLines="1"
            margin="10,0,0,0"
            ellipsize="end"
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
            background="#ffffff"
            onChange = {result=>_this.getSearchList(result)}
            id={this.idSet.searchHolder}
            style={window.__TextStyle.textStyle.TOOLBAR.HEADING}
            imeOptions="actionSearch" 
            />


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
    if(url=="ic_action_search"){
      this.handleSearchClick();
    }
  }

  handleBackPress = () =>{
    this.props.onBackPress();
  }

  handleSearchBackPress=()=>{
    this.handleCloseClick();
  }


  getSearchList(searchText){
    var data = [];
    var listData=[];
    var temp = [];
    var totalJson={};
    var callback = callbackMapper.map(function(data) {
        // console.log("params",JSON.parse(data));
        
        console.log("length",searchText);
        console.log(data);
      if(searchText == "" || data == "[]"){

          var layout = (<LinearLayout
                         width="match_parent"
                         height="1500"
                         root="true"
                         background="#ffffff"
                         gravity="center_horizontal"
                         orientation="vertical">

                          <TextView
                            height="wrap_content"
                            width="wrap_content"
                            gravity="center_horizontal"
                            maxLines="1"
                            margin="16,16,16,16"
                            style={window.__TextStyle.textStyle.TOOLBAR.HEADING}
                            text="No Search Results Found"/>

                        </LinearLayout>);
      }
      else
      {
          data = JSON.parse(data);
          var layout = (<LinearLayout
                         width="match_parent"
                         height="1500"
                         root="true"
                         background="#ffffff"
                         orientation="vertical">
                          <SearchResult 
                            data={data} />
                        </LinearLayout>)
                         
      }
      
      


    _this.replaceChild(_this.idSet.searchListContainer,layout.render(),0);

      // if(searchText.length != 0){
      //     for(var i = 0;i<data.length;i++){
      //       if(data[i].subject.toLowerCase().includes(searchText.toLowerCase())||data[i].comment.toLowerCase().includes(searchText.toLowerCase())){
      //       temp["subject"]= this.replaceAll(data[i].subject,searchText,"<font color='#007AFF'>"+searchText+"</font>");
      //       temp["comment"]= this.replaceAll(data[i].comment,searchText,"<font color='#007AFF'>"+searchText+"</font>");
      //       temp["color"]= data[i].color;
      //       temp["imageUrl"]=data[i].imageUrl;
      //       temp["logo"]=data[i].logo;
      //       listData.push(temp);
      //       temp = [];
      //       }
      //     }
      //     totalJson["type"] = this.textData.type;
      //     totalJson["values"] = listData;
      //     var layout = (<LinearLayout
      //                    width="match_parent"
      //                    height="match_parent"
      //                    background="#ffffff"
      //                    orientation="vertical">
      //                      <ClassListItem
      //                       data={totalJson}
      //                       itemClick={this.handleItemClick}
      //                       lineSeparator="true"/>
      //                   </LinearLayout>);
      //     _this.replaceChild(_this.idSet.searchListContainer,layout.render(),0);
      // }
    });
    if(searchText.length >2){
      JBridge.searchContent(callback,searchText);
    }

    
  }


  replaceAll (target,search, replacement) {
    return target.split(search).join(replacement);
  };


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

       <ScrollView
        height="0"
        weight="1"
        width="match_parent">


       <LinearLayout
           width="match_parent"
           height="1500"
           root="true"
           visibility="gone"
           background="#ffffff"
           id = {this.idSet.searchListContainer}
           orientation="vertical"/>

       </ScrollView>

       </LinearLayout>
    )

    return this.layout.render();
  }
}

module.exports = SearchToolbar;
