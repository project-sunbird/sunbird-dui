
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
		_ -> pure $ "default"

    
startCourseInfoFlow state= do
	event <- ui $ CourseInfoScreen {courseDetails:state}
	case event of
		DummyCourseInfoAction -> pure $ "handled"
		ShowEnrolledCourse {course:courseDetail} -> startEnrolledCourseFlow courseDetail
		_ -> pure $ "default"

startEnrolledCourseFlow state= do
	event <- ui $ CourseEnrolledScreen {courseDetails:state}
	case event of
		DummyCourseEnrolledAction -> pure $ "handled"
  		_ -> pure $ "default"

startCourseSearchFlow state = do
  liftEff $ log $ "Search FLow started"
  state <- ui $ SearchScreen {filterDetails:state}
  case state of
    CourseInfoFlow {course : details} -> startCourseInfoFlow details
    StartFilterFlow{filterDetails : details} -> startFilterFlow details 
    _ -> pure $ "aborted"







