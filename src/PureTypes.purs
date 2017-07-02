module PureTypes where

import Control.Monad.Aff
import Prelude (bind, ($), (<>), pure, discard)
import Control.Monad.Except.Trans (runExceptT)
import Utils
import Control.Monad.Eff (Eff)
import Control.Monad.Aff (launchAff)
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)
import Data.Foreign.Class (class Decode, class Encode, encode)
import Data.Generic.Rep (class Generic)
import Data.Foreign.Generic (encodeJSON)
import Control.Monad.Eff.Exception (EXCEPTION)
import Prelude

data UserScreen = UserScreen 
data UserScreenAction = LoginAction | LoginApiAction {userName::String, userPass::String} | SignUpApiAction{userName::String,firstName::String,password::String,language::String}


data HomeScreen = HomeScreen
data HomeScreenAction = ShowHome {name::String} | StartCourseFlow |
 StartResourceFlow | StartCommunityFlow | StartProfileFlow | 
 StartCommunityInfoFlow {community::String} | StartCommunityViewAllFlow | 
 StartCourseInfoFlow {course::String} | GetCoursePage | GetResourcePage | StartNotificationFlow | StartResourceDetailFlow {resourceDetails::String}

data InitScreen = InitScreen 
data InitScreenAction = ShowInit  | StartInit

data ResourceScreen = ResourceScreen 
data ResourceScreenAction = DummyResourceAction

data CommunityInfoScreen = CommunityInfoScreen {name::String}
data CommunityInfoScreenAction = DummyInfoAction | ExAction

data CourseInfoScreen = CourseInfoScreen
data CourseInfoScreenAction = DummyCourseInfoAction

data CommunityViewAllScreen = CommunityViewAllScreen
data CommunityViewAllAction = DummyCommunityViewAllAction

data NotificationScreen = NotificationScreen
data NotificationAction = DummyNotificationAction


data ResourceDetailScreen = ResourceDetailScreen {resourceDetails::String}
data ResourceDetailAction = DummyResourceDetailAction


instance homeScreen :: UIScreen HomeScreen HomeScreenAction where
  generateMockEvents _ = [ShowHome {name:"Kiran"} ,StartCourseFlow]
  ui x = genericUI x (generateMockEvents x :: Array HomeScreenAction)

derive instance genericHomeScreenAction  :: Generic HomeScreenAction _
instance decodeHomeScreenAction :: Decode HomeScreenAction where decode = defaultDecode
instance encodeHomeScreenAction :: Encode HomeScreenAction where encode = defaultEncode

instance initScreen :: UIScreen InitScreen InitScreenAction where
  generateMockEvents _ = [ShowInit ,StartInit]
  ui x = genericUI x (generateMockEvents x :: Array InitScreenAction)

derive instance genericInitScreenAction  :: Generic InitScreenAction _
instance decodeInitScreenAction :: Decode InitScreenAction where decode = defaultDecode
instance encodeInitScreenAction :: Encode InitScreenAction where encode = defaultEncode

instance userScreen :: UIScreen UserScreen UserScreenAction where
  generateMockEvents _ = [LoginAction , LoginApiAction {userName:"String",userPass:"String"} , SignUpApiAction{userName:"test1@juspay.in",firstName:"Beta Tester 1",password:"beta",language:"English"}
]
  ui x = genericUI x (generateMockEvents x :: Array UserScreenAction)

derive instance genericUnitScreenAction  :: Generic UserScreenAction _
instance decodeUserScreenAction :: Decode UserScreenAction where decode = defaultDecode
instance encodeUserScreenAction :: Encode UserScreenAction where encode = defaultEncode

instance communityInfoScreen :: UIScreen CommunityInfoScreen CommunityInfoScreenAction where
  generateMockEvents _ = [DummyInfoAction]
  ui x = genericUI x (generateMockEvents x :: Array CommunityInfoScreenAction)

derive instance genericCommunityInfoScreenAction  :: Generic CommunityInfoScreenAction _
instance decodeCommunityInfoScreenAction :: Decode CommunityInfoScreenAction where decode = defaultDecode
instance encodeCommunityInfoScreenAction :: Encode CommunityInfoScreenAction where encode = defaultEncode


instance courseInfoScreen :: UIScreen CourseInfoScreen CourseInfoScreenAction where
  generateMockEvents _ = [DummyCourseInfoAction]
  ui x = genericUI x (generateMockEvents x :: Array CourseInfoScreenAction)

derive instance genericCourseInfoScreenAction  :: Generic CourseInfoScreenAction _
instance decodeCourseInfoScreenAction :: Decode CourseInfoScreenAction where decode = defaultDecode
instance encodeCourseInfoScreenAction :: Encode CourseInfoScreenAction where encode = defaultEncode

instance communityViewAllScreen :: UIScreen CommunityViewAllScreen CommunityViewAllAction where
  generateMockEvents _ = [DummyCommunityViewAllAction]
  ui x = genericUI x (generateMockEvents x :: Array CommunityViewAllAction)

derive instance genericCommunityViewAllAction  :: Generic CommunityViewAllAction _
instance decodeCommunityViewAllAction :: Decode CommunityViewAllAction where decode = defaultDecode
instance encodeCommunityViewAllAction :: Encode CommunityViewAllAction where encode = defaultEncode


instance resourceScreen :: UIScreen ResourceScreen ResourceScreenAction where
  generateMockEvents _ = [DummyResourceAction]
  ui x = genericUI x (generateMockEvents x :: Array ResourceScreenAction)

derive instance genericResourceScreenAction  :: Generic ResourceScreenAction _
instance decodeResourceScreenAction :: Decode ResourceScreenAction where decode = defaultDecode
instance encodeResourceScreenAction :: Encode ResourceScreenAction where encode = defaultEncode

instance notificationScreen :: UIScreen NotificationScreen NotificationAction where
  generateMockEvents _ = [DummyNotificationAction]
  ui x = genericUI x (generateMockEvents x :: Array NotificationAction)

derive instance genericNotificationAction  :: Generic NotificationAction _
instance decodeNotificationAction :: Decode NotificationAction where decode = defaultDecode
instance encodeNotificationAction :: Encode NotificationAction where encode = defaultEncode

instance resourceDetailScreen :: UIScreen ResourceDetailScreen ResourceDetailAction where
  generateMockEvents _ = [DummyResourceDetailAction]
  ui x = genericUI x (generateMockEvents x :: Array ResourceDetailAction)

derive instance genericResourceDetailAction  :: Generic ResourceDetailAction _
instance decodeResourceDetailAction :: Decode ResourceDetailAction where decode = defaultDecode
instance encodeResourceDetailAction :: Encode ResourceDetailAction where encode = defaultEncode

