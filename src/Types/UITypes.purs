
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
import Data.Functor (void)
--import Data.Foreign.Generic (encodeJSON)
import Control.Monad.Eff.Exception (EXCEPTION)
import UI
--A.JSON import argonaut for json and try

data InitScreen = InitScreen
data InitScreenAction = ShowInit | OPEN_UserActivity

instance initScreen :: UIScreen InitScreen InitScreenAction where
  generateMockEvents _ = [ShowInit ,OPEN_UserActivity]
  ui x = genericUI x (generateMockEvents x :: Array InitScreenAction)

derive instance genericInitScreenAction  :: Generic InitScreenAction _
instance decodeInitScreenAction :: Decode InitScreenAction where decode = defaultDecode
instance encodeInitScreenAction :: Encode InitScreenAction where encode = defaultEncode


data SplashScreenActivity = SplashScreenActivity
data SplashScreenActivityAction = DummyUserActivityAction  |
  BACK_SplashScreenActivity

instance splashScreenActivity :: UIScreen SplashScreenActivity SplashScreenActivityAction where
  generateMockEvents _ = [DummyUserActivityAction , BACK_SplashScreenActivity]
  ui x = genericUI x (generateMockEvents x :: Array SplashScreenActivityAction)

derive instance genericSplashScreenActivityAction  :: Generic SplashScreenActivityAction _
instance decodeSplashScreenActivityAction :: Decode SplashScreenActivityAction where decode = defaultDecode
instance encodeSplashScreenActivityAction :: Encode SplashScreenActivityAction where encode = defaultEncode


data UserActivity = UserActivity {whereFrom::String}
data UserActivityAction = OPEN_MainActivity |
  OPEN_Deeplink_ResourceDetail {resource :: String} |
  OPEN_Deeplink_CourseEnrolled {course::String}|
  OPEN_DeepLink_CourseInfo {course::String}|
  OPEN_DeepLink_ContentPreview{details::String} |
  API_LogIn {userName::String, userPass::String} |
  API_SignUp {request::String, api_token::String} |
  API_EnrolledCourses {user_token::String, api_token::String} 

instance userActivity :: UIScreen UserActivity UserActivityAction where
  generateMockEvents _ = [OPEN_MainActivity , API_LogIn {userName:"String",userPass:"String"}]
  ui x = genericUI x (generateMockEvents x :: Array UserActivityAction)

derive instance genericUserActivityAction  :: Generic UserActivityAction _
instance decodeUserActivityAction :: Decode UserActivityAction where decode = defaultDecode
instance encodeUserActivityAction :: Encode UserActivityAction where encode = defaultEncode



data ContentPreviewScreen = ContentPreviewScreen {details::String}
data ContentPreviewScreenAction = BACK_ContentPreviewScreen | OPEN_UserActivityFromPreview

instance contentPreviewScreen :: UIScreen ContentPreviewScreen ContentPreviewScreenAction where
  generateMockEvents _ = [BACK_ContentPreviewScreen]
  ui x = genericUI x (generateMockEvents x :: Array ContentPreviewScreenAction)

derive instance generiContentPreviewScreenAction  :: Generic ContentPreviewScreenAction _
instance decodeContentPreviewScreenAction :: Decode ContentPreviewScreenAction where decode = defaultDecode
instance encodeContentPreviewScreenAction :: Encode ContentPreviewScreenAction where encode = defaultEncode



data MainActivity = MainActivity
data MainActivityAction = OPEN_HomeFragment |
  OPEN_CourseFragment |
  OPEN_ResourceFragment |
  OPEN_CommunityFragment |
  OPEN_ProfileFragment |
  BACK_HomeActivity |
  OPEN_CourseInfoActivity {course::String} |
  OPEN_EnrolledCourseActivity {course::String} |
  OPEN_CourseViewAllActivity {courseListDetails :: String} |
  OPEN_ResourceDetailActivity {resourceDetails::String} |
  OPEN_ResourceViewAllActivity {resourceDetails::String} |
  OPEN_CommunityInfoActivity {community::String} |
  OPEN_CommunityViewAllActivity |
  OPEN_NotificationActivity |
  OPEN_EditProfileActivity |
  OPEN_SearchActivity {filterDetails::String}|
  OPEN_CommProfSearchActivity {filterDetails::String}|
  API_ResourceFragment {user_token::String, api_token::String}|
  API_CourseFragment {user_token::String, api_token::String} |
  API_ProfileFragment {user_token::String, api_token::String}|
  API_UserEnrolledCourse {user_token::String, api_token::String} |
  API_FilterPage {user_token::String, api_token::String,filter_to_send::String}

instance homeActivity :: UIScreen MainActivity MainActivityAction where
  generateMockEvents _ = [BACK_HomeActivity , OPEN_HomeFragment , OPEN_CourseFragment , OPEN_ResourceFragment , OPEN_CommunityFragment , OPEN_ProfileFragment ]
  ui x = genericUI x (generateMockEvents x :: Array MainActivityAction)

derive instance genericMainActivityAction  :: Generic MainActivityAction _
instance decodeMainActivityAction :: Decode MainActivityAction where decode = defaultDecode
instance encodeMainActivityAction :: Encode MainActivityAction where encode = defaultEncode


data ResourceDetailActivity = ResourceDetailActivity {resourceDetails::String}
data ResourceDetailActivityAction =  DummyResourceDetailActivityAction |
  BACK_ResourceDetailActivity | API_FlagContent{user_token::String,api_token::String,requestBody::String,identifier::String}

instance resourceDetailActivity :: UIScreen ResourceDetailActivity ResourceDetailActivityAction where
  generateMockEvents _ = [DummyResourceDetailActivityAction , BACK_ResourceDetailActivity]
  ui x = genericUI x (generateMockEvents x :: Array ResourceDetailActivityAction)

derive instance genericResourceDetailActivityAction  :: Generic ResourceDetailActivityAction _
instance decodeResourceDetailActivityAction :: Decode ResourceDetailActivityAction where decode = defaultDecode
instance encodeResourceDetailActivityAction:: Encode ResourceDetailActivityAction where encode = defaultEncode

data CourseInfoActivity = CourseInfoActivity {courseDetails::String}
data CourseInfoActivityAction = BACK_CourseInfoActivity |
  OPEN_EnrolledActivity {course::String} |
  API_EnrollCourse {user_token::String,reqParams ::String, api_token::String} |
  ShowModuleDetails {moduleName::String,moduleDetails::String} |
  API_EnrolledCoursesList {user_token::String,api_token::String}

instance courseInfoScreen :: UIScreen CourseInfoActivity CourseInfoActivityAction where
  generateMockEvents _ = [BACK_CourseInfoActivity , OPEN_EnrolledActivity {course:"Dummy"} ]
  ui x = genericUI x (generateMockEvents x :: Array CourseInfoActivityAction)

derive instance genericourseInfoActivityAction  :: Generic CourseInfoActivityAction _
instance decodeCourseInfoActivityAction :: Decode CourseInfoActivityAction where decode = defaultDecode
instance encodeCourseInfoActivityAction :: Encode CourseInfoActivityAction where encode = defaultEncode

data CourseEnrolledActivity = CourseEnrolledActivity {courseDetails::String}
data CourseEnrolledActivityAction = DummyCourseEnrolledActivityAction |
  BACK_CourseEnrolledActivity |
  OPEN_ModuleDetailsActivity {moduleName::String,moduleDetails::String} |
  API_GetContentState {courseId::String,user_token::String,api_token::String}

instance courseEnrolledActivity :: UIScreen CourseEnrolledActivity CourseEnrolledActivityAction where
  generateMockEvents _ = [DummyCourseEnrolledActivityAction , BACK_CourseEnrolledActivity]
  ui x = genericUI x (generateMockEvents x :: Array CourseEnrolledActivityAction)

derive instance genericCourseEnrolledActivityAction  :: Generic CourseEnrolledActivityAction _
instance decodeCourseEnrolledActivityAction :: Decode CourseEnrolledActivityAction where decode = defaultDecode
instance encodeCourseEnrolledActivityAction :: Encode CourseEnrolledActivityAction where encode = defaultEncode


data ModuleDetailActivity = ModuleDetailActivity {moduleName::String,moduleDetails::String}
data ModuleDetailActivityAction = DummyModuleDetailActivityAction |
 BACK_ModuleDetailActivity

instance moduleDetailActivity :: UIScreen ModuleDetailActivity ModuleDetailActivityAction where
  generateMockEvents _ = [DummyModuleDetailActivityAction , BACK_ModuleDetailActivity ]
  ui x = genericUI x (generateMockEvents x :: Array ModuleDetailActivityAction)

derive instance genericModuleDetailActivityAction  :: Generic ModuleDetailActivityAction _
instance decodeModuleDetailActivityAction :: Decode ModuleDetailActivityAction where decode = defaultDecode
instance encodeModuleDetailActivityAction :: Encode ModuleDetailActivityAction where encode = defaultEncode


data CommunityViewAllActivity = CommunityViewAllActivity
data CommunityViewAllAction = DummyCommunityViewAllAction |
  BACK_CommunityViewAllActivity

instance communityViewAllActivity :: UIScreen CommunityViewAllActivity CommunityViewAllAction where
  generateMockEvents _ = [DummyCommunityViewAllAction ,  BACK_CommunityViewAllActivity]
  ui x = genericUI x (generateMockEvents x :: Array CommunityViewAllAction)

derive instance genericCommunityViewAllAction  :: Generic CommunityViewAllAction _
instance decodeCommunityViewAllAction :: Decode CommunityViewAllAction where decode = defaultDecode
instance encodeCommunityViewAllAction :: Encode CommunityViewAllAction where encode = defaultEncode


data CommunityInfoActivity = CommunityInfoActivity {name::String}
data CommunityInfoActivityAction = DummyInfoAction | ExAction | BACK_CommunityInfoActivity

instance communityInfoActivity :: UIScreen CommunityInfoActivity CommunityInfoActivityAction where
  generateMockEvents _ = [DummyInfoAction]
  ui x = genericUI x (generateMockEvents x :: Array CommunityInfoActivityAction)

derive instance genericCommunityInfoActivityAction :: Generic CommunityInfoActivityAction _
instance decodeCommunityInfoActivityAction :: Decode CommunityInfoActivityAction where decode = defaultDecode
instance encodeCommunityInfoActivityAction :: Encode CommunityInfoActivityAction where encode = defaultEncode


data NotificationActivity = NotificationActivity
data NotificationActivityAction = DummyNotificationActivityAction |
  BACK_NotificationActivity

instance notificationActivity :: UIScreen NotificationActivity NotificationActivityAction where
  generateMockEvents _ = [DummyNotificationActivityAction , BACK_NotificationActivity]
  ui x = genericUI x (generateMockEvents x :: Array NotificationActivityAction)

derive instance genericNotificationActivityAction  :: Generic NotificationActivityAction _
instance decodeNotificationActivityAction :: Decode NotificationActivityAction where decode = defaultDecode
instance encodeNotificationActivityAction :: Encode NotificationActivityAction where encode = defaultEncode

data ResourceViewAllActivity = ResourceViewAllActivity {resourceDetails::String}
data ResourceViewAllActivityAction = DummyResourceViewAllAction |
  BACK_ResourceViewAllActivity |
  OPEN_ResourceInfo {resourceDetails::String} |
  OPEN_CourseEnrolled {course::String} |
  OPEN_ResourceViewAllDetail {resourceDetails::String}


instance resourceViewAllActivity :: UIScreen ResourceViewAllActivity ResourceViewAllActivityAction where
  generateMockEvents _ = [DummyResourceViewAllAction , BACK_ResourceViewAllActivity]
  ui x = genericUI x (generateMockEvents x :: Array ResourceViewAllActivityAction)

derive instance genericResourceViewAllActivityAction  :: Generic ResourceViewAllActivityAction _
instance decodeResourceViewAllActivityAction :: Decode ResourceViewAllActivityAction where decode = defaultDecode
instance encodeResourceViewAllActivityAction :: Encode ResourceViewAllActivityAction where encode = defaultEncode


data CourseViewAllActivity = CourseViewAllActivity {courseViewAllDetails::String}
data CourseViewAllActivityAction = DummyCourseViewAllActivityAction |
  BACK_CourseViewAllActivity |
  OPEN_EnrolledCourseFlowFromCourseViewAll {course::String} | OPEN_CourseInfoFlowFromCourseViewAll {course::String}

instance courseViewAllActivity :: UIScreen CourseViewAllActivity CourseViewAllActivityAction where
  generateMockEvents _ = [DummyCourseViewAllActivityAction , BACK_CourseViewAllActivity]
  ui x = genericUI x (generateMockEvents x :: Array CourseViewAllActivityAction)

derive instance genericCourseViewAllActivityAction :: Generic CourseViewAllActivityAction _
instance decodeCourseViewAllActivityAction :: Decode CourseViewAllActivityAction where decode = defaultDecode
instance encodeCourseViewAllActivityAction :: Encode CourseViewAllActivityAction where encode = defaultEncode


data SearchActivity = SearchActivity {filterDetails::String}
data SearchActivityAction = DummySearchActivity |
  BACK_SearchActivity |
  OPEN_ResourceDetailActivity_SEARCH {resourceDetails::String} |
  OPEN_FilterActivity {filterDetails::String} |
  OPEN_CourseInfoActivity_SEARCH {course::String} |
  OPEN_CourseEnrolledActivity_SEARCH {course::String} |
  OPEN_ResourceFragment_SEARCH {course::String}

instance searchActivity :: UIScreen SearchActivity SearchActivityAction where
  generateMockEvents _ = [DummySearchActivity , BACK_SearchActivity ]
  ui x = genericUI x (generateMockEvents x :: Array SearchActivityAction)

derive instance genericSearchActivityAction  :: Generic SearchActivityAction _
instance decodeSearchActivityAction :: Decode SearchActivityAction where decode = defaultDecode
instance encodeSearchActivityAction :: Encode SearchActivityAction where encode = defaultEncode

data CommProfSearchActivity = CommProfSearchActivity {filterDetails::String}
data CommProfSearchActivityAction = DummyCommProfSearchActivity |
  BACK_CommProfSearchActivity |
  OPEN_FilterActivity2 {filterDetails::String} |
  OPEN_ProfileActivity_SEARCH {profile::String}|
  API_SearchProfile {user_token::String, api_token::String,filter_to_send::String}

instance commProfSearchActivity :: UIScreen CommProfSearchActivity CommProfSearchActivityAction where
  generateMockEvents _ = [DummyCommProfSearchActivity , BACK_CommProfSearchActivity ]
  ui x = genericUI x (generateMockEvents x :: Array CommProfSearchActivityAction)

derive instance genericCommProfSearchActivityAction  :: Generic CommProfSearchActivityAction _
instance decodeCommProfSearchActivityAction :: Decode CommProfSearchActivityAction where decode = defaultDecode
instance encodeCommProfSearchActivityAction :: Encode CommProfSearchActivityAction where encode = defaultEncode

data ProfileActivity = ProfileActivity {profile::String}
data ProfileActivityAction = DummyProfileActivity |
  BACK_ProfileActivity |
	OPEN_CommProfSearchActivity_Prof {filterDetails :: String}

instance profileActivity :: UIScreen ProfileActivity ProfileActivityAction where
  generateMockEvents _ = [DummyProfileActivity , BACK_ProfileActivity ]
  ui x = genericUI x (generateMockEvents x :: Array ProfileActivityAction)

derive instance genericProfileActivityAction  :: Generic ProfileActivityAction _
instance decodeProfileActivityAction :: Decode ProfileActivityAction where decode = defaultDecode
instance encodeProfileActivityAction :: Encode ProfileActivityAction where encode = defaultEncode

data FilterActivity = FilterActivity {filterDetails::String}
data FilterActivityAction = DummyFilterActivity |
  BACK_FilterActivity |
  OPEN_SearchActivity_FILTER {filterData::String}

instance filterActivity :: UIScreen FilterActivity FilterActivityAction where
  generateMockEvents _ = [ DummyFilterActivity , BACK_FilterActivity ]
  ui x = genericUI x (generateMockEvents x :: Array FilterActivityAction)

derive instance genericFilterActivityAction  :: Generic FilterActivityAction _
instance decodeFilterActivityAction :: Decode FilterActivityAction where decode = defaultDecode
instance encodeFilterActivityAction :: Encode FilterActivityAction where encode = defaultEncode


data AdditionalInformationActivity = AdditionalInformationActivity
data AdditionalInformationActivityAction = DummyAdditionalInformationActivity |
  BACK_AdditionalInformationActivity

instance addtionalInsormationActivity :: UIScreen AdditionalInformationActivity AdditionalInformationActivityAction where
  generateMockEvents _ = [ DummyAdditionalInformationActivity , BACK_AdditionalInformationActivity]
  ui x = genericUI x (generateMockEvents x :: Array AdditionalInformationActivityAction)

derive instance genericAdditionalInformationActivityAction  :: Generic AdditionalInformationActivityAction _
instance decodeAdditionalInformationActivityAction :: Decode AdditionalInformationActivityAction where decode = defaultDecode
instance encodeAdditionalInformationActivityAction :: Encode AdditionalInformationActivityAction where encode = defaultEncode
