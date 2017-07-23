

module Fragments.CommunityFragment where

import Prelude (bind, ($), (<>), pure, discard)
import Utils
import Types.UITypes
import Types.APITypes
import UI

communityFragment input whereFrom whatToSendBack = do
  event <- ui $ HomeActivity
  case event of
    OPEN_CommunityInfoActivity {community : output} -> communityInfoActivity output "CommunityFragment" input
    OPEN_CommunityViewAllActivity -> communityViewAllActivity input "CommunityFragment" input
    _ -> communityFragment whatToSendBack whereFrom input


communityInfoActivity input whereFrom whatToSendBack = do
  event <- ui $ CommunityInfoActivity {name : input}
    case event of
    BACK_CommunityInfoActivity -> case whereFrom of
      "CommunityFragment" -> communityFragment whatToSendBack "Terminate" input
      _ -> communityFragment input whereFrom whatToSendBack
    _ -> communityInfoActivity input whereFrom whatToSendBack

communityViewAllActivity input whereFrom whatToSendBack = do
  event <- ui $ CommunityViewAlActivity
    case event of
      BACK_CommunityViewAlActivity -> case whatNext of
        "CommunityFragment" -> communityFragment whatToSendBack "Terminate" input
        _ -> communityFragment whatToSendBack "Terminate" input
      _ -> communityViewAllActivity input whereFrom whatToSendBack






