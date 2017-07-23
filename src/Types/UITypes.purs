
module Types.UITypes where

import Control.Monad.Aff
import Prelude (bind, ($), (<>), pure, discard)
import Control.Monad.Except.Trans (runExceptT)
import Utils
import Data.Argonaut.Core
import Control.Monad.Eff (Eff)
import Control.Monad.Aff (launchAff)
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)
import Data.Foreign.Class (class Decode, class Encode, encode)
import Data.Generic.Rep (class Generic)
--import Data.Foreign.Generic (encodeJSON)
import Control.Monad.Eff.Exception (EXCEPTION)
import UI
--A.JSON import argonaut for json and try


data SplashScreenActivity = SplashAScreenctivity
data SplashScreenActivityAction = OPEN_UserScreenActivity  | BACK_SplashAScreenctivity


instance splashScreen :: UIScreen SplashScreenActivity SplashScreenActivityAction where
  generateMockEvents _ = [BACK_SplashAScreenctivity , BACK_SplashAScreenctivity]
  ui x = genericUI x (generateMockEvents x :: Array SplashScreenActivityAction)

derive instance genericSplashScreenActivityAction  :: Generic SplashScreenActivityAction _
instance decodeSplasScreenActivityAction :: Decode SplashScreenActivityAction where decode = defaultDecode
instance encodeSplasScreenActivityAction :: Encode SplashScreenActivityAction where encode = defaultEncode


data UserActivity = UserActivity
data UserActivityAction = OPEN_HomeActivity | 
  API_LogiIn {userName::String, userPass::String} | API_SignUpApi{userName::String,email::String,firstName::String,password::String,mobileNumber::String,language::String,api_token::String}

instance userActivity :: UIScreen UserActivity UserActivityAction where
  generateMockEvents _ = [OPEN_HomeActivity , API_LogiIn {userName:"String",userPass:"String"} , API_SignUpApi {userName:"amit.rohan",email:"amit@rohan.com",firstName:"Amit Rohan",password:"beta",mobileNumber:"6756756743",language:"English",api_token:"__failed"}
]
  ui x = genericUI x (generateMockEvents x :: Array UserActivityAction)

derive instance genericUnitActivityAction  :: Generic UserActivityAction _
instance decodeUserActivityAction :: Decode UserActivityAction where decode = defaultDecode
instance encodeUserActivityAction :: Encode UserActivityAction where encode = defaultEncode


data HomeActivity = HomeActivity
data HomeActivityAction = OPEN_HomeFragment | OPEN_CourseFragment | OPEN_ResourceFragment | OPEN_CommunityFragment | OPEN_ProfileFragment |
  BACK_HomeActivity | 
  OPEN_CourseInfoActivity {course::String} | 
  OPEN_EnrolledCourseActivity {course::String} | 
  OPEN_CourseViewAllActivity {courseListDetails :: String} |
  OPEN_ResourceDetailActivity {resourceDetails::String} |
  OPEN_ResourceViewAllActivity {resourceDetails::String} |
  OPEN_CommunityInfoActivity {community::String} | 
  OPEN_CommunityViewAllActivity |
  OPEN_NotificationActivity | 
  OPEN_SearchActivity {filterDetails::String}|
  API_ResourcePage {user_token::String, api_token::String}|
  API_CoursePage {user_token::String, api_token::String} |
  API_UserEnrolledCourse {user_token::String, api_token::String} |
  API_ProfilePage {user_token::String, api_token::String}|
  API_FilterPage{user_token::String, api_token::String,filter_to_send::String}

instance homeActivity :: UIScreen HomeActivity HomeActivityAction where
  generateMockEvents _ = [BACK_HomeActivity , OPEN_HomeFragment , OPEN_CourseFragment , OPEN_ResourceFragment , OPEN_CommunityFragment , OPEN_ProfileFragment ]
  ui x = genericUI x (generateMockEvents x :: Array HomeActivityAction)

derive instance genericHomeActivityAction  :: Generic HomeActivityAction _
instance decodeHomeActivityAction :: Decode HomeActivityAction where decode = defaultDecode
instance encodeHomeActivityAction :: Encode HomeActivityAction where encode = defaultEncode




data ResourceDetailActivity = ResourceDetailActivity {resourceDetails::String}
data ResourceDetailActivityAction =  DummyResourceDetailActivityAction | BACK_ResourceDetailActivity

instance resourceDetailActivity :: UIScreen ResourceDetailActivity ResourceDetailActivityAction where
  generateMockEvents _ = [DummyResourceDetailActivityAction , BACK_ResourceDetailActivity]
  ui x = genericUI x (generateMockEvents x :: Array ResourceDetailActivityAction)

derive instance genericResourceDetailActivityAction  :: Generic ResourceDetailActivityAction _
instance decodeResourceDetailActivityAction :: Decode ResourceDetailActivityAction where decode = defaultDecode
instance encodeResourceDetailActivityAction:: Encode ResourceDetailActivityAction where encode = defaultEncode

data CourseInfoActivity = CourseInfoActivity {courseDetails::String}
data CourseInfoActivityAction = BACK_CourseInfoActivity | OPEN_EnrolledActivity {course::String} |
  API_EnrollCourse {user_token::String,reqParams :: String, api_token::String} | 
  ShowModuleDetails {moduleName::String,moduleDetails::String} | CourseInfoBackpress 

instance courseInfoScreen :: UIScreen CourseInfoActivity CourseInfoActivityAction where
  generateMockEvents _ = [BACK_CourseInfoActivity , OPEN_EnrolledActivity {course:"Dummy"} ]
  ui x = genericUI x (generateMockEvents x :: Array CourseInfoActivityAction)

derive instance genericourseInfoActivityAction  :: Generic CourseInfoActivityAction _
instance decodeCourseInfoActivityAction :: Decode CourseInfoActivityAction where decode = defaultDecode
instance encodeCourseInfoActivityAction :: Encode CourseInfoActivityAction where encode = defaultEncode  

data CourseEnrolledActivity = CourseEnrolledActivity {courseDetails::String}
data CourseEnrolledActivityAction = DummyCourseEnrolledActivityAction | BACK_CourseEnrolledActivity | OPEN_ModuleDetailsActivity {moduleName::String,moduleDetails::String} |
 API_GetContentState {courseId::String,user_token::String,api_token::String}  

instance courseEnrolledActivity :: UIScreen CourseEnrolledActivity CourseEnrolledActivityAction where
  generateMockEvents _ = [DummyCourseEnrolledActivityAction , BACK_CourseEnrolledActivity]
  ui x = genericUI x (generateMockEvents x :: Array CourseEnrolledActivityAction)

derive instance genericCourseEnrolledActivityAction  :: Generic CourseEnrolledActivityAction _
instance decodeCourseEnrolledActivityAction :: Decode CourseEnrolledActivityAction where decode = defaultDecode
instance encodeCourseEnrolledActivityAction :: Encode CourseEnrolledActivityAction where encode = defaultEncode


data ModuleDetailActivity = ModuleDetailActivity {moduleName::String,moduleDetails::String}
data ModuleDetailActivityAction = DummyModuleDetailActivityAction | BACK_ModuleDetailActivity | OPEN_SubModuleDetailActivity {moduleName::String,moduleDetails::String}

instance moduleDetailActivity :: UIScreen ModuleDetailActivity ModuleDetailActivityAction where
  generateMockEvents _ = [DummyModuleDetailActivityAction , BACK_ModuleDetailActivity ]
  ui x = genericUI x (generateMockEvents x :: Array ModuleDetailActivityAction)

derive instance genericModuleDetailActivityAction  :: Generic ModuleDetailActivityAction _
instance decodeModuleDetailActivityAction :: Decode ModuleDetailActivityAction where decode = defaultDecode
instance encodeModuleDetailActivityAction :: Encode ModuleDetailActivityAction where encode = defaultEncode


data AlternateModuleDetailActivity = AlternateModuleDetailActivity {moduleName::String,moduleDetails::String}
data AlternateModuleDetailActivityAction = DummyAlternateModuleDetailAction | BACK_AlternateModuleDetailActivity | OPEN_ModuleActivity {moduleName::String,moduleDetails::String}


instance alternateModuleDetailActivity :: UIScreen AlternateModuleDetailActivity AlternateModuleDetailActivityAction where
  generateMockEvents _ = [ DummyAlternateModuleDetailAction , BACK_AlternateModuleDetailActivity]
  ui x = genericUI x (generateMockEvents x :: Array AlternateModuleDetailActivityAction)

derive instance genericAlternateModuleDetailActivityAction  :: Generic AlternateModuleDetailActivityAction _
instance decodeAlternateModuleDetailActivityAction :: Decode AlternateModuleDetailActivityAction where decode = defaultDecode
instance encodeAlternateModuleDetailActivityAction :: Encode AlternateModuleDetailActivityAction where encode = defaultEncode


data CommunityViewAllScreen = CommunityViewAllScreen
data CommunityViewAllAction = DummyCommunityViewAllAction | BACK_CommunityViewAllActivity



instance communityViewAllScreen :: UIScreen CommunityViewAllScreen CommunityViewAllAction where
  generateMockEvents _ = [DummyCommunityViewAllAction]
  ui x = genericUI x (generateMockEvents x :: Array CommunityViewAllAction)

derive instance genericCommunityViewAllAction  :: Generic CommunityViewAllAction _
instance decodeCommunityViewAllAction :: Decode CommunityViewAllAction where decode = defaultDecode
instance encodeCommunityViewAllAction :: Encode CommunityViewAllAction where encode = defaultEncode


data CommunityInfoActivity = CommunityInfoActivity {name::String}
data CommunityInfoActivityAction = DummyInfoAction | ExAction | BACK_CommunityInfoActivity

instance communityInfoScreen :: UIScreen CommunityInfoActivity CommunityInfoActivityAction where
  generateMockEvents _ = [DummyInfoAction]
  ui x = genericUI x (generateMockEvents x :: Array CommunityInfoActivityAction)

derive instance genericCommunityInfoActivityAction :: Generic CommunityInfoActivityAction _
instance decodeCommunityInfoActivityAction :: Decode CommunityInfoActivityAction where decode = defaultDecode
instance encodeCommunityInfoActivityAction :: Encode CommunityInfoActivityAction where encode = defaultEncode


data NotificationActivity = NotificationActivity
data NotificationActivityAction = DummyNotificationAction | BACK_NotificationActivity

instance notificationActivity :: UIScreen NotificationActivity NotificationActivityAction where
  generateMockEvents _ = [DummyNotificationAction]
  ui x = genericUI x (generateMockEvents x :: Array NotificationActivityAction)

derive instance genericNotificationActivityAction :: Generic NotificationActivityAction _
instance decodeNotififcationActivityAction :: Decode NotificationActivityAction where decode = defaultDecode
instance encodeNotificationActivityAction :: Encode NotificationActivityAction where encode = defaultEncode

data ResourceViewAllActivity = ResourceViewAllActivity {resourceDetails::String}
data ResourceViewAllActivityAction = DummyResourceViewAllAction | BACK_ResourceViewAllActivity | OPEN_ResourceInfo {resourceDetails::String} | OPEN_ResourceViewAllDetail {resourceDetails::String}


instance resourceViewAllActivity :: UIScreen ResourceViewAllActivity ResourceViewAllActivityAction where
  generateMockEvents _ = [DummyResourceViewAllAction , BACK_ResourceViewAllActivity]
  ui x = genericUI x (generateMockEvents x :: Array ResourceViewAllActivityAction)

derive instance genericResourceViewAllActivityAction  :: Generic ResourceViewAllActivityAction _
instance decodeResourceViewAllActivityAction :: Decode ResourceViewAllActivityAction where decode = defaultDecode
instance encodeResourceViewAllActivityAction :: Encode ResourceViewAllActivityAction where encode = defaultEncode


data CourseViewAllActivity = CourseViewAllActivity {courseViewAllDetails::String}
data CourseViewAllAction = DummyCourseViewAllActivityAction | BACK_CourseViewAllActivity | OPEN_EnrolledCourseFlowFromCourseViewAll {course::String}

instance courseViewAllActivity :: UIScreen CourseViewAllActivity CourseViewAllAction where
  generateMockEvents _ = [DummyCourseViewAllActivityAction , BACK_CourseViewAllActivity]
  ui x = genericUI x (generateMockEvents x :: Array CourseViewAllAction)

derive instance genericCourseViewAllAction  :: Generic CourseViewAllAction _
instance decodeCourseViewAllAction :: Decode CourseViewAllAction where decode = defaultDecode
instance encodeCourseViewAllAction :: Encode CourseViewAllAction where encode = defaultEncode


data SearchActivity = SearchActivity {filterDetails::String}
data SearchActivityAction = DummySearchActivity | BACK_SearchActivity | OPEN_ResourceDetailActivity_SEARCH {resourceDetails::String} | OPEN_FilterActivity {filterDetails::String} | OPEN_CourseInfoActivity_SEARCH {course::String} | OPEN_ResourceFragment_SEARCH {course::String}

instance searchActivity :: UIScreen SearchActivity SearchActivityAction where
  generateMockEvents _ = [DummySearchActivity , BACK_SearchActivity ]
  ui x = genericUI x (generateMockEvents x :: Array SearchActivityAction)

derive instance genericSearchActivityAction  :: Generic SearchActivityAction _
instance decodeSearchActivityAction :: Decode SearchActivityAction where decode = defaultDecode
instance encodeSearchActivityAction :: Encode SearchActivityAction where encode = defaultEncode

data FilterActivity = FilterActivity {filterDetails::String}
data FilterActivityAction = DummyFilterActivity | BACK_FilterActivity | OPEN_SearchActivity_FILTER {filterData::String}  

instance filterActivity :: UIScreen FilterActivity FilterActivityAction where
  generateMockEvents _ = [ DummyFilterActivity , BACK_FilterActivity ]
  ui x = genericUI x (generateMockEvents x :: Array FilterActivityAction)

derive instance genericFilterActivityAction  :: Generic FilterActivityAction _
instance decodeFilterActivityAction :: Decode FilterActivityAction where decode = defaultDecode
instance encodeFilterActivityAction :: Encode FilterActivityAction where encode = defaultEncode
