
module Fragments.ProfileFragment where


import Prelude (bind, ($), (<>), pure, discard)
import Utils
import Types.UITypes
import Types.APITypes
import UI



profileFragment input whereFrom whatToSendBack = do
	event <- ui $ MainActivity
	case event of
		OPEN_NotificationActivity -> notificationActivity "{}" "ProfileFragment"  input
		_ -> profileFragment input whereFrom whatToSendBack

notificationActivity input whereFrom whatToSendBack = do
	event <- ui $ NotificationActivity
	case event of
		BACK_NotificationActivity -> case whereFrom of
			"ProfileFragment" -> profileFragment input "Terminate" input
			_ -> profileFragment input "Terminate" input
		_ -> notificationActivity input whereFrom whatToSendBack		

