
module Types.UITypes where

import Control.Monad.Aff
import Control.Monad.Eff.Console
import Data.Argonaut.Core
import UI
import Utils

import Control.Monad.Aff (launchAff)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Class (liftEff)
import Control.Monad.Eff.Exception (EXCEPTION)
import Control.Monad.Except.Trans (runExceptT)
import Data.Foreign.Class (class Decode, class Encode, encode)
import Data.Functor (void)
import Data.Generic.Rep (class Generic)
import Prelude (bind, discard, pure, ($), (<>), (||))
--A.JSON import argonaut for json and try

data InitScreen = InitScreen
data InitScreenAction = ShowInit | OPEN_UserActivity | OPEN_WelcomeScreenActivity | OPEN_LanguageSelectActivity

instance initScreen :: UIScreen InitScreen InitScreenAction where
  generateMockEvents _ = [ShowInit ,OPEN_UserActivity,OPEN_WelcomeScreenActivity]
  ui x = genericUI x (generateMockEvents x :: Array InitScreenAction)

derive instance genericInitScreenAction  :: Generic InitScreenAction _
instance decodeInitScreenAction :: Decode InitScreenAction where decode = defaultDecode
instance encodeInitScreenAction :: Encode InitScreenAction where encode = defaultEncode


data SplashScreenActivity = SplashScreenActivity
data SplashScreenActivityAction = DummyUserActivityAction  |
  BACK_SplashScreenActivity

instance splashScreenActivity :: UIScreen SplashScreenActivity SplashScreenActivityAction where
  generateMockEvents _ = [DummyUserActivityAction , BACK_SplashScreenActivity ]
  ui x = genericUI x (generateMockEvents x :: Array SplashScreenActivityAction)

derive instance genericSplashScreenActivityAction  :: Generic SplashScreenActivityAction _
instance decodeSplashScreenActivityAction :: Decode SplashScreenActivityAction where decode = defaultDecode
instance encodeSplashScreenActivityAction :: Encode SplashScreenActivityAction where encode = defaultEncode

data LanguageSelectActivity = LanguageSelectActivity
data LanguageSelectActivityAction = LanguageSelectActivityAction  |
  OPEN_UserActivity_1 |
  BACK_LanguageSelectActivity

instance languageSelectActivity :: UIScreen LanguageSelectActivity LanguageSelectActivityAction where
  generateMockEvents _ = [LanguageSelectActivityAction , BACK_LanguageSelectActivity ]
  ui x = genericUI x (generateMockEvents x :: Array LanguageSelectActivityAction)

derive instance genericLanguageSelectionActivityAction  :: Generic LanguageSelectActivityAction _
instance decodeLanguageSelectionActivityAction :: Decode LanguageSelectActivityAction where decode = defaultDecode
instance encodeLanguageSelectionActivityAction :: Encode LanguageSelectActivityAction where encode = defaultEncode


data WelcomeScreenActivity = WelcomeScreenActivity
data WelcomeScreenActivityAction = DummyWelcomeScreenAction | OPEN_StateSelectActivity

instance welcomeScreenActivity :: UIScreen WelcomeScreenActivity WelcomeScreenActivityAction where
  generateMockEvents _ = [DummyWelcomeScreenAction , OPEN_StateSelectActivity]
  ui x = genericUI x (generateMockEvents x :: Array WelcomeScreenActivityAction)

derive instance genericWelcomeScreenActivityAction  :: Generic WelcomeScreenActivityAction _
instance decodeWelcomeScreenActivityAction :: Decode WelcomeScreenActivityAction where decode = defaultDecode
instance encodeWelcomeScreenActivityAction :: Encode WelcomeScreenActivityAction where encode = defaultEncode


data StateSelectActivity = StateSelectActivity
data StateSelectActivityAction = DummyStateSelectAction  | BACK_StateSelectActivity | OPEN_UserActivityFromStateSelection

instance stateSelectActivity :: UIScreen StateSelectActivity StateSelectActivityAction where
  generateMockEvents _ = [DummyStateSelectAction , BACK_StateSelectActivity , OPEN_UserActivityFromStateSelection]
  ui x = genericUI x (generateMockEvents x :: Array StateSelectActivityAction)

derive instance genericStateSelectActivityAction  :: Generic StateSelectActivityAction _
instance decodeStateSelectActivityAction :: Decode StateSelectActivityAction where decode = defaultDecode
instance encodeStateSelectActivityAction :: Encode StateSelectActivityAction where encode = defaultEncode

data UserActivity = UserActivity {whereFrom::String}
data UserActivityAction = OPEN_MainActivity |
  OPEN_Deeplink_ResourceDetail {resource :: String} |
  OPEN_Deeplink_CourseEnrolled {course::String}|
  OPEN_DeepLink_CourseInfo {course::String}|
  OPEN_DeepLink_ContentPreview {details::String} |
  OPEN_Notif_AnnouncementDetail {announcementData::String} |
  OPEN_Notif_AnnouncementList |
  API_LogIn {userName::String, userPass::String} |
  API_SignUp {request::String, api_token::String} |
  API_EnrolledCourses {user_token::String, api_token::String} |
  API_GetProfileData {user_token::String, api_token::String}

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
  OPEN_AnnouncementViewAllActivity {announcementDetails :: String}|
  OPEN_CourseInfoActivity {course::String} |
  OPEN_EnrolledCourseActivity {course::String} |
  OPEN_CourseViewAllActivity {courseListDetails :: String} |
  OPEN_ResourceDetailActivity {resourceDetails::String} |
  OPEN_ResourceViewAllActivity {resourceDetails::String} |
  OPEN_CommunityInfoActivity {community::String} |
  OPEN_CommunityViewAllActivity |
  OPEN_NotificationActivity |
  OPEN_EditProfileActivity {profile::String} |
  OPEN_EditGuestProfileActivity {profile::String} |
  OPEN_SettingsScreenActivity {profile::String} |
  OPEN_AddressActivity {profile::String} |
  OPEN_EducationActivity {profile::String} |
  OPEN_ExperienceActivity {profile::String} |
  OPEN_SearchActivity {filterDetails::String}|
  OPEN_CommProfSearchActivity {filterDetails::String}|
  OPEN_AnnouncementDetailActivity {announcementData::String}|
  OPEN_QRActivity |
  API_ResourceFragment {user_token::String, api_token::String}|
  API_CourseFragment {user_token::String, api_token::String} |
  API_ProfileFragment {user_token::String, api_token::String}|
  API_UserEnrolledCourse {user_token::String, api_token::String} |
  API_FilterPage {user_token::String, api_token::String,filter_to_send::String} |
  API_CreatedBy {user_token::String, api_token::String, sendBack::String, filters::String }|
  API_SetProfileVisibility {user_token::String, api_token::String, request::String }|
  API_EndorseSkill {user_token::String,api_token::String,requestBody::String} |
  API_GetSkillsList {user_token::String,api_token::String} |
  API_GetAnnouncementData {user_token::String,api_token::String,requestBody::String} |
  API_Tenant {user_token::String, api_token::String, slug::String }

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
data CourseInfoActivityAction = BACK_CourseInfoActivity | OPEN_ViewBatchActivity {course::String}|
  OPEN_EnrolledActivity {course::String} |
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
  API_GetContentState {courseId::String,user_token::String,api_token::String} |
  API_FlagCourse {user_token::String,api_token::String,requestBody::String,identifier::String} |
  API_Get_Batch_Details{user_token::String,api_token::String,batch_id::String} |
  API_Get_Batch_Creator_name {user_token::String,api_token::String} | 
  API_Reload_Course {user_token::String,api_token::String}

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



data AnnouncementViewAllActivity = AnnouncementViewAllActivity {announcementDetails::String}
data AnnouncementViewAllActivityAction = DummyAnnouncementViewAllActivity |
  BACK_AnnouncementViewAllActivity |
  API_GetMoreAnnouncementData {user_token::String,api_token::String,requestBody::String} |
  OPEN_AnnouncementDetailActivityFromViewAll {announcementData::String}


instance announcementViewAllActivity :: UIScreen AnnouncementViewAllActivity AnnouncementViewAllActivityAction where
  generateMockEvents _ = [DummyAnnouncementViewAllActivity , BACK_AnnouncementViewAllActivity]
  ui x = genericUI x (generateMockEvents x :: Array AnnouncementViewAllActivityAction)

derive instance genericAnnouncementViewAllActivityAction  :: Generic AnnouncementViewAllActivityAction _
instance decodeAnnouncementViewAllActivityAction :: Decode AnnouncementViewAllActivityAction where decode = defaultDecode
instance encodeAnnouncementViewAllActivityAction :: Encode AnnouncementViewAllActivityAction where encode = defaultEncode




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
  API_SearchProfile {user_token::String, api_token::String,filter_to_send::String} |
  API_GetProfile {user_token::String, api_token::String} |
  API_CreatedBy_Search {user_token::String, api_token::String, sendBack::String, filters::String }

instance commProfSearchActivity :: UIScreen CommProfSearchActivity CommProfSearchActivityAction where
  generateMockEvents _ = [DummyCommProfSearchActivity , BACK_CommProfSearchActivity ]
  ui x = genericUI x (generateMockEvents x :: Array CommProfSearchActivityAction)

derive instance genericCommProfSearchActivityAction  :: Generic CommProfSearchActivityAction _
instance decodeCommProfSearchActivityAction :: Decode CommProfSearchActivityAction where decode = defaultDecode
instance encodeCommProfSearchActivityAction :: Encode CommProfSearchActivityAction where encode = defaultEncode

data ProfileActivity = ProfileActivity {profile::String}
data ProfileActivityAction = DummyProfileActivity |
  BACK_ProfileActivity |
  API_EndorseSkill1 {user_token::String,api_token::String,requestBody::String} |
  API_GetSkills1 {user_token::String,api_token::String,requestBody::String} |
	OPEN_CommProfSearchActivity_Prof {filterDetails :: String}|
  OPEN_EnrolledCourseActivity_Prof {course::String} |
  OPEN_CourseInfoActivity_Prof {course::String} |
  OPEN_ResourceDetailActivity_Prof {resourceDetails::String}

instance profileActivity :: UIScreen ProfileActivity ProfileActivityAction where
  generateMockEvents _ = [DummyProfileActivity , BACK_ProfileActivity]
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

data ViewBatchActivity = ViewBatchActivity { extras::String }
data ViewBatchActivityAction = DummyViewBatchActivity |
  BACK_ViewBatchActivity |
  OPEN_EnrolledActivity_BATCH {course::String} |
  API_EnrollInBatch {reqParams ::String , user_token::String ,api_token::String} |
  API_BatchCreator {user_token::String , api_token::String} |
  API_Get_Batch_list {user_token::String, api_token::String, request::String }

instance viewBatchActivity :: UIScreen ViewBatchActivity ViewBatchActivityAction where
  generateMockEvents _ = [ DummyViewBatchActivity , BACK_ViewBatchActivity ]
  ui x = genericUI x (generateMockEvents x :: Array ViewBatchActivityAction)

derive instance genericViewBatchActivity  :: Generic ViewBatchActivityAction _
instance decodeViewBatchActivityAction :: Decode ViewBatchActivityAction where decode = defaultDecode
instance encodeViewBatchActivityAction :: Encode ViewBatchActivityAction where encode = defaultEncode


data AdditionalInformationActivity = AdditionalInformationActivity {profile :: String}
data AdditionalInformationActivityAction = DummyAdditionalInformationActivity |
  BACK_AdditionalInformationActivity|
  API_ProfileVisibility {user_token::String, api_token::String, request::String }

instance addtionalInsormationActivity :: UIScreen AdditionalInformationActivity AdditionalInformationActivityAction where
  generateMockEvents _ = [ DummyAdditionalInformationActivity , BACK_AdditionalInformationActivity]
  ui x = genericUI x (generateMockEvents x :: Array AdditionalInformationActivityAction)

derive instance genericAdditionalInformationActivityAction  :: Generic AdditionalInformationActivityAction _
instance decodeAdditionalInformationActivityAction :: Decode AdditionalInformationActivityAction where decode = defaultDecode
instance encodeAdditionalInformationActivityAction :: Encode AdditionalInformationActivityAction where encode = defaultEncode


data GuestInformationActivity = GuestInformationActivity {profile :: String}
data GuestInformationActivityAction = BACK_GuestInformationActivity

instance guestInformationActivity :: UIScreen GuestInformationActivity GuestInformationActivityAction where
  generateMockEvents _ = [BACK_GuestInformationActivity]
  ui x = genericUI x (generateMockEvents x :: Array GuestInformationActivityAction)

derive instance genericGuestInformationActivityAction  :: Generic GuestInformationActivityAction _
instance decodeGuestInformationActivityAction :: Decode GuestInformationActivityAction where decode = defaultDecode
instance encodeGuestInformationActivityAction :: Encode GuestInformationActivityAction where encode = defaultEncode

data SettingsScreenActivity = SettingsScreenActivity {profile :: String}
data SettingsScreenActivityAction = BACK_SettingsScreenActivity | OPEN_LanguageSelectActivitySt {profile::String} | OPEN_AboutUsActivity {profile::String} | OPEN_DataSyncScreenActivity

instance settingsScreenActivity :: UIScreen SettingsScreenActivity SettingsScreenActivityAction where
  generateMockEvents _ = [BACK_SettingsScreenActivity]
  ui x = genericUI x (generateMockEvents x :: Array SettingsScreenActivityAction)

derive instance genericSettingsScreenActivityAction  :: Generic SettingsScreenActivityAction _
instance decodeSettingsScreenActivityAction :: Decode SettingsScreenActivityAction where decode = defaultDecode
instance encodeSettingsScreenActivityAction :: Encode SettingsScreenActivityAction where encode = defaultEncode

data LanguageSelectActivitySt = LanguageSelectActivitySt {profile :: String}
data LanguageSelectActivityStAction = BACK_LanguageSelectActivitySt

instance languageSelectActivitySt :: UIScreen LanguageSelectActivitySt LanguageSelectActivityStAction where
  generateMockEvents _ = [BACK_LanguageSelectActivitySt]
  ui x = genericUI x (generateMockEvents x :: Array LanguageSelectActivityStAction)

derive instance genericLanguageSelectActivityStAction  :: Generic LanguageSelectActivityStAction _
instance decodeLanguageSelectActivityStAction :: Decode LanguageSelectActivityStAction where decode = defaultDecode
instance encodeLanguageSelectActivityStAction :: Encode LanguageSelectActivityStAction where encode = defaultEncode

data AboutUsActivity = AboutUsActivity {profile :: String}
data AboutUsActivityAction = BACK_AboutUsActivity | OPEN_AboutUsScreen {sectionData::String}

instance aboutUsActivity :: UIScreen AboutUsActivity AboutUsActivityAction where
  generateMockEvents _ = [BACK_AboutUsActivity]
  ui x = genericUI x (generateMockEvents x :: Array AboutUsActivityAction)

derive instance genericAboutUsActivityAction  :: Generic AboutUsActivityAction _
instance decodeAboutUsActivityAction :: Decode AboutUsActivityAction where decode = defaultDecode
instance encodeAboutUsActivityAction :: Encode AboutUsActivityAction where encode = defaultEncode

data AboutUsScreen = AboutUsScreen {sectionData :: String}
data AboutUsScreenAction = BACK_AboutUsScreen

instance aboutUsScreen :: UIScreen AboutUsScreen AboutUsScreenAction where
  generateMockEvents _ = [BACK_AboutUsScreen]
  ui x = genericUI x (generateMockEvents x :: Array AboutUsScreenAction)

derive instance genericAboutUsScreenAction  :: Generic AboutUsScreenAction _
instance decodeAboutUsScreenAction :: Decode AboutUsScreenAction where decode = defaultDecode
instance encodeAboutUsScreenAction :: Encode AboutUsScreenAction where encode = defaultEncode

data DataSyncScreenActivity = DataSyncScreenActivity
data DataSyncScreenActivityAction = BACK_DataSyncScreenActivity

instance dataSyncScreenActivity :: UIScreen DataSyncScreenActivity DataSyncScreenActivityAction where
  generateMockEvents _ = [BACK_DataSyncScreenActivity]
  ui x = genericUI x (generateMockEvents x :: Array DataSyncScreenActivityAction)

derive instance genericDataSyncScreenActivityAction  :: Generic DataSyncScreenActivityAction _
instance decodeDataSyncScreenActivityAction :: Decode DataSyncScreenActivityAction where decode = defaultDecode
instance encodeDataSyncScreenActivityAction :: Encode DataSyncScreenActivityAction where encode = defaultEncode

data AnnouncementDetailActivity = AnnouncementDetailActivity {announcementData :: String}
data AnnouncementDetailActivityAction = DummyAnnouncementDetailActivityAction  |
  BACK_AnnouncementDetailActivity |
  API_ReadAnnouncement {user_token::String,api_token::String,requestBody::String}


instance announcementDetailActivity :: UIScreen AnnouncementDetailActivity AnnouncementDetailActivityAction where
  generateMockEvents _ = [DummyAnnouncementDetailActivityAction , BACK_AnnouncementDetailActivity]
  ui x = genericUI x (generateMockEvents x :: Array AnnouncementDetailActivityAction)

derive instance genericAnnouncementDetailActivityAction  :: Generic AnnouncementDetailActivityAction _
instance decodeAnnouncementDetailActivityAction :: Decode AnnouncementDetailActivityAction where decode = defaultDecode
instance encodeAnnouncementDetailActivityAction :: Encode AnnouncementDetailActivityAction where encode = defaultEncode
data AddressActivity = AddressActivity {profile :: String}
data AddressActivityAction = DummyAddressActivity |
  BACK_AddressActivity

instance addressActivity :: UIScreen AddressActivity AddressActivityAction where
  generateMockEvents _ = [ DummyAddressActivity , BACK_AddressActivity]
  ui x = genericUI x (generateMockEvents x :: Array AddressActivityAction)

derive instance genericAddressActivityAction  :: Generic AddressActivityAction _
instance decodeAddressActivityAction :: Decode AddressActivityAction where decode = defaultDecode
instance encodeAddressActivityAction :: Encode AddressActivityAction where encode = defaultEncode
---------------------------------------------------------------------------------

data EducationActivity = EducationActivity {profile :: String}
data EducationActivityAction = DummyEducationActivity |
  BACK_EducationActivity

instance educationActivity :: UIScreen EducationActivity EducationActivityAction where
  generateMockEvents _ = [ DummyEducationActivity , BACK_EducationActivity]
  ui x = genericUI x (generateMockEvents x :: Array EducationActivityAction)

derive instance genericEducationActivityAction  :: Generic EducationActivityAction _
instance decodeEducationActivityAction :: Decode EducationActivityAction where decode = defaultDecode
instance encodeEducationActivityAction :: Encode EducationActivityAction where encode = defaultEncode
---------------------------------------------------------------------------------

data ExperienceActivity = ExperienceActivity {profile :: String}
data ExperienceActivityAction = DummyExperienceActivity |
  BACK_ExperienceActivity

instance experienceActivity :: UIScreen ExperienceActivity ExperienceActivityAction where
  generateMockEvents _ = [ DummyExperienceActivity , BACK_ExperienceActivity]
  ui x = genericUI x (generateMockEvents x :: Array ExperienceActivityAction)

derive instance genericExperienceActivityAction  :: Generic ExperienceActivityAction _
instance decodeExperienceActivityAction :: Decode ExperienceActivityAction where decode = defaultDecode
instance encodeExperienceActivityAction :: Encode ExperienceActivityAction where encode = defaultEncode

---------------------------------------------------------------------------------

data QRActivity = QRActivity
data QRActivityAction = DummyQRActivity |
  BACK_QRActivity |
  OPEN_CourseEnrolledActivity_QR {course::String} |
  OPEN_ResourceDetailActivity_QR {resourceDetails::String} |
  OPEN_CourseInfoActivity_QR {course::String} |
  OPEN_SearchActivity_QR {filterDetails::String}

instance qrActivity :: UIScreen QRActivity QRActivityAction where
  generateMockEvents _ = [ DummyQRActivity , BACK_QRActivity ]
  ui x = genericUI x (generateMockEvents x :: Array QRActivityAction)

derive instance genericQRActivityAction  :: Generic QRActivityAction _
instance decodeQRActivityAction :: Decode QRActivityAction where decode = defaultDecode
instance encodeQRActivityAction :: Encode QRActivityAction where encode = defaultEncode
