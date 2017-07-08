
module Flows.CourseFlow where

import Control.Monad.Aff
import Prelude (bind, ($), (<>), pure, discard)
import Control.Monad.Except.Trans (runExceptT)
import Utils
import Control.Monad.Eff (Eff)
import Control.Monad.Aff (launchAff)
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)
import Data.Foreign.Class (class Decode, class Encode, encode)
import Data.Maybe
import Flows.NotificationFlow
import Flows.FilterFlow
import Flows.ResourceFlow
import Data.Generic.Rep (class Generic)
import Data.Foreign.Generic (encodeJSON)
import Control.Monad.Eff.Exception (EXCEPTION)
import Types.UITypes
import Types.APITypes
import UI



startCourseFlow state = do
	liftEff $ log $ "startCourseFlow"
	event <- ui $ HomeScreen
	case event of
		StartCourseInfoFlow {course:courseDetail} -> startCourseInfoFlow courseDetail
		StartEnrolledCourseFlow {course:courseDetail} -> startEnrolledCourseFlow courseDetail
		StartNotificationFlow -> startNotificationFlow state
		StartSearchFlow {filterDetails : details} -> startCourseSearchFlow details
		GetEnrolledCourseApi -> do
			responseData <- getUserEnrolledCourses 
	 		_ <- sendUpdatedState {response : responseData, responseFor : "GetEnrolledCourseApi", screen:"asas"} 
	  		pure $ "Aborted 3"
		_ -> pure $ "default"

    
startCourseInfoFlow cDetail= do
	event <- ui $ CourseInfoScreen {courseDetails:cDetail}
	case event of
		DummyCourseInfoAction -> pure $ "handled"
		ShowEnrolledCourse {course:courseDetail} -> startEnrolledCourseFlow courseDetail
		ShowModuleDetails {moduleName:mName,moduleDetails:mDetails}-> startModuleDetailsFlow mName mDetails cDetail
		_ -> pure $ "default"

startEnrolledCourseFlow cDetail= do
	event <- ui $ CourseEnrolledScreen {courseDetails:cDetail}
	case event of
		DummyCourseEnrolledAction -> pure $ "handled"
  		ShowModuleScreen {moduleName:mName,moduleDetails:mDetails}-> startModuleDetailsFlow mName mDetails cDetail
		_ -> pure $ "default"

startModuleDetailsFlow mName mDetails parentCourse= do
	event <- ui $ ModuleDetailScreen {moduleName:mName,moduleDetails:mDetails}
	case event of
		DummyModuleDetailsAction -> pure $ "handled"
		BackToParent -> startCourseInfoFlow parentCourse
  		_ -> pure $ "default"

startCourseSearchFlow state = do
  liftEff $ log $ "Search FLow started"
  state <- ui $ SearchScreen {filterDetails:state}
  case state of
    CourseInfoFlow {course : details} -> startCourseInfoFlow details
    StartFilterFlow{filterDetails : details} -> startFilterFlow details 
    _ -> pure $ "aborted"







