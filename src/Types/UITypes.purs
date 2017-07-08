{-
Copyright (c) 2012-2017 "JUSPAY Technologies"
JUSPAY Technologies Pvt. Ltd. [https://www.juspay.in]

This file is part of JUSPAY Platform.

JUSPAY Platform is free software: you can redistribute it and/or modify
it for only educational purposes under the terms of the GNU Affero General
Public License (GNU AGPL) as published by the Free Software Foundation,
either version 3 of the License, or (at your option) any later version.
For Enterprise/Commerical licenses, contact <info@juspay.in>.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  The end user will
be liable for all damages without limitation, which is caused by the
ABUSE of the LICENSED SOFTWARE and shall INDEMNIFY JUSPAY for such
damages, claims, cost, including reasonable attorney fee claimed on Juspay.
The end user has NO right to claim any indemnification based on its use
of Licensed Software. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/agpl.html>.


-}
module Types.UITypes where

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
import UI


data UserScreen = UserScreen 
data UserScreenAction = LoginAction | LoginApiAction {userName::String, userPass::String} | SignUpApiAction{userName::String,firstName::String,password::String,language::String}


data HomeScreen = HomeScreen
data HomeScreenAction = ShowHome {name::String} | StartCourseFlow |
 StartResourceFlow | StartCommunityFlow | StartProfileFlow | 
 StartCommunityInfoFlow {community::String} | StartCommunityViewAllFlow | 
 StartCourseInfoFlow {course::String} | StartEnrolledCourseFlow {course::String} |
 GetCoursePage | GetResourcePage | StartNotificationFlow | StartResourceDetailFlow {resourceDetails::String} | 
 StartResourceViewAllFlow {resourceDetails::String} | StartSearchFlow {filterDetails::String}| StartResourcePageApi | StartCoursePageApi

data InitScreen = InitScreen 
data InitScreenAction = ShowInit  | StartInit

data ResourceScreen = ResourceScreen 
data ResourceScreenAction = DummyResourceAction

data CommunityInfoScreen = CommunityInfoScreen {name::String}
data CommunityInfoScreenAction = DummyInfoAction | ExAction

data CourseInfoScreen = CourseInfoScreen {courseDetails::String}
data CourseInfoScreenAction = DummyCourseInfoAction | ShowEnrolledCourse {course::String} | ShowModuleDetails {moduleName::String,moduleDetails::String}

data CourseEnrolledScreen = CourseEnrolledScreen {courseDetails::String}
data CourseEnrolledScreenAction = DummyCourseEnrolledAction | ShowModuleScreen {moduleName::String,moduleDetails::String}

data ModuleDetailScreen = ModuleDetailScreen {moduleName::String,moduleDetails::String}
data ModuleDetailScreenAction = DummyModuleDetailsAction


data CommunityViewAllScreen = CommunityViewAllScreen
data CommunityViewAllAction = DummyCommunityViewAllAction

data NotificationScreen = NotificationScreen
data NotificationAction = DummyNotificationAction


data ResourceDetailScreen = ResourceDetailScreen {resourceDetails::String}
data ResourceDetailAction = DummyResourceDetailAction


data ResourceViewAllScreen = ResourceViewAllScreen {resourceDetails::String}
data ResourceViewAllAction = DummyResourceViewAllAction | StartResourceInfoFlow {resourceDetails::String}


data SearchScreen = SearchScreen {filterDetails::String}
data SearchScreenAction = ResourceDetailFlow {resourceDetails::String} | StartFilterFlow {filterDetails::String} | CourseInfoFlow {course::String}

data FilterScreen = FilterScreen {filterDetails::String}
data FilterScreenAction = SearchScreenFromFilter {filterData::String}


instance homeScreen :: UIScreen HomeScreen HomeScreenAction where
  generateMockEvents _ = [ShowHome {name:"Kiran"} ,StartCourseFlow]
  ui x = genericUI x (generateMockEvents x :: Array HomeScreenAction)

derive instance genericHomeScreenAction  :: Generic HomeScreenAction _
instance decodeHomeScreenAction :: Decode HomeScreenAction where decode = defaultDecode
instance encodeHomeScreenAction :: Encode HomeScreenAction where encode = defaultEncode


instance moduleDetailScreen :: UIScreen ModuleDetailScreen ModuleDetailScreenAction where
  generateMockEvents _ = [DummyModuleDetailsAction]
  ui x = genericUI x (generateMockEvents x :: Array ModuleDetailScreenAction)

derive instance genericModuleDetailScreenAction  :: Generic ModuleDetailScreenAction _
instance decodeModuleDetailScreenAction :: Decode ModuleDetailScreenAction where decode = defaultDecode
instance encodeModuleDetailScreenAction :: Encode ModuleDetailScreenAction where encode = defaultEncode


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
  generateMockEvents _ = [DummyCourseInfoAction,ShowEnrolledCourse {course:"Dummy"} ]
  ui x = genericUI x (generateMockEvents x :: Array CourseInfoScreenAction)

derive instance genericCourseInfoScreenAction  :: Generic CourseInfoScreenAction _
instance decodeCourseInfoScreenAction :: Decode CourseInfoScreenAction where decode = defaultDecode
instance encodeCourseInfoScreenAction :: Encode CourseInfoScreenAction where encode = defaultEncode

instance courseEnrolledScreen :: UIScreen CourseEnrolledScreen CourseEnrolledScreenAction where
  generateMockEvents _ = [DummyCourseEnrolledAction]
  ui x = genericUI x (generateMockEvents x :: Array CourseEnrolledScreenAction)

derive instance genericCourseEnrolledScreenAction  :: Generic CourseEnrolledScreenAction _
instance decodeCourseEnrolledScreenAction :: Decode CourseEnrolledScreenAction where decode = defaultDecode
instance encodeCourseEnrolledScreenAction :: Encode CourseEnrolledScreenAction where encode = defaultEncode

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


instance resourceViewAllScreen :: UIScreen ResourceViewAllScreen ResourceViewAllAction where
  generateMockEvents _ = [DummyResourceViewAllAction]
  ui x = genericUI x (generateMockEvents x :: Array ResourceViewAllAction)

derive instance genericResourceViewAllAction  :: Generic ResourceViewAllAction _
instance decodeResourceViewAllAction :: Decode ResourceViewAllAction where decode = defaultDecode
instance encodeResourceViewAllAction :: Encode ResourceViewAllAction where encode = defaultEncode

instance searchScreen :: UIScreen SearchScreen SearchScreenAction where
  generateMockEvents _ = []
  ui x = genericUI x (generateMockEvents x :: Array SearchScreenAction)

derive instance genericSearchScreenAction  :: Generic SearchScreenAction _
instance decodeSearchScreenAction :: Decode SearchScreenAction where decode = defaultDecode
instance encodeSearchScreenAction :: Encode SearchScreenAction where encode = defaultEncode

instance filterScreen :: UIScreen FilterScreen FilterScreenAction where
  generateMockEvents _ = []
  ui x = genericUI x (generateMockEvents x :: Array FilterScreenAction)

derive instance genericFilterScreenAction  :: Generic FilterScreenAction _
instance decodeFilterScreenAction :: Decode FilterScreenAction where decode = defaultDecode
instance encodeFilterScreenAction :: Encode FilterScreenAction where encode = defaultEncode
