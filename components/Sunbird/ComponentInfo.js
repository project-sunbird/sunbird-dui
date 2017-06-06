/**This is to demo how to use different components**/

1.ClassListItem::

      <ClassListItem
        data={this.textData}
        itemClick={this.handleItemClick}
        lineSeparator="true"/> 

        this.textData = {
          type: "Subjects",
          values: [
            { color: "#10D50000", imageUrl: "ic_action_search", subject: "Dot Structure", logo:["ic_action_completed","ic_action_share"]},
            { color: "#F0E9FD", imageUrl: "ic_account", subject: "Hybridization", logo:["ic_action_completed","ic_action_share"] },
            { color: "#10E3C31C", imageUrl: "ic_action_search", subject: "Bond Line Structure", logo:["ic_action_completed","ic_action_share"] },
            { color: "#10FF9F00", imageUrl: "ic_action_search", subject: "Counting Electrons", logo:["ic_action_completed","ic_action_share"] },
            { color: "#10D50000", imageUrl: "ic_action_search", subject: "Dot Structure", logo:["ic_action_completed","ic_action_share"] },
          ]
        }

    handleItemClick = (itemNo,logoNo) =>{
    console.log(itemNo + " itemNo")
    console.log(logoNo + " logoNo")
  }

2.SearchToolbar:

      <SearchToolbar
        title="Sunbird"
        hint="Search here"
        invert="true"
        onMenuItemClick={this.handleMenuClick}
        menuData={this.menuData}
        onSearch={this.handleSearch}/>


        this.menuData = {
          url: [
            { imageUrl: "ic_action_notification_blue" },
            { imageUrl: "ic_action_filter" }
          ]
        }
        //No need to send search icon. Search is default.

        handleMenuClick = (url) =>{
          console.log("icon selected",url);
        }

        handleSearch=(data)=>{
          console.log("searched",data);
        }

